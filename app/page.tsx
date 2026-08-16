import type { ReactNode } from "react";
import Pipeline from "@/components/machine/Pipeline";
import Signals from "@/components/machine/Signals";
import Opportunities from "@/components/machine/Opportunities";
import Experiments from "@/components/machine/Experiments";
import Graveyard from "@/components/machine/Graveyard";
import { ProvenanceKey } from "@/components/machine/Provenance";
import { SIGNALS, OPPORTUNITIES, EXPERIMENTS, GRAVEYARD, NOTE } from "@/lib/machine/data";

// ─── Estructura editorial: la homepage es el expediente vivo de la máquina ──
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
  return (
    <>
      {/* Hero — la tesis, no el pitch */}
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
            VersionLimitada es una máquina que busca dolor real, lo documenta en
            expedientes, corre experimentos y acumula evidencia para decidir{" "}
            <span className="font-mono text-xs">build / iterate / kill</span>. Aquí
            no dan ideas ni puntajes inventados: muestran qué se encontró, qué se
            probó, qué hizo la gente y qué se decidió.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#senal"
              className="inline-flex items-center rounded-[10px] bg-accent px-5 py-3 font-heading text-sm font-bold text-paper transition hover:bg-accenthover"
            >
              Ver señales →
            </a>
            <a
              href="#oportunidades"
              className="inline-flex items-center rounded-[10px] border border-line px-5 py-3 font-heading text-sm font-semibold text-ink transition hover:border-accent/60 hover:text-accent"
            >
              Expediente abierto
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
              señal → problema → anatomía → oportunidad → hipótesis → experimento → evidencia → decisión
            </p>
          </div>
          <Pipeline />
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-dim">{NOTE}</p>
        </section>

        {/* Buscar */}
        <Section
          id="senal"
          eyebrow="buscando · entrada"
          title="Señales de dolor real"
          lead="La máquina no junta ideas: junta afirmaciones observables de que algo molesta. Cada señal trae su origen y, si ya se contó, el número de menciones independientes (observado, no opinado)."
        >
          <Signals signals={SIGNALS} />
        </Section>

        {/* Encontrado */}
        <Section
          id="oportunidades"
          eyebrow="encontrado · expediente abierto"
          title="Expediente #001"
          lead="Cuando una señal reúne evidencia, se abre un expediente con anatomía del problema, competencia y un Evidence Score que separa hechos de inferencias y de sugerencias de la IA."
        >
          <Opportunities items={OPPORTUNITIES} />
        </Section>

        {/* Probar */}
        <Section
          id="experimentos"
          eyebrow="probando · experimentation lab"
          title="Experimentos corriendo"
          lead="Un expediente con evidencia no construye un SaaS: primero se arma una oferta, se lanza un CTA y se mide intención frente a dinero. Aquí los ceros son honestos hasta que dejen de serlo."
        >
          <Experiments items={EXPERIMENTS} />
        </Section>

        {/* Decidir */}
        <Section
          id="cementerio"
          eyebrow="decidiendo · el cementerio"
          title="Muertos con aprendizaje"
          lead="Los experimentos que terminan en kill no se esconden: son activos. Un fracaso medido enseña más que diez aciertos no probados."
        >
          <Graveyard items={GRAVEYARD} />
        </Section>
      </div>
    </>
  );
}