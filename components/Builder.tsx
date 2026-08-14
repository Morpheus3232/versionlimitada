"use client";

import { useCallback, useEffect, useState } from "react";

type BuildResult = {
  html: string;
  promptTokens: number;
  completionTokens: number;
  realCostUsd: number;
  userCostUsd: number;
  markup: number;
  balanceUsd: number;
  blocked: boolean;
};

const cidKey = "vl.builder.cid";

function getCid(): string {
  if (typeof window === "undefined") return "";
  let c = window.localStorage.getItem(cidKey);
  if (!c) {
    c = "vl-" + crypto.randomUUID().slice(0, 12);
    window.localStorage.setItem(cidKey, c);
  }
  return c;
}

export default function Builder() {
  const [clientId, setClientId] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"idle" | "result" | "blocked">("idle");
  const [res, setRes] = useState<BuildResult | null>(null);
  const [balance, setBalance] = useState(0.35);
  const [published, setPublished] = useState("");

  const loadBalance = useCallback(async () => {
    if (!clientId) return;
    try {
      const r = await fetch(`/api/usage?cid=${encodeURIComponent(clientId)}`);
      const j = await r.json();
      if (typeof j.balanceUsd === "number") setBalance(j.balanceUsd);
    } catch {
      /* noop */
    }
  }, [clientId]);

  useEffect(() => {
    const cid = getCid();
    setClientId(cid);
    loadBalance();
  }, [loadBalance]);

  // Si vuelvo de un pago aprobado, acredito el top-up.
  useEffect(() => {
    if (typeof window === "undefined" || !clientId) return;
    const q = new URLSearchParams(window.location.search);
    const pg = q.get("pg");
    if (pg === "ok") {
      const ref = q.get("payment_id") ?? q.get("token");
      (async () => {
        if (ref) {
          await fetch("/api/payments/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method: ref.startsWith("pay") ? "paypal" : "mp", clientId, paymentRef: ref }),
          }).catch(() => {});
        }
        setPhase((p) => (p === "blocked" ? "idle" : p));
        await loadBalance();
        window.history.replaceState({}, "", "/construir");
      })();
    }
  }, [clientId, loadBalance]);

  const build = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), clientId }),
      });
      const j = await r.json();
      if (j.blocked) {
        setPhase("blocked");
        setBalance(0);
      } else if (j.html) {
        setRes(j);
        setPhase("result");
        setBalance(j.balanceUsd);
      } else if (r.status === 503) {
        setError("El motor no está configurado todavía (falta la key de IA del dueño).");
      } else {
        setError(j.error ?? j.detail ?? "No se pudo generar.");
      }
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    if (!res) return;
    const slug = `vl-${Date.now().toString(36)}-${clientId.slice(-4)}`;
    const r = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, html: res.html }),
    });
    const j = await r.json();
    if (j.ok) setPublished(j.url);
    else setError("No se pudo publicar.");
  };

  const pay = async (method: "mp" | "paypal") => {
    const r = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, clientId }),
    });
    const j = await r.json();
    if (j.url) window.location.href = j.url;
    else setError(j.error ?? "No se pudo iniciar el pago.");
  };

  const remainingCost = balance < 0.000001 ? 0 : balance;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Columna: generar */}
      <div>
        <form onSubmit={build} className="flex flex-col gap-3">
          <label htmlFor="prompt" className="font-mono text-xs uppercase tracking-widest text-muted">
            Describí tu sitio web
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full resize-y rounded-[10px] border border-line bg-panel px-4 py-3 font-mono text-sm text-ink placeholder-dim outline-none focus:border-accent"
            placeholder="Ej.: una landing para una cafetería de especialidad en Buenos Aires, tono cálido, con menú y WhatsApp…"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="rounded-[10px] bg-accent px-6 py-3 font-heading text-sm font-bold text-paper transition hover:bg-accenthover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generando…" : "Generar web"}
            </button>
            {phase === "blocked" && (
              <span className="font-mono text-xs text-gold">Saldo agotado — recargá para seguir.</span>
            )}
          </div>
        </form>

        {error && (
          <p role="alert" className="mt-4 rounded-[10px] border border-red-900 bg-panel px-4 py-3 font-mono text-xs text-red-400">
            {error}
          </p>
        )}

        {/* Estado bloqueado → pagar */}
        {phase === "blocked" && (
          <div className="mt-6 rounded-[10px] border border-gold/40 bg-panel p-5">
            <h3 className="font-heading text-lg font-bold text-ink">Recargá para seguir</h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              Te regalé tus primeros tokens (lo pago yo). Cuando se acaban, cada
              recarga es de <strong className="text-gold">USD 2,80</strong> y te alcanza para volver a trabajar.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => pay("mp")} className="rounded-[10px] bg-gold px-5 py-3 font-heading text-sm font-bold text-paper transition hover:brightness-110">
                Pagar con Mercado Pago
              </button>
              <button onClick={() => pay("paypal")} className="rounded-[10px] border border-line px-5 py-3 font-heading text-sm font-semibold text-ink transition hover:border-accent/60 hover:text-accent">
                PayPal
              </button>
            </div>
          </div>
        )}

        {/* Resultado */}
        {phase === "result" && res && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={publish} className="rounded-[10px] bg-gold px-5 py-3 font-heading text-sm font-bold text-paper transition hover:brightness-110">
                Publicar en link público
              </button>
              <a href={`data:text/html;charset=utf-8,${encodeURIComponent(res.html)}`} download="sitio.html" className="rounded-[10px] border border-line px-5 py-3 font-heading text-sm font-semibold text-ink transition hover:border-accent/60 hover:text-accent">
                Descargar HTML
              </a>
            </div>
            {published && (
              <p className="font-mono text-xs">
                <span className="text-dim">En línea:</span>{" "}
                <a className="text-accent hover:underline" href={published} target="_blank" rel="noreferrer">
                  {window.location.origin}{published}
                </a>
              </p>
            )}
            <div className="overflow-hidden rounded-[10px] border border-line bg-white">
              <iframe title="Vista previa" sandbox="allow-scripts" className="h-[380px] w-full" srcDoc={res.html} />
            </div>
          </div>
        )}
      </div>

      {/* Columna: transparencia / saldo */}
      <aside className="space-y-4">
        <div className="rounded-[10px] border border-line bg-panel p-5">
          <h3 className="font-heading text-sm font-semibold text-ink">Tu saldo</h3>
          <p className="mt-2 font-mono text-3xl font-bold text-accent">
            ${remainingCost.toFixed(4)}
          </p>
          <p className="mt-1 font-mono text-[11px] text-dim">de consumo real de IA</p>
          <div className="mt-3 h-1 w-full rounded bg-linesoft">
            <div className="h-full rounded bg-accent" style={{ width: `${Math.min(100, (balance / 0.7) * 100)}%` }} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-dim">
            Gratis hasta USD 0.35 · recarga USD 2.80
          </p>
        </div>

        {res && phase === "result" && (
          <div className="rounded-[10px] border border-line bg-panel p-5">
            <h3 className="font-heading text-sm font-semibold text-ink">Costo de esta generación</h3>
            <dl className="mt-3 space-y-1 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-dim">Tokens (in/out)</dt><dd className="text-muted">{res.promptTokens} / {res.completionTokens}</dd></div>
              <div className="flex justify-between"><dt className="text-dim">Costo real (dueño)</dt><dd className="text-muted">${res.realCostUsd}</dd></div>
              <div className="flex justify-between"><dt className="text-dim">Vos pagás (×{res.markup})</dt><dd className="text-gold">${res.userCostUsd}</dd></div>
              <div className="flex justify-between border-t border-linesoft pt-1"><dt className="text-dim">Saldo restante</dt><dd className="text-muted">${res.balanceUsd}</dd></div>
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-dim">
              Transparencia total: se cobra 8× lo que realmente cuesta ejecutar tu
              pedido en el proveedor del dueño. Sin suscripciones escondidas.
            </p>
          </div>
        )}

        <div className="rounded-[10px] border border-line bg-panel p-5">
          <h3 className="font-heading text-sm font-semibold text-ink">Qué tiene esto que otros no</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• Link público instantáneo en /s/…, sin cuenta.</li>
            <li>• Pagás solo el cómputo real (×8), transparente.</li>
            <li>• Primeros casos los paga el dueño: gratis para vos.</li>
            <li>• HTML autocontenido: lo llevás a donde quieras.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}