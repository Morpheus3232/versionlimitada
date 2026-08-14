// Cliente OpenRouter: usa las credenciales del DUEÑO y reporta el costo REAL
// en USD que ese request va a facturar al dueño (para luego cobrar 8x).

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };
export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost?: number; // USD total (OpenRouter lo devuelve con la key del dueño)
};

const BASE = "https://openrouter.ai/api/v1";

// Precios por millón de tokens (USD) por modelo, como respaldo cuando
// `usage.cost` no venga. Solo importa para límites/techo; la facturación real
// usa el costo que OpenRouter devuelve.
const PRICE_FALLBACK: Record<string, { prompt: number; completion: number }> = {
  "deepseek/deepseek-chat": { prompt: 0.14, completion: 0.28 },
  "deepseek/deepseek-chat-v4-flash": { prompt: 0.14, completion: 0.28 },
};

export function estimateCost(usage: Usage, model: string): number {
  if (typeof usage.cost === "number" && usage.cost > 0) return usage.cost;
  const p = PRICE_FALLBACK[model] ?? { prompt: 0.5, completion: 1.5 };
  return (usage.prompt_tokens * p.prompt + usage.completion_tokens * p.completion) / 1_000_000;
}

export async function chatComplete(opts: {
  model?: string;
  system?: string;
  messages?: ChatMsg[];
  prompt?: string;
  maxTokens?: number;
}): Promise<{ text: string; usage: Usage; realCostUsd: number }> {
  const model = opts.model ?? process.env.MODEL_DEFAULT ?? "deepseek/deepseek-chat";
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY no configurada");

  const messages: ChatMsg[] = [];
  if (opts.system) messages.push({ role: "system", content: opts.system });
  if (opts.messages) messages.push(...opts.messages);
  if (opts.prompt) messages.push({ role: "user", content: opts.prompt });

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: opts.maxTokens ?? 2048,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${data?.error?.message ?? "error"}`);
  }

  const usage = (data.usage ?? {}) as Usage;
  const realCostUsd = estimateCost(usage, model);
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    usage,
    realCostUsd,
  };
}