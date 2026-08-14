// Modelo de negocio del motor de tokens.
// - Los primeros USD $FREE_REAL de consumo REAL los paga el dueño (free tier).
// - Cada top-up de USD 2.8 acredita USD (2.8 / 8) de consumo real: el usuario
//   paga 8x el costo real que el proveedor le cobra al dueño (como OpenRouter).
// - Se trabaja en "microdólares" (enteros) para evitar errores de punto flotante.

export const TOPUP_USD = Number(process.env.NEXT_PUBLIC_TOPUP_USD ?? 2.8);
export const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP ?? 8);
export const FREE_REAL_USD = Number(process.env.NEXT_PUBLIC_FREE_REAL_USD ?? 0.35);

export function usdToMicro(usd: number): number {
  return Math.round(usd * 1_000_000);
}

export function microToUsd(micro: number): number {
  return micro / 1_000_000;
}

// Saldo inicial regalado (lo paga el dueño) = 0.35 USD reales de cómputo.
export const FREE_MICRO = usdToMicro(FREE_REAL_USD);

// Un top-up de USD 2.8 cubre USD (2.8/8) de consumo real a costo proveedor.
export const TOPUP_REAL_MICRO = usdToMicro(TOPUP_USD / MARKUP);

// Techo de reserva por pedido (evita que el dueño pague de más en la última
// llamada). 0.03 USD reales por generación.
export const RESERVE_REAL_MICRO = usdToMicro(0.03);

export function userPriceFromReal(realUsd: number): number {
  return realUsd * MARKUP;
}

export function trim(n: number, decimals = 4): number {
  return Number(n.toFixed(decimals));
}