"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { DecisionResult, EvidenceProvenance, EvidenceUnit, ExpStatus, Provenance, SignalStatus } from "@/lib/lab/state";
import { newEvidenceId } from "@/lib/lab/state";

const inputCls =
  "w-full rounded-[8px] border border-line bg-paper px-3 py-2 font-mono text-sm text-ink placeholder-dim outline-none focus:border-accent";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-dim">
        {label}
        {hint && <span className="normal-case tracking-normal text-dim">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Input({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

export function Area({ value, onChange, rows = 3, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className={`${inputCls} resize-y`}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function Select<T extends string>({ value, onChange, options }: {
  value: T;
  onChange: (v: T) => void;
  options: T[];
}) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => (
        <option key={o} value={o} className="bg-panel text-ink">
          {o}
        </option>
      ))}
    </select>
  );
}

export function Tags({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const commit = (raw: string) => onChange(raw.split(",").map((s) => s.trim()).filter(Boolean));
  return (
    <input
      className={inputCls}
      value={value.join(", ")}
      onChange={(e) => commit(e.target.value)}
      placeholder="tags separados por coma"
    />
  );
}

export const PROVENANCE_OPTIONS: Provenance[] = ["OBSERVED", "INFERRED", "ESTIMATED", "GENERATED"];
export const EVIDENCE_PROVENANCE_OPTIONS: EvidenceProvenance[] = ["OBSERVED", "INFERRED", "ESTIMATED", "GENERATED"];
export const DECISION_OPTIONS: DecisionResult[] = ["BUILD", "ITERATE", "KILL", "PENDING"];
export const EXP_STATUS_OPTIONS: ExpStatus[] = [
  "NO_DISEÑADO",
  "DISEÑADO",
  "LISTO",
  "CORRIENDO",
  "TERMINADO",
  "ITERAR",
  "KILLED",
];

export const SIGNAL_STATUS_OPTIONS: SignalStatus[] = ["ABIERTA", "CONVERTIDA", "DESCARTADA"];

// ─── Badge helpers ──────────────────────────────────────────────────────────

const PROVENANCE_STYLE: Record<string, string> = {
  OBSERVED: "border-accent/50 text-accent",
  INFERRED: "border-line text-muted",
  ESTIMATED: "border-gold/50 text-gold",
  GENERATED: "border-dashed border-line text-dim",
};

const PROVENANCE_LABEL: Record<string, string> = {
  OBSERVED: "observado",
  INFERRED: "inferido",
  ESTIMATED: "estimado",
  GENERATED: "generado · ia",
};

/** Etiquetas en español para mostrar en UI editable. */
const PROVENANCE_LABEL_ES: Record<string, string> = {
  OBSERVED: "Observado",
  INFERRED: "Inferido",
  ESTIMATED: "Estimado",
  GENERATED: "Generado por IA",
};

/** Tooltips cortos para cada provenance. */
const PROVENANCE_TITLE: Record<string, string> = {
  OBSERVED: "Dato visto directamente o fuente primaria",
  INFERRED: "Conclusión derivada de evidencia",
  ESTIMATED: "Valor aproximado o calculado",
  GENERATED: "Contenido producido por el asistente IA",
};

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${className}`}>
      {children}
    </span>
  );
}

/**
 * ProvenanceTag → componente canónico para mostrar origen de evidencia.
 * ProvenanceBadge es un alias que delega a éste (unificados).
 */
export function ProvenanceTag({ kind }: { kind: EvidenceProvenance }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${PROVENANCE_STYLE[kind]}`}
      title={PROVENANCE_TITLE[kind]}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-70" />
      {PROVENANCE_LABEL[kind]}
    </span>
  );
}

/** Delegado a ProvenanceTag — mantener para compatibilidad. */
export function ProvenanceBadge({ kind }: { kind: Provenance }) {
  return <ProvenanceTag kind={kind as EvidenceProvenance} />;
}

export function ProvenanceKey() {
  const keys: EvidenceProvenance[] = ["OBSERVED", "INFERRED", "ESTIMATED", "GENERATED"];
  return (
    <p className="flex flex-wrap gap-2 font-mono text-[11px] text-dim">
      {keys.map((k) => (
        <ProvenanceTag key={k} kind={k} />
      ))}
    </p>
  );
}

export function EvidenceUnitBadge({ unit, onClick }: { unit: EvidenceUnit; onClick?: () => void }) {
  return (
    <div className={`border-l-2 border-linesoft py-1 pl-4 ${onClick ? "cursor-pointer hover:bg-paper/50" : ""}`} onClick={onClick}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-dim">{unit.label}</p>
        <ProvenanceTag kind={unit.provenance} />
      </div>
      <p className="mt-1 font-heading text-sm font-semibold text-ink">{unit.value}</p>
      {(unit.origin || unit.date) && (
        <p className="mt-0.5 font-mono text-[11px] text-dim">
          {unit.origin && <span>fuente · {unit.origin}</span>}
          {unit.origin && unit.date && <span className="mx-1">/</span>}
          {unit.date && <span>{unit.date}</span>}
        </p>
      )}
    </div>
  );
}

