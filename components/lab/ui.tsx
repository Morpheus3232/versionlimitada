"use client";

import type { ReactNode } from "react";
import type { DecisionResult, ExpStatus, Provenance, SignalStatus } from "@/lib/lab/state";

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

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${className}`}>
      {children}
    </span>
  );
}

export function ProvenanceBadge({ kind }: { kind: Provenance }) {
  const map: Record<Provenance, string> = {
    OBSERVED: "border-accent/50 text-accent",
    INFERRED: "border-line text-muted",
    ESTIMATED: "border-gold/50 text-gold",
    GENERATED: "border-dashed border-line text-dim",
  };
  const label: Record<Provenance, string> = {
    OBSERVED: "observado",
    INFERRED: "inferido",
    ESTIMATED: "estimado",
    GENERATED: "generado · ia",
  };
  return <Badge className={map[kind]}>{label[kind]}</Badge>;
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