"use client";

import { useState } from "react";

type Idea = {
  title: string;
  why: string;
  src: string;
  url: string;
  tag: string;
};

type Window = { id: string; label: string; ideas: Idea[] };

const DATA: Window[] = [
  {
    id: "30d",
    label: "Últimos 30 días",
    ideas: [
      {
        title: "StartupWiki",
        why: "Base de startups estilo Wikipedia, gratuita y sin cuenta. Oportunidad: los datos abiertos de empresas son un recurso que varios productos pueden compartir.",
        src: "Show HN",
        url: "https://news.ycombinator.com/item",
        tag: "datos",
      },
      {
        title: "Visibilidad en IA",
        why: "Medir que los modelos (ChatGPT, Perplexity) citen tu marca o producto. Oportunidad: 'SEO para buscadores de IA' todavía sin dueño claro.",
        src: "Product Hunt · Lettertrace",
        url: "https://www.producthunt.com/products/lettertrace",
        tag: "marketing",
      },
      {
        title: "Chip virtual para firmware",
        why: "Probar firmware sobre un chip emulado, sin hardware físico. Oportunidad: ahorra tiempo y dinero en el DEV de sistemas embebidos.",
        src: "Product Hunt · Chiplab",
        url: "https://www.producthunt.com/products/chiplab",
        tag: "tooling",
      },
      {
        title: "Sistema de marketing autónomo",
        why: "Un OS de marketing con agentes, screenings por voz y entregas semanales curadas. Oportunidad: automatizar el marketing de un negocio como servicio.",
        src: "Show HN",
        url: "https://hn.algolia.com/?query=autonomous%20marketing%20os",
        tag: "agente",
      },
      {
        title: "Que la IA rompa tu idea",
        why: "Retar la idea con IA antes de construirla para encontrar los puntos débiles. Oportunidad: encaja directo con el pipeline de este tablero (validar antes de invertir).",
        src: "Redes · concepto",
        url: "https://www.facebook.com/groups/698593531630485",
        tag: "validación",
      },
    ],
  },
  {
    id: "60d",
    label: "Últimos 60 días",
    ideas: [
      {
        title: "Agentes que descubren materiales",
        why: "Agentes de IA que aceleran el descubrimiento de materiales para semiconductores (YC P26). Oportunidad: agentes de ciencia e I+D con ROI enorme.",
        src: "Launch HN · YC P26",
        url: "https://news.ycombinator.com/item?id=discovered-materials",
        tag: "ciencia",
      },
      {
        title: "Agentes de marketing en roles acotados",
        why: "Tres agentes: planeación de campañas, redacción y competencia. Oportunidad: agentes B2B con roles claros venden mejor que un 'todo-en-uno'.",
        src: "Montco · marketing",
        url: "https://montco.today/2026/08/ai-agents-in-marketing-towers/",
        tag: "agente",
      },
      {
        title: "Categoría 'AI software' en auge",
        why: "El 'AI visibility' y las tools para posicionarse en respuestas generadas por IA crecieron fuerte. Oportunidad: es una categoría en formación, hay espacio para un producto propio.",
        src: "Product Hunt 2026",
        url: "https://www.producthunt.com/categories/ai-software",
        tag: "tendencia",
      },
      {
        title: "Monitoreo de lanzamientos",
        why: "Trackers automatizados que detectan productos nuevos en el mercado. Oportunidad: señales tempranas para decidir qué construir (pega con este radar).",
        src: "Apify · Tech Launch Tracker",
        url: "https://apify.com/second_coming/tech-launch-tracker",
        tag: "señal",
      },
    ],
  },
];

export default function Radar() {
  const [activeId, setActiveId] = useState(DATA[0].id);
  const active = DATA.find((w) => w.id === activeId)!;
  const idx = DATA.findIndex((w) => w.id === activeId);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = DATA.length - 1;
    let next = idx;
    if (e.key === "ArrowRight") next = idx === last ? 0 : idx + 1;
    if (e.key === "ArrowLeft") next = idx === 0 ? last : idx - 1;
    if (next !== idx) {
      e.preventDefault();
      setActiveId(DATA[next].id);
      document.getElementById(`radar-tab-${DATA[next].id}`)?.focus();
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Radar de ideas"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {DATA.map((w) => (
          <button
            key={w.id}
            id={`radar-tab-${w.id}`}
            role="tab"
            aria-selected={activeId === w.id}
            aria-controls={`radar-panel-${w.id}`}
            tabIndex={activeId === w.id ? 0 : -1}
            onClick={() => setActiveId(w.id)}
            className={`border px-4 py-2 font-mono text-sm transition-colors ${
              activeId === w.id
                ? "border-cyan-300 bg-cyan-300/10 text-cyan-200"
                : "border-[#1d2433] text-[#9aa4b8] hover:border-cyan-400/40 hover:text-cyan-200"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      <div
        id={`radar-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`radar-tab-${active.id}`}
        className="mt-6 grid gap-3 lg:grid-cols-2"
      >
        {active.ideas.map((idea) => (
          <article key={idea.title} className="cell flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-base font-semibold text-[#f2f5fa]">
                {idea.title}
              </h3>
              <span className="shrink-0 border border-amber-400/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-200/90">
                {idea.tag}
              </span>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[#9aa4b8]">
              {idea.why}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-[#5c6679]">{idea.src}</span>
              <a
                href={idea.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-cyan-300 transition hover:text-cyan-100"
              >
                ver fuente →
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 max-w-3xl font-mono text-[11px] leading-relaxed text-[#5c6679]">
        Radar web de lanzamientos y tendencias (Show HN, Product Hunt, YC,
        prensa). Es una instantánea curada, no una promesa: cada idea se valida
        con el pipeline de la central antes de construir.
      </p>
    </div>
  );
}