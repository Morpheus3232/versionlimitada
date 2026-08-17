/**
 * Capa pura de operaciones del laboratorio.
 *
 * Cada función recibe el estado actual y devuelve el estado nuevo (inmutable)
 * más el id generado cuando corresponde. Así la lógica es testeable y no depende
 * del ciclo de render de React: un click que "no hacía nada" no puede existir acá.
 */
import type {
  Experiment,
  ExperimentDecision,
  ExperimentResult,
  ExpStatus,
  Expediente,
  GraveEntry,
  LabState,
  Provenance,
  Signal,
} from "@/lib/lab/state";
import { nextNumber, today, withHistory } from "@/lib/lab/state";

// evidence vacía — las unidades se agregan desde el detalle del expediente
const EMPTY_EVIDENCE = () => [] as Expediente["evidence"];

export interface SignalInput {
  title: string;
  problem: string;
  source?: string;
  url?: string;
  sourceType?: string;
  evidence?: Provenance;
  notes?: string;
  tags?: string[];
}

export interface ExpedienteInput {
  title: string;
  problem: string;
  evidence: Expediente["evidence"];
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

export function newId(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

const now = () => new Date().toISOString();

/** Crea una señal. Solo se exige título y descripción; el resto toma valores por defecto. */
export function createSignal(s: LabState, inp: SignalInput, who: string): { state: LabState; id: string } {
  const id = newId("s");
  const sig: Signal = {
    id,
    title: inp.title.trim(),
    problem: inp.problem.trim(),
    source: inp.source?.trim() ?? "",
    url: inp.url?.trim() || undefined,
    date: today(),
    foundBy: who,
    sourceType: inp.sourceType ?? "otro",
    evidence: inp.evidence ?? "OBSERVED",
    notes: inp.notes ?? "",
    tags: inp.tags ?? [],
    status: "ABIERTA" as const,
    createdAt: now(),
    updatedAt: now(),
    history: [{ at: now(), by: who, what: "señal creada" }],
  };
  return { state: { ...s, signals: [sig, ...s.signals] }, id };
}

export function updateSignal(s: LabState, id: string, patch: Partial<Signal>, who: string): LabState {
  return {
    ...s,
    signals: s.signals.map((x) => (x.id === id ? withHistory({ ...x, ...patch }, "señal editada", who) : x)),
  };
}

export function discardSignal(s: LabState, id: string, who: string): LabState {
  return {
    ...s,
    signals: s.signals.map((x) =>
      x.id === id && x.status !== "CONVERTIDA"
        ? withHistory({ ...x, status: "DESCARTADA" as const }, "señal descartada", who)
        : x,
    ),
  };
}

export function restoreSignal(s: LabState, id: string, who: string): LabState {
  return {
    ...s,
    signals: s.signals.map((x) =>
      x.id === id ? withHistory({ ...x, status: "ABIERTA" as const }, "señal restaurada", who) : x,
    ),
  };
}

/** Convierte una señal en expediente (nadie copia a mano). Devuelve el id del expediente. */
export function convertSignal(s: LabState, id: string, who: string): { state: LabState; expId: string | null } {
  const sig = s.signals.find((x) => x.id === id);
  if (!sig || sig.status === "CONVERTIDA") return { state: s, expId: null };
  const expId = newId("ex");
  const number = nextNumber(s.expedientes.map((e) => e.number));
  const expo: Expediente = {
    id: expId,
    number,
    title: sig.title,
    status: "OPEN",
    problem: sig.problem,
    evidence: EMPTY_EVIDENCE(),
    opportunity: "",
    hypothesis: "",
    signalIds: [sig.id],
    experimentIds: [],
    createdAt: now(),
    updatedAt: now(),
    history: [{ at: now(), by: who, what: "expediente creado desde señal" }],
  };
  const state = {
    ...s,
    expedientes: [expo, ...s.expedientes],
    signals: s.signals.map((x) =>
      x.id === id
        ? withHistory({ ...x, status: "CONVERTIDA" as const, expedienteId: expId }, "convertida a expediente", who)
        : x,
    ),
  };
  return { state, expId };
}

export function createExpediente(
  s: LabState,
  inp: ExpedienteInput,
  signalId: string | undefined,
  who: string,
): { state: LabState; id: string } {
  const id = newId("ex");
  const number = nextNumber(s.expedientes.map((e) => e.number));
  const expo: Expediente = {
    id,
    number,
    title: inp.title.trim(),
    status: "OPEN",
    problem: inp.problem.trim(),
    evidence: inp.evidence,
    opportunity: inp.opportunity,
    hypothesis: inp.hypothesis,
    signalIds: signalId ? [signalId] : [],
    experimentIds: [],
    createdAt: now(),
    updatedAt: now(),
    history: [{ at: now(), by: who, what: "expediente creado" }],
  };
  return {
    state: {
      ...s,
      expedientes: [expo, ...s.expedientes],
      signals: signalId
        ? s.signals.map((x) =>
            x.id === signalId && x.status !== "CONVERTIDA"
              ? withHistory({ ...x, status: "CONVERTIDA" as const, expedienteId: id }, "enlazada a expediente", who)
              : x,
          )
        : s.signals,
    },
    id,
  };
}

export function updateExpediente(s: LabState, id: string, patch: Partial<Expediente>, who: string): LabState {
  return {
    ...s,
    expedientes: s.expedientes.map((e) =>
      e.id === id ? withHistory({ ...e, ...patch }, "expediente editado", who) : e,
    ),
  };
}

export function linkSignal(s: LabState, expId: string, signalId: string, who: string): LabState {
  return {
    ...s,
    expedientes: s.expedientes.map((e) =>
      e.id === expId && !e.signalIds.includes(signalId)
        ? withHistory({ ...e, signalIds: [...e.signalIds, signalId] }, "señal enlazada", who)
        : e,
    ),
    signals: s.signals.map((x) =>
      x.id === signalId
        ? withHistory({ ...x, status: "CONVERTIDA" as const, expedienteId: expId }, "enlazada a expediente", who)
        : x,
    ),
  };
}

export function unlinkSignal(s: LabState, expId: string, signalId: string, who: string): LabState {
  return {
    ...s,
    expedientes: s.expedientes.map((e) =>
      e.id === expId
        ? withHistory({ ...e, signalIds: e.signalIds.filter((x) => x !== signalId) }, "señal desenlazada", who)
        : e,
    ),
    signals: s.signals.map((x) =>
      x.id === signalId
        ? withHistory({ ...x, status: "ABIERTA" as const, expedienteId: undefined }, "desenlazada", who)
        : x,
    ),
  };
}

export function createExperiment(
  s: LabState,
  inp: ExperimentInput,
  who: string,
): { state: LabState; id: string } {
  const id = newId("exp");
  const number = nextNumber(s.experiments.map((e) => e.number));
  const expo: Experiment = {
    id,
    number,
    name: inp.name.trim(),
    expedienteId: inp.expedienteId,
    hypothesis: inp.hypothesis,
    offer: inp.offer,
    method: inp.method,
    metricPrimary: inp.metricPrimary,
    metricSecondary: inp.metricSecondary,
    status: inp.status,
    createdAt: now(),
    updatedAt: now(),
    history: [{ at: now(), by: who, what: "experimento creado" }],
  };
  return {
    state: {
      ...s,
      experiments: [expo, ...s.experiments],
      expedientes: inp.expedienteId
        ? s.expedientes.map((e) =>
            e.id === inp.expedienteId
              ? { ...e, experimentIds: [...new Set([...e.experimentIds, id])] }
              : e,
          )
        : s.expedientes,
    },
    id,
  };
}

export function updateExperiment(s: LabState, id: string, patch: Partial<Experiment>, who: string): LabState {
  return {
    ...s,
    experiments: s.experiments.map((e) =>
      e.id === id ? withHistory({ ...e, ...patch }, "experimento editado", who) : e,
    ),
  };
}

export function setStatus(s: LabState, id: string, status: ExpStatus, who: string): LabState {
  return {
    ...s,
    experiments: s.experiments.map((e) =>
      e.id === id ? withHistory({ ...e, status }, "estado → " + status.toUpperCase(), who) : e,
    ),
  };
}

export function setResult(s: LabState, id: string, result: ExperimentResult, who: string): LabState {
  return {
    ...s,
    experiments: s.experiments.map((e) =>
      e.id === id ? withHistory({ ...e, result, endDate: today() }, "resultado registrado", who) : e,
    ),
  };
}

export function setDecision(s: LabState, id: string, decision: ExperimentDecision, who: string): LabState {
  return {
    ...s,
    experiments: s.experiments.map((e) =>
      e.id === id ? withHistory({ ...e, decision }, "decisión → " + decision.value, who) : e,
    ),
  };
}

/** Envía un experimento al Cementerio (estado KILLED + entrada histórica reutilizable). */
export function killExperiment(s: LabState, id: string, who: string): LabState {
  const exp = s.experiments.find((e) => e.id === id);
  if (!exp) return s;
  const grave: GraveEntry = {
    id: newId("g"),
    experimentId: exp.id,
    problema: exp.hypothesis,
    solucion: exp.offer,
    hipotesis: exp.hypothesis,
    ocurrio: exp.result?.occurred ?? "",
    porQueMurio: exp.decision?.reason ?? "",
    aprendizaje: exp.decision?.aprendizaje ?? "",
    reutilizable: "",
    createdAt: now(),
    updatedAt: now(),
    history: [{ at: now(), by: who, what: "enviado al cementerio" }],
  };
  return {
    ...s,
    experiments: s.experiments.map((e) =>
      e.id === id ? withHistory({ ...e, status: "KILLED" }, "estado → KILLED", who) : e,
    ),
    graveyard: [grave, ...s.graveyard],
  };
}

export function updateGrave(s: LabState, id: string, patch: Partial<GraveEntry>, who: string): LabState {
  return {
    ...s,
    graveyard: s.graveyard.map((g) => (g.id === id ? withHistory({ ...g, ...patch }, "entrada editada", who) : g)),
  };
}

export function deleteGrave(s: LabState, id: string): LabState {
  return { ...s, graveyard: s.graveyard.filter((g) => g.id !== id) };
}

export function setMember(s: LabState, member: string): LabState {
  return { ...s, member };
}