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
 *
 * MIGRACIÓN: evidence en Expediente era string (v1). Ahora es EvidenceUnit[] (v2).
 * normalizeLabState() convierte estados legacy automáticamente al cargar.
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

/** Origen de una afirmación. Idéntico a Provenance — se usa en EvidenceUnit. */
export type EvidenceProvenance = "OBSERVED" | "INFERRED" | "ESTIMATED" | "GENERATED";

/** Unidad atómica de evidencia con origen explícito. */
export interface EvidenceUnit {
  id: string;
  label: string;
  value: string;
  provenance: EvidenceProvenance;
  origin?: string;
  date?: string;
}

/**
 * Anatomía estructurada de un problema (rescatada de lib/machine/types.ts).
 * Opcional en Expediente — sólo se llena cuando hay investigación profunda.
 */
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
  /**
   * v1: string (legacy, migrado automáticamente por normalizeLabState)
   * v2: EvidenceUnit[] — unidades atómicas con origen explícito
   */
  evidence: EvidenceUnit[];
  opportunity: string;
  hypothesis: string;
  /** Anatomía estructurada del problema (optional — sólo expedientes profundos). */
  anatomy?: ProblemAnatomy;
  /** Contexto de competencia observado. */
  competition?: { count: number; gap: string };
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

/** Versión actual del schema. Incrementar al hacer cambios destructivos. */
export const LAB_SCHEMA_VERSION = 2;

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

export function newEvidenceId(): string {
  return "ev_" + Math.random().toString(36).slice(2, 9);
}

// ─── Migración de estados legacy ────────────────────────────────────────────
// Convierte evidence:string → EvidenceUnit[] sin perder información.
// Se aplica en LabContext.load() cada vez que se lee localStorage.

const VALID_PROVENANCE = new Set<string>(["OBSERVED", "INFERRED", "ESTIMATED", "GENERATED"]);

function coerceProvenance(v: unknown): EvidenceProvenance {
  return (typeof v === "string" && VALID_PROVENANCE.has(v)) ? (v as EvidenceProvenance) : "INFERRED";
}

function normalizeEvidence(v: unknown): EvidenceUnit[] {
  // New shape: already EvidenceUnit[]
  if (Array.isArray(v)) {
    return v.map((u: Record<string, unknown>) => ({
      id: typeof u?.id === "string" ? u.id : newEvidenceId(),
      label: typeof u?.label === "string" ? u.label : "",
      value: typeof u?.value === "string" ? u.value : "",
      provenance: coerceProvenance(u?.provenance),
      origin: typeof u?.origin === "string" ? u.origin : undefined,
      date: typeof u?.date === "string" ? u.date : undefined,
    }));
  }
  // Legacy shape: plain string — wrap into one unit, preserving full text
  if (typeof v === "string" && v.trim()) {
    return [{ id: newEvidenceId(), label: "Contexto", value: v, provenance: "INFERRED" }];
  }
  return [];
}

/**
 * Normaliza un estado crudo de localStorage hacia el shape actual.
 * Seguro ante versiones antiguas donde evidence era string.
 */
export function normalizeLabState(raw: unknown): LabState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.expedientes)) return null;
  return {
    version: LAB_SCHEMA_VERSION,
    member: typeof r.member === "string" ? r.member : "yo",
    signals: Array.isArray(r.signals) ? (r.signals as Signal[]) : [],
    expedientes: (r.expedientes as Record<string, unknown>[]).map((e) => ({
      ...(e as object),
      evidence: normalizeEvidence(e?.evidence),
    })) as Expediente[],
    experiments: Array.isArray(r.experiments) ? (r.experiments as Experiment[]) : [],
    graveyard: Array.isArray(r.graveyard) ? (r.graveyard as GraveEntry[]) : [],
  };
}

// ─── Semilla: el estado real actual (nada inventado) ────────────────────────
// Evidencia y anatomía del expediente #001 migradas desde lib/machine/data.ts.
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

  // Evidencia estructurada del expediente #001 (rescatada de lib/machine/data.ts OPPORTUNITIES[0].evidence)
  const ev001: EvidenceUnit[] = [
    { id: newEvidenceId(), label: "Categoría en auge: 'posicionarse en respuestas de IA'", value: "tendencia registrada", provenance: "OBSERVED", origin: "Product Hunt 2026", date: "ago 2026" },
    { id: newEvidenceId(), label: "Producto que vigila citas sin servicio completo", value: "Lettertrace", provenance: "OBSERVED", origin: "Product Hunt", date: "ago 2026" },
    { id: newEvidenceId(), label: "Intensidad del dolor", value: "Alta (se paga contenido sin medirlo)", provenance: "INFERRED" },
    { id: newEvidenceId(), label: "Workarounds identificados", value: "en curso", provenance: "INFERRED" },
    { id: newEvidenceId(), label: "TAM preliminar (supuesto de trabajo)", value: "~$4M", provenance: "ESTIMATED" },
    { id: newEvidenceId(), label: "Hipótesis y oferta propuestas", value: "dashboard + avisos de citación", provenance: "GENERATED" },
  ];

  // Anatomía estructurada del expediente #001 (rescatada de lib/machine/data.ts OPPORTUNITIES[0].anatomy)
  const anatomy001: ProblemAnatomy = {
    problem: "La visibilidad en ChatGPT / Perplexity es opaca: no hay métricas, no hay dashboard, no hay causalidad.",
    who: "Founders de productos de software y equipos de marketing de startups.",
    context: "Cuando el buyer busca la categoría y la respuesta no menciona tu producto.",
    frequency: "Recurrente: cada ciclo de evaluación de producto / campaña.",
    intensity: "Alta: no poder ver el resultado de lo que pagás es frustrante, no una molestia.",
    workaround: "Contratar agencias caras, o rebuscar a mano en publicaciones.",
    timeCost: "Horas-persona por mes en búsqueda manual y reportes improvisados.",
    moneyCost: "Gasto existente: content marketing y PR que no se puede atribuir.",
    existingSpend: "Sí: el target ya paga por contenido, PR y agencias.",
    market: "Startups B2B y marcas que compiten por ser citadas por IA.",
    competitors: ["Lettertrace", "IZMO (prompt data)", "agencias de 'AI SEO'"],
    competitorGap: "Nadie responde el 'por qué me desaparecieron' ni ofrece un dashboard simple.",
  };

  const exp: Expediente = {
    id: "ex_1",
    number: 1,
    title: "Vigilancia de visibilidad en IA",
    status: "IN_EXPERIMENT",
    problem:
      "La visibilidad en ChatGPT / Perplexity es opaca: no hay métricas, no hay dashboard, no hay causalidad.",
    evidence: ev001,
    opportunity: "Un dashboard ligero que revele hábitos de citación y explique por qué se desaparece de una respuesta.",
    hypothesis:
      "Un dashboard ligero de vigilancia puede devolver control si revela hábitos de citación, sin necesidad de agencia.",
    anatomy: anatomy001,
    competition: { count: 3, gap: "Catalogados individualmente; ninguno combina vigilancia + explicación causal." },
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
    version: LAB_SCHEMA_VERSION,
    member: author,
    signals,
    expedientes: [exp],
    experiments: [exp1],
    graveyard: [],
  };
}
