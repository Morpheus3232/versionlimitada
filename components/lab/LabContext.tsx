"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
  Experiment,
  ExperimentDecision,
  ExperimentResult,
  ExpStatus,
  Expediente,
  GraveEntry,
  LabState,
  Signal,
} from "@/lib/lab/state";
import { seedState } from "@/lib/lab/state";
import * as store from "@/lib/lab/store";
import type { ExperimentInput, ExpedienteInput, SignalInput } from "@/lib/lab/store";

const LS_KEY = "vl.lab.v1";

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

function load(fallback: LabState): LabState {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as LabState;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.expedientes)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function LabProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LabState>(() => seedState());

  useEffect(() => {
    const stored = load(seedState());
    setState(stored);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LS_KEY, JSON.stringify(stored));
    }
  }, []);

  const commit = (next: LabState) => {
    setState(next);
    if (typeof window !== "undefined") window.localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const who = state.member || "yo";

  const value: LabValue = {
    state,
    member: state.member,

    setMember: (m) => commit(store.setMember(state, m)),

    createSignal: (inp) => {
      const r = store.createSignal(state, inp, who);
      commit(r.state);
      return r.id;
    },
    updateSignal: (id, patch) => commit(store.updateSignal(state, id, patch, who)),
    discardSignal: (id) => commit(store.discardSignal(state, id, who)),
    restoreSignal: (id) => commit(store.restoreSignal(state, id, who)),
    convertSignalToExpediente: (id) => {
      const r = store.convertSignal(state, id, who);
      commit(r.state);
      return r.expId;
    },

    createExpediente: (inp, signalId) => {
      const r = store.createExpediente(state, inp, signalId, who);
      commit(r.state);
      return r.id;
    },
    updateExpediente: (id, patch) => commit(store.updateExpediente(state, id, patch, who)),
    linkSignal: (expId, signalId) => commit(store.linkSignal(state, expId, signalId, who)),
    unlinkSignal: (expId, signalId) => commit(store.unlinkSignal(state, expId, signalId, who)),

    createExperiment: (inp) => {
      const r = store.createExperiment(state, inp, who);
      commit(r.state);
      return r.id;
    },
    updateExperiment: (id, patch) => commit(store.updateExperiment(state, id, patch, who)),
    setStatus: (id, status) => commit(store.setStatus(state, id, status, who)),
    setResult: (id, result) => commit(store.setResult(state, id, result, who)),
    setDecision: (id, decision) => commit(store.setDecision(state, id, decision, who)),
    killExperiment: (id) => commit(store.killExperiment(state, id, who)),

    updateGrave: (id, patch) => commit(store.updateGrave(state, id, patch, who)),
    deleteGrave: (id) => commit(store.deleteGrave(state, id)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLab(): LabValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLab must be used within LabProvider");
  return v;
}