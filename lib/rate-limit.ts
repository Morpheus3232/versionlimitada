// Throttling simple en memoria por IP (suficiente para V1; en 1 instancia).
const WINDOW_MS = 60_000;

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(ip: string, max = 20): { ok: boolean; retryIn?: number } {
  const now = Date.now();
  const key = ip || "unknown";
  let b = buckets.get(key);
  if (!b || now > b.reset) {
    b = { count: 0, reset: now + WINDOW_MS };
    buckets.set(key, b);
  }
  b.count += 1;
  if (b.count > max) {
    return { ok: false, retryIn: Math.ceil((b.reset - now) / 1000) };
  }
  return { ok: true };
}