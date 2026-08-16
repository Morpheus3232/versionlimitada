"use client";

import { useMemo, useState } from "react";
import { useLab } from "@/components/lab/LabContext";
import Assistant from "@/components/lab/Assistant";
import {
  Cementerio,
  Dashboard,
  ExpDetail,
  ExpDetailView,
  Experimentos,
  Expedientes,
  Guia,
  Radar,
  type Go,
  type LabView,
  type Open,
} from "@/components/lab/views";

const TABS: { id: LabView; label: string }[] = [
  { id: "dashboard", label: "Tablero" },
  { id: "radar", label: "Radar" },
  { id: "expedientes", label: "Expedientes" },
  { id: "experimentos", label: "Experimentos" },
  { id: "cementerio", label: "Cementerio" },
  { id: "guia", label: "Cómo usar" },
];

export default function LabApp() {
  const { state } = useLab();
  const [view, setView] = useState<LabView>("dashboard");
  const [selected, setSelected] = useState<string | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const go: Go = (v, i) => {
    setView(v);
    setSelected(null);
    setIntent(i ?? null);
  };
  const open: Open = (v, id) => {
    setView(v);
    setSelected(id || null);
    setIntent(null);
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const hit = (...fields: (string | undefined)[]) => fields.some((f) => f && f.toLowerCase().includes(q));
    const signals = state.signals.filter((x) => hit(x.title, x.problem, x.source, x.notes));
    const expedientes = state.expedientes.filter((x) => hit(x.title, x.problem, x.evidence, x.opportunity, x.hypothesis));
    const experiments = state.experiments.filter((x) => hit(x.name, x.hypothesis, x.offer));
    const graveyard = state.graveyard.filter((x) => hit(x.problema, x.solucion, x.aprendizaje, x.porQueMurio));
    return { signals, expedientes, experiments, graveyard };
  }, [query, state]);

  let body: React.ReactNode;
  if (view === "dashboard") body = <Dashboard go={go} />;
  else if (view === "radar") body = <Radar intent={intent} open={open} />;
  else if (view === "expedientes") body = selected ? <ExpDetail id={selected} open={open} /> : <Expedientes intent={intent} open={open} />;
  else if (view === "experimentos") body = selected ? <ExpDetailView id={selected} open={open} /> : <Experimentos intent={intent} open={open} />;
  else body = <Cementerio />;
  if (view === "guia") body = <Guia />;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16">
      <header className="flex flex-col gap-4 border-b border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">versión limitada</p>
          <p className="font-heading text-lg font-bold text-ink">Laboratorio de ideas</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="buscar en señales, expedientes, experimentos…"
          aria-label="Búsqueda global"
          className="w-full rounded-[8px] border border-line bg-panel px-3 py-2 font-mono text-sm text-ink placeholder-dim outline-none focus:border-accent sm:w-80"
        />
      </header>

      <nav aria-label="Secciones" className="mt-5 flex flex-wrap gap-1 border-b border-line pb-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            className={`rounded-t-[8px] border-b-2 px-4 py-2 font-heading text-sm font-semibold transition ${
              view === t.id
                ? "border-accent bg-panel text-ink"
                : "border-transparent text-dim hover:text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-4 max-w-2xl">
        <Assistant />
      </div>

      {results && (        <section aria-label="Resultados de búsqueda" className="mt-5 rounded-[10px] border border-line bg-panel p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            resultados para “{query}”
          </p>
          <div className="grid gap-6 sm:grid-cols-4">
            <ResultGroup title="señales" count={results.signals.length}>
              {results.signals.map((s) => (
                <button key={s.id} onClick={() => { go("radar"); setQuery(""); }} className="block w-full text-left font-mono text-[11px] text-accent hover:underline">
                  {s.title}
                </button>
              ))}
            </ResultGroup>
            <ResultGroup title="expedientes" count={results.expedientes.length}>
              {results.expedientes.map((e) => (
                <button key={e.id} onClick={() => open("expedientes", e.id)} className="block w-full text-left font-mono text-[11px] text-accent hover:underline">
                  nº {String(e.number).padStart(3, "0")} · {e.title}
                </button>
              ))}
            </ResultGroup>
            <ResultGroup title="experimentos" count={results.experiments.length}>
              {results.experiments.map((e) => (
                <button key={e.id} onClick={() => open("experimentos", e.id)} className="block w-full text-left font-mono text-[11px] text-accent hover:underline">
                  {e.name}
                </button>
              ))}
            </ResultGroup>
            <ResultGroup title="cementerio" count={results.graveyard.length}>
              {results.graveyard.map((g) => (
                <button key={g.id} onClick={() => go("cementerio")} className="block w-full text-left font-mono text-[11px] text-accent hover:underline">
                  {g.problema}
                </button>
              ))}
            </ResultGroup>
          </div>
        </section>
      )}

      <main className="mt-8">{body}</main>
    </div>
  );
}

function ResultGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-dim">{title} · {count}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}