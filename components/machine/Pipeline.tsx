// El circuito interno de la máquina: señal → … → decisión.
// Es una secuencia real, por eso va numerada. Los nodos que todavía no existen
// se muestran como estado vacío (sin datos / pendiente), nunca como datos inventados.

export type CircuitTone = "on" | "empty";
export interface CircuitStep {
  label: string;
  state: string;
  tone: CircuitTone;
}

function Node({ n, step, last }: { n: number; step: CircuitStep; last: boolean }) {
  const on = step.tone === "on";
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${
            on ? "border-accent/60 text-accent" : "border-line text-dim"
          }`}
        >
          {String(n).padStart(2, "0")}
        </span>
        {!last && <span aria-hidden className="w-px flex-1 bg-line" />}
      </div>
      <div className="min-w-0 flex-1 pb-7">
        <p className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className={`font-heading text-base font-bold ${on ? "text-ink" : "text-dim"}`}>
            {step.label}
          </span>
          <span className={`font-mono text-[11px] uppercase tracking-widest ${on ? "text-accent" : "text-dim"}`}>
            {step.state}
          </span>
        </p>
        {!last && <span aria-hidden className="mt-2 block h-px w-full bg-linesoft" />}
      </div>
    </li>
  );
}

export default function Pipeline({ steps }: { steps: CircuitStep[] }) {
  return (
    <div className="rounded-[10px] border border-line bg-panel px-5 py-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">circuito interno</p>
        <span aria-hidden className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> on
          <span className="ml-2 h-1.5 w-1.5 rounded-full bg-line" /> vacío
        </span>
      </div>
      {steps.length > 0 ? (
        <ol className="flex flex-col">
          {steps.map((s, i) => (
            <Node key={s.label} n={i + 1} step={s} last={i === steps.length - 1} />
          ))}
        </ol>
      ) : (
        <p className="font-mono text-xs text-dim">La cadena no tiene piezas todavía.</p>
      )}
    </div>
  );
}