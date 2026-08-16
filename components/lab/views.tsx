"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type {
  DecisionResult,
  Experiment,
  Expediente,
  GraveEntry,
  Signal,
} from "@/lib/lab/state";
import { useLab } from "@/components/lab/LabContext";
import {
  ActionBtn,
  Area,
  DecisionBadge,
  DECISION_OPTIONS,
  EXP_STATUS_OPTIONS,
  ExpStatusBadge,
  Field,
  Input,
  ProvenanceBadge,
  Select,
  SignalStatusBadge,
} from "@/components/lab/ui";

export type LabView = "dashboard" | "radar" | "expedientes" | "experimentos" | "cementerio" | "guia";
export type Go = (view: LabView, intent?: string) => void;
export type Open = (view: LabView, id: string) => void;

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[10px] border border-line bg-panel p-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{title}</p>
      <div>{children}</div>
    </div>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-dim">{children}</p>;
}

function Dt({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-l-2 border-linesoft py-1 pl-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-dim">{label}</p>
      <div className="mt-0.5 text-sm text-muted">{value || <span className="text-dim">—</span>}</div>
    </div>
  );
}

function Hist({ history }: { history: Signal["history"] }) {
  if (!history.length) return <p className="font-mono text-[11px] text-dim">sin historial</p>;
  return (
    <ul className="max-h-40 space-y-1 overflow-auto font-mono text-[11px] text-dim">
      {history.map((h, i) => (
        <li key={i} className="flex justify-between gap-3">
          <span>{h.what}</span>
          <span className="shrink-0">· {h.by}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
export function Dashboard({ go }: { go: Go }) {
  const { state, member, setMember } = useLab();
  const s = state;
  const roll = [
    { v: s.signals.filter((x) => x.status === "ABIERTA").length, l: "señales abiertas" },
    { v: s.expedientes.length, l: "expedientes abiertos" },
    { v: s.experiments.filter((x) => x.status === "DISEÑADO" || x.status === "LISTO").length, l: "experimentos diseñados" },
    { v: s.experiments.filter((x) => x.status === "CORRIENDO").length, l: "experimentos activos" },
    { v: s.experiments.filter((x) => x.result).length, l: "resultados" },
    { v: s.experiments.filter((x) => x.decision && x.decision.value !== "PENDING").length, l: "decisiones" },
    { v: s.graveyard.length, l: "ideas matadas" },
  ];
  const spine = [
    { n: "SEÑAL", v: s.signals.length, go: "radar" },
    { n: "EXPEDIENTE", v: s.expedientes.length, go: "expedientes" },
    { n: "HIPÓTESIS", v: s.expedientes.filter((e) => e.hypothesis).length, go: "expedientes" },
    { n: "EXPERIMENTO", v: s.experiments.length, go: "experimentos" },
    { n: "RESULTADO", v: s.experiments.filter((e) => e.result).length, go: "experimentos" },
    { n: "DECISIÓN", v: s.experiments.filter((e) => e.decision && e.decision.value !== "PENDING").length, go: "experimentos" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">versión limitada</p>
          <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Tablero del laboratorio</h1>
        </div>
        <label className="flex items-center gap-2 font-mono text-xs text-dim">
          sos
          <input
            value={member}
            onChange={(e) => setMember(e.target.value)}
            placeholder="tu handle"
            className="w-36 rounded-[6px] border border-line bg-panel px-2 py-1 font-mono text-xs text-ink outline-none focus:border-accent"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-linesoft sm:grid-cols-4">
        {roll.map((r) => (
          <div key={r.l} className="bg-panel p-4">
            <p className="font-mono text-2xl font-bold text-ink">{r.v}</p>
            <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-wide text-muted">{r.l}</p>
          </div>
        ))}
      </div>

      <Panel title="columna vertebral · estado actual">
        <div className="grid gap-px overflow-hidden rounded-[8px] border border-line bg-linesoft sm:grid-cols-6">
          {spine.map((x) => (
            <button key={x.n} onClick={() => go(x.go as LabView)} className="bg-paper p-3 text-left transition hover:bg-panel">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{x.n}</p>
              <p className="mt-1 font-mono text-xl font-bold text-ink">{x.v}</p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap gap-3">
        <ActionBtn onClick={() => go("radar", "create-signal")}>+ nueva señal</ActionBtn>
        <ActionBtn tone="ghost" onClick={() => go("expedientes", "create-expediente")}>+ nuevo expediente</ActionBtn>
        <ActionBtn tone="ghost" onClick={() => go("experimentos", "create-experimento")}>+ nuevo experimento</ActionBtn>
      </div>
    </div>
  );
}

// ─── Radar de señales ───────────────────────────────────────────────────────
function SignalForm({ initial, onDone }: { initial?: Signal; onDone: () => void }) {
  const { createSignal, updateSignal } = useLab();
  const [missing, setMissing] = useState<string[]>([]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [problem, setProblem] = useState(initial?.problem ?? "");
  const submit = () => {
    const faltan: string[] = [];
    if (!title.trim()) faltan.push("título");
    if (!problem.trim()) faltan.push("descripción");
    setMissing(faltan);
    if (faltan.length) return;
    if (initial) updateSignal(initial.id, { title, problem });
    else createSignal({ title, problem });
    onDone();
  };
  return (
    <div className="space-y-3">
      <Field label="título de la idea"><Input value={title} onChange={setTitle} placeholder="¿qué notaste?" /></Field>
      <Field label="descripción"><Area value={problem} onChange={setProblem} placeholder="explicá en un párrafo qué pasa y por qué importa (puede ser simple)" /></Field>
      {missing.length > 0 && (
        <p role="alert" className="rounded-[8px] border border-gold/40 bg-paper px-3 py-2 font-mono text-[11px] text-gold">
          falta: {missing.join(", ")}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <ActionBtn tone="ghost" onClick={onDone}>cancelar</ActionBtn>
        <ActionBtn onClick={submit}>{initial ? "Guardar" : "Agregar señal"}</ActionBtn>
      </div>
    </div>
  );
}

export function Radar({ intent, open }: { intent: string | null; open: Open }) {
  const { state, discardSignal, restoreSignal, convertSignalToExpediente } = useLab();
  const [openForm, setOpenForm] = useState(intent === "create-signal");
  const [editing, setEditing] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const list = state.signals.filter((s) => filter === "ALL" || s.status === filter);
  const expNum = (id?: string) => state.expedientes.find((e) => e.id === id)?.number;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">bandeja de entrada</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">Radar de señales</h1>
        </div>
        <ActionBtn onClick={() => { setOpenForm((v) => !v); setEditing(null); }}>
          {openForm ? "cerrar" : "+ nueva señal"}
        </ActionBtn>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "ABIERTA", "CONVERTIDA", "DESCARTADA"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`rounded-[6px] border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest transition ${filter === st ? "border-accent/60 text-accent" : "border-line text-dim hover:text-muted"}`}
          >
            {st === "ALL" ? "todas" : st.toLowerCase()}
          </button>
        ))}
      </div>

      {openForm && (
        <Panel title="nueva señal">
          <SignalForm onDone={() => setOpenForm(false)} />
        </Panel>
      )}

      <div className="space-y-3">
        {list.map((s) => (
          <article key={s.id} className="rounded-[10px] border border-line bg-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ProvenanceBadge kind={s.evidence} />
                <SignalStatusBadge status={s.status} />
                {s.expedienteId && (
                  <button onClick={() => open("expedientes", s.expedienteId!)} className="font-mono text-[11px] text-accent hover:underline">
                    → expediente nº {String(expNum(s.expedienteId)).padStart(3, "0")}
                  </button>
                )}
              </div>
              <Meta>
                <span>{s.date}</span>
                <span>· {s.foundBy || "—"}</span>
                <span>· {s.sourceType}</span>
              </Meta>
            </div>
            <h3 className="mt-2 font-heading text-base font-semibold text-ink">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{s.problem}</p>
            <p className="mt-1 font-mono text-[11px] text-dim">fuente · {s.source}</p>
            {s.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-[4px] border border-line px-1.5 py-0.5 font-mono text-[10px] text-dim">#{t}</span>
                ))}
              </div>
            )}
            {s.notes && <p className="mt-2 rounded-[6px] border border-linesoft bg-paper px-3 py-2 font-mono text-[11px] text-dim">{s.notes}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-linesoft pt-3">
              {editing === s.id ? (
                <SignalForm initial={s} onDone={() => setEditing(null)} />
              ) : (
                <>
                  <ActionBtn tone="ghost" onClick={() => setEditing(s.id)}>editar</ActionBtn>
                  {s.status !== "CONVERTIDA" && (
                    <ActionBtn tone="ghost" onClick={() => { const id = convertSignalToExpediente(s.id); if (id) open("expedientes", id); }}>
                      convertir en expediente
                    </ActionBtn>
                  )}
                  {s.status === "ABIERTA" && (
                    <ActionBtn tone="danger" onClick={() => discardSignal(s.id)}>descartar</ActionBtn>
                  )}
                  {s.status === "DESCARTADA" && (
                    <ActionBtn tone="ghost" onClick={() => restoreSignal(s.id)}>restaurar</ActionBtn>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ─── Expedientes ────────────────────────────────────────────────────────────
function ExpForm({ initial, onDone, signalId, titleFor }: {
  initial?: Expediente;
  onDone: () => void;
  signalId?: string;
  titleFor?: string;
}) {
  const { createExpediente, updateExpediente } = useLab();
  const [f, setF] = useState({
    title: initial?.title ?? titleFor ?? "",
    problem: initial?.problem ?? "",
    evidence: initial?.evidence ?? "",
    opportunity: initial?.opportunity ?? "",
    hypothesis: initial?.hypothesis ?? "",
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.title.trim()) return;
    if (initial) updateExpediente(initial.id, { ...f, evidence: f.evidence, opportunity: f.opportunity, hypothesis: f.hypothesis });
    else createExpediente(f, signalId);
    onDone();
  };
  return (
    <div className="space-y-3">
      <Field label="título"><Input value={f.title} onChange={(v) => set("title", v)} /></Field>
      <Field label="problema"><Area value={f.problem} onChange={(v) => set("problem", v)} /></Field>
      <Field label="evidencia (qué observamos)"><Area value={f.evidence} onChange={(v) => set("evidence", v)} rows={2} /></Field>
      <Field label="oportunidad (qué podría existir)"><Area value={f.opportunity} onChange={(v) => set("opportunity", v)} rows={2} /></Field>
      <Field label="hipótesis (qué queremos probar)"><Area value={f.hypothesis} onChange={(v) => set("hypothesis", v)} rows={2} /></Field>
      <div className="flex justify-end gap-2">
        <ActionBtn tone="ghost" onClick={onDone}>cancelar</ActionBtn>
        <ActionBtn onClick={submit}>{initial ? "Guardar" : "Crear expediente"}</ActionBtn>
      </div>
    </div>
  );
}

export function Expedientes({ intent, open }: { intent: string | null; open: Open }) {
  const { state, convertSignalToExpediente } = useLab();
  const [openForm, setOpenForm] = useState(intent === "create-expediente");
  const openSignals = state.signals.filter((s) => s.status === "ABIERTA");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">investigaciones</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">Expedientes</h1>
        </div>
        <ActionBtn onClick={() => setOpenForm((v) => !v)}>{openForm ? "cerrar" : "+ nuevo expediente"}</ActionBtn>
      </div>

      {openForm && (
        <Panel title="nuevo expediente">
          <ExpForm onDone={() => setOpenForm(false)} />
        </Panel>
      )}

      {openSignals.length > 0 && (
        <Panel title="señales abiertas que se pueden crear como expediente">
          <div className="flex flex-wrap gap-2">
            {openSignals.map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-[8px] border border-line bg-paper px-3 py-2">
                <span className="text-xs text-muted">{s.title}</span>
                <button
                  onClick={() => { const id = convertSignalToExpediente(s.id); if (id) open("expedientes", id); }}
                  className="font-mono text-[11px] text-accent hover:underline"
                >
                  crear →
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div className="space-y-3">
        {state.expedientes.map((e) => (
          <button key={e.id} onClick={() => open("expedientes", e.id)} className="block w-full rounded-[10px] border border-line bg-panel p-5 text-left transition hover:border-accent/50">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-accent">expediente nº {String(e.number).padStart(3, "0")}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-dim">{e.status.replace(/_/g, " ")}</span>
            </div>
            <h3 className="mt-1 font-heading text-lg font-bold text-ink">{e.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] text-dim">
              <span>{e.signalIds.length} señales</span>
              <span>·</span>
              <span>{e.experimentIds.length} experimentos</span>
              {e.hypothesis && <span>· hipótesis definida</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
// ─── Detalle de expediente ──────────────────────────────────────────────────
export function ExpDetail({ id, open }: { id: string; open: Open }) {
  const { state, linkSignal, unlinkSignal } = useLab();
  const exp = state.expedientes.find((e) => e.id === id);
  const [editing, setEditing] = useState(false);
  const [pickSignal, setPickSignal] = useState("");
  const [showNewExp, setShowNewExp] = useState(false);

  if (!exp) return <p className="font-mono text-sm text-dim">Expediente no encontrado.</p>;

  const signals = exp.signalIds.map((sid) => state.signals.find((x) => x.id === sid)).filter(Boolean) as Signal[];
  const experiments = exp.experimentIds.map((eid) => state.experiments.find((x) => x.id === eid)).filter(Boolean) as Experiment[];
  const available = state.signals.filter((s) => s.status === "ABIERTA" && !exp.signalIds.includes(s.id));

  return (
    <div className="space-y-6">
      <button onClick={() => open("expedientes", "")} className="font-mono text-[11px] text-dim hover:text-muted">← expedientes</button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">expediente nº {String(exp.number).padStart(3, "0")}</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">{exp.title || "(sin título)"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-[6px] border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">{exp.status.replace(/_/g, " ")}</span>
          <ActionBtn tone="ghost" onClick={() => setEditing((v) => !v)}>{editing ? "cerrar edición" : "editar"}</ActionBtn>
        </div>
      </div>

      {editing ? (
        <Panel title="editar expediente">
          <ExpForm initial={exp} onDone={() => setEditing(false)} />
        </Panel>
      ) : (
        <div className="grid gap-px overflow-hidden rounded-[10px] border border-line bg-linesoft md:grid-cols-2">
          <div className="bg-panel p-5"><Dt label="problema" value={exp.problem} /></div>
          <div className="bg-panel p-5"><Dt label="evidencia" value={exp.evidence} /></div>
          <div className="bg-panel p-5"><Dt label="oportunidad" value={exp.opportunity} /></div>
          <div className="bg-panel p-5"><Dt label="hipótesis" value={exp.hypothesis} /></div>
        </div>
      )}

      <Panel title={`señales (${signals.length})`}>
        <div className="space-y-2">
          {signals.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-[8px] border border-linesoft bg-paper px-3 py-2">
              <span className="text-sm text-muted">{s.title}</span>
              <button onClick={() => unlinkSignal(exp.id, s.id)} className="font-mono text-[11px] text-dim hover:text-red-400">quitar</button>
            </div>
          ))}
          {signals.length === 0 && <p className="font-mono text-[11px] text-dim">Sin señales.</p>}
        </div>
        {available.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-linesoft pt-3">
            <Select value={pickSignal} onChange={setPickSignal} options={["", ...available.map((s) => s.id)]} />
            {pickSignal && (
              <ActionBtn tone="ghost" onClick={() => { linkSignal(exp.id, pickSignal); setPickSignal(""); }}>enlazar señal</ActionBtn>
            )}
          </div>
        )}
      </Panel>

      <Panel title={`experimentos (${experiments.length})`}>
        <div className="space-y-2">
          {experiments.map((ex) => (
            <button key={ex.id} onClick={() => open("experimentos", ex.id)} className="flex w-full items-center justify-between gap-3 rounded-[8px] border border-linesoft bg-paper px-3 py-2 text-left transition hover:border-accent/50">
              <div>
                <p className="text-sm text-ink">{ex.name}</p>
                <p className="font-mono text-[10px] text-dim">exp nº {String(ex.number).padStart(3, "0")}</p>
              </div>
              <ExpStatusBadge status={ex.status} />
            </button>
          ))}
          {experiments.length === 0 && !showNewExp && <p className="font-mono text-[11px] text-dim">Sin experimentos.</p>}
        </div>
        <div className="mt-3 border-t border-linesoft pt-3">
          {showNewExp ? (
            <ExpRunForm
              presetExpedienteId={exp.id}
              onCreated={(id) => open("experimentos", id)}
              onDone={() => setShowNewExp(false)}
            />
          ) : (
            <ActionBtn tone="ghost" onClick={() => setShowNewExp(true)}>+ crear experimento acá</ActionBtn>
          )}
        </div>
      </Panel>

      <Panel title="historial">
        <Hist history={exp.history} />
      </Panel>
    </div>
  );
}

// ─── Experimentos ───────────────────────────────────────────────────────────
function ExpRunForm({ initial, onDone, onCreated, presetExpedienteId }: {
  initial?: Experiment;
  onDone: () => void;
  onCreated?: (id: string) => void;
  presetExpedienteId?: string;
}) {
  const { createExperiment, updateExperiment, state } = useLab();
  const [f, setF] = useState({
    name: initial?.name ?? "",
    hypothesis: initial?.hypothesis ?? "",
    offer: initial?.offer ?? "",
    method: initial?.method ?? "",
    metricPrimary: initial?.metricPrimary ?? "",
    metricSecondary: initial?.metricSecondary ?? "",
    status: (initial?.status ?? "NO_DISEÑADO") as Experiment["status"],
    expedienteId: initial?.expedienteId ?? presetExpedienteId ?? "",
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.name.trim()) return;
    if (initial) updateExperiment(initial.id, { ...f, expedienteId: f.expedienteId || undefined });
    else {
      const id = createExperiment({ ...f, expedienteId: f.expedienteId || undefined });
      onCreated?.(id);
    }
    onDone();
  };
  return (
    <div className="space-y-3">
      <Field label="nombre"><Input value={f.name} onChange={(v) => set("name", v)} /></Field>
      {presetExpedienteId ? (
        <Field label="expediente relacionado">
          <p className="rounded-[8px] border border-line bg-paper px-3 py-2 font-mono text-sm text-muted">
            fijo: nº {String(state.expedientes.find((e) => e.id === presetExpedienteId)?.number ?? "").padStart(3, "0")}
          </p>
        </Field>
      ) : (
        <Field label="expediente relacionado">
          <select
            className="w-full rounded-[8px] border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent"
            value={f.expedienteId}
            onChange={(e) => set("expedienteId", e.target.value)}
          >
            <option value="" className="bg-panel text-ink">sin expediente</option>
            {state.expedientes.map((e) => (
              <option key={e.id} value={e.id} className="bg-panel text-ink">
                nº {String(e.number).padStart(3, "0")} · {e.title || "(sin título)"}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="hipótesis"><Area value={f.hypothesis} onChange={(v) => set("hypothesis", v)} /></Field>
      <Field label="oferta / intervención"><Area value={f.offer} onChange={(v) => set("offer", v)} rows={2} /></Field>
      <Field label="método"><Area value={f.method} onChange={(v) => set("method", v)} rows={2} /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="métrica principal"><Input value={f.metricPrimary} onChange={(v) => set("metricPrimary", v)} /></Field>
        <Field label="métrica secundaria"><Input value={f.metricSecondary} onChange={(v) => set("metricSecondary", v)} /></Field>
      </div>
      <Field label="estado">
        <Select value={f.status} onChange={(v) => set("status", v)} options={EXP_STATUS_OPTIONS} />
      </Field>
      <div className="flex justify-end gap-2">
        <ActionBtn tone="ghost" onClick={onDone}>cancelar</ActionBtn>
        <ActionBtn onClick={submit}>{initial ? "Guardar" : "Crear experimento"}</ActionBtn>
      </div>
    </div>
  );
}

export function Experimentos({ intent, open }: { intent: string | null; open: Open }) {
  const { state } = useLab();
  const [openForm, setOpenForm] = useState(intent === "create-experimento");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">laboratorio</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">Experimentos</h1>
        </div>
        <ActionBtn onClick={() => setOpenForm((v) => !v)}>{openForm ? "cerrar" : "+ nuevo experimento"}</ActionBtn>
      </div>
      {openForm && (
        <Panel title="nuevo experimento">
          <ExpRunForm onDone={() => setOpenForm(false)} />
        </Panel>
      )}
      <div className="space-y-3">
        {state.experiments.map((e) => (
          <button key={e.id} onClick={() => open("experimentos", e.id)} className="block w-full rounded-[10px] border border-line bg-panel p-5 text-left transition hover:border-accent/50">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-accent">exp nº {String(e.number).padStart(3, "0")}</span>
              <ExpStatusBadge status={e.status} />
            </div>
            <h3 className="mt-1 font-heading text-lg font-bold text-ink">{e.name}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-muted">{e.hypothesis}</p>
            {e.decision && <div className="mt-2"><DecisionBadge value={e.decision.value} /></div>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ExpDetailView({ id, open }: { id: string; open: Open }) {
  const { state, setStatus, setResult, setDecision, killExperiment } = useLab();
  const ex = state.experiments.find((e) => e.id === id);
  const [editing, setEditing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const member = state.member;

  if (!ex) return <p className="font-mono text-sm text-dim">Experimento no encontrado.</p>;
  const exp = state.expedientes.find((e) => e.id === ex.expedienteId);

  const quickStatus: Experiment["status"][] = ["DISEÑADO", "LISTO", "CORRIENDO", "TERMINADO"];

  return (
    <div className="space-y-6">
      <button onClick={() => open("experimentos", "")} className="font-mono text-[11px] text-dim hover:text-muted">← experimentos</button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">experimento nº {String(ex.number).padStart(3, "0")}</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">{ex.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ExpStatusBadge status={ex.status} />
          <ActionBtn tone="ghost" onClick={() => setEditing((v) => !v)}>{editing ? "cerrar" : "editar"}</ActionBtn>
        </div>
      </div>

      {ex.expedienteId && (
        <p className="font-mono text-[11px]">
          <button onClick={() => open("expedientes", ex.expedienteId!)} className="text-accent hover:underline">
            → expediente nº {String(exp?.number).padStart(3, "0")} · {exp?.title}
          </button>
        </p>
      )}

      {editing ? (
        <Panel title="editar experimento"><ExpRunForm initial={ex} onDone={() => setEditing(false)} /></Panel>
      ) : (
        <div className="grid gap-px overflow-hidden rounded-[10px] border border-line bg-linesoft md:grid-cols-2">
          <div className="bg-panel p-5"><Dt label="hipótesis" value={ex.hypothesis} /></div>
          <div className="bg-panel p-5"><Dt label="oferta / intervención" value={ex.offer} /></div>
          <div className="bg-panel p-5"><Dt label="método" value={ex.method} /></div>
          <div className="bg-panel p-5">
            <Dt label="métrica principal" value={ex.metricPrimary} />
            <div className="mt-1"><Dt label="secundaria" value={ex.metricSecondary} /></div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {quickStatus.map((st) => (
          <button key={st} onClick={() => setStatus(ex.id, st)} className={`rounded-[6px] border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest transition ${ex.status === st ? "border-accent/60 text-accent" : "border-line text-dim hover:text-muted"}`}>
            {st.replace(/_/g, " ")}
          </button>
        ))}
        <ActionBtn tone="ghost" onClick={() => setShowResult((v) => !v)}>{showResult ? "cerrar resultado" : "registrar resultado"}</ActionBtn>
        <ActionBtn tone="ghost" onClick={() => setShowDecision((v) => !v)}>{showDecision ? "cerrar decisión" : "registrar decisión"}</ActionBtn>
        <ActionBtn tone="danger" onClick={() => { if (confirm(`¿Enviar "${ex.name}" al cementerio?`)) killExperiment(ex.id); }}>
          matar →
        </ActionBtn>
      </div>

      {showResult && <ResultForm ex={ex} onSubmit={(r) => { setResult(ex.id, r); setShowResult(false); }} />}
      {showDecision && <DecisionForm ex={ex} member={member} onSubmit={(d) => { setDecision(ex.id, d); setShowDecision(false); }} />}

      {ex.result && !showResult && (
        <Panel title="resultado registrado">
          <div className="grid gap-px overflow-hidden rounded-[8px] border border-line bg-linesoft sm:grid-cols-2">
            <div className="bg-paper p-4"><Dt label="qué esperábamos" value={ex.result.expected} /></div>
            <div className="bg-paper p-4"><Dt label="qué ocurrió" value={ex.result.occurred} /></div>
            <div className="bg-paper p-4"><Dt label="evidencia / métrica" value={ex.result.evidence || ex.result.metric} /></div>
            <div className="bg-paper p-4"><Dt label="fuente · fecha · interpretación" value={`${ex.result.source || "—"} · ${ex.result.date || "—"} — ${ex.result.interpretation || "—"}`} /></div>
          </div>
        </Panel>
      )}

      {ex.decision && !showDecision && (
        <Panel title="decisión">
          <div className="flex items-center gap-3">
            <DecisionBadge value={ex.decision.value} />
            <span className="font-mono text-[11px] text-dim">{ex.decision.date} · {ex.decision.by}</span>
          </div>
          <div className="ms-0 mt-3 grid gap-2 sm:ms-2">
            <Dt label="motivo" value={ex.decision.reason} />
            <Dt label="evidencia utilizada" value={ex.decision.evidenceUsed} />
            <Dt label="aprendizaje" value={ex.decision.aprendizaje} />
          </div>
        </Panel>
      )}

      <Panel title="historial"><Hist history={ex.history} /></Panel>
    </div>
  );
}

function ResultForm({ ex, onSubmit }: { ex: Experiment; onSubmit: (r: Experiment["result"] & {}) => void }) {
  const [f, setF] = useState({
    expected: ex.result?.expected ?? "",
    occurred: ex.result?.occurred ?? "",
    evidence: ex.result?.evidence ?? "",
    metric: ex.result?.metric ?? "",
    source: ex.result?.source ?? "",
    date: ex.result?.date ?? new Date().toISOString().slice(0, 10),
    interpretation: ex.result?.interpretation ?? "",
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Panel title="registrar resultado">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="qué esperábamos"><Area value={f.expected} onChange={(v) => set("expected", v)} rows={2} /></Field>
        <Field label="qué ocurrió (dato)"><Area value={f.occurred} onChange={(v) => set("occurred", v)} rows={2} /></Field>
        <Field label="evidencia"><Area value={f.evidence} onChange={(v) => set("evidence", v)} rows={2} /></Field>
        <Field label="métrica"><Input value={f.metric} onChange={(v) => set("metric", v)} /></Field>
        <Field label="fuente"><Input value={f.source} onChange={(v) => set("source", v)} /></Field>
        <Field label="fecha"><Input value={f.date} onChange={(v) => set("date", v)} /></Field>
        <div className="sm:col-span-2">
          <Field label="interpretación (no es dato)"><Area value={f.interpretation} onChange={(v) => set("interpretation", v)} rows={2} /></Field>
        </div>
      </div>
      <div className="mt-3 flex justify-end"><ActionBtn onClick={() => onSubmit(f)}>guardar resultado</ActionBtn></div>
    </Panel>
  );
}

function DecisionForm({ ex, member, onSubmit }: {
  ex: Experiment;
  member: string;
  onSubmit: (d: Experiment["decision"] & {}) => void;
}) {
  const [f, setF] = useState({
    value: (ex.decision?.value ?? "PENDING") as DecisionResult,
    date: ex.decision?.date ?? new Date().toISOString().slice(0, 10),
    by: ex.decision?.by ?? member,
    reason: ex.decision?.reason ?? "",
    evidenceUsed: ex.decision?.evidenceUsed ?? "",
    aprendizaje: ex.decision?.aprendizaje ?? "",
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Panel title="registrar decisión">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="decisión"><Select value={f.value} onChange={(v) => set("value", v)} options={DECISION_OPTIONS} /></Field>
        <Field label="fecha"><Input value={f.date} onChange={(v) => set("date", v)} /></Field>
        <Field label="responsable"><Input value={f.by} onChange={(v) => set("by", v)} /></Field>
      </div>
      <div className="mt-3 grid gap-3">
        <Field label="motivo"><Area value={f.reason} onChange={(v) => set("reason", v)} rows={2} /></Field>
        <Field label="evidencia utilizada"><Area value={f.evidenceUsed} onChange={(v) => set("evidenceUsed", v)} rows={1} /></Field>
        <Field label="aprendizaje"><Area value={f.aprendizaje} onChange={(v) => set("aprendizaje", v)} rows={2} /></Field>
      </div>
      <div className="mt-3 flex justify-end"><ActionBtn onClick={() => onSubmit(f)}>guardar decisión</ActionBtn></div>
    </Panel>
  );
}

// ─── Cementerio ─────────────────────────────────────────────────────────────
export function Cementerio() {
  const { state, updateGrave, deleteGrave } = useLab();
  const [editing, setEditing] = useState<string | null>(null);

  if (state.graveyard.length === 0) {
    return (
      <Panel title="cementerio · base histórica">
        <p className="font-mono text-sm text-dim">0 experimentos matados — todavía vacío.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">base histórica de lo que murió</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">Cementerio</h1>
      </div>
      <div className="space-y-3">
        {state.graveyard.map((g) => (
          <GraveCard key={g.id} g={g} editing={editing === g.id} onEdit={() => setEditing(editing === g.id ? null : g.id)} onSave={(patch) => { updateGrave(g.id, patch); setEditing(null); }} onDelete={() => { if (confirm("¿Borrar esta entrada del cementerio?")) deleteGrave(g.id); }} />
        ))}
      </div>
    </div>
  );
}

function GraveCard({ g, editing, onEdit, onSave, onDelete }: {
  g: GraveEntry;
  editing: boolean;
  onEdit: () => void;
  onSave: (patch: Partial<GraveEntry>) => void;
  onDelete: () => void;
}) {
  const [f, setF] = useState({
    problema: g.problema, solucion: g.solucion, hipotesis: g.hipotesis, ocurrio: g.ocurrio,
    porQueMurio: g.porQueMurio, aprendizaje: g.aprendizaje, reutilizable: g.reutilizable,
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  return (
    <article className="rounded-[10px] border border-line bg-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-red-400">kill</p>
        <div className="flex items-center gap-2">
          <ActionBtn tone="ghost" onClick={onEdit}>{editing ? "cerrar" : "editar"}</ActionBtn>
          <ActionBtn tone="danger" onClick={onDelete}>borrar</ActionBtn>
        </div>
      </div>
      {editing ? (
        <div className="mt-3 space-y-3">
          <Field label="problema que parecía existir"><Area value={f.problema} onChange={(v) => set("problema", v)} rows={2} /></Field>
          <Field label="solución que probamos"><Area value={f.solucion} onChange={(v) => set("solucion", v)} rows={1} /></Field>
          <Field label="hipótesis"><Area value={f.hipotesis} onChange={(v) => set("hipotesis", v)} rows={1} /></Field>
          <Field label="qué ocurrió"><Area value={f.ocurrio} onChange={(v) => set("ocurrio", v)} rows={1} /></Field>
          <Field label="por qué murió"><Area value={f.porQueMurio} onChange={(v) => set("porQueMurio", v)} rows={2} /></Field>
          <Field label="aprendizaje"><Area value={f.aprendizaje} onChange={(v) => set("aprendizaje", v)} rows={2} /></Field>
          <Field label="qué podríamos reutilizar"><Area value={f.reutilizable} onChange={(v) => set("reutilizable", v)} rows={2} /></Field>
          <div className="flex justify-end"><ActionBtn onClick={() => onSave(f)}>guardar</ActionBtn></div>
        </div>
      ) : (
        <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <Dt label="problema" value={g.problema} />
          <Dt label="solución probada" value={g.solucion} />
          <Dt label="hipótesis" value={g.hipotesis} />
          <Dt label="qué ocurrió" value={g.ocurrio} />
          <Dt label="por qué murió" value={g.porQueMurio} />
          <Dt label="aprendizaje" value={g.aprendizaje} />
          {g.reutilizable && <div className="sm:col-span-2"><Dt label="reutilizable" value={g.reutilizable} /></div>}
        </div>
      )}
    </article>
  );
}
// ─── Guía / cómo usar ───────────────────────────────────────────────────────

export function Guia() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">guía fácil</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">Cómo se usa esto, en simple</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Piénsalo como una libreta del taller. Cuando alguien ve un problema, lo anotamos.
          Después vemos si vale la pena arreglarlo. Y al final decimos: <strong className="text-ink">lo hacemos</strong>,{" "}
          <strong className="text-ink">lo probamos otra vez</strong> o <strong className="text-ink">lo tiramos</strong>.
        </p>
      </div>

      <div className="rounded-[10px] border border-line bg-panel p-5">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">los pasos, uno por uno</p>
        <div className="space-y-4">
          <Step n={1} tab="radar" t="Anotá lo que viste." d="Si notás algo que molesta o que va lento, escríbelo acá. No hace falta que sea perfecto." e="ej: «la gente arma sus cuentas a mano en papel»" />
          <Step n={2} tab="radar" t="Guardá la prueba." d="Poné de dónde lo viste y cuándo. Así después no nos olvidamos por qué lo anotamos." />
          <Step n={3} tab="radar" t="Hazlo ficha." d="Tocá «convertir en expediente» y la anotación se vuelve una ficha de investigación con todo ya cargado." />
          <Step n={4} tab="expedientes" t="Explicá la ficha." d="Contá qué está pasando, qué sabemos y qué querés comprobar. Con palabras tuyas y simples." />
          <Step n={5} tab="experimentos" t="Inventá una prueba." d="Pensá una forma chica de saber si es verdad. Por ejemplo: una página con un botón y mirar si la gente lo toca." />
          <Step n={6} tab="experimentos" t="Hacé la prueba." d="Poné el estado en «corriendo» y déjalá andar un tiempo." />
          <Step n={7} tab="experimentos" t="Anotá qué pasó." d="Escribí qué esperabas y qué pasó de verdad. Y aparte, qué creés que significa. Son dos cosas distintas." />
          <Step n={8} tab="experimentos" t="Decidí." d="¿Se hace? ¿Se prueba otra vez? ¿Se tira? Elegí y dejá el motivo." />
          <Step n={9} tab="cementerio" t="Lo que se tira, va al Cementerio." d="Si una prueba no funcionó, queda guardada con «por qué» y «qué aprendimos». Sirve para no equivocarnos dos veces con lo mismo." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[10px] border border-line bg-panel p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">las etiquetas de la evidencia</p>
          <div className="space-y-3 text-sm text-muted">
            <p><BadgeC k="OBSERVED" t="Visto" /> <span className="ml-2">Lo vimos nosotros mismos, con fuente y fecha. Esto es lo que vale como cierto.</span></p>
            <p><BadgeC k="INFERRED" t="Pensado" /> <span className="ml-2">Lo dedujimos mirando las cosas. Es una buena idea, pero no una prueba.</span></p>
            <p><BadgeC k="ESTIMATED" t="Calculado" /> <span className="ml-2">Un número que sacamos por encima, con suposiciones. Sirve para hacerse una idea, no para confirmar.</span></p>
            <p><BadgeC k="GENERATED" t="Dicho por la máquina" /> <span className="ml-2">Lo sugirió una computadora. Todavía no cuenta como prueba.</span></p>
          </div>
        </div>
        <div className="rounded-[10px] border border-line bg-panel p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">las decisiones</p>
          <div className="space-y-3 text-sm text-muted">
            <p><BadgeC k="BUILD" t="Hacerlo" /> <span className="ml-2">Hay pruebas suficientes: se construye.</span></p>
            <p><BadgeC k="ITERATE" t="Otro intento" /> <span className="ml-2">Hay señales pero hay que ajustar y probar de nuevo.</span></p>
            <p><BadgeC k="KILL" t="Tirarlo" /> <span className="ml-2">No funcionó: se descarta y se aprende algo.</span></p>
            <p><BadgeC k="PENDING" t="No sabemos" /> <span className="ml-2">Todavía no hay pruebas para decidir. Eso también está bien.</span></p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-line bg-panel p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">reglas sencillas</p>
        <ul className="space-y-2 text-sm leading-relaxed text-muted">
          <li>· <span className="text-ink">Lo que pasó no es lo mismo que lo que creemos.</span> Por eso van en casilleros separados.</li>
          <li>· <span className="text-ink">La máquina no decide por nosotros.</span> Solo sugiere; la decisión la tomamos nosotros.</li>
          <li>· <span className="text-ink">No inventamos números.</span> Si todavía no hay datos, se ve vacío, y está bien.</li>
          <li>· <span className="text-ink">Por ahora se guarda en este navegador.</span> Si lo abrís en otra computadora, no está. (Compartir entre máquinas viene después.)</li>
          <li>· <span className="text-ink">Si te equivocaste, se arregla.</span> Todo se puede editar, y se guarda el historial de quién cambió qué.</li>
        </ul>
      </div>
    </div>
  );
}

function Step({ n, tab, t, d, e }: { n: number; tab: string; t: string; d: string; e?: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/60 font-mono text-sm text-accent">{n}</span>
      <div className="min-w-0">
        <p className="font-heading text-base font-bold text-ink">
          {t}{" "}
          <span className="rounded-[4px] border border-line px-1.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-widest text-muted">{tab}</span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
        {e && <p className="mt-1 font-mono text-[11px] text-dim">{e}</p>}
      </div>
    </div>
  );
}

const TONE: Record<string, string> = {
  OBSERVED: "border-accent/50 text-accent",
  INFERRED: "border-line text-muted",
  ESTIMATED: "border-gold/50 text-gold",
  GENERATED: "border-dashed border-line text-dim",
  BUILD: "border-gold/60 text-gold",
  ITERATE: "border-accent/60 text-accent",
  KILL: "border-red-900 text-red-400",
  PENDING: "border-line text-dim",
};

function BadgeC({ k, t }: { k: string; t: string }) {
  return (
    <span className={`inline-flex items-center rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${TONE[k] ?? "border-line text-dim"}`}>
      {t}
    </span>
  );
}
