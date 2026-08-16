import type { Evidence, EvidenceProvenance } from "@/lib/machine/types";

/**
 * Evidence Score.
 *
 * La regla de la casa: NUNCA mezclar evidencia observada con inferencia de IA
 * sin distinguirlas. Por eso el score no es un número mágico que la IA "opina".
 * Es una composición transparente de lo que cada dato pesa, agrupado por origen.
 */
export const PROVENANCE_LABEL: Record<EvidenceProvenance, string> = {
  OBSERVED: "Observado",
  INFERRED: "Inferido",
  ESTIMATED: "Estimado",
  GENERATED: "Generado",
};

export const PROVENANCE_WEIGHT: Record<EvidenceProvenance, number> = {
  OBSERVED: 1,
  ESTIMATED: 0.5,
  INFERRED: 0.3,
  GENERATED: 0,
};

export interface ScoreSlice {
  label: EvidenceProvenance;
  points: number;
  items: number;
  weight: number;
}

export interface EvidenceScoreResult {
  /** /100 — la composición se muestra siempre desglosada, nunca como un único default. */
  total: number;
  observed: number;
  slices: ScoreSlice[];
}

/**
 * Calcula un score a partir de una lista de afirmaciones. Sólo cuenta lo que
 * entra al expediente: GENERATED (lo que sugiere la IA) pesa 0 para no inflar
 * el score con opiniones. Cada origen aporta a su propia franja.
 */
export function evidenceScore(evidence: Evidence[]): EvidenceScoreResult {
  const by: Record<EvidenceProvenance, number> = {
    OBSERVED: 0,
    INFERRED: 0,
    ESTIMATED: 0,
    GENERATED: 0,
  };
  for (const e of evidence) by[e.provenance] += 1;

  const slices: ScoreSlice[] = (Object.keys(by) as EvidenceProvenance[])
    .filter((k) => by[k] > 0)
    .map((k) => ({
      label: k,
      points: by[k],
      items: by[k],
      weight: PROVENANCE_WEIGHT[k],
    }));

  const weighted = slices.reduce((acc, s) => acc + s.points * s.weight, 0);
  // Techo blando: la evidencia observada domina, y nada puede sumar por encima
  // de su propio peso.
  const total = Math.min(100, Math.round(weighted * 12));
  const observed = Math.min(100, Math.round(by.OBSERVED * 20));

  return { total, observed, slices };
}