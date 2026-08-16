"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  type Experiment,
  type ExperimentDecision,
  type ExperimentResult,
  type ExpStatus,
  type Expediente,
  type GraveEntry,
  type LabState,
  type Signal,
  nextNumber,
  seedState,
  today,
  withHistory,
} from "@/lib/lab/state";

const LS_KEY = "vl.lab.v1";

export interface SignalInput {
  title: string;
  problem: string;
  source: string;
  url?: string;
  foundBy: string;
  sourceType: string;
  evidence: Signal["evidence"];
  notes: string;
  tags: string[];
}

export interface ExpedienteInput {
  title: string;
  problem: string;
  evidence: string;
  opportunity: string;
  hypothesis: string;
}

export interface ExperimentInput {
  name: string;
  hypothesis: string;
  offer: string;
  method: string;
  metricPrimary: string;
  metricSecondary: string;
  status: ExpStatus;
  expedienteId?: string;
}

type LabActions = {
  member: string;
  setMember: (m: string) => void;

  createSignal: (inp: SignalInput) => string;
  updateSignal: (id: string, patch: Partial<Signal>) => void;
  discardSignal: (id: string) => void;
  restoreSignal: (id: string) => void;
  convertSignalToExpediente: (id: string) => string | null;

  createExpediente: (inp: ExpedienteInput, signalId?: string) => string;
  updateExpediente: (id: string, patch: Partial<Expediente>) => void;
  linkSignal: (expId: string, signalId: string) => void;
  unlinkSignal: (expId: string, signalId: string) => void;

  createExperiment: (inp: ExperimentInput) => string;
  updateExperiment: (id: string, patch: Partial<Experiment>) => void;
  setStatus: (id: string, status: ExpStatus) => void;
  setResult: (id: string, result: ExperimentResult) => void;
  setDecision: (id: string, decision: ExperimentDecision) => void;
  killExperiment: (id: string) => void;

  updateGrave: (id: string, patch: Partial<GraveEntry>) => void;
  deleteGrave: (id: string) => void;
};

interface LabValue extends LabActions {
  state: LabState;
}

const Ctx = createContext<LabValue | null>(null);

function load(memberState: LabState): LabState {
  if (typeof window === "undefined") return memberState;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return memberState;
    const parsed = JSON.parse(raw) as LabState;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.signals || parsed.expedientes)) {
      return memberState;
    }
    return parsed;
  } catch {
    return memberState;
  }
}

function persist(get: () => LabState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(get()));
  } catch {
    /* noop */
  }
}

