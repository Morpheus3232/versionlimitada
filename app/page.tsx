import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VersionLimitada — laboratorio de ideas",
  description:
    "Sistema operativo del laboratorio: señales, expedientes, hipótesis, experimentos, resultados y decisiones build / iterate / kill.",
};

const year = new Date().getFullYear();

function PulseDot() {
  return (
    <span
      className="relative inline-block w-2 h-2 rounded-full bg-gold animate-pulse"
      style={{ animationDuration: "1.5s" }}
      aria-hidden="true"
    />
  );
}

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function RadarIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      <path d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12a10 10 0 0 1 20 0" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group cell p-6 flex flex-col gap-4 hover:border-accent transition-colors duration-200"
    >
      <div className="text-accent">{icon}</div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-ink group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-dim leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2 transition-all">
        <span>Ver</span>
        <ArrowIcon />
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* SECCIÓN 1: HERO */}
      <section className="relative py-20 sm:py-28 lg:py-32 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-mono uppercase tracking-widest mb-8">
          <PulseDot />
          LABORATORIO ACTIVO
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] max-w-4xl mx-auto mb-6">
          No construimos lo que suena bien.{" "}
          <span className="text-accent">Construimos lo que se demuestra.</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Validá problemas con nuestro radar, construí webs con IA, consultá guías de patentes y
          gestioná tu cómputo con total transparencia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/construir"
            className="w-full sm:w-auto px-8 py-4 rounded-[8px] bg-accent text-paper font-heading font-semibold text-base hover:bg-accenthover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Construir Web con IA
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 rounded-[8px] border border-line bg-transparent text-ink font-heading font-semibold text-base hover:bg-panel hover:border-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Ver Estado de la Máquina
          </Link>
        </div>
      </section>

      {/* SECCIÓN 2: GRID DE FUNCIONALIDADES */}
      <section className="py-20 px-6 bg-panel border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              href="/"
              icon={<RadarIcon />}
              title="Radar y Expedientes"
              description="Descubrí problemas reales, reuní evidencia y tomá decisiones con datos, no con opiniones."
            />
            <FeatureCard
              href="/construir"
              icon={<CodeIcon />}
              title="Constructor de Webs"
              description="Generá sitios funcionales con IA, previsualizalos y publicalos al instante con motor de tokens transparente."
            />
            <FeatureCard
              href="/patentes"
              icon={<ShieldIcon />}
              title="Guía de Patentes"
              description="Recorrido didáctico multi-país con fuentes oficiales y disclaimers claros."
            />
            <FeatureCard
              href="/transparencia"
              icon={<EyeIcon />}
              title="Transparencia Total"
              description="Conocé exactamente cómo funciona el modelo de precios, el costo real del cómputo y los pagos."
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: MANIFIESTO ABREVIADO */}
      <section className="py-20 px-6 bg-panel/50 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              El Manifiesto
            </span>
            <span className="w-8 h-px bg-gold" aria-hidden="true" />
          </div>

          <ul className="space-y-6" role="list">
            {[
              "Problemas antes que tecnología: No construimos porque podemos, sino porque existe un problema que merece ser resuelto.",
              "Usuarios antes que opiniones: Una idea debe sobrevivir al contacto real. Si no hay uso, se itera o se mata.",
              "Ingresos antes que escala: Un producto que nadie paga es una hipótesis fallida.",
            ].map((item, index) => (
              <li key={index} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <p className="text-base sm:text-lg text-muted leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center italic text-dim">
            El laboratorio no se enamora de sus productos.
          </p>
        </div>
      </section>

      {/* SECCIÓN 4: FOOTER */}
      <footer className="border-t border-line py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-dim">
          <p>© {year} VersionLimitada. Código abierto bajo licencia MIT.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="https://github.com/Morpheus3232/versionlimitada"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="/transparencia"
              className="hover:text-accent transition-colors"
            >
              Transparencia
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}