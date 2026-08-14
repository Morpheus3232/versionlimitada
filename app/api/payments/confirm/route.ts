import { NextResponse } from "next/server";
import { z } from "zod";
import { kvSet } from "@/lib/kv";
import { creditTopUp } from "@/lib/billing";
import { mpGetPayment } from "@/lib/mercadopago";
import { ppCaptureOrder } from "@/lib/paypal";
import { TOPUP_USD } from "@/lib/pricing";

const Body = z.object({
  method: z.enum(["mp", "paypal"]),
  clientId: z.string().min(6).max(128),
  paymentRef: z.string().min(1),
});

// Acredita un pago aprobado. Idempotente: un mismo pago solo acredita una vez.
export async function POST(req: Request) {
  let b;
  try {
    b = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  try {
    if (b.method === "mp") {
      const payment = await mpGetPayment(b.paymentRef);
      if (!payment) return NextResponse.json({ error: "Pago no encontrado." }, { status: 404 });
      if (payment.status !== "approved") {
        return NextResponse.json({ error: "Pago no aprobado.", status: payment.status }, { status: 402 });
      }
      if (Math.abs(Number(payment.transaction_amount) - TOPUP_USD) > 0.01) {
        return NextResponse.json({ error: "Monto inválido." }, { status: 422 });
      }
      if (payment.external_reference !== b.clientId) {
        return NextResponse.json({ error: "Receptor inválido." }, { status: 422 });
      }
      const claimed = await kvSet(`builder:paid:mp:${b.paymentRef}`, "1", { nx: true });
      const balance = await creditTopUp(b.clientId);
      return NextResponse.json({ ok: true, credited: !!claimed, balanceUsd: balance / 1_000_000 });
    }

    // paypal: capturamos la orden aprobada (idempotente).
    const cap = await ppCaptureOrder(b.paymentRef);
    const st = cap.data?.status ?? cap.data?.error?.name ?? "unknown";
    if (!cap.ok) {
      return NextResponse.json({ error: "Orden no capturada.", status: st }, { status: 402 });
    }
    const amount = Number(cap.data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ?? 0);
    const ref = cap.data?.purchase_units?.[0]?.reference_id ?? "";
    if (Math.abs(amount - TOPUP_USD) > 0.01 || ref !== b.clientId) {
      return NextResponse.json({ error: "Datos de pago inválidos." }, { status: 422 });
    }
    const claimed = await kvSet(`builder:paid:pp:${b.paymentRef}`, "1", { nx: true });
    const balance = await creditTopUp(b.clientId);
    return NextResponse.json({ ok: true, credited: !!claimed, balanceUsd: balance / 1_000_000 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Error al acreditar.", detail: msg }, { status: 500 });
  }
}