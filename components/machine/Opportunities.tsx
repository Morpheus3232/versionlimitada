import type { Opportunity } from "@/lib/machine/types";
import { evidenceScore } from "@/lib/machine/score";
import { ProvenanceTag } from "@/components/machine/Provenance";

// Anatomía del problema: las preguntas que el expediente debe poder responder.
const ANATOMY_ROWS: { key: keyof Opportunity["anatomy"]; label: string }[] = [
  { key: "problem", label: "Qué está roto" },
  { key: "who", label: "Quién lo sufre" },
  { key: "context", label: "Cuándo ocurre" },
  { key: "frequency", label: "Con qué frecuencia" },
  { key: "intensity", label: "Qué tan doloroso" },
  { key: "workaround", label: "Cómo lo solucionan hoy" },
  { key: "timeCost", label: "Costo en tiempo" },
  { key: "moneyCost", label: "Costo en dinero" },
  { key: "existingSpend", label: "Ya gastan dinero" },
  { key: "market", label: "Mercado" },
  { key: "competitorGap", label: "Quién compite y qué falla" },
];

const STATUS_LABEL: Record<Opportunity["status"], string> = {
  OPEN: "expediente abierto",
  IN_EXPERIMENT: "en experimento",
  BUILD: "build",
  ITERATE: "iterate",
  KILLED: "kill",
};

export default function Opportunities({ items }: { items: Opportunity[] }) {
  return (
    <div className="space-y-4">
      {items.map((o) => {
        const score = evidenceScore(o.evidence);
        return (
          <article key={o.id} className="cell overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-linesoft px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-dim">expediente</span>
                <h3 className="font-heading text-lg font-bold text-ink">
                  <span className="font-mono text-sm text-accent">#{o.number}</span> · {o.title}
                </h3>
              </div>
              <span className="rounded-[6px] border border-accent/40 px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
                {STATUS_LABEL[o.status]}
              </span>
            </header>

            <div className="grid gap-0 lg:grid-cols-[1.3fr_1fr]">
              {/* Anatomía */}
              <dl className="divide-y divide-linesoft">
                {ANATOMY_ROWS.map((row) => (
                  <div key={row.key} className="flex gap-4 px-5 py-3">
                    <dt className="w-44 shrink-0 font-mono text-[11px] uppercase tracking-widest text-dim">
                      {row.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-muted">{o.anatomy[row.key]}</dd>
                  </div>
                ))}
              </dl>

              {/* Evidencia + score */}
              <aside className="border-t border-linesoft bg-paper/60 p-5 lg:border-l lg:border-t-0">
                <h4 className="font-heading text-sm font-semibold text-ink">Evidence score</h4>
                <div className="mt-3 flex items-end gap-3">
                  <span className="font-mono text-4xl font-bold text-accent">{score.total}</span>
                  <span className="mb-1 font-mono text-xs text-dim">/100</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-linesoft">
                  <div className="h-full rounded bg-accent" style={{ width: `${score.total}%` }} />
                </div>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-dim">
                  Observed real score (sólo hechos): <span className="text-accent">{score.observed}</span>
                </p>

                <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-dim">Hipótesis</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{o.hypothesis}</p>

                <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-dim">Evidencia en el expediente</p>
                <ul className="mt-2 divide-y divide-linesoft">
                  {o.evidence.map((e) => (
                    <li key={e.label} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-muted">{e.label}</p>
                        <p className="font-mono text-xs text-ink">{e.value}</p>
                      </div>
                      <ProvenanceTag kind={e.provenance} />
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </article>
        );
      })}
    </div>
  );
}