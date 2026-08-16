import type { Experiment } from "@/lib/machine/types";
import { ProvenanceTag } from "@/components/machine/Provenance";

const STATE_LABEL: Record<Experiment["state"], string> = {
  PLANNED: "no lanzado · listo",
  RUNNING: "corriendo",
  CONCLUDED: "concluido",
};

// Experimentos: se representa lo que realmente existe. Mientras no haya uno
// corriendo con tráfico, la sección declara la infraestructura lista.
export default function Experiments({ items }: { items: Experiment[] }) {
  const active = items.filter((e) => e.state === "RUNNING").length;

  return (
    <div>
      <p className="mb-4 max-w-2xl rounded-[10px] border border-line bg-panel px-4 py-3 font-mono text-[11px] leading-relaxed text-dim">
        {active > 0
          ? `${active} experimento(s) corriendo.`
          : "Infraestructura preparada — sin experimentos activos todavía. El expediente #001 tiene un experimento diseñado y listo para lanzarse; cuando se publique, los resultados se llenan con datos observados y su origen."}
      </p>

      <div className="space-y-4">
        {items.map((e) => (
          <article key={e.id} className="cell flex flex-col p-6 md:flex-row md:gap-8">
            <div className="md:w-2/5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-dim">experimento nº {e.number}</span>
                <span className="rounded-[6px] border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                  {STATE_LABEL[e.state]}
                </span>
              </div>
              <h3 className="mt-2 font-heading text-xl font-bold text-ink">{e.title}</h3>
              <dl className="mt-4 space-y-3">
                <div>
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
            </div>

            <div className="md:w-3/5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-dim">resultado</p>
              <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-line bg-linesoft sm:grid-cols-4">
                {e.metrics.map((m) => (
                  <div key={m.label} className="bg-panel p-3">
                    <p className="font-mono text-2xl font-bold text-ink">{m.value}</p>
                    <p className="mt-1 font-mono text-[10px] leading-tight text-dim">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-dim">
                {e.state === "PLANNED"
                  ? "Sin lanzar: a la vista no hay datos reales todavía. Estos campos se actualizan cuando haya observaciones, con origen y fecha."
                  : e.notes}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-linesoft pt-3">
                <span className="font-mono text-[11px] text-dim">
                  decisión ·{" "}
                  <span className={e.decision ? "uppercase text-accent" : "text-dim"}>
                    {e.decision ?? "pendiente"}
                  </span>
                </span>
                <div className="flex items-center justify-end gap-1.5">
                  {[...new Set(e.metrics.map((m) => m.provenance))].map((p) => (
                    <ProvenanceTag key={p} kind={p} />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}