import { NextResponse } from "next/server";
import { z } from "zod";
import { mpCreatePreference, mpEnabled } from "@/lib/mercadopago";
import { ppCreateOrder, ppEnabled } from "@/lib/paypal";

const Body = z.object({
  method: z.enum(["mp", "paypal"]),
  clientId: z.string().min(6).max(128),
});

export async function POST(req: Request) {
  let b;
  try {
    b = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (b.method === "mp") {
    if (!mpEnabled()) return NextResponse.json({ error: "Mercado Pago deshabilitado." }, { status: 400 });
    const r = await mpCreatePreference(b.clientId);
    if ("error" in r) {
      return NextResponse.json({ error: r.error }, { status: 502 });
    }
    return NextResponse.json({ url: r.initPoint, method: "mp" });
  }

  if (!ppEnabled()) return NextResponse.json({ error: "PayPal deshabilitado." }, { status: 400 });
  const r = await ppCreateOrder(b.clientId);
  if ("error" in r) {
    return NextResponse.json({ error: r.error }, { status: 502 });
  }
  return NextResponse.json({ url: r.approveUrl, method: "paypal", orderId: r.id });
}