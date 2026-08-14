import { TOPUP_USD } from "@/lib/pricing";

// PayPal — Orders v2 vía REST (misma pasarela que molino.app).
const base = () =>
  (process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com") + "/v2/checkout";

export function ppConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function ppEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYPAL_ENABLED !== "false";
}

function auth() {
  const cred = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`;
  return `Basic ${Buffer.from(cred).toString("base64")}`;
}

// Crea una orden de pago de USD 2.8 (top-up). Devuelve el link de aprobación.
export async function ppCreateOrder(
  cid: string,
): Promise<{ id: string; approveUrl: string } | { error: string }> {
  if (!ppConfigured()) return { error: "PAYPAL_NOT_CONFIGURED" };
  const res = await fetch(`${base()}/orders`, {
    method: "POST",
    headers: {
      Authorization: auth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: cid,
          description: "VersionLimitada · 1 recarga de tokens",
          amount: { currency_code: "USD", value: TOPUP_USD.toFixed(2) },
        },
      ],
      application_context: {
        brand_name: process.env.PAYPAL_BRAND_NAME ?? "VersionLimitada",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/construir?pg=ok`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/construir?pg=cancel`,
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) return { error: `PP ${res.status}: ${data?.message ?? "error"}` };
  const approve = (data.links ?? []).find((l: { rel: string }) => l.rel === "approve");
  return { id: data.id, approveUrl: approve?.href ?? "" };
}

// Ejecuta la captura de una orden aprobada.
export async function ppCaptureOrder(orderId: string) {
  const res = await fetch(`${base()}/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: auth(),
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return { ok: res.ok, data };
}