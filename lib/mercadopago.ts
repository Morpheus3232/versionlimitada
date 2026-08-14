import { TOPUP_USD } from "@/lib/pricing";

// Mercado Pago — Checkout Pro (misma pasarela que molino.app).
const base = () =>
  process.env.MP_ACCESS_TOKEN ? "https://api.mercadopago.com" : "";

export function mpConfigured(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

export function mpEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED !== "false";
}

// Crea una preferencia de pago de USD 2.8 (top-up de tokens).
export async function mpCreatePreference(cid: string): Promise<{ id: string; initPoint: string } | { error: string }> {
  if (!mpConfigured()) return { error: "MERCADOPAGO_NOT_CONFIGURED" };
  const token = process.env.MP_ACCESS_TOKEN!;
  const res = await fetch(`${base()}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          id: "vl-tokens",
          title: "VersionLimitada · 1 recarga de tokens",
          quantity: 1,
          unit_price: TOPUP_USD,
          currency_id: "USD",
        },
      ],
      external_reference: cid,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/construir?pg=ok`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/construir?pg=pending`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/construir?pg=fail`,
      },
      auto_return: "approved",
    }),
  });
  const data = await res.json();
  if (!res.ok) return { error: `MP ${res.status}: ${data?.message ?? "error"}` };
  return { id: data.id, initPoint: data.init_point ?? data.sandbox_init_point };
}

// Verifica un pago real de MP (usado por el webhook y por check).
export async function mpGetPayment(paymentId: string) {
  if (!mpConfigured()) return null;
  const res = await fetch(`${base()}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}` },
  });
  if (!res.ok) return null;
  return res.json();
}