import type { EvidenceProvenance } from "@/lib/machine/types";

// Etiquetas de ROL (procedencia) con colores fijos, semánticos y legibles.
const STYLE: Record<EvidenceProvenance, string> = {
  OBSERVED: "border-accent/50 text-accent",
  INFERRED: "border-line text-muted",
  ESTIMATED: "border-gold/50 text-gold",
  GENERATED: "border-dashed border-line text-dim",
};

const LABEL: Record<EvidenceProvenance, string> = {
  OBSERVED: "observado",
  INFERRED: "inferido",
  ESTIMATED: "estimado",
  GENERATED: "generado · ia",
};

export const NATURE: Record<EvidenceProvenance, string> = {
  OBSERVED: "Qué sabemos · se observó, con fuente y fecha",
  INFERRED: "Qué creemos · conclusión derivada de observaciones",
  ESTIMATED: "Qué suponemos · estimación con supuestos de trabajo",
  GENERATED: "Qué propone la máquina · sugerido por IA, no cuenta como hecho",
};

export function ProvenanceTag({ kind }: { kind: EvidenceProvenance }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STYLE[kind]}`}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-70" />
      {LABEL[kind]}
    </span>
  );
}

export function ProvenanceKey() {
  const keys: EvidenceProvenance[] = ["OBSERVED", "INFERRED", "ESTIMATED", "GENERATED"];
  return (
    <p className="flex flex-wrap gap-2 font-mono text-[11px] text-dim">
      {keys.map((k) => (
        <ProvenanceTag key={k} kind={k} />
      ))}
    </p>
  );
}