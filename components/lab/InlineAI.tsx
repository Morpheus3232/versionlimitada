"use client";

import { useState } from "react";
import { Area } from "@/components/lab/ui";

// Asistente IA inline: colabora en un expediente/experimento concreto.
// Respuesta = «generado · ia»: sugiere, no decide, nunca cuenta como hecho.
export default function InlineAI({ promptDefault, context }: { promptDefault: string; context: unknown }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(promptDefault);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<{ text?: string; error?: string } | null>(null);

  const ask = async () => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setOut(null);
    try {
      const r = await fetch("/api/lab/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q, context }),
      });
      const j = await r.json();
      if (r.ok && j.text) setOut({ text: j.text });
      else setOut({ error: j.error ?? "No respondió." });
    } catch {
      setOut({ error: "Error de red." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[8px] border border-linesoft bg-paper p-3">
      {open ? (
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-dim">
            pedite crítica o ideas a la IA · generado · ia (no cuenta como hecho)
          </p>
          <Area value={q} onChange={setQ} rows={2} placeholder="pedile que te rompa la idea o que te proponga un experimento chico" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="rounded-[6px] border border-line px-2.5 py-1 font-mono text-[11px] text-dim">
              cerrar
            </button>
            <button
              onClick={ask}
              className="rounded-[6px] bg-accent px-2.5 py-1 font-heading text-xs font-bold text-paper disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "pensando…" : "preguntar"}
            </button>
          </div>
          {out?.text && (
            <div className="whitespace-pre-wrap rounded-[6px] border border-linesoft bg-panel p-2 text-xs leading-relaxed text-muted">
              {out.text}
            </div>
          )}
          {out?.error && (
            <p className="rounded-[6px] border border-gold/40 bg-panel px-2 py-1 font-mono text-[10px] text-gold">{out.error}</p>
          )}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="font-mono text-[11px] text-accent hover:underline">
          ¿le pedís crítica / ideas a la IA? →
        </button>
      )}
    </div>
  );
}