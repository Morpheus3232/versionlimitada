import type { GraveyardEntry } from "@/lib/machine/types";

// The Graveyard: los experimentos que terminaron en KILL son activos, no errores.
// Mientras no exista un kill real, se muestra vacío — no se inventan fracasos.
export default function Graveyard({ items }: { items: GraveyardEntry[] }) {
  if (items.length === 0) {
    return (
      <div className="cell flex flex-col gap-2 p-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-dim">el cementerio está vacío</p>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted">
          Los fracasos producen conocimiento. Cuando un experimento real llegue a{" "}
          <span className="font-mono text-xs text-red-400">kill</span>, se documenta acá con su
          hipótesis, su resultado, por qué murió y qué se aprendió. Por ahora no hay ninguno,
          y eso también se dice.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((e) => (
        <article key={e.id} className="cell p-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            experimento nº {e.number} · <span className="text-red-400">kill</span>
          </p>
          <h3 className="mt-1 font-heading text-xl font-bold text-ink">{e.title}</h3>
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
              <div key={m.label} className="bg-panel px-3 py-2">
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