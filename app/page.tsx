import type { ReactNode } from "react";
import IdeaBoard from "@/components/IdeaBoard";
import Radar from "@/components/Radar";

// ─── Instrumentos (datos de la central) ─────────────────────────────────────
const SYSTEMS = [
  { url: "https://claude.ai", name: "Anthropic · Claude", note: "Razonamiento y redacción" },
  { url: "https://platform.openai.com", name: "OpenAI", note: "GPT y embeddings" },
  { url: "https://openrouter.ai", name: "OpenRouter · DeepSeek", note: "Router de modelos" },
  { url: "https://aistudio.google.com", name: "Google", note: "Gemini" },
  { url: "https://console.groq.com", name: "Groq", note: "Inferencia de baja latencia" },
  { url: "https://firecrawl.dev", name: "Firecrawl", note: "Web → datos para agentes" },
];

const TOOLS = [
  { url: "https://kilo.ai/docs", name: "Kilo", note: "CLI de ingeniería" },
  { url: "https://opencode.ai", name: "OpenCode", note: "Agente de código" },
  { url: "https://vercel.com/dashboard", name: "Vercel", note: "Despliegues" },
  { url: "https://github.com/Morpheus3232", name: "GitHub", note: "Código y CI" },
  { url: "https://www.namecheap.com", name: "Namecheap", note: "Dominios y DNS" },
  { url: "https://github.com/Morpheus3232/molino", name: "Molino", note: "Caso de estudio" },
  { url: "https://github.com/Morpheus3232/versionlimitada", name: "VersionLimitada", note: "Este laboratorio" },
  { url: "https://kilo.ai/docs/skills", name: "Skills", note: "Impeccable · gpt-taste · firecrawl" },
];

const TELEMETRY = [
  { label: "Motor de IA", value: "6", unit: "proveedores", on: true },
  { label: "Herramientas", value: "8", unit: "conectadas", on: true },
  { label: "Proyectos", value: "2", unit: "en vivo", on: true },
  { label: "Pipeline", value: "8", unit: "fases activas", on: true },
];

const PROJECTS = [
  {
    name: "Molino",
    tag: "web de muestra",
    dev: "http://localhost:3000",
    prod: "https://molino.app",
    stack: "Next.js · KV · Pagos · IA",
  },
  {
    name: "VersionLimitada",
    tag: "laboratorio",
    dev: "http://localhost:3001",
    prod: "https://versionlimitada.online",
    stack: "Next.js · Vercel · IA",
  },
];

const FLOW = ["Problema", "Investigación", "Hipótesis", "MVP", "Usuarios", "Pago", "Retención", "Iterar · Escalar · Matar"];

const PRINCIPLES = [
  "Problemas antes que tecnología",
  "Valor antes que funcionalidades",
  "Usuarios antes que opiniones",
  "Ingresos antes que escala",
  "Simplicidad antes que arquitectura",
];

const NAV = [
  { href: "#motor", label: "Motor de IA" },
  { href: "#herramientas", label: "Herramientas" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#radar", label: "Radar de ideas" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#ideas", label: "Tablero" },
];

// ─── Bloques ────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 font-heading text-xs uppercase tracking-[0.3em] text-accent">
      <span aria-hidden className="inline-block h-px w-6 bg-accent/50" />
      {children}
    </h2>
  );
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-linesoft py-16">
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

function Cell({ url, name, note }: { url: string; name: string; note: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="cell group flex items-start justify-between gap-3 p-5"
    >
      <div>
        <p className="font-heading text-sm font-semibold text-ink group-hover:text-accenthover">
          {name}
        </p>
        <p className="mt-1.5 text-xs text-muted">{note}</p>
      </div>
      <span aria-hidden className="mt-0.5 text-dim transition-transform group-hover:translate-x-1 group-hover:text-accent">
        →
      </span>
    </a>
  );
}

function StatusCell({ label, value, unit, on }: { label: string; value: string; unit: string; on: boolean }) {
  return (
    <div className="rounded-[10px] border border-line bg-panel px-5 py-4">
      <p className="font-heading text-2xl font-bold text-ink">
        {value}
        <span
          aria-hidden
          className="ml-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
          style={{ background: on ? "var(--color-accent)" : "var(--color-dim)" }}
        />
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-dim">
        {label} · {unit}
      </p>
    </div>
  );
}

