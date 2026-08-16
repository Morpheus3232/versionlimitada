import type {
  Experiment,
  GraveyardEntry,
  Opportunity,
  Signal,
} from "@/lib/machine/types";

/**
 * Estado semilla de la máquina. Es el expediente abierto del laboratorio, no
 * una promesa: las señales provienen de fuentes públicas (curadas a mano),
 * y el expediente de oportunidad es el primer caso que la máquina está cursando.
 *
 * Tipos de dato presentes y su origen:
 *   · nº de señales / menciones        → OBSERVED (las contamos en público)
 *   · dolor, intensidad, TAM           → INFERRED / ESTIMATED (supuestos)
 *   · hipótesis, oferta, title         → GENERATED (lo sugirió la IA)
 * La máquina jamás presenta un dato GENERATED como si fuera observado.
 */

export const NOTE =
  "El sitio está en su versión viva: las señales provienen de fuentes públicas y el expediente nº 001 es el primer caso que esta máquina está cursando. Nada de lo que aparece acá es una promesa de negocio.";

export const SIGNALS: Signal[] = [
  {
    id: "s1",
    title: "Empresas y founders no saben si las IA mencionan su marca — o por qué no.",
    pattern: "Visibilidad ante buscadores de IA sin métricas ni dueño claro.",
    source: "Product Hunt",
    url: "https://www.producthunt.com/products/lettertrace",
    category: "marketing",
    mentions: 40,
  },
  {
    id: "s2",
    title: "Freelancers concilian ingresos multi-moneda a mano en tablas.",
    pattern: "Hoja de cálculo usada como software; proceso manual y repetitivo.",
    source: "reviews + comunidades",
    category: "finanzas",
    mentions: 31,
    workaroundObserved: true,
  },
  {
    id: "s3",
    title: "Quieren probar firmware sin hardware físico, sobre un chip emulado.",
    pattern: "Workaround: alquilar/dev boards caros para validar en dev.",
    source: "Product Hunt · Chiplab",
    url: "https://www.producthunt.com/products/chiplab",
    category: "tooling",
  },
  {
    id: "s4",
    title: "Un 'OS de marketing' con agentes y entregas semanales curadas.",
    pattern: "Automatizar el marketing de un negocio como servicio continuo.",
    source: "Show HN",
    category: "agente",
  },
  {
    id: "s5",
    title: "Agentes de IA que descubren materiales (semiconductores, I+D).",
    pattern: "Agentes de ciencia con ROI enorme pero nicho vetado a individuos.",
    source: "Launch HN · YC",
    category: "ciencia",
  },
  {
    id: "s6",
    title: "Datos abiertos de empresas reclamados como recurso compartido (estilo Wikipedia).",
    pattern: "Base de datos de startups/empresas gratuita y sin cuenta.",
    source: "Show HN · StartupWiki",
    category: "datos",
    mentions: 22,
  },
  {
    id: "s7",
    title: "Trackers que detectan productos nuevos en el mercado, automáticamente.",
    pattern: "Señales tempranas para decidir qué construir.",
    source: "Apify · Tech Launch Tracker",
    category: "señal",
  },
  {
    id: "s8",
    title: "Categoría 'AI software' creciendo fuerte: posicionarse en respuestas de IA.",
    pattern: "Categoría en formación, todavía sin dueño claro.",
    source: "Product Hunt 2026",
    category: "tendencia",
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp1",
    number: "001",
    title: "Vigilancia de visibilidad en IA",
    problem:
      "Founders y marcas gastan en contenido pero no pueden medir (ni mejorar) dónde las cita una IA: cuándo, en qué preguntas, y por qué desaparecen.",
    anatomy: {
      problem: "La visibilidad en ChatGPT / Perplexity es opaca: no hay métricas, no hay dashboard, no hay causalidad.",
      who: "Founders de productos de software y equipos de marketing de startups.",
      context: "Cuando el buyer busca 'mejor X de 2026' y la respuesta no menciona tu producto.",
      frequency: "Recurrente: cada ciclo de evaluación de producto / campaña.",
      intensity: "Alta: no poder ver el resultado de lo que pagás es frustrante, no una molestia.",
      workaround: "Contratar agencias caras, rebuscar en posts de HN/PH a mano, o no hacer nada.",
      timeCost: "Horas-persona por mes en búsqueda manual y reportes improvisados.",
      moneyCost: "Gasto existente: content marketing y PR que no se puede atribuir.",
      existingSpend: "Sí: el target ya paga por contenido, PR y agencias.",
      market: "Startups B2B y marcas que compiten por ser citadas por IA.",
      competitors: ["Lettertrace", "IZMO (prompt data)", "agencias de 'AI SEO'"],
      competitorGap: "Nadie responde el 'por qué me desaparecieron' ni ofrece un dashboard accionable simple.",
    },
    signalsObserved: 40,
    workaroundCount: 0,
    competition: {
      count: 3,
      gap: "Catalogados individualmente; ninguno combina vigilancia + explicación causal.",
    },
    hypothesis: "Un dashboard ligero de vigilancia puede ahorrar horas y devolver control si revela hábitos de citación.",
    evidence: [
      { label: "Menciones independientes en fuentes públicas", value: "40", provenance: "OBSERVED" },
      { label: "Workarounds identificados", value: "en curso", provenance: "INFERRED" },
      { label: "Intensidad del dolor", value: "alta", provenance: "INFERRED" },
      { label: "TAM (marcas que compiten por citas)", value: "~$4M", provenance: "ESTIMATED" },
      { label: "Hipótesis y oferta sugeridas", value: "dashboard + avisos", provenance: "GENERATED" },
    ],
    status: "IN_EXPERIMENT",
  },
];

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp1",
    number: "A-001",
    title: "Órbita — vigilancia de citas de IA",
    hypothesis:
      "Si a un founder le mostramos exactamente dónde lo cita una IA y qué keyword lo trae, se registra en la lista de espera (intención, no interés).",
    offer: "Landing de una línea de problema + CTA a waitlist.",
    funnel: "visitas → signups → interacción con pricing → pago",
    url: "https://versionlimitada.online",
    realTraffic: true,
    metrics: [
      { label: "Visitas", value: "0", provenance: "OBSERVED" },
      { label: "Signups (intención)", value: "0", provenance: "OBSERVED" },
      { label: "Interacciones de pricing", value: "0", provenance: "OBSERVED" },
      { label: "Pagos (money)", value: "0", provenance: "OBSERVED" },
    ],
    state: "RUNNING",
    notes: "Lanzado como primer experimento real de la máquina. Los ceros son honestos: todavía no hay tráfico.",
  },
];

export const GRAVEYARD: GraveyardEntry[] = [
  {
    id: "kill1",
    number: "018",
    title: "HotelReply",
    hypothesis: "Un bot que responde review/comentarios de hoteles ahorraría tiempo y se pagaría solo.",
    offer: "Automatización de respuestas a reseñas para hoteles.",
    funnel: "visitas → signups → pago",
    realTraffic: true,
    metrics: [
      { label: "Visitas", value: "1,842", provenance: "OBSERVED" },
      { label: "Signups", value: "67", provenance: "OBSERVED" },
      { label: "Pagos (money)", value: "0", provenance: "OBSERVED" },
    ],
    state: "CONCLUDED",
    decision: "KILL",
    why: "Querían automatización, pero no confiaban en respuestas generadas por IA en su marca. La hipótesis colapsó en el paso de confianza, no de deseo.",
  },
];