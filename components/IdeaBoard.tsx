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

const STAGE_NEXT: Record<Stage, Stage> = {
  idea: "hipotesis",
  hipotesis: "mvc",
  mvc: "vivo",
  vivo: "vivo",
  descartado: "descartado",
};

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
    persist(
      ideas.map((i) => (i.id === id ? { ...i, stage: STAGE_NEXT[i.stage] } : i)),
    );
  };

  const discard = (id: string) => {
    persist(
      ideas.map((i) => (i.id === id ? { ...i, stage: "descartado" } : i)),
    );
  };

  const restore = (id: string) => {
    persist(
      ideas.map((i) => (i.id === id ? { ...i, stage: "idea" } : i)),
    );
  };

  const remove = (id: string) => {
    persist(ideas.filter((i) => i.id !== id));
  };

  const counts = useMemo(() => {
    const c: Record<Stage, number> = {
      idea: 0,
      hipotesis: 0,
      mvc: 0,
      vivo: 0,
      descartado: 0,
    };
    ideas.forEach((i) => (c[i.stage] += 1));
    return c;
  }, [ideas]);

  return (
    <div>
      <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Capturá una idea — vive en tu navegador"
          aria-label="Nueva idea"
          className="flex-1 rounded-[10px] border border-line bg-panel px-4 py-3 font-mono text-sm text-ink placeholder-dim outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="rounded-[10px] bg-accent px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accenthover"
        >
          Capturar →
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-dim">
        {STAGES.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                counts[s.id] > 0 ? "bg-accent" : "bg-muted"
              }`}
            />
            {s.label} {counts[s.id]}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {ideas.length === 0 && (
          <li className="rounded-[10px] border border-dashed border-line px-4 py-5 text-center font-mono text-sm text-dim">
            Sin ideas todavía. El laboratorio empieza con una.
          </li>
        )}
        {ideas.map((i) => {
          const stage = STAGES.find((s) => s.id === i.stage)!;
          const discarded = i.stage === "descartado";
          return (
            <li
              key={i.id}
              className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-panel px-4 py-3"
            >
              <div className="min-w-0">
                <p
                  className={`truncate text-sm ${
                    discarded ? "text-dim line-through" : "text-ink"
                  }`}
                >
                  {i.title}
                </p>
                <p className="mt-0.5 font-mono text-xs text-dim">
                  {new Date(i.created).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`font-mono text-xs ${
                    discarded ? "text-dim" : "text-muted"
                  }`}
                >
                  {stage.label}
                </span>
                {discarded ? (
                  <button
                    onClick={() => restore(i.id)}
                    className="rounded-[6px] border border-line px-2 py-1 font-mono text-xs text-muted transition hover:border-gold/60 hover:text-gold"
                  >
                    restaurar
                  </button>
                ) : (
                  i.stage !== "vivo" && (
                    <button
                      onClick={() => advance(i.id)}
                      className="rounded-[6px] border border-line px-2 py-1 font-mono text-xs text-muted transition hover:border-accent/60 hover:text-accent"
                    >
                      avanzar
                    </button>
                  )
                )}
                <button
                  onClick={() => (discarded ? remove(i.id) : discard(i.id))}
                  aria-label={discarded ? "Borrar idea" : "Descartar idea"}
                  title={discarded ? "Borrar definitivamente" : "Descartar"}
                  className="rounded-[6px] border border-line px-2 py-1 font-mono text-xs text-dim transition hover:border-red-900 hover:text-red-400"
                >
                  {discarded ? "x" : "descartar"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}