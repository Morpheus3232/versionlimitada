"use client";

import type { ReactNode } from "react";
import type { EvidenceProvenance, EvidenceUnit, Expediente, Experiment } from "@/lib/lab/state";
import { ProvenanceTag } from "@/components/lab/ui";

// ─── 6-stage pipeline for an expediente — canonical (rescatado de Machine) ──

interface PipelineProps {
  exp: Expediente;
  experiments: Experiment[];
}

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

const ANATOMY_ROWS: { key: keyof NonNullable<Expediente["anatomy"]>; label: string }[] = [
  { key: "who", label: "quién" },
  { key: "context", label: "cuándo" },
  { key: "frequency", label: "frecuencia" },
  { key: "intensity", label: "intensidad" },
  { key: "workaround", label: "workaround actual" },
  { key: "existingSpend", label: "gasto existente" },
  { key: "market", label: "mercado" },
  { key: "competitorGap", label: "competencia · qué falla" },
];

function EvidenceUnitItem({ e }: { e: EvidenceUnit }) {
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

const GROUPS: { id: string; title: string; kinds: EvidenceProvenance[] }[] = [
  { id: "sabemos", title: "Lo sabemos", kinds: ["OBSERVED"] },
  { id: "suponemos", title: "Lo estamos suponiendo", kinds: ["INFERRED", "ESTIMATED"] },
  { id: "propone", title: "Lo propone la máquina", kinds: ["GENERATED"] },
];

export default function OpportunityPipeline({ exp, experiments }: PipelineProps) {
  return (
    <article className="rounded-[10px] border border-line bg-panel px-5 py-1 sm:px-7">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line py-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            expediente · nº {String(exp.number).padStart(3, "0")}
          </p>
          <h3 className="mt-1 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {exp.title}
          </h3>
        </div>
        <span className="rounded-[6px] border border-accent/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
          {exp.status.replace(/_/g, " ")}
        </span>
      </header>

      {/* 01 · Problema */}
      <Stage n={1} name="Problema">
        <p className="max-w-2xl font-heading text-base font-semibold leading-relaxed text-ink">
          {exp.problem}
        </p>
        {exp.anatomy && (
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {ANATOMY_ROWS.map((row) => (
              <div key={row.key}>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">{row.label}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-muted">{exp.anatomy![row.key] ?? "—"}</dd>
              </div>
            ))}
            {exp.competition && (
              <div className="sm:col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-dim">competencia ({exp.competition.count})</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-muted">{exp.competition.gap}</dd>
              </div>
            )}
          </dl>
        )}
      </Stage>

      {/* 02 · Evidencia — grouped by provenance */}
      <Stage n={2} name="Evidencia">
        {exp.evidence.length === 0 ? (
          <p className="font-mono text-sm text-dim">Sin evidencia registrada.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {GROUPS.map((g) => {
              const evs = exp.evidence.filter((e) => g.kinds.includes(e.provenance));
              if (evs.length === 0) return null;
              return (
                <div key={g.id}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{g.title}</p>
                  <div className="space-y-4">
                    {evs.map((e) => (
                      <EvidenceUnitItem key={e.id} e={e} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Stage>

      {/* 03 · Hipótesis */}
      <Stage n={3} name="Hipótesis">
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {exp.hypothesis || "Sin hipótesis definida."}
        </p>
      </Stage>

      {/* 04 · Experimento(s) */}
      <Stage n={4} name="Experimento">
        {experiments.length === 0 ? (
          <p className="font-mono text-sm text-dim">Sin experimento asignado.</p>
        ) : (
          <div className="space-y-4">
            {experiments.map((ex) => (
              <div key={ex.id} className="grid gap-3 sm:grid-cols-2">
                <p className="text-sm leading-relaxed text-muted">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-dim">método · </span>
                  {ex.method || "—"}
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-dim">mide · </span>
                  {ex.metricPrimary}{ex.metricSecondary ? ` · ${ex.metricSecondary}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </Stage>

      {/* 05 · Resultado */}
      <Stage n={5} name="Resultado">
        {experiments.filter((x) => x.result).length === 0 ? (
          <p className="font-mono text-lg font-bold text-dim">SIN DATOS</p>
        ) : (
          <div className="space-y-4">
            {experiments.map((ex) =>
              ex.result ? (
                <div key={ex.id} className="rounded-[8px] border border-line bg-paper p-3">
                  <p className="font-mono text-[10px] text-dim">{ex.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-dim">ocurrió · </span>
                    {ex.result.occurred}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-dim">
                    métrica: {ex.result.metric || "—"}
                  </p>
                </div>
              ) : null,
            )}
          </div>
        )}
      </Stage>

      {/* 06 · Decisión */}
      <Stage n={6} name="Decisión">
        {experiments.filter((x) => x.decision && x.decision.value !== "PENDING").length === 0 ? (
          <p className="font-mono text-sm text-muted">
            Pendiente · <span className="text-accent">en evaluación</span> (build / iterate / kill a definir)
          </p>
        ) : (
          <div className="space-y-3">
            {experiments.map((ex) =>
              ex.decision && ex.decision.value !== "PENDING" ? (
                <div key={ex.id} className="rounded-[8px] border border-line bg-paper p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[4px] border border-accent/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                      {ex.decision.value}
                    </span>
                    <span className="font-mono text-[11px] text-dim">{ex.decision.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{ex.decision.reason}</p>
                  {ex.decision.aprendizaje && (
                    <p className="mt-1 font-mono text-[11px] text-dim">aprendizaje: {ex.decision.aprendizaje}</p>
                  )}
                </div>
              ) : null,
            )}
          </div>
        )}
      </Stage>
    </article>
  );
}
