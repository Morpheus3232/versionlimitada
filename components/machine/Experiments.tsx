import type { Experiment } from "@/lib/machine/types";

const STATE_LABEL: Record<Experiment["state"], string> = {
  PLANNED: "no lanzado · listo",
  RUNNING: "corriendo",
  CONCLUDED: "concluido",
};

export default function Experiments({ items }: { items: Experiment[] }) {
  return (
    <div className="space-y-4">
      {items.map((e) => (
        <article key={e.id} className="rounded-[10px] border border-line bg-panel px-5 py-6 sm:px-7">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
                experimento · nº {e.number}
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold tracking-tight text-ink">{e.title}</h3>
            </div>
            <span className="rounded-[6px] border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-muted">
              {STATE_LABEL[e.state]}
            </span>
          </header>

          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">hipótesis</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{e.hypothesis}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">oferta</dt>
              <dd className="mt-1 text-sm text-muted">{e.offer}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">método</dt>
              <dd className="mt-1 text-sm text-muted">{e.method}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">métrica principal</dt>
              <dd className="mt-1 text-sm text-muted">{e.funnel}</dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-line pt-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-dim">resultado</p>
            <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-line bg-linesoft sm:grid-cols-4">
              {e.metrics.map((m) => (
                <div key={m.label} className="bg-paper p-3">
                  <p className="font-mono text-2xl font-bold text-dim">{m.value}</p>
                  <p className="mt-1 font-mono text-[10px] leading-tight text-dim">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 font-mono text-[11px] text-dim">el estado lo dice: aún no se lanzó</p>
          </div>
        </article>
      ))}
    </div>
  );
}