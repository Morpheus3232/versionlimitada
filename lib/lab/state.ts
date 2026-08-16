/**
 * VersionLimitada — modelo del laboratorio operativo.
 *
 * Es un sistema simple de operar (issue tracker + notebook + log de experimento).
 * Todo está pensado en un único documento serializable (LabStore) que hoy vive en
 * el navegador y puede migrarse luego a un backend compartido: cada entidad ya
 * lleva autores y un historial básico, así el modelo soporta colaboración futura.
 *
 * Regla de verdad: TAM siempre la respuesta a "de dónde sale esto". La taxonomía
 * OBSERVADO / INFERIDO / ESTIMADO / GENERADO·IA se conserva y nunca se lleva una
 * sugerencia de IA como hecho.
 */

export type Provenance = "OBSERVED" | "INFERRED" | "ESTIMATED" | "GENERATED";
export type DecisionResult = "BUILD" | "ITERATE" | "KILL" | "PENDING";
export type SignalStatus = "ABIERTA" | "CONVERTIDA" | "DESCARTADA";
export type ExpStatus =
  | "NO_DISEÑADO"
  | "DISEÑADO"
  | "LISTO"
  | "CORRIENDO"
  | "TERMINADO"
  | "KILLED"
  | "ITERAR";
export type ExpStatusStage = "open" | "running" | "closed";

export interface Change {
  at: string;
  by: string;
  what: string;
}

export interface Signal {
  id: string;
  title: string;
  problem: string;
  source: string;
  url?: string;
  date: string; // YYYY-MM-DD
  foundBy: string;
  sourceType: string;
  evidence: Provenance;
  notes: string;
  tags: string[];
  status: SignalStatus;
  expedienteId?: string;
  createdAt: string;
  updatedAt: string;
  history: Change[];
}

export interface Expediente {
  id: string;
  number: number;
  title: string;
  status: "OPEN" | "IN_EXPERIMENT" | "BUILD" | "ITERATE" | "KILLED";
  problem: string;
  evidence: string;
  opportunity: string;
  hypothesis: string;
  signalIds: string[];
  experimentIds: string[];
  createdAt: string;
  updatedAt: string;
  history: Change[];
}

export interface ExperimentResult {
  expected: string;
  occurred: string;
  evidence: string;
  metric: string;
  source: string;
  date: string;
  interpretation: string;
}

export interface ExperimentDecision {
  value: DecisionResult;
  date: string;
  by: string;
  reason: string;
  evidenceUsed: string;
  aprendizaje: string;
}

export interface Experiment {
  id: string;
  number: number;
  name: string;
  expedienteId?: string;
  hypothesis: string;
  offer: string; // oferta / intervención
  method: string;
  metricPrimary: string;
  metricSecondary: string;
  status: ExpStatus;
  startDate?: string;
  endDate?: string;
  result?: ExperimentResult;
  decision?: ExperimentDecision;
  createdAt: string;
  updatedAt: string;
  history: Change[];
}

export interface GraveEntry {
  id: string;
  experimentId?: string;
  problema: string;
  solucion: string;
  hipotesis: string;
  ocurrio: string;
  porQueMurio: string;
  aprendizaje: string;
  reutilizable: string;
  createdAt: string;
  updatedAt: string;
  history: Change[];
}

export interface LabState {
  version: number;
  /** handle local de quién opera — reemplaza autenticación por ahora. */
  member: string;
  signals: Signal[];
  expedientes: Expediente[];
  experiments: Experiment[];
  graveyard: GraveEntry[];
}

export const SRC_TYPES = [
  "foro",
  "product hunt",
  "show hn",
  "reviews",
  "comunidades",
  "prensa",
  "cliente",
  "otro",
];

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function iso(): string {
  return new Date().toISOString();
}

export function withHistory<T extends { history: Change[]; updatedAt: string }>(
  e: T,
  what: string,
  by: string,
): T {
  return { ...e, updatedAt: iso(), history: [{ at: iso(), by, what }, ...e.history].slice(0, 60) };
}

export function nextNumber(nums: number[]): number {
  return nums.length ? Math.max(...nums) + 1 : 1;
}

