import { NextResponse } from "next/server";
import { z } from "zod";
import { chatComplete } from "@/lib/openrouter";
import {
  getBalance,
  reservedBySeat,
  settle,
  balanceToUsd,
} from "@/lib/billing";
import { rateLimit } from "@/lib/rate-limit";
import { MARKUP, TOPUP_USD, trim } from "@/lib/pricing";

const BodySchema = z.object({
  prompt: z.string().min(3).max(4000),
  clientId: z.string().min(6).max(128),
  model: z.string().optional(),
});

const SYSTEM = `Eres un generador de sitios web. Devuelve SOLO un archivo HTML completo y autocontenido (una sola página), con:
- doctype y etiquetas semanticas (lang es).
- CSS en <style> dentro del head (sin frameworks externos, sin CDN, sin javascript de terceros).
- Buen diseno responsive con una paleta propia y tipografias de sistema.
- Copia en espanol, clara y util.
- CSS centrado en una buena experiencia de usuario y accesibilidad basica (contraste, focus).
No agregues comentarios largos. Empieza la respuesta con <!DOCTYPE html>.`;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const rl = rateLimit(ip, 8);
  if (!rl.ok) {
    return NextResponse.json({ error: "Demasiadas peticiones. Intentá en unos segundos." }, { status: 429 });
  }

  let body;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "CONFIG_INCOMPLETA", detail: "Falta configurar el motor de IA." }, { status: 503 });
  }

  const cid = body.clientId;
  const balance = await getBalance(cid);
  if (balance <= 0) {
    return NextResponse.json({
      blocked: true,
      topup: TOPUP_USD,
      message: "Se acabó tu recarga gratis/comprada. Para seguir trabajando, pagá un top-up.",
    });
  }

  // Reserva un techo para no pasar de negativo (protege al dueño).
  const reservedMicro = await reservedBySeat(cid);
  if (reservedMicro <= 0) {
    return NextResponse.json({ blocked: true, topup: TOPUP_USD });
  }

  try {
    const out = await chatComplete({
      model: body.model,
      system: SYSTEM,
      prompt: body.prompt,
      maxTokens: Number(process.env.MODEL_MAX_TOKENS ?? 1500),
    });

    let html = out.text.trim();
    if (html.startsWith("```")) {
      html = html.replace(/^```(html)?\s*/i, "").replace(/```$/, "").trim();
    }

    const settled = await settle(cid, reservedMicro, out.realCostUsd);
    const realUsd = trim(out.realCostUsd);
    const userUsd = trim(out.realCostUsd * MARKUP);

    return NextResponse.json({
      html,
      promptTokens: out.usage.prompt_tokens ?? 0,
      completionTokens: out.usage.completion_tokens ?? 0,
      realCostUsd: realUsd,
      userCostUsd: userUsd,
      markup: MARKUP,
      balanceUsd: trim(balanceToUsd(settled.balanceMicro)),
      blocked: settled.blocked,
    });
  } catch (e) {
    // Si falló el proveedor, devolvemos la reserva.
    await settle(cid, reservedMicro, 0);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "No se pudo generar.", detail: message }, { status: 502 });
  }
}