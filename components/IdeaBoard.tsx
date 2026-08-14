"use client";

import { useMemo, useState } from "react";

type Stage = "idea" | "hipotesis" | "mvc" | "vivo" | "descartado";

const STAGES: { id: Stage; label: string }[] = [
  { id: "idea", label: "Idea" },
  { id: "hipotesis", label: "Hipótesis" },
  { id: "mvc", label: "MVP" },
  { id: "vivo", label: "En vivo" },
  { id: "descartado", label: "Descartado" },
];

const STORAGE_KEY = "vl.ideas.v1";

type Idea = { id: string; title: string; stage: Stage; created: number };

function load(): Idea[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Idea[]) : [];
  } catch {
    return [];
  }
}

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState<Idea[]>(load);
  const [draft, setDraft] = useState("");

  const persist = (next: Idea[]) => {
    setIdeas(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    persist([
      { id: crypto.randomUUID(), title, stage: "idea", created: Date.now() },
      ...ideas,
    ]);
    setDraft("");
  };

  const advance = (id: string) => {
    const next = ideas.map((i) => {
      if (i.id !== id) return i;
      const idx = STAGES.findIndex((s) => s.id === i.stage);
      const nextStage = STAGES[Math.min(idx + 1, STAGES.length - 1)].id;
      return { ...i, stage: nextStage as Stage };
    });
    persist(next);
  };

  const kill = (id: string) => persist(ideas.filter((i) => i.id !== id));

  const counts = useMemo(() => {
    const c: Record<Stage, number> = { idea: 0, hipotesis: 0, mvc: 0, vivo: 0, descartado: 0 };
    ideas.forEach((i) => (c[i.stage] += 1));
    return c;
  }, [ideas]);

  return (
    <div>
      <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Capturá una idea — se guarda en tu navegador"
          aria-label="Nueva idea"
          className="flex-1 border border-zinc-800 bg-zinc-900/60 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-zinc-600"
        />
        <button
          type="submit"
          className="border border-zinc-500 bg-zinc-700/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-600"
        >
          Capturar →
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-500">
        {STAGES.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5">
            <span
              className={
                s.id === "descartado"
                  ? "h-1.5 w-1.5 bg-zinc-600"
                  : "h-1.5 w-1.5 bg-zinc-400"
              }
            />
            {s.label} {counts[s.id]}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {ideas.length === 0 && (
          <li className="border border-dashed border-zinc-800 px-4 py-5 text-center font-mono text-sm text-zinc-600">
            Sin ideas todavía. El laboratorio empieza con una.
          </li>
        )}
        {ideas.map((i) => {
          const stage = STAGES.find((s) => s.id === i.stage)!;
          return (
            <li
              key={i.id}
              className="flex items-center justify-between gap-4 border border-zinc-800 bg-zinc-900/40 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-zinc-200">{i.title}</p>
                <p className="mt-0.5 font-mono text-xs text-zinc-600">
                  {new Date(i.created).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-xs text-zinc-500">
                  {stage.label}
                </span>
                {i.stage !== "descartado" && i.stage !== "vivo" && (
                  <button
                    onClick={() => advance(i.id)}
                    aria-label="Avanzar de etapa"
                    className="border border-zinc-700 px-2 py-1 font-mono text-xs text-zinc-300 hover:border-zinc-500"
                  >
                    avanzar
                  </button>
                )}
                <button
                  onClick={() => kill(i.id)}
                  aria-label="Borrar idea"
                  className="border border-zinc-800 px-2 py-1 font-mono text-xs text-zinc-500 hover:border-red-900 hover:text-red-400"
                >
                  x
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}