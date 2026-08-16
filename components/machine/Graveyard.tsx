import type { GraveyardEntry } from "@/lib/machine/types";

// The Graveyard: los experimentos que terminaron en KILL son activos, no errores.
// Un fracaso documentado enseña más que diez aciertos no medidos.
export default function Graveyard({ items }: { items: GraveyardEntry[] }) {
  return (
    <div className="space-y-3">
      {items.map((e) => (
        <article key={e.id} className="cell flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-widest text-dim">
              experimento #{e.number} · <span className="text-red-400">kill</span>
            </p>
            <h3 className="mt-1 font-heading text-lg font-bold text-ink">{e.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{e.why}</p>
            <p className="mt-2 font-mono text-[11px] text-dim">{e.offer}</p>
          </div>
          <dl className="grid shrink-0 grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-line bg-linesoft">
            {e.metrics.map((m) => (
              <div key={m.label} className="bg-panel px-3 py-2">
                <dd className="font-mono text-lg font-bold text-ink">{m.value}</dd>
                <dt className="font-mono text-[10px] text-dim">{m.label}</dt>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}