import type { ReactNode } from "react";
import Pipeline, { type CircuitStep } from "@/components/machine/Pipeline";
import Estado from "@/components/machine/Estado";
import Signals from "@/components/machine/Signals";
import Opportunities from "@/components/machine/Opportunities";
import Experiments from "@/components/machine/Experiments";
import Graveyard from "@/components/machine/Graveyard";
import { SIGNALS, OPPORTUNITIES, EXPERIMENTS, GRAVEYARD } from "@/lib/machine/data";

// ─── Estructura editorial: la home es el estado vivo de la máquina. ─────────
function Section({ id, eyebrow, title, children }: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          <span aria-hidden className="inline-block h-px w-6 bg-accent/60" />
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const designed = EXPERIMENTS.filter((e) => e.state === "PLANNED").length;
  const executed = EXPERIMENTS.filter((e) => e.state !== "PLANNED").length;
  const results = EXPERIMENTS.filter((e) => e.state === "RUNNING" || e.state === "CONCLUDED").length;
  const decisions = EXPERIMENTS.filter((e) => Boolean(e.decision)).length;
  const openExpediente = OPPORTUNITIES.length;

  const steps: CircuitStep[] = [
    { label: "Señal", state: `${SIGNALS.length} observadas`, tone: "on" },
    { label: "Problema", state: "detectado", tone: "on" },
    { label: "Evidencia", state: "clasificada", tone: "on" },
    { label: "Oportunidad", state: "expediente #001", tone: "on" },
    { label: "Hipótesis", state: "definida", tone: "on" },
    { label: "Experimento", state: "diseñado · no lanzado", tone: "on" },
    { label: "Resultado", state: "sin datos", tone: "empty" },
    { label: "Decisión", state: "pendiente", tone: "empty" },
  ];

  const heroStats = [
    { v: String(SIGNALS.length), l: "señales" },
    { v: String(openExpediente), l: "expediente" },
    { v: String(designed), l: "experimento listo" },
    { v: String(results), l: "resultados" },
  ];

  return (
    <>
      {/* Hero — estado operativo, no pitch */}
      <div className="relative isolate">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <p className="font-mono text-sm text-muted">
            <span className="text-accent">~/versionlimitada</span> $ máquina de evidencia
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">máquina de evidencia</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
            No construimos lo que suena bien.{" "}
            <span className="text-accent">Construimos lo que se demuestra.</span>
          </h1>

          {/* Estado operativo inline */}
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-linesoft sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.l} className="bg-panel px-5 py-4">
                <p className="font-mono text-3xl font-bold text-ink">{s.v}</p>
                <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-wide text-muted">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#expediente"
              className="inline-flex items-center rounded-[10px] bg-accent px-5 py-3 font-heading text-sm font-bold text-paper transition hover:bg-accenthover"
            >
              Ver expediente #001 →
            </a>
            <a
              href="#senal"
              className="inline-flex items-center rounded-[10px] border border-line px-5 py-3 font-heading text-sm font-semibold text-ink transition hover:border-accent/60 hover:text-accent"
            >
              Ver radar
            </a>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* La cadena — circuito interno con estados visibles */}
        <section className="border-t border-line py-14 sm:py-16">
          <div className="mx-auto max-w-3xl lg:grid lg:grid-cols-[1fr_1.15fr] lg:gap-10">
            <p className="mb-3 max-w-xs font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              el circuito<br />del problema a la decisión
            </p>
            <Pipeline steps={steps} />
          </div>
        </section>

        {/* Estado del sistema */}
        <Section id="estado" eyebrow="estado · ahora" title="Estado del sistema">
          <div className="max-w-xl">
            <Estado
              signals={SIGNALS.length}
              problems={openExpediente}
              designed={designed}
              executed={executed}
              results={results}
              decisions={decisions}
            />
          </div>
        </Section>

        {/* Radar de señales */}
        <Section id="senal" eyebrow="radar · observamos" title="Radar de señales">
          <Signals signals={SIGNALS} />
        </Section>

        {/* Expediente #001 */}
        <Section id="expediente" eyebrow="expediente · investigamos" title="Expediente #001">
          <Opportunities items={OPPORTUNITIES} experiments={EXPERIMENTS} />
        </Section>

        {/* Experimentos */}
        <Section id="experimentos" eyebrow="probamos" title="Experimentos">
          <Experiments items={EXPERIMENTS} />
        </Section>

        {/* Cementerio */}
        <Section id="cementerio" eyebrow="matamos" title="Cementerio">
          <Graveyard items={GRAVEYARD} />
        </Section>
      </div>
    </>
  );
}