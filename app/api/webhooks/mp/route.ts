import { NextResponse } from "next/server";
import { kvSet } from "@/lib/kv";
import { creditTopUp } from "@/lib/billing";
import { mpGetPayment } from "@/lib/mercadopago";
import { TOPUP_USD } from "@/lib/pricing";

// Webhook de Mercado Pago (acreditación asíncrona).
export async function POST(req: Request) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  // Enfoque simple y verificador: ante cada notificación pedimos los datos
  // reales a MP y acreditamos solo si está approved y con monto correcto.
  const paymentId = String(payload?.data?.id ?? "");
  if (!paymentId || payload?.type !== "payment") {
    return new Response("ok", { status: 200 });
  }

  const payment = await mpGetPayment(paymentId);
  if (!payment) return new Response("ok", { status: 200 });

  const approved = payment.status === "approved";
  const amountOk = Math.abs(Number(payment.transaction_amount) - TOPUP_USD) <= 0.01;
  const cid = String(payment.external_reference ?? "");
  if (approved && amountOk && cid) {
    await kvSet(`builder:paid:mp:${paymentId}`, "1", { nx: true });
    await creditTopUp(cid);
  }
  return new Response("ok", { status: 200 });
}