export function LabProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LabState>(() => seedState());

  useEffect(() => {
    const stored = load(seedState());
    setState(stored);
    persist(() => stored);
  }, []);

  const commit = (next: LabState) => {
    setState(next);
    persist(() => next);
  };

  const who = state.member || "yo";

  const value: LabValue = {
    state,
    member: state.member,

    setMember: (m) => commit({ ...state, member: m }),

    createSignal: (inp) => {
      const id = "s_" + Math.random().toString(36).slice(2, 8);
      const s: Signal = {
        id,
        title: inp.title,
        problem: inp.problem,
        source: inp.source,
        url: inp.url,
        date: today(),
        foundBy: inp.foundBy || who,
        sourceType: inp.sourceType,
        evidence: inp.evidence,
        notes: inp.notes,
        tags: inp.tags,
        status: "ABIERTA",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{ at: new Date().toISOString(), by: who, what: "señal creada" }],
      };
      commit({ ...state, signals: [s, ...state.signals] });
      return id;
    },

    updateSignal: (id, patch) => {
      commit({
        ...state,
        signals: state.signals.map((s) =>
          s.id === id ? withHistory({ ...s, ...patch }, "señal editada", who) : s,
        ),
      });
    },

    discardSignal: (id) => {
      commit({
        ...state,
        signals: state.signals.map((s) =>
          s.id === id
            ? s.status === "CONVERTIDA"
              ? s
              : withHistory({ ...s, status: "DESCARTADA" }, "señal descartada", who)
            : s,
        ),
      });
    },

    restoreSignal: (id) => {
      commit({
        ...state,
        signals: state.signals.map((s) =>
          s.id === id ? withHistory({ ...s, status: "ABIERTA" }, "señal restaurada", who) : s,
        ),
      });
    },

    convertSignalToExpediente: (id) => {
      const sig = state.signals.find((s) => s.id === id);
      if (!sig || sig.status === "CONVERTIDA") return null;
      const expId = "ex_" + Math.random().toString(36).slice(2, 8);
      const number = nextNumber(state.expedientes.map((e) => e.number));
      const now = new Date().toISOString();
      const expo: Expediente = {
        id: expId,
        number,
        title: sig.title,
        status: "OPEN",
        problem: sig.problem,
        evidence: "",
        opportunity: "",
        hypothesis: "",
        signalIds: [sig.id],
        experimentIds: [],
        createdAt: now,
        updatedAt: now,
        history: [{ at: now, by: who, what: "expediente creado desde señal" }],
      };
      commit({
        ...state,
        expedientes: [expo, ...state.expedientes],
        signals: state.signals.map((s) =>
          s.id === id
            ? withHistory(
                { ...s, status: "CONVERTIDA", expedienteId: expId },
                "convertida a expediente " + number,
                who,
              )
            : s,
        ),
      });
      return expId;
    },

    createExpediente: (inp, signalId) => {
      const expId = "ex_" + Math.random().toString(36).slice(2, 8);
      const number = nextNumber(state.expedientes.map((e) => e.number));
      const now = new Date().toISOString();
      const signalIds = signalId ? [signalId] : [];
      const expo: Expediente = {
        id: expId,
        number,
        title: inp.title,
        status: "OPEN",
        problem: inp.problem,
        evidence: inp.evidence,
        opportunity: inp.opportunity,
        hypothesis: inp.hypothesis,
        signalIds,
        experimentIds: [],
        createdAt: now,
        updatedAt: now,
        history: [{ at: now, by: who, what: "expediente creado" }],
      };
      commit({
        ...state,
        expedientes: [expo, ...state.expedientes],
        signals: signalId
          ? state.signals.map((s) =>
              s.id === signalId && s.status !== "CONVERTIDA"
                ? withHistory({ ...s, status: "CONVERTIDA", expedienteId: expId }, "enlazada a expediente", who)
                : s,
            )
          : state.signals,
      });
      return expId;
    },

    updateExpediente: (id, patch) => {
      commit({
        ...state,
        expedientes: state.expedientes.map((e) =>
          e.id === id ? withHistory({ ...e, ...patch }, "expediente editado", who) : e,
        ),
      });
    },

    linkSignal: (expId, signalId) => {
      commit({
        ...state,
        expedientes: state.expedientes.map((e) =>
          e.id === expId && !e.signalIds.includes(signalId)
            ? withHistory({ ...e, signalIds: [...e.signalIds, signalId] }, "señal enlazada", who)
            : e,
        ),
        signals: state.signals.map((s) =>
          s.id === signalId
            ? withHistory({ ...s, status: "CONVERTIDA", expedienteId: expId }, "enlazada a expediente", who)
            : s,
        ),
      });
    },

    unlinkSignal: (expId, signalId) => {
      commit({
        ...state,
        expedientes: state.expedientes.map((e) =>
          e.id === expId
            ? withHistory(
                { ...e, signalIds: e.signalIds.filter((x) => x !== signalId) },
                "señal desenlazada",
                who,
              )
            : e,
        ),
        signals: state.signals.map((s) =>
          s.id === signalId
            ? withHistory({ ...s, status: "ABIERTA", expedienteId: undefined }, "desenlazada", who)
            : s,
        ),
      });
    },

    createExperiment: (inp) => {
      const id = "exp_" + Math.random().toString(36).slice(2, 8);
      const number = nextNumber(state.experiments.map((e) => e.number));
      const now = new Date().toISOString();
      const expo: Experiment = {
        id,
        number,
        name: inp.name,
        expedienteId: inp.expedienteId,
        hypothesis: inp.hypothesis,
        offer: inp.offer,
        method: inp.method,
        metricPrimary: inp.metricPrimary,
        metricSecondary: inp.metricSecondary,
        status: inp.status,
        createdAt: now,
        updatedAt: now,
        history: [{ at: now, by: who, what: "experimento creado" }],
      };
      commit({
        ...state,
        experiments: [expo, ...state.experiments],
        expedientes: inp.expedienteId
          ? state.expedientes.map((e) =>
              e.id === inp.expedienteId ? { ...e, experimentIds: [...new Set([...e.experimentIds, id])] } : e,
            )
          : state.expedientes,
      });
      return id;
    },

    updateExperiment: (id, patch) => {
      commit({
        ...state,
        experiments: state.experiments.map((e) =>
          e.id === id ? withHistory({ ...e, ...patch }, "experimento editado", who) : e,
        ),
      });
    },

    setStatus: (id, status) => {
      commit({
        ...state,
        experiments: state.experiments.map((e) =>
          e.id === id ? withHistory({ ...e, status }, "estado → " + status.toUpperCase(), who) : e,
        ),
      });
    },

    setResult: (id, result) => {
      commit({
        ...state,
        experiments: state.experiments.map((e) =>
          e.id === id
            ? withHistory({ ...e, result, endDate: today() }, "resultado registrado", who)
            : e,
        ),
      });
    },

    setDecision: (id, decision) => {
      commit({
        ...state,
        experiments: state.experiments.map((e) =>
          e.id === id ? withHistory({ ...e, decision }, "decisión → " + decision.value, who) : e,
        ),
      });
    },

    killExperiment: (id) => {
      const exp = state.experiments.find((e) => e.id === id);
      if (!exp) return;
      const now = new Date().toISOString();
      const gid = "g_" + Math.random().toString(36).slice(2, 8);
      const grave: GraveEntry = {
        id: gid,
        experimentId: exp.id,
        problema: exp.hypothesis,
        solucion: exp.offer,
        hipotesis: exp.hypothesis,
        ocurrio: exp.result?.occurred ?? "",
        porQueMurio: exp.decision?.reason ?? "",
        aprendizaje: exp.decision?.aprendizaje ?? "",
        reutilizable: "",
        createdAt: now,
        updatedAt: now,
        history: [{ at: now, by: who, what: "enviado al cementerio" }],
      };
      commit({
        ...state,
        experiments: state.experiments.map((e) =>
          e.id === id ? withHistory({ ...e, status: "KILLED" }, "estado → KILLED", who) : e,
        ),
        graveyard: [grave, ...state.graveyard],
      });
    },

    updateGrave: (id, patch) => {
      commit({
        ...state,
        graveyard: state.graveyard.map((g) =>
          g.id === id ? withHistory({ ...g, ...patch }, "entrada editada", who) : g,
        ),
      });
    },

    deleteGrave: (id) => {
      commit({ ...state, graveyard: state.graveyard.filter((g) => g.id !== id) });
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLab(): LabValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLab must be used within LabProvider");
  return v;
}