import type { GraveyardEntry } from "@/lib/machine/types";

// El Cementerio: los kills producen conocimiento. Vacío hasta que exista uno.
export default function Graveyard({ items }: { items: GraveyardEntry[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[10px] border border-line bg-panel px-5 py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <p className="font-mono text-3xl font-bold text-dim">0</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">experimentos matados</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-dim">todavía vacío</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((e) => (
        <article key={e.id} className="rounded-[10px] border border-line bg-panel px-5 py-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            experimento nº {e.number} · <span className="text-red-400">kill</span>
          </p>
          <h3 className="mt-1 font-heading text-2xl font-bold text-ink">{e.title}</h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">hipótesis</dt>
              <dd className="mt-1 text-sm text-muted">{e.hypothesis}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">por qué murió</dt>
              <dd className="mt-1 text-sm text-muted">{e.why}</dd>
            </div>
          </dl>
          <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-line bg-linesoft">
            {e.metrics.map((m) => (
              <div key={m.label} className="bg-paper px-3 py-2">
                <dd className="font-mono text-lg font-bold text-ink">{m.value}</dd>
                <dt className="font-mono text-[10px] text-dim">{m.label}</dt>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}