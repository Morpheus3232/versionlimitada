import { PIPELINE } from "@/lib/machine/types";

// La cadena de la máquina. Es una secuencia real (señal → decisión), por eso
// el número de etapa sí tiene sentido: ordena y no decora.
export default function Pipeline() {
  return (
    <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-linesoft sm:grid-cols-4 lg:grid-cols-8">
      {PIPELINE.map((stage, i) => (
        <li key={stage} className="flex flex-col gap-1.5 bg-panel p-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-heading text-sm font-semibold text-ink">{stage}</span>
          <span aria-hidden className="h-px w-full bg-line" />
        </li>
      ))}
    </ol>
  );
}