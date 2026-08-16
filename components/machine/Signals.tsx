import type { Signal } from "@/lib/machine/types";

// Lo que la máquina está buscando: dolor observable, no ideas. Cada entrada es
// una afirmación con origen; el nº de menciones va etiquetado como observado.
export default function Signals({ signals }: { signals: Signal[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {signals.map((s) => (
        <article key={s.id} className="cell flex flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-[6px] border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-dim">
              {s.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-muted">
              {s.source}
            </span>
          </div>
          <p className="mt-3 font-heading text-base font-semibold leading-snug text-ink">
            {s.title}
          </p>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
            <span className="font-mono text-[11px] uppercase tracking-widest text-dim">patrón · </span>
            {s.pattern}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-linesoft pt-3 font-mono text-[11px] text-dim">
            <span>
              {s.mentions ? (
                <>
                  {s.mentions} menciones · <span className="text-accent">observado</span>
                </>
              ) : (
                "señal · en conteo"
              )}
            </span>
            <span className="flex items-center gap-3">
              {s.workaroundObserved && <span className="text-gold">workaround ✓</span>}
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent transition hover:text-accenthover"
                >
                  fuente →
                </a>
              )}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}