/** Editor en línea de unidades de evidencia (add/edit/remove). */
export function EvidenceEditor({ units, onChange }: { units: EvidenceUnit[]; onChange: (u: EvidenceUnit[]) => void }) {
  const update = (id: string, patch: Partial<EvidenceUnit>) =>
    onChange(units.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  const remove = (id: string) => onChange(units.filter((u) => u.id !== id));
  const add = () =>
    onChange([...units, { id: newEvidenceId(), label: "", value: "", provenance: "OBSERVED" as EvidenceProvenance }]);
  return (
    <div className="space-y-3">
      {units.length === 0 && <p className="font-mono text-[11px] text-dim">Sin evidencia registrada.</p>}
      {units.map((u) => (
        <div key={u.id} className="rounded-[8px] border border-line bg-paper p-3 space-y-2">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-[6px] border border-line bg-panel px-2 py-1 font-mono text-xs text-ink outline-none focus:border-accent"
              value={u.label}
              onChange={(e) => update(u.id, { label: e.target.value })}
              placeholder="título de esta evidencia"
            />
            <select
              className="rounded-[6px] border border-line bg-panel px-2 py-1 font-mono text-xs text-ink outline-none focus:border-accent"
              value={u.provenance}
              onChange={(e) => update(u.id, { provenance: e.target.value as EvidenceProvenance })}
            >
              {EVIDENCE_PROVENANCE_OPTIONS.map((p) => (
                <option key={p} value={p} className="bg-panel text-ink" title={PROVENANCE_TITLE[p]}>{PROVENANCE_LABEL_ES[p]}</option>
              ))}
            </select>
            <button
              onClick={() => remove(u.id)}
              className="rounded-[6px] border border-red-900 px-2 py-1 font-mono text-[10px] text-red-400 hover:bg-red-900/10"
            >
              quitar
            </button>
          </div>
          <textarea
            className="w-full rounded-[6px] border border-line bg-panel px-2 py-1 font-mono text-xs text-ink outline-none focus:border-accent resize-y"
            rows={2}
            value={u.value}
            onChange={(e) => update(u.id, { value: e.target.value })}
            placeholder="descripción de la evidencia"
          />
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-[6px] border border-line bg-panel px-2 py-1 font-mono text-[11px] text-ink outline-none focus:border-accent"
              value={u.origin ?? ""}
              onChange={(e) => update(u.id, { origin: e.target.value || undefined })}
              placeholder="fuente"
            />
            <input
              className="w-28 rounded-[6px] border border-line bg-panel px-2 py-1 font-mono text-[11px] text-ink outline-none focus:border-accent"
              value={u.date ?? ""}
              onChange={(e) => update(u.id, { date: e.target.value || undefined })}
              placeholder="fecha"
            />
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="rounded-[6px] border border-line px-2.5 py-1 font-mono text-[11px] text-muted hover:text-accent"
      >
        + añadir evidencia
      </button>
    </div>
  );
}

export function ExpStatusBadge({ status }: { status: ExpStatus }) {
  const map: Record<ExpStatus, string> = {
    NO_DISEÑADO: "border-line text-dim",
    DISEÑADO: "border-line text-muted",
    LISTO: "border-accent/50 text-accent",
    CORRIENDO: "border-accent text-accent",
    TERMINADO: "border-line text-muted",
    ITERAR: "border-gold/50 text-gold",
    KILLED: "border-red-900 text-red-400",
  };
  const label = status.replace(/_/g, " ");
  return <Badge className={map[status]}>{label}</Badge>;
}

export function DecisionBadge({ value }: { value: DecisionResult }) {
  const map: Record<DecisionResult, string> = {
    BUILD: "border-gold/60 text-gold",
    ITERATE: "border-accent/60 text-accent",
    KILL: "border-red-900 text-red-400",
    PENDING: "border-line text-dim",
  };
  return <Badge className={map[value]}>{value}</Badge>;
}

export function SignalStatusBadge({ status }: { status: SignalStatus }) {
  const map: Record<SignalStatus, string> = {
    ABIERTA: "border-line text-muted",
    CONVERTIDA: "border-accent/50 text-accent",
    DESCARTADA: "border-line text-dim",
  };
  return <Badge className={map[status]}>{status}</Badge>;
}

export function ActionBtn({ children, onClick, tone = "primary", className = "" }: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const tones = {
    primary: "bg-accent text-paper hover:bg-accenthover",
    ghost: "border border-line text-muted hover:border-accent/60 hover:text-accent bg-transparent",
    danger: "border border-red-900 text-red-400 hover:bg-red-900/10",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[8px] px-3.5 py-2 font-heading text-sm font-semibold transition ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}
