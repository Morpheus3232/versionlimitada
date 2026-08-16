import type {
  Experiment,
  GraveyardEntry,
  Opportunity,
  Signal,
} from "@/lib/machine/types";

/**
 * Estado real de la máquina (cortado a la verdad).
 *
 * Regla: si no podemos mostrar el origen de una evidencia, no la presentamos
 * como observada. Cada afirmación declara su naturaleza:
 *   OBSERVED   → con fuente y fecha (revisar que existan).
 *   INFERRED   → conclusión derivada de observaciones, sin raíz directa.
 *   ESTIMATED  → supuesto de trabajo (TAM, rangos).
 *   GENERATED  → lo propuso la máquina (IA).
 * La máquina jamás presenta un dato GENERATED como si fuera observado.
 */

export const NOTE =
  "La máquina está en su primera semana de vida: 8 señales detectadas en fuentes públicas, un expediente abierto y ningún experimento lanzado todavía. Los números que ves son reales y cuentan con su origen; los que faltan no se inventan.";

// ── Señales detectadas en público (curadas a mano, con fuente real) ─────────
export const SIGNALS: Signal[] = [
  {
    id: "s1",
    title: "Empresas y founders no saben si las IA mencionan su marca — o por qué no.",
    pattern: "Visibilidad ante buscadores de IA sin métricas ni dueño claro.",
    source: "Product Hunt",
    url: "https://www.producthunt.com/products/lettertrace",
    category: "marketing",
  },
  {
    id: "s2",
    title: "Quieren probar firmware sin hardware físico, sobre un chip emulado.",
    pattern: "Workaround: alquilar/dev boards caros para validar en dev.",
    source: "Product Hunt · Chiplab",
    url: "https://www.producthunt.com/products/chiplab",
    category: "tooling",
  },
  {
    id: "s3",
    title: "Un 'OS de marketing' con agentes y entregas semanales curadas.",
    pattern: "Automatizar el marketing de un negocio como servicio continuo.",
    source: "Show HN",
    category: "agente",
  },
  {
    id: "s4",
    title: "Agentes de IA que descubren materiales (semiconductores, I+D).",
    pattern: "Agentes de ciencia con ROI enorme pero nicho vetado a individuos.",
    source: "Launch HN · YC",
    category: "ciencia",
  },
  {
    id: "s5",
    title: "Datos abiertos de empresas reclamados como recurso compartido (estilo Wikipedia).",
    pattern: "Base de datos de empresas gratuita y sin cuenta.",
    source: "Show HN · StartupWiki",
    category: "datos",
  },
  {
    id: "s6",
    title: "Trackers que detectan productos nuevos en el mercado, automáticamente.",
    pattern: "Señales tempranas para decidir qué construir.",
    source: "Apify · Tech Launch Tracker",
    category: "señal",
  },
  {
    id: "s7",
    title: "Categoría 'AI software' creciendo fuerte: posicionarse en respuestas de IA.",
    pattern: "Categoría en formación, todavía sin dueño claro.",
    source: "Product Hunt 2026",
    category: "tendencia",
  },
  {
    id: "s8",
    title: "Reviews y comunidades con procesos manuales que piden automatización.",
    pattern: "Tareas repetitivas resueltas a mano por pequeños equipos.",
    source: "reviews + comunidades",
    category: "b2b",
  },
];

// ── Expediente #001 — el objeto principal de la interfaz ────────────────────
export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp1",
    number: "001",
    title: "Vigilancia de visibilidad en IA",
    problem:
      "Founders y marcas gastan en contenido pero no pueden medir (ni mejorar) dónde las cita una IA: cuándo, en qué preguntas y por qué desaparecen.",
    anatomy: {
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
    },
    signalsObserved: 2,
    workaroundCount: 0,
    competition: {
      count: 3,
      gap: "Catalogados individualmente; ninguno combina vigilancia + explicación causal.",
    },
    hypothesis:
      "Un dashboard ligero de vigilancia puede devolver control si revela hábitos de citación, sin necesidad de agencia.",
    evidence: [
      {
        label: "Categoría en auge: 'posicionarse en respuestas de IA'",
        value: "tendencia registrada",
        provenance: "OBSERVED",
        origin: "Product Hunt 2026",
        date: "ago 2026",
      },
      {
        label: "Producto que vigila citas sin servicio completo",
        value: "Lettertrace",
        provenance: "OBSERVED",
        origin: "Product Hunt",
        date: "ago 2026",
      },
      {
        label: "Intensidad del dolor",
        value: "Alta (se paga contenido sin medirlo)",
        provenance: "INFERRED",
      },
      {
        label: "Workarounds identificados",
        value: "en curso",
        provenance: "INFERRED",
      },
      {
        label: "TAM preliminar (supuesto de trabajo)",
        value: "~$4M",
        provenance: "ESTIMATED",
      },
      {
        label: "Hipótesis y oferta propuestas",
        value: "dashboard + avisos de citación",
        provenance: "GENERATED",
      },
    ],
    status: "IN_EXPERIMENT",
    experimentId: "exp1",
  },
];

// ── Experimentos — ninguno lanzado todavía. Infraestructura lista. ──────────
export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp1",
    number: "A-001",
    title: "Órbita — vigilancia de citas de IA",
    hypothesis:
      "Si a un founder le mostramos dónde lo cita una IA y qué keyword lo trae, se registra en el waitlist (intención, no interés).",
    offer: "Landing de una línea de problema + CTA a waitlist.",
    method: "Landing pública + CTA a waitlist.",
    funnel: "visitas → signups → interacción con pricing → pago",
    launched: false,
    metrics: [
      { label: "Visitas", value: "—", provenance: "GENERATED" },
      { label: "Registros (intención)", value: "—", provenance: "GENERATED" },
      { label: "Interacción de pricing", value: "—", provenance: "GENERATED" },
      { label: "Pagos (money)", value: "—", provenance: "GENERATED" },
    ],
    state: "PLANNED",
    notes:
      "Listo para lanzarse: hipótesis y oferta definidas. Aún sin tráfico real; cuando se publique, estos campos se llenan con OBSERVADO y origen.",
  },
];

// ── El Cementerio — vacío hasta que exista un kill real. ────────────────────
// No documentamos fracasos que no ocurrieron. Un kill real se registra acá
// con su hipótesis, su resultado y su aprendizaje; mientras tanto, está vacío.
export const GRAVEYARD: GraveyardEntry[] = [];