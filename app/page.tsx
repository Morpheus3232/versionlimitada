import type { ReactNode } from "react";
import IdeaBoard from "@/components/IdeaBoard";

// ─── Instrumentos (datos de la central) ─────────────────────────────────────
const SYSTEMS = [
  { name: "Anthropic · Claude", url: "https://claude.ai", note: "Razonamiento y redacción" },
  { name: "OpenAI", url: "https://platform.openai.com", note: "GPT y embeddings" },
  { name: "OpenRouter · DeepSeek", url: "https://openrouter.ai", note: "Router de modelos" },
  { name: "Google", url: "https://aistudio.google.com", note: "Gemini" },
  { name: "Groq", url: "https://console.groq.com", note: "Inferencia de baja latencia" },
  { name: "Firecrawl", url: "https://firecrawl.dev", note: "Web → datos para agentes" },
];

const TOOLS = [
  { name: "Kilo", url: "https://kilo.ai/docs", note: "CLI de ingeniería" },
  { name: "OpenCode", url: "https://opencode.ai", note: "Agente de código" },
  { name: "Vercel", url: "https://vercel.com/dashboard", note: "Despliegues" },
  { name: "GitHub", url: "https://github.com/Morpheus3232", note: "Código y CI" },
  { name: "Namecheap", url: "https://www.namecheap.com", note: "Dominios y DNS" },
  { name: "Molino", url: "https://github.com/Morpheus3232/molino", note: "Caso de estudio" },
  { name: "VersionLimitada", url: "https://github.com/Morpheus3232/versionlimitada", note: "Este laboratorio" },
  { name: "Skills", url: "https://kilo.ai/docs/skills", note: "Impeccable · gpt-taste · firecrawl" },
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
    online: true,
  },
  {
    name: "VersionLimitada",
    tag: "laboratorio",
    dev: "http://localhost:3001",
    prod: "https://versionlimitada.online",
    stack: "Next.js · Vercel · IA",
    online: true,
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
  { href: "#pipeline", label: "Pipeline" },
  { href: "#ideas", label: "Tablero de ideas" },
];

// ─── Bloques ────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/90">
      <span aria-hidden className="inline-block h-px w-6 bg-cyan-400/60" />
      {children}
    </h2>
  );
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[#161c29] py-16">
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
        <p className="font-mono text-sm font-semibold text-[#f2f5fa] group-hover:text-cyan-200">
          {name}
        </p>
        <p className="mt-1.5 text-xs text-[#9aa4b8]">{note}</p>
      </div>
      <span aria-hidden className="mt-0.5 text-[#5c6679] transition-transform group-hover:translate-x-1 group-hover:text-cyan-300">
        →
      </span>
    </a>
  );
}

