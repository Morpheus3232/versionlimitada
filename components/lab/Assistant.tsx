"use client";

import { useState } from "react";
import { useLab } from "@/components/lab/LabContext";
import { ActionBtn, Area } from "@/components/lab/ui";

// Asistente IA del laboratorio. Usa deepseek flash 0731 (OpenRouter).
// Sus respuestas son «generado · ia»: nunca cuentan como hecho ni cambian la evidencia.
export default function Assistant() {
  const { state } = useLab();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<{ text?: string; error?: string } | null>(null);

  const ask = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setOut(null);
    const context = {
      señales: state.signals.map((s) => ({ titulo: s.title, estado: s.status })),
      expedientes: state.expedientes.map((e) => ({
        numero: e.number,
        titulo: e.title,
        hipotesis: e.hypothesis || null,
      })),
      experimentos: state.experiments.map((x) => ({
        numero: x.number,
        nombre: x.name,
        estado: x.status,
        decision: x.decision?.value ?? null,
      })),
      cementerio: state.graveyard.length,
    };
    try {
      const r = await fetch("/api/lab/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });
      const j = await r.json();
      if (r.ok && j.text) setOut({ text: j.text });
      else setOut({ error: j.error ?? "No respondió." });
    } catch {
      setOut({ error: "Error de red. Intentá de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[10px] border border-line bg-panel">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          asistente ia · deepseek flash 0731
        </span>
        <span className="rounded-[5px] border border-dashed border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-dim">
          generado · ia
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-line p-4">
          <p className="font-mono text-[11px] leading-relaxed text-dim">
            La IA sugiere, no decide. Todo lo que responde es «generado · ia»: no cuenta como
            hecho ni toca la evidencia observada. Solos decidís vos en build / iterate / kill.
          </p>
          <Area
            value={prompt}
            onChange={setPrompt}
            rows={3}
            placeholder={'Ej: ¿qué hipótesis propondrías para el expediente nº 002?  ¿qué experimento chico probarías primero?'}
          />
          <div className="flex justify-end">
            <ActionBtn onClick={ask} className={loading ? "opacity-60" : ""}>
              {loading ? "pensando…" : "preguntar"}
            </ActionBtn>
          </div>
          {out?.text && (
            <div className="whitespace-pre-wrap rounded-[8px] border border-linesoft bg-paper p-3 text-sm leading-relaxed text-muted">
              {out.text}
            </div>
          )}
          {out?.error && (
            <p role="alert" className="rounded-[8px] border border-gold/40 bg-paper px-3 py-2 font-mono text-[11px] text-gold">
              {out.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}