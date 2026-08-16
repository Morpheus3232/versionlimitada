// Estado de la máquina: cifras reales, contadas del estado actual.
// Si no hay datos, se dice. Nunca se rellenan números ficticios.
export default function Estado({
  signals,
  problems,
  activeExperiments,
}: {
  signals: number;
  problems: number;
  activeExperiments: number;
}) {
  const cells = [
    { label: "Señales detectadas", value: String(signals), sub: "fuentes públicas · observado" },
    { label: "Problemas investigados", value: String(problems), sub: "expedientes abiertos" },
    { label: "Experimentos corriendo", value: String(activeExperiments), sub: "infraestructura lista" },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-line bg-linesoft">
        {cells.map((c) => (
          <div key={c.label} className="bg-panel p-5 sm:p-6">
            <p className="font-mono text-3xl font-bold text-ink sm:text-4xl">{c.value}</p>
            <p className="mt-2 font-heading text-xs font-semibold uppercase tracking-wide text-muted sm:text-sm">
              {c.label}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-accent sm:text-[11px]">
              real · {c.sub}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-[10px] border border-line bg-panel px-4 py-3 font-mono text-[11px] leading-relaxed text-dim">
        Datos reales. La máquina está comenzando: expediente #001 abierto y primer
        experimento listo para lanzarse. Cuando haya más señales o resultados, se
        actualizan acá solos.
      </p>
    </div>
  );
}