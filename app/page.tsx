import type { ReactNode } from "react";
import Pipeline from "@/components/machine/Pipeline";
import Estado from "@/components/machine/Estado";
import Signals from "@/components/machine/Signals";
import Opportunities from "@/components/machine/Opportunities";
import Experiments from "@/components/machine/Experiments";
import Graveyard from "@/components/machine/Graveyard";
import { ProvenanceKey } from "@/components/machine/Provenance";
import { SIGNALS, OPPORTUNITIES, EXPERIMENTS, GRAVEYARD, NOTE } from "@/lib/machine/data";

// ─── Estructura editorial: la home es el estado vivo de la máquina ──────────
function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          <span aria-hidden className="inline-block h-px w-6 bg-accent/60" />
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {lead && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{lead}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const activeExperiments = EXPERIMENTS.filter((e) => e.state === "RUNNING").length;

  return (
    <>
      {/* Hero — la tesis */}
      <div className="relative isolate">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <p className="font-mono text-sm text-muted">
            <span className="text-accent">~/versionlimitada</span> $ máquina de evidencia —{" "}
            <span className="text-dim">build what proves itself</span>
          </p>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
            No construimos lo que suena bien.{" "}
            <span className="text-accent">Construimos lo que se demuestra.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            VersionLimitada encuentra problemas reales, reúne evidencia, prueba
            hipótesis y decide qué merece ser construido. Aquí no se vende hype:
            se muestra qué se observó, qué se supuso, qué se probó y qué ocurrió.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#expediente"
              className="inline-flex items-center rounded-[10px] bg-accent px-5 py-3 font-heading text-sm font-bold text-paper transition hover:bg-accenthover"
            >
              Ver el expediente #001 →
            </a>
            <a
              href="#senal"
              className="inline-flex items-center rounded-[10px] border border-line px-5 py-3 font-heading text-sm font-semibold text-ink transition hover:border-accent/60 hover:text-accent"
            >
              Radar de señales
            </a>
          </div>
          <div className="mt-8 flex max-w-2xl flex-wrap items-center gap-3">
            <ProvenanceKey />
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* La cadena */}
        <section className="border-t border-line py-14">
          <div className="flex items-end justify-between gap-4 pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              la cadena · cómo opera la máquina
            </p>
            <p className="hidden font-mono text-[11px] text-dim sm:block">
              señal → problema → evidencia → oportunidad → hipótesis → experimento → resultado → decisión
            </p>
          </div>
          <Pipeline />
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-dim">{NOTE}</p>
        </section>

        {/* Estado de la máquina */}
        <Section
          id="estado"
          eyebrow="estado · la máquina ahora"
          title="Estado de la máquina"
          lead="Las cifras son las que realmente existen hoy. Si algo no tiene datos, no se inventa."
        >
          <Estado
            signals={SIGNALS.length}
            problems={OPPORTUNITIES.length}
            activeExperiments={activeExperiments}
          />
        </Section>

        {/* Radar de señales */}
        <Section
          id="senal"
          eyebrow="radar · entrada de la máquina"
          title="Radar de señales"
          lead="Señales de dolor observable con origen y fuente pública. La máquina no junta ocurrencias: junta afirmaciones que se pueden verificar."
        >
          <Signals signals={SIGNALS} />
        </Section>

        {/* Expediente */}
        <Section
          id="expediente"
          eyebrow="expediente · caso abierto"
          title="Expediente #001"
          lead="Cuando una señal reúne evidencia, se abre un expediente. Cada afirmación declara su naturaleza — observada, inferida, estimada o propuesta por la máquina — y la decisión build / iterate / kill queda pendiente de resultados."
        >
          <Opportunities items={OPPORTUNITIES} experiments={EXPERIMENTS} />
        </Section>

        {/* Experimentos */}
        <Section
          id="experimentos"
          eyebrow="probando · experimentation lab"
          title="Experimentos"
          lead="Primero se prueba con una oferta y un CTA, antes de construir nada. Mientras no haya un experimento corriendo con tráfico real, se declara la infraestructura lista."
        >
          <Experiments items={EXPERIMENTS} />
        </Section>

        {/* Cementerio */}
        <Section
          id="cementerio"
          eyebrow="decidiendo · el cementerio"
          title="Cementerio"
          lead="Los experimentos que terminan en kill son activos de conocimiento. Si no hay ninguno todavía, se dice."
        >
          <Graveyard items={GRAVEYARD} />
        </Section>
      </div>
    </>
  );
}