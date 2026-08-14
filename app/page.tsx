import type { ReactNode } from "react";
import IdeaBoard from "@/components/IdeaBoard";

// ─── Datos de la base de cómputos ──────────────────────────────────────────

const SYSTEMS = [
  { name: "Anthropic · Claude", url: "https://claude.ai", note: "Razonamiento + writing" },
  { name: "OpenAI", url: "https://platform.openai.com", note: "GPT, embeddings" },
  { name: "OpenRouter · DeepSeek", url: "https://openrouter.ai", note: "Router de modelos" },
  { name: "Google", url: "https://aistudio.google.com", note: "Gemini" },
  { name: "Groq", url: "https://console.groq.com", note: "Latencia baja" },
  { name: "Firecrawl", url: "https://firecrawl.dev", note: "Web → datos para agentes" },
];

const TOOLS = [
  { name: "Kilo", url: "https://kilo.ai/docs", note: "CLI de ingeniería" },
  { name: "OpenCode", url: "https://opencode.ai", note: "Agente de código" },
  { name: "Vercel", url: "https://vercel.com/dashboard", note: "Deploys" },
  { name: "GitHub", url: "https://github.com/Morpheus3232", note: "Código" },
  { name: "Namecheap", url: "https://www.namecheap.com", note: "Dominios / DNS" },
  { name: "Molino (repo)", url: "https://github.com/Morpheus3232/molino", note: "Caso de estudio" },
  { name: "VersionLimitada (repo)", url: "https://github.com/Morpheus3232/versionlimitada", note: "Este laboratorio" },
  { name: "Skills", url: "https://kilo.ai/docs/skills", note: "impeccable, gpt-taste, firecrawl" },
];

const PROJECTS = [
  {
    name: "Molino",
    tag: "web de muestra",
    links: { dev: "http://localhost:3000", prod: "https://molino.app" },
    stack: "Next.js · KV · Stripe/MP/PayPal · IA",
    online: true,
  },
  {
    name: "VersionLimitada",
    tag: "laboratorio",
    links: { dev: "http://localhost:3001", prod: "https://versionlimitada.online" },
    stack: "Next.js · Vercel · IA",
    online: true,
  },
];

const FLOW = [
  "Problema",
  "Investigación",
  "Hipótesis",
  "MVP",
  "Usuarios",
  "Pago",
  "Retención",
  "Iterar · Escalar · Matar",
];

const PRINCIPLES = [
  "Problemas antes que tecnología",
  "Valor antes que funcionalidades",
  "Usuarios antes que opiniones",
  "Ingresos antes que escala",
  "Simplicidad antes que arquitectura",
];

// ─── Bloques UI ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-zinc-800 py-14">
      <h2 className="mb-7 font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

function Card({
  href,
  name,
  note,
  online,
  external = true,
}: {
  href: string;
  name: string;
  note: string;
  online?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group flex items-start justify-between gap-3 border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
    >
      <div>
        <p className="text-sm font-semibold text-zinc-100 group-hover:text-zinc-50">
          {name}
        </p>
        <p className="mt-1 text-xs text-zinc-500">{note}</p>
      </div>
      <span
        aria-hidden
        className={`mt-1 h-2 w-2 shrink-0 ${
          online === false ? "bg-zinc-600" : "bg-emerald-400"
        }`}
      />
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-semibold tracking-tight">
              VersionLimitada
            </span>
            <span className="border border-zinc-700 px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              control
            </span>
          </div>
          <p className="hidden items-center gap-2 font-mono text-xs text-zinc-500 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse bg-emerald-400" />
            sistema en línea
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <p className="font-mono text-sm text-zinc-500">
            <span className="text-emerald-400">~/versionlimitada</span>
            $ base de cómputos
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Convertí ideas en
            <br />
            negocios rentables.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Esta es mi central: aquí están el motor de IA, las herramientas de
            programación y mis proyectos. Todo lo que necesito para pasar de una
            idea a un producto con usuarios y pago.
          </p>
        </section>

        {/* Motor de IA */}
        <Section title="01 · Motor de IA">
          <Grid>
            {SYSTEMS.map((s) => (
              <Card key={s.name} href={s.url} name={s.name} note={s.note} />
            ))}
          </Grid>
        </Section>

        {/* Herramientas */}
        <Section title="02 · Herramientas">
          <Grid>
            {TOOLS.map((t) => (
              <Card key={t.name} href={t.url} name={t.name} note={t.note} />
            ))}
          </Grid>
        </Section>

        {/* Proyectos */}
        <Section title="03 · Proyectos en vivo">
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECTS.map((p) => (
              <div
                key={p.name}
                className="border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    {p.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{p.stack}</p>
                <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
                  <Card
                    href={p.links.dev}
                    name="dev"
                    note="localhost"
                    online={true}
                    external={false}
                  />
                  <Card
                    href={p.links.prod}
                    name="prod"
                    note={p.links.prod.replace(/https?:\/\//, "")}
                    online={p.online}
                    external={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Pipeline */}
        <Section title="04 · De idea a negocio">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-400">
            {FLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="border border-zinc-700 px-3 py-1.5 text-zinc-300">
                  {step}
                </span>
                {i < FLOW.length - 1 && <span className="text-zinc-600">→</span>}
              </span>
            ))}
          </div>
        </Section>

        {/* Tablero de ideas */}
        <Section title="05 · Tablero de ideas">
          <IdeaBoard />
        </Section>

        {/* Principios */}
        <Section title="06 · Reglas del laboratorio">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <li
                key={p}
                className="border border-zinc-800 bg-zinc-900/40 px-4 py-4 text-sm text-zinc-300"
              >
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <footer className="border-t border-zinc-800 py-10 font-mono text-xs text-zinc-600">
          VersionLimitada · base de cómputos personal · datos de ideas guardados
          solo en tu navegador
        </footer>
      </div>
    </main>
  );
}