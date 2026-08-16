import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/openrouter";

// Asistente de IA del laboratorio. Usa OpenRouter con el modelo del dueño.
// Por defecto: deepseek flash 0731 (el mismo que opera este proyecto).
export const runtime = "nodejs";

const MODEL = process.env.LAB_AI_MODEL || "deepseek/deepseek-v4-flash-0731";

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "El dueño todavía no configuró la key de IA (OPENROUTER_API_KEY). El resto del laboratorio sigue funcionando igual." },
      { status: 503 },
    );
  }

  let body: { prompt?: string; context?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const prompt = (body.prompt ?? "").trim();
  if (!prompt) return NextResponse.json({ error: "Escribí algo antes de preguntar." }, { status: 400 });

  const context = JSON.stringify(body.context ?? {});

  const system = [
    "Sos el asistente del laboratorio VersionLimitada, un sistema que junta problemas, evidencia, hipótesis, experimentos y decisiones (build/iterate/kill).",
    "Podés ayudar a resumir evidencia, detectar contradicciones, sugerir hipótesis, encontrar huecos de evidencia, proponer experimentos chicos, clasificar señales y sintetizar resultados.",
    "Reglas obligatorias:",
    "- Tus respuestas SON sugerencias de una máquina (IA). Nunca son hechos. Si proponés algo, decilo como propuesta; no lo presentes como observado ni inventes cifras, señales, resultados o fuentes. Si no tenés evidencia, decilo.",
    "- Usá el contexto del laboratorio cuando te sirva (referite a expedientes y experimentos por su número).",
    "- Respondé corto, concreto y ordenado, en español rioplatense simple, sin vender hype ni usar palabra 'disruptivo'.",
    `Contexto actual del laboratorio:\n${context}`,
  ].join("\n");

  try {
    const r = await chatComplete({ model: MODEL, system, prompt, maxTokens: 1000 });
    return NextResponse.json({ text: r.text });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "El motor de IA no respondió." },
      { status: 502 },
    );
  }
}