function Orb() {
  return (
    <div aria-hidden className="relative flex items-center justify-center">
      <div className="relative h-[220px] w-[220px]">
        <div className="orb-corona" />
        <div className="orb-scrim" />
        <div className="orb-core" />
        <div className="orb-ring" />
        <div className="orb-sats">
          <span className="sat" style={{ top: "12%", left: "60%" }} />
          <span className="sat" style={{ top: "70%", left: "18%" }} />
          <span className="sat" style={{ top: "58%", left: "82%" }} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a href="#principal" className="skip-link">
        Saltar al contenido
      </a>

      {/* Barra superior */}
      <header className="glass sticky top-0 z-20 border-b border-linesoft">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <a href="#" className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(124,140,255,0.9)]" />
            VersionLimitada
            <span className="ml-1 hidden border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted sm:inline">
              código abierto
            </span>
          </a>
          <nav aria-label="Principal" className="hidden items-center gap-1 font-mono text-xs text-muted lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-[6px] px-3 py-2 transition-colors hover:text-accent">
                {n.label}
              </a>
            ))}
          </nav>
          <p className="flex items-center gap-2 font-mono text-xs text-muted">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="hidden sm:inline">sistema en línea</span>
          </p>
        </div>
      </header>

      {/* Hero */}
      <div className="relative isolate overflow-hidden">
        <div className="sky" aria-hidden />
        <div className="grid" aria-hidden />

        <section id="principal" className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_0.85fr]">
            <div>
              <p className="enter d1 font-mono text-sm text-muted">
                <span className="text-accent">~/versionlimitada</span> $ base de cómputos
              </p>
              <h1 className="enter d2 mt-5 text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.2rem]">
                Convierte{" "}
                cada idea en un
                <br className="hidden sm:block" />{" "}
                <span className="grad">
                  negocio rentable<span className="blink" aria-hidden />
                </span>
              </h1>
              <p className="enter d3 mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Esta es mi central de mando: el motor de IA, las herramientas de
                programación y mis proyectos al alcance. Código abierto, para que
                la utilidad también sea de todos.
              </p>
              <div className="enter d4 mt-8 flex flex-wrap gap-3">
                <a
                  href="#ideas"
                  className="inline-flex items-center rounded-[10px] bg-gold px-6 py-3 font-heading text-sm font-bold text-paper transition hover:brightness-110"
                >
                  Abrir tablero de ideas
                </a>
                <a
                  href="#motor"
                  className="inline-flex items-center rounded-[10px] border border-line px-6 py-3 font-heading text-sm font-semibold text-ink transition hover:border-accent/60 hover:text-accent"
                >
                  Ver motor de IA
                </a>
              </div>
              <p className="enter d5 mt-6 flex items-center gap-2 font-mono text-[11px] text-dim">
                <span aria-hidden className="inline-block h-3 w-3 rounded-[4px] bg-[#131315] text-center leading-3 text-gold">★</span>
                MIT · de código abierto · incrustable
              </p>
            </div>

            <div className="enter d3 hidden items-center justify-center lg:flex">
              <Orb />
            </div>
          </div>

          {/* Telemetría */}
          <dl className="enter d5 mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TELEMETRY.map((m) => (
              <StatusCell key={m.label} label={m.label} value={m.value} unit={m.unit} on={m.on} />
            ))}
          </dl>
        </section>
      </div>

      {/* Índice rápido (mobile/tablet) */}
      <nav aria-label="Secciones" className="mx-auto -mt-2 flex max-w-6xl flex-wrap gap-2 px-6 lg:hidden">
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className="rounded-[6px] border border-line px-3 py-1.5 font-mono text-xs text-muted transition hover:border-accent/50 hover:text-accent"
          >
            {n.label}
          </a>
        ))}
      </nav>

      <div className="mx-auto max-w-6xl px-6">
        <Section id="motor">
          <Eyebrow>01 · Motor de IA</Eyebrow>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SYSTEMS.map((s) => (
              <Cell key={s.name} {...s} />
            ))}
          </div>
        </Section>

        <Section id="herramientas">
          <Eyebrow>02 · Herramientas</Eyebrow>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((t) => (
              <Cell key={t.name} {...t} />
            ))}
          </div>
        </Section>

        <Section id="proyectos">
          <Eyebrow>03 · Proyectos en vivo</Eyebrow>
          <div className="grid gap-4 lg:grid-cols-2">
            {PROJECTS.map((p) => (
              <article key={p.name} className="cell p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-ink">{p.name}</h3>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {p.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted">{p.stack}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                  <a
                    href={p.dev}
                    className="rounded-[10px] border border-line px-4 py-3 text-muted transition hover:border-accent/50 hover:text-accent"
                  >
                    <span className="block text-dim">DEV</span>
                    <span className="mt-0.5 block truncate">{p.dev.replace(/^https?:\/\//, "")}</span>
                  </a>
                  <a
                    href={p.prod}
                    className="rounded-[10px] border border-line px-4 py-3 text-muted transition hover:border-accent/50 hover:text-accent"
                  >
                    <span className="block text-dim">PRODUCCIÓN</span>
                    <span className="mt-0.5 block truncate">{p.prod.replace(/^https?:\/\//, "")}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="radar">
          <Eyebrow>04 · Radar de ideas</Eyebrow>
          <Radar />
        </Section>

        <Section id="pipeline">
          <Eyebrow>05 · De idea a negocio</Eyebrow>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {FLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className={`rounded-[6px] border px-3 py-2 ${
                    i === FLOW.length - 1
                      ? "border-gold/50 text-gold"
                      : "border-line text-muted"
                  }`}
                >
                  {step}
                </span>
                {i < FLOW.length - 1 && <span aria-hidden className="text-dim">→</span>}
              </span>
            ))}
          </div>
        </Section>

        <Section id="ideas">
          <Eyebrow>06 · Tablero de ideas</Eyebrow>
          <div className="cell p-6">
            <p className="mb-5 max-w-2xl text-sm text-muted">
              Capturá una idea y avanzala en el pipeline. Vive en tu navegador.
            </p>
            <IdeaBoard />
          </div>
        </Section>

        <Section id="reglas">
          <Eyebrow>07 · Reglas del laboratorio</Eyebrow>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PRINCIPLES.map((p) => (
              <li key={p} className="cell p-5 text-sm leading-snug text-muted">
                {p}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <footer className="border-t border-linesoft">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 font-mono text-xs text-dim sm:flex-row sm:items-center">
          <p>VersionLimitada · base de cómputos · código abierto (MIT)</p>
          <p>Síntonia visual con molino.app</p>
        </div>
      </footer>
    </>
  );
}