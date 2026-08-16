import type { ReactNode } from "react";
import type { Experiment, Opportunity } from "@/lib/machine/types";
import { NATURE, ProvenanceTag } from "@/components/machine/Provenance";

const STATUS_LABEL: Record<Opportunity["status"], string> = {
  OPEN: "expediente abierto",
  IN_EXPERIMENT: "en experimento",
  BUILD: "build",
  ITERATE: "iterate",
  KILLED: "kill",
};

const ANATOMY: { key: keyof Opportunity["anatomy"]; label: string }[] = [
  { key: "who", label: "quién" },
  { key: "context", label: "cuándo" },
  { key: "frequency", label: "frecuencia" },
  { key: "intensity", label: "intensidad" },
  { key: "workaround", label: "workaround actual" },
  { key: "timeCost", label: "costo tiempo" },
  { key: "moneyCost", label: "costo dinero" },
  { key: "existingSpend", label: "gasto existente" },
  { key: "market", label: "mercado" },
  { key: "competitorGap", label: "competencia · qué falla" },
];

function BlockSection({ tag, title, children }: { tag: string; title: string; children: ReactNode }) {
  return (
    <div className="border-t border-linesoft px-5 py-5">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        <span aria-hidden className="inline-block h-px w-4 bg-accent/60" />
        {tag}
      </p>
      <p className="mt-1 font-heading text-sm font-semibold uppercase tracking-wide text-ink">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function Opportunities({
  items,
  experiments,
}: {
  items: Opportunity[];
  experiments: Experiment[];
}) {
  const byId = new Map(experiments.map((e) => [e.id, e]));

  return (
    <div className="space-y-4">
      {items.map((o) => {
        const exp = o.experimentId ? byId.get(o.experimentId) : undefined;
        const balance: Record<string, number> = { OBSERVED: 0, INFERRED: 0, ESTIMATED: 0, GENERATED: 0 };
        o.evidence.forEach((e) => (balance[e.provenance] += 1));

        return (
          <article key={o.id} className="cell overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">expediente · nº {o.number}</p>
                <h3 className="mt-1 font-heading text-2xl font-bold tracking-tight text-ink">{o.title}</h3>
              </div>
              <span className="rounded-[6px] border border-accent/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
                estado · {STATUS_LABEL[o.status]}
              </span>
            </header>

            <BlockSection tag="01" title="Problema">
              <p className="max-w-2xl text-sm leading-relaxed text-muted">{o.problem}</p>
              <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {ANATOMY.map((row) => (
                  <div key={row.key}>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">{row.label}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted">{o.anatomy[row.key]}</dd>
                  </div>
                ))}
              </dl>
            </BlockSection>

            <BlockSection tag="02" title="Evidencia">
              <p className="mb-4 font-mono text-[11px] text-dim">
                Cada afirmación declara su naturaleza. Sólo <span className="text-accent">observado</span> cuenta
                como hecho; el resto es creencia o propuesta.
              </p>
              <ul className="divide-y divide-linesoft">
                {o.evidence.map((e) => (
                  <li key={e.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-muted">{e.label}</p>
                      <p className="font-mono text-xs text-ink">{e.value}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-dim">
                        {NATURE[e.provenance]}
                        {e.origin && <span className="text-dim"> · {e.origin}</span>}
                        {e.date && <span className="text-dim"> · {e.date}</span>}
                      </p>
                    </div>
                    <div className="shrink-0 justify-end sm:flex">
                      <ProvenanceTag kind={e.provenance} />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-linesoft pt-3 font-mono text-[11px] text-dim">
                <span className="text-xs uppercase tracking-widest text-muted">balance</span>
                <span className="text-accent">observado {balance.OBSERVED}</span>
                <span>inferido {balance.INFERRED}</span>
                <span>estimado {balance.ESTIMATED}</span>
                <span className="text-dim">generado (ia) {balance.GENERATED}</span>
              </div>
            </BlockSection>

            <BlockSection tag="03" title="Hipótesis">
              <p className="max-w-2xl text-sm leading-relaxed text-muted">{o.hypothesis}</p>
              <p className="mt-2 font-mono text-[11px] text-dim">{NATURE.GENERATED}</p>
            </BlockSection>

            <BlockSection tag="04" title="Experimento">
              {exp ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <p className="text-sm leading-relaxed text-muted">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-dim">método · </span>
                    {exp.method}
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-dim">mide · </span>
                    {exp.funnel}
                  </p>
                </div>
              ) : (
                <p className="font-mono text-[11px] text-dim">Sin experimento asignado todavía.</p>
              )}
            </BlockSection>

            <BlockSection tag="05" title="Resultado">
              <p className="font-mono text-[11px] text-dim">
                {exp?.state === "PLANNED"
                  ? "Sin datos · el experimento aún no se lanzó a tráfico real."
                  : exp?.state === "RUNNING"
                    ? "Corriendo · recogiendo observaciones."
                    : "Ver el cementerio (documentado como kill)."}
              </p>
            </BlockSection>

            <BlockSection tag="06" title="Decisión">
              <p className="font-mono text-sm text-muted">
                {o.status === "IN_EXPERIMENT" ? (
                  <>Pendiente · <span className="text-accent">en experimento</span> (build / iterate / kill a definir con resultados)</>
                ) : (
                  <span className="text-accent uppercase">{o.status}</span>
                )}
              </p>
            </BlockSection>
          </article>
        );
      })}
    </div>
  );
}