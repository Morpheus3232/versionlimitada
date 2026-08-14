import { kvSet } from "@/lib/kv";
import { creditTopUp } from "@/lib/billing";
import { ppCaptureOrder } from "@/lib/paypal";
import { TOPUP_USD } from "@/lib/pricing";

// Webhook de PayPal (capture). Alternativa a la confirmación client-side.
export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  const resource = payload?.resource ?? {};
  const cc = resource?.capture_refund_details?.capture ?? {};
  const amount = Number(resource?.amount?.value ?? cc?.amount?.value ?? 0);
  const cid = String(resource?.reference_id ?? "");
  const orderId = String(resource?.id ?? "");

  if (amount <= 0 || !cid || !orderId) return new Response("ok", { status: 200 });

  // Verificación defensiva: monto correcto y estado de la orden (si es un
  // evento COMPLETED de capture).
  if (payload?.event_type === "PAYMENT.CAPTURE.COMPLETED" || payload?.event_type === "CHECKOUT.ORDER.APPROVED") {
    const cap = await ppCaptureOrder(orderId).catch(() => ({ ok: false, data: {} }));
    const ok = cap.ok && Math.abs(Number(cap.data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ?? 0) - TOPUP_USD) <= 0.01;
    if (ok) {
      await kvSet(`builder:paid:pp:${orderId}`, "1", { nx: true });
      await creditTopUp(cid);
    }
  }

  return new Response("ok", { status: 200 });
}