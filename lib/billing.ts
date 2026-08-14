import { kvGet, kvSet } from "@/lib/kv";
import {
  FREE_MICRO,
  RESERVE_REAL_MICRO,
  TOPUP_REAL_MICRO,
  microToUsd,
} from "@/lib/pricing";

// Balance por cliente, en "microdólares de consumo REAL".
const balKey = (cid: string) => `builder:bal:${cid}`;

// Primera vez: acredita el free tier (lo paga el dueño) de forma atómica.
export async function ensureBalance(cid: string): Promise<number> {
  const existing = await kvGet(balKey(cid));
  if (existing == null) {
    const set = await kvSet(balKey(cid), String(FREE_MICRO), { nx: true });
    if (set != null) return FREE_MICRO;
    // en carrera, otro request lo creó
    return Number((await kvGet(balKey(cid))) ?? 0);
  }
  return Number(existing ?? 0);
}

export async function getBalance(cid: string): Promise<number> {
  return ensureBalance(cid);
}

export async function reservedBySeat(cid: string): Promise<number> {
  const cur = await getBalance(cid);
  const reserve = Math.min(RESERVE_REAL_MICRO, Math.max(0, cur));
  const next = cur - reserve;
  await kvSet(balKey(cid), String(next));
  return reserve;
}

export async function settle(
  cid: string,
  reservedMicro: number,
  actualRealUsd: number,
): Promise<{ balanceMicro: number; usedMicro: number; blocked: boolean }> {
  const cur = await getBalance(cid);
  const actualMicro = Math.round(actualRealUsd * 1_000_000);
  const used = Math.min(actualMicro, reservedMicro);
  // devolvemos lo no usado de la reserva
  const next = Math.max(0, cur + (reservedMicro - actualMicro));
  await kvSet(balKey(cid), String(next));
  return {
    balanceMicro: next,
    usedMicro: used,
    blocked: next <= 0,
  };
}

// Un pago exitoso de USD 2.8 acredita USD 2.8/8 de consumo real.
export async function creditTopUp(cid: string): Promise<number> {
  const cur = await getBalance(cid);
  const next = cur + TOPUP_REAL_MICRO;
  await kvSet(balKey(cid), String(next));
  return next;
}

export function balanceToUsd(micro: number): number {
  return microToUsd(micro);
}