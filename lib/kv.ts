import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Almacén clave-valor con fallback local (archivo) cuando no hay KV_REST_*.
// En producción usa @vercel/kv (Upstash) si las credenciales están presentes.

const FILE = path.join(os.tmpdir(), "versionlimitada-kv.json");
let remote: (typeof import("@vercel/kv"))["kv"] | null = null;

function hasRemote() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getRemote() {
  if (!remote) {
    const mod = await import("@vercel/kv");
    remote = mod.kv;
  }
  return remote;
}

function readLocal(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeLocal(data: Record<string, unknown>) {
  fs.writeFileSync(FILE, JSON.stringify(data));
}

export async function kvGet(key: string): Promise<string | null> {
  if (hasRemote()) {
    const kv = await getRemote();
    const v = await kv.get<string>(key);
    return v ?? null;
  }
  const data = readLocal();
  const v = data[key];
  return typeof v === "string" ? v : v == null ? null : JSON.stringify(v);
}

export async function kvSet(
  key: string,
  value: unknown,
  opts?: { ex?: number; nx?: boolean },
): Promise<string | null> {
if (hasRemote()) {
    const kv = await getRemote();
    const v = typeof value === "string" ? value : JSON.stringify(value);
    const o: { ex?: number; nx?: true } = {};
    if (opts?.ex != null) o.ex = opts.ex;
    if (opts?.nx === true) o.nx = true;
    return kv.set(key, v, o as Parameters<typeof kv.set>[2]);
  }
  const data = readLocal();
  if (opts?.nx && key in data) return null;
  data[key] = value;
  writeLocal(data);
  if (opts?.ex) {
    setTimeout(() => {
      const d = readLocal();
      if (d[key] === value) {
        delete d[key];
        writeLocal(d);
      }
    }, opts.ex * 1000).unref();
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}

export async function kvDel(key: string): Promise<void> {
  if (hasRemote()) {
    const kv = await getRemote();
    await kv.del(key);
    return;
  }
  const data = readLocal();
  delete data[key];
  writeLocal(data);
}