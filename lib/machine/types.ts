/**
 * VersionLimitada — modelo de la máquina de descubrir y demostrar oportunidades.
 *
 * Principio que gobierna el modelo: en la máquina hay un solo tipo de dato
 * que NO puede mezclarse sin etiquetarlo — el origen de cada afirmación.
 * Por eso toda cifra de la plataforma lleva siempre una `provenance`.
 *
 *   OBSERVED    → lo vimos nosotros (mención, workaround, pago, conversión)
 *   INFERRED    → lo dedujimos de otras observaciones (intensidad, dolor)
 *   ESTIMATED   → lo estimamos con supuestos explícitos (TAM, mercado)
 *   GENERATED   → lo sugirió una IA (MVP, prompts, títulos)
 *
 * Una "opinión de IA" jamás cuenta como observación. La máquina las mantiene
 * separadas para que el Evidence Score no mezcle predicción con hecho.
 */

export type EvidenceProvenance = "OBSERVED" | "INFERRED" | "ESTIMATED" | "GENERATED";

export type Decision = "BUILD" | "ITERATE" | "KILL";

export type Stage =
  | "SIGNAL"
  | "PROBLEM"
  | "ANATOMY"
  | "OPPORTUNITY"
  | "HYPOTHESIS"
  | "EXPERIMENT"
  | "RESULT"
  | "DECISION";

/** Cadena de la máquina: la columna vertebral del pipeline (es una secuencia real). */
export const PIPELINE: Stage[] = [
  "SIGNAL",
  "PROBLEM",
  "ANATOMY",
  "OPPORTUNITY",
  "HYPOTHESIS",
  "EXPERIMENT",
  "RESULT",
  "DECISION",
];

/** Una señal observable de dolor: el insumo bruto de la máquina. */
export interface Signal {
  id: string;
  /** La afirmación observable, no el "título de una idea". */
  title: string;
  /** El síntoma de dolor que sugiere. */
  pattern: string;
  source: string;
  url?: string;
  category: string;
  /** nº de menciones/incidencias independientes observadas (null = aún no contadas). */
  mentions?: number;
  workaroundObserved?: boolean;
}

export interface Evidence {
  label: string;
  value: string;
  provenance: EvidenceProvenance;
}

export interface ProblemAnatomy {
  problem: string;
  who: string;
  context: string;
  frequency: string;
  intensity: string;
  workaround: string;
  timeCost: string;
  moneyCost: string;
  existingSpend: string;
  market: string;
  competitors: string[];
  competitorGap: string;
}

export interface Opportunity {
  id: string;
  number: string;
  title: string;
  problem: string;
  anatomy: ProblemAnatomy;
  signalsObserved: number;
  workaroundCount: number;
  competition: { count: number; gap: string };
  hypothesis: string;
  evidence: Evidence[];
  status: "OPEN" | "IN_EXPERIMENT" | "BUILD" | "ITERATE" | "KILLED";
}

export interface ExperimentMetric {
  label: string;
  value: string;
  provenance: EvidenceProvenance;
}

export interface Experiment {
  id: string;
  number: string;
  title: string;
  hypothesis: string;
  offer: string;
  funnel: string;
  url?: string;
  realTraffic: boolean;
  metrics: ExperimentMetric[];
  state: "RUNNING" | "CONCLUDED";
  decision?: Decision;
  notes?: string;
}

/** El Cementerio: experimentos terminados en KILL, tratados como activos de conocimiento. */
export interface GraveyardEntry extends Experiment {
  decision: "KILL";
  why: string;
}