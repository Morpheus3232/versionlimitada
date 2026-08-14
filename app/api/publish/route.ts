import { NextResponse } from "next/server";
import { z } from "zod";
import { kvSet } from "@/lib/kv";
import { rateLimit } from "@/lib/rate-limit";

const Body = z.object({
  slug: z
    .string()
    .min(3)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  html: z.string().min(50).max(250_000),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(ip, 12).ok) {
    return NextResponse.json({ error: "Demasiado rápido." }, { status: 429 });
  }
  let b;
  try {
    b = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  await kvSet(`builder:site:${b.slug}`, b.html);
  return NextResponse.json({ ok: true, url: `/s/${b.slug}` });
}