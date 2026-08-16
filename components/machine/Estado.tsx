// Estado del sistema: monitor operativo, no card de marketing.
// Cada línea = valor → etiqueta → estado. Cifras reales, derivadas del estado.
export default function Estado({
  signals,
  problems,
  designed,
  executed,
  results,
  decisions,
}: {
  signals: number;
  problems: number;
  designed: number;
  executed: number;
  results: number;
  decisions: number;
}) {
  const rows = [
    { label: "Señales observadas", value: signals, state: "activo", on: true },
    { label: "Expediente abierto", value: problems, state: "activo", on: true },
    { label: "Experimentos diseñados", value: designed, state: "no lanzado", on: false },
    { label: "Experimentos ejecutados", value: executed, state: "—", on: false },
    { label: "Resultados", value: results, state: "sin datos", on: false },
    { label: "Decisiones cerradas", value: decisions, state: "pendiente", on: false },
  ];

  return (
    <div className="overflow-hidden rounded-[10px] border border-line">
      <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">estado del sistema</p>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          en línea
        </span>
      </div>
      <dl className="divide-y divide-linesoft">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 bg-paper px-4 py-2.5">
            <div className="flex items-baseline gap-3">
              <dt className="font-mono text-xl font-bold text-ink">{r.value}</dt>
              <dd className="font-heading text-xs font-medium uppercase tracking-wide text-muted">{r.label}</dd>
            </div>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${r.on ? "text-accent" : "text-dim"}`}>
              {r.state}
            </span>
          </div>
        ))}
      </dl>
    </div>
  );
}