// ─── Semilla: el estado real actual (nada inventado) ────────────────────────
// Se carga en el navegador la primera vez. La fuente de estas piezas es
// lib/machine/data.ts (señales públicas y expediente #001).
export function seedState(): LabState {
  const author = "yo";
  const at = iso();

  const sexta = (title: string, problem: string, source: string, url: string | undefined): Signal => ({
    id: "s_" + Math.random().toString(36).slice(2, 8),
    title,
    problem,
    source,
    url,
    date: "2026-08-14",
    foundBy: author,
    sourceType: "comunidades",
    evidence: "OBSERVED",
    notes: "",
    tags: [],
    status: "ABIERTA",
    createdAt: at,
    updatedAt: at,
    history: [{ at, by: author, what: "señal registrada" }],
  });

  const signals: Signal[] = [
    sexta(
      "Empresas y founders no saben si las IA mencionan su marca — o por qué no.",
      "Visibilidad ante buscadores de IA sin métricas ni dueño claro.",
      "Product Hunt",
      "https://www.producthunt.com/products/lettertrace",
    ),
    sexta(
      "Quieren probar firmware sin hardware físico, sobre un chip emulado.",
      "Workaround: alquilar/dev boards caros para validar en dev.",
      "Product Hunt",
      "https://www.producthunt.com/products/chiplab",
    ),
    sexta(
      "Un 'OS de marketing' con agentes y entregas semanales curadas.",
      "Automatizar el marketing de un negocio como servicio continuo.",
      "Show HN",
      undefined,
    ),
    sexta(
      "Agentes de IA que descubren materiales (semiconductores, I+D).",
      "Agentes de ciencia con ROI enorme pero nicho vetado a individuos.",
      "Launch HN · YC",
      undefined,
    ),
    sexta(
      "Datos abiertos de empresas reclamados como recurso compartido (estilo Wikipedia).",
      "Base de datos de empresas gratuita y sin cuenta.",
      "Show HN · StartupWiki",
      undefined,
    ),
    sexta(
      "Trackers que detectan productos nuevos en el mercado, automáticamente.",
      "Señales tempranas para decidir qué construir.",
      "Apify",
      undefined,
    ),
    sexta(
      "Categoría 'AI software' creciendo fuerte: posicionarse en respuestas de IA.",
      "Categoría en formación, todavía sin dueño claro.",
      "Product Hunt 2026",
      undefined,
    ),
    sexta(
      "Reviews y comunidades con procesos manuales que piden automatización.",
      "Tareas repetitivas resueltas a mano por pequeños equipos.",
      "reviews + comunidades",
      undefined,
    ),
  ];

  const exp: Expediente = {
    id: "ex_1",
    number: 1,
    title: "Vigilancia de visibilidad en IA",
    status: "IN_EXPERIMENT",
    problem:
      "La visibilidad en ChatGPT / Perplexity es opaca: no hay métricas, no hay dashboard, no hay causalidad.",
    evidence:
      "Observado: categoría 'AI software' en auge y productos que vigilan citas (Lettertrace). Inferido: dolor alto porque se paga contenido sin medirlo. Estimado: TAM preliminar ~$4M.",
    opportunity: "Un dashboard ligero que revele hábitos de citación y explique por qué se desaparece de una respuesta.",
    hypothesis:
      "Un dashboard ligero de vigilancia puede devolver control si revela hábitos de citación, sin necesidad de agencia.",
    signalIds: [signals[0].id, signals[6].id],
    experimentIds: ["exp_1"],
    createdAt: at,
    updatedAt: at,
    history: [{ at, by: author, what: "expediente creado" }],
  };
  signals[0].expedienteId = exp.id;
  signals[0].status = "CONVERTIDA";
  signals[6].expedienteId = exp.id;
  signals[6].status = "CONVERTIDA";

  const exp1: Experiment = {
    id: "exp_1",
    number: 1,
    name: "Órbita — vigilancia de citas de IA",
    expedienteId: exp.id,
    hypothesis:
      "Si a un founder le mostramos dónde lo cita una IA y qué keyword lo trae, se registra en el waitlist (intención, no interés).",
    offer: "Landing de una línea de problema + CTA a waitlist.",
    method: "Landing pública + CTA a waitlist.",
    metricPrimary: "visitas → signups → interacción con pricing → pago",
    metricSecondary: "CTR del CTA y origen del tráfico",
    status: "DISEÑADO",
    createdAt: at,
    updatedAt: at,
    history: [{ at, by: author, what: "experimento diseñado" }],
  };

  return {
    version: 1,
    member: author,
    signals,
    expedientes: [exp],
    experiments: [exp1],
    graveyard: [],
  };
}