function StatusCell({ value, unit, on }: { value: string; unit: string; on: boolean }) {
  return (
    <div className="border border-[#161c29] bg-[#0a0d14] px-5 py-4">
      <p className="font-mono text-2xl font-bold text-[#f2f5fa]">
        {value}
        <span aria-hidden className="ml-1 h-1.5 w-1.5 inline-block align-middle rounded-full"
          style={{ background: on ? "var(--vl-cyan)" : "var(--vl-dim)" }} />
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[#5c6679]">
        {unit}
      </p>
    </div>
  );
}

function Orb() {
  return (
    <div aria-hidden className="relative flex items-center justify-center">
      <div className="vl-orb">
        <div className="vl-orb-corona" />
        <div className="vl-orb-scrim" />
        <div className="vl-orb-core" />
        <div className="vl-orb-ring" />
        <div className="vl-orb-sats">
          <span className="vl-sat" style={{ top: "12%", left: "60%" }} />
          <span className="vl-sat" style={{ top: "70%", left: "18%" }} />
          <span className="vl-sat" style={{ top: "58%", left: "82%" }} />
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
      <header className="sticky top-0 z-20 border-b border-[#161c29] glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <a href="#" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(94,224,255,0.9)]" />
            VersionLimitada
            <span className="ml-1 hidden border border-[#2a3348] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#9aa4b8] sm:inline">
              control
            </span>
          </a>
          <nav aria-label="Principal" className="hidden items-center gap-1 font-mono text-xs text-[#9aa4b8] lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="px-3 py-2 transition-colors hover:text-cyan-200">
                {n.label}
              </a>
            ))}
          </nav>
          <p className="flex items-center gap-2 font-mono text-xs text-emerald-300">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">sistema en línea</span>
          </p>
        </div>
      </header>

      {/* Hero */}
      <div className="relative isolate overflow-hidden">
        <div className="vl-sky" aria-hidden />
        <div className="vl-grid" aria-hidden />

        <section id="principal" className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_0.85fr]">
            <div>
              <p className="vl-enter d1 font-mono text-sm text-[#9aa4b8]">
                <span className="text-cyan-300">~/versionlimitada</span> $ base de cómputos
              </p>
              <h1 className="vl-enter d2 mt-5 text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.2rem]">
                Convierte{" "}
                cada idea en un
                <br className="hidden sm:block" />{" "}
                <span className="vl-grad">negocio rentable<span className="vl-blink" aria-hidden /></span>
              </h1>
              <p className="vl-enter d3 mt-6 max-w-xl text-lg leading-relaxed text-[#9aa4b8]">
                Esta es mi central de mando: el motor de IA, las herramientas de
                programación y mis proyectos al alcance. Todo lo que necesito para
                pasar de una idea a un producto con usuarios y pago.
              </p>
              <div className="vl-enter d4 mt-8 flex flex-wrap gap-3">
                <a
                  href="#ideas"
                  className="inline-flex items-center bg-cyan-300 px-6 py-3 font-mono text-sm font-bold text-[#05060a] transition hover:bg-cyan-200"
                >
                  Abrir tablero de ideas
                </a>
                <a
                  href="#motor"
                  className="inline-flex items-center border border-[#2a3348] px-6 py-3 font-mono text-sm font-semibold text-[#f2f5fa] transition hover:border-cyan-400/60 hover:text-cyan-200"
                >
                  Ver motor de IA
                </a>
              </div>
            </div>

            <div className="vl-enter d3 hidden items-center justify-center lg:flex">
              <Orb />
            </div>
          </div>

          {/* Telemetría */}
          <dl className="vl-enter d5 mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TELEMETRY.map((m) => (
              <StatusCell key={m.label} value={m.value} unit={`${m.label} · ${m.unit}`} on={m.on} />
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
            className="border border-[#1d2433] px-3 py-1.5 font-mono text-xs text-[#9aa4b8] transition hover:border-cyan-400/50 hover:text-cyan-200"
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
                  <h3 className="font-mono text-lg font-bold text-[#f2f5fa]">{p.name}</h3>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-emerald-300">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {p.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#9aa4b8]">{p.stack}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                  <a href={p.dev} className="border border-[#1d2433] px-4 py-3 text-[#9aa4b8] transition hover:border-cyan-400/50 hover:text-cyan-200">
                    <span className="block text-[#5c6679]">DEV</span>
                    <span className="mt-0.5 block truncate">{p.dev.replace(/^https?:\/\//, "")}</span>
                  </a>
                  <a href={p.prod} className="border border-[#1d2433] px-4 py-3 text-[#9aa4b8] transition hover:border-cyan-400/50 hover:text-cyan-200">
                    <span className="block text-[#5c6679]">PRODUCCIÓN</span>
                    <span className="mt-0.5 block truncate">{p.prod.replace(/^https?:\/\//, "")}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="pipeline">
          <Eyebrow>04 · De idea a negocio</Eyebrow>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {FLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className={`border px-3 py-2 ${
                    i === FLOW.length - 1
                      ? "border-amber-400/50 text-amber-200"
                      : "border-[#1d2433] text-[#c6cfe0]"
                  }`}
                >
                  {step}
                </span>
                {i < FLOW.length - 1 && <span aria-hidden className="text-[#5c6679]">→</span>}
              </span>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs text-[#5c6679] lg:hidden">
            Cada fase se completa en orden: el producto se itera, escala o se descarta.
          </p>
        </Section>

        <Section id="ideas">
          <Eyebrow>05 · Tablero de ideas</Eyebrow>
          <div className="cell p-6">
            <p className="mb-5 max-w-2xl text-sm text-[#9aa4b8]">
              Capturá una idea y avanzala en el pipeline. Solo se guarda en tu
              navegador — nadie más la ve.
            </p>
            <IdeaBoard />
          </div>
        </Section>

        <Section id="reglas">
          <Eyebrow>06 · Reglas del laboratorio</Eyebrow>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PRINCIPLES.map((p) => (
              <li key={p} className="cell p-5 text-sm leading-snug text-[#c6cfe0]">
                {p}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <footer className="border-t border-[#161c29]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 font-mono text-xs text-[#5c6679] sm:flex-row sm:items-center">
          <p>VersionLimitada · base de cómputos personal</p>
          <p>Las ideas se guardan solo en tu navegador</p>
        </div>
      </footer>
    </>
  );
}