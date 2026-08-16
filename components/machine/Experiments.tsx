import type { Experiment } from "@/lib/machine/types";
import { ProvenanceTag } from "@/components/machine/Provenance";

export default function Experiments({ items }: { items: Experiment[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((e) => (
        <article key={e.id} className="cell flex flex-col p-6">
          <header className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-lg font-bold text-ink">
              <span className="font-mono text-sm text-accent">experimento #{e.number}</span>
              <span className="block text-base">{e.title}</span>
            </h3>
            <span
              className={`shrink-0 rounded-[6px] border px-2 py-1 font-mono text-[11px] uppercase tracking-widest ${
                e.state === "RUNNING"
                  ? "border-accent/40 text-accent"
                  : "border-line text-muted"
              }`}
            >
              {e.state === "RUNNING" ? "corriendo" : "concluido"}
            </span>
          </header>

          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
            <span className="font-mono text-[11px] uppercase tracking-widest text-dim">hipótesis · </span>
            {e.hypothesis}
          </p>

          <p className="mt-2 font-mono text-[11px] text-dim">
            oferta: {e.offer}
          </p>
          <p className="mt-1 font-mono text-[11px] text-dim">
            mide · {e.funnel}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-line bg-linesoft">
            {e.metrics.map((m) => (
              <div key={m.label} className="bg-panel p-3">
                <p className="font-mono text-2xl font-bold text-ink">{m.value}</p>
                <p className="mt-0.5 flex items-center justify-between gap-2 font-mono text-[11px] text-dim">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <footer className="mt-4 flex items-center justify-between gap-3 border-t border-linesoft pt-3">
            <span className="flex items-center gap-2 font-mono text-[11px] text-dim">
              {e.realTraffic ? "tráfico real" : "simulado"}
            </span>
            <div className="flex items-center justify-end gap-1.5">
              {[...new Set(e.metrics.map((m) => m.provenance))].map((p) => (
                <ProvenanceTag key={p} kind={p} />
              ))}
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
}