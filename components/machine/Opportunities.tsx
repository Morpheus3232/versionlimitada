import type { ReactNode } from "react";
import type { Evidence, Experiment, Opportunity } from "@/lib/machine/types";
import { ProvenanceTag } from "@/components/machine/Provenance";

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
  { key: "existingSpend", label: "gasto existente" },
  { key: "market", label: "mercado" },
  { key: "competitorGap", label: "competencia · qué falla" },
];

function Stage({ n, name, children }: { n: number; name: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-6 first:border-t-0">
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/60 font-mono text-[10px]">
          {String(n).padStart(2, "0")}
        </span>
        {name}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EvidenceUnit({ e }: { e: Evidence }) {
  return (
    <div className="border-l-2 border-linesoft py-1 pl-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-dim">{e.label}</p>
        <ProvenanceTag kind={e.provenance} />
      </div>
      <p className="mt-1 font-heading text-sm font-semibold text-ink">{e.value}</p>
      {(e.origin || e.date) && (
        <p className="mt-0.5 font-mono text-[11px] text-dim">
          {e.origin && <span>fuente · {e.origin}</span>}
          {e.origin && e.date && <span className="mx-1">/</span>}
          {e.date && <span>fecha · {e.date}</span>}
        </p>
      )}
    </div>
  );
}

const GROUPS: { id: string; title: string; kinds: Evidence["provenance"][] }[] = [
  { id: "sabemos", title: "Lo sabemos", kinds: ["OBSERVED"] },
  { id: "suponemos", title: "Lo estamos suponiendo", kinds: ["INFERRED", "ESTIMATED"] },
  { id: "propone", title: "Lo propone la máquina", kinds: ["GENERATED"] },
];

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
        return (
          <article key={o.id} className="rounded-[10px] border border-line bg-panel px-5 py-1 sm:px-7">
            {/* Encabezado del expediente */}
            <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line py-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
                  expediente · nº {o.number}
                </p>
                <h3 className="mt-1 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Vigilancia de visibilidad en IA
                </h3>
              </div>
              <span className="rounded-[6px] border border-accent/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
                {STATUS_LABEL[o.status]}
              </span>
            </header>

            {/* 01 · Problema */}
            <Stage n={1} name="Problema">
              <p className="max-w-2xl font-heading text-base font-semibold leading-relaxed text-ink">
                {o.anatomy.problem}
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {ANATOMY.map((row) => (
                  <div key={row.key}>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">{row.label}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted">{o.anatomy[row.key]}</dd>
                  </div>
                ))}
              </dl>
            </Stage>

            {/* 02 · Evidencia — separación hecha/propuesta */}
            <Stage n={2} name="Evidencia">
              <div className="grid gap-6 lg:grid-cols-3">
                {GROUPS.map((g) => {
                  const evs = o.evidence.filter((e) => g.kinds.includes(e.provenance));
                  if (evs.length === 0) return null;
                  return (
                    <div key={g.id}>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{g.title}</p>
                      <div className="space-y-4">
                        {evs.map((e) => (
                          <EvidenceUnit key={e.label} e={e} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Stage>

            {/* 03 · Hipótesis */}
            <Stage n={3} name="Hipótesis">
              <p className="max-w-2xl text-sm leading-relaxed text-muted">{o.hypothesis}</p>
              <p className="mt-2 font-mono text-[11px] text-dim">lo propone la máquina</p>
            </Stage>

            {/* 04 · Experimento */}
            <Stage n={4} name="Experimento">
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
            </Stage>

            {/* 05 · Resultado */}
            <Stage n={5} name="Resultado">
              <p className="font-mono text-lg font-bold text-dim">SIN DATOS</p>
              <p className="mt-1 font-mono text-[11px] text-dim">no lanzado a tráfico real</p>
            </Stage>

            {/* 06 · Decisión */}
            <Stage n={6} name="Decisión">
              <p className="font-mono text-sm text-muted">
                Pendiente · <span className="text-accent">en experimento</span> (build / iterate / kill a definir con resultados)
              </p>
            </Stage>
          </article>
        );
      })}
    </div>
  );
}