import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo patentar ideas — VersionLimitada",
  description:
    "Guía simple y didáctica para patentar una idea en los principales países del mundo (USPTO, EPO, WIPO/PCT, UKIPO, INPI, IMPI…), con fuentes oficiales y total transparencia.",
};

const STEPS = [
  ["Entendé qué protege una patente", "Una patente protege una invención (producto o proceso) nueva, no evidente y de aplicación industrial. No protege la 'idea' en abstracto ni una fórmula matemática por sí misma."],
  ["Verificá novedad", "La invención debe ser nueva en el mundo. Si ya se publicó, se vendió o se mostró públicamente, suele perder novedad. No la reveles antes de presentar."],
  ["Buscá el estado del arte", "Revisá patentes existentes en las bases públicas de tu oficina (Google Patents reúne varias) para saber si ya existe algo parecido."],
  ["Escribí el documento", "Memoria descriptiva + reivindicaciones (lo que pedís proteger) + dibujos + resumen. Es la parte técnica y más importante."],
  ["Presentá la solicitud", "En tu oficina nacional o vía PCT/EPO según tu estrategia. Cada país tiene su procedimiento y sus tasas."],
  ["Gestión y costos", "La tramitación es lenta (meses a años), con tasas, y el mantenimiento es periódico. No es gratis ni automático."],
];

type Country = {
  name: string;
  code: string;
  office: string;
  url: string;
  note: string;
};

const COUNTRIES: Country[] = [
  { name: "Internacional", code: "PCT · OMPI/WIPO", office: "Patent Cooperation Treaty (PCT)", url: "https://www.wipo.int/pct/es/", note: "Sistema que permite iniciar UNA solicitud que vale para muchos países después. Útil para proteger a nivel global." },
  { name: "Estados Unidos", code: "US · USPTO", office: "United States Patent and Trademark Office", url: "https://www.uspto.gov/", note: "El mercado más grande. Sistema 'first to file'. Importante decidir rápido y sin divulgación previa." },
  { name: "Europa", code: "EU · EPO", office: "European Patent Office", url: "https://www.epo.org/es", note: "Una solicitud europea puede valer para varios países de la UE. El título concedido luego se valida país por país." },
  { name: "Reino Unido", code: "UK · UKIPO", office: "UK Intellectual Property Office", url: "https://www.gov.uk/government/organisations/intellectual-property-office", note: "Oficina independiente de Reino Unido (post-Brexit). Guías claras para personas y pequeñas empresas." },
  { name: "Argentina", code: "AR · INPI", office: "Instituto Nacional de la Propiedad Industrial", url: "https://www.argentina.gob.ar/inpi", note: "Regulación nacional de patentes y modelos de utilidad. El trámite se realiza en INPI." },
  { name: "México", code: "MX · IMPI", office: "Instituto Mexicano de la Propiedad Industrial", url: "https://www.gob.mx/impi", note: "Oficina mexicana de patentes, modelos de utilidad y marcas. Base de datos pública para búsqueda." },
  { name: "Brasil", code: "BR · INPI", office: "Instituto Nacional da Propriedade Industrial", url: "https://www.gov.br/inpi", note: "Mayor mercado de LatAm. Procrastura el examen y revisa requisitos locales antes de presentar." },
  { name: "España", code: "ES · OEPM", office: "Oficina Española de Patentes y Marcas", url: "https://www.oepm.es/es/", note: "Ofrece patentes nacionales y vía europea. Buenas guías en español." },
];

export default function PatentesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="mb-8 font-mono text-sm text-muted">
        <span className="text-accent">~/versionlimitada</span> $ patentar
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
        Cómo <span className="grad">proteger tu idea</span>
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Guía simple para entender patentes en los principales países del mundo.
        Es <strong className="text-ink">educativa</strong>: te da el mapa y las
        fuentes oficiales, pero no reemplaza a un agente de patentes o abogado.
      </p>

      {/* Disclaimer transparente */}
      <aside className="mt-6 rounded-[10px] border border-gold/40 bg-panel p-4">
        <h2 className="font-heading text-sm font-semibold text-gold">Transparencia y límites</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Patentar es específico por país, caro y lento. Esta página resume bases
          generales; <strong className="text-ink">una idea o un algoritmo por sí solo no es patentable</strong>.
          Antes de invertir, consultá un profesional de tu jurisdicción. Copyright,
          marca, secreto industrial, modelo de utilidad o licencias abiertas (MIT, MPL,
          Apache) suelen ser alternativas más simples y baratas según el caso.
        </p>
      </aside>

      <section className="mt-12">
        <h2 className="font-heading text-xl font-bold text-ink">6 pasos en simple</h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map(([title, desc], i) => (
            <li key={title} className="flex gap-4 rounded-[10px] border border-line bg-panel p-4">
              <span aria-hidden className="font-heading text-2xl font-bold text-accent">{i + 1}</span>
              <div>
                <h3 className="font-heading text-base font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-xl font-bold text-ink">Oficinas por país</h2>
        <p className="mt-2 text-sm text-muted">
          Empezá siempre por la fuente oficial de tu país y su guía de procedimiento.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {COUNTRIES.map((c) => (
            <article key={c.code} className="cell flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-base font-bold text-ink">{c.name}</h3>
                <span className="shrink-0 rounded-[6px] border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                  {c.code}
                </span>
              </div>
              <p className="mt-1 text-xs text-dim">{c.office}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.note}</p>
              <a href={c.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-accent transition hover:text-accenthover">
                Sitio oficial →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-xl font-bold text-ink">Dónde buscar más (fuentes)</h2>
        <ul className="mt-4 space-y-2 font-mono text-sm">
          {[
            ["OMPI/WIPO — guía de propiedad intelectual", "https://www.wipo.int/toolbox/es/page.html"],
            ["Google Patents — búsqueda de estado del arte", "https://patents.google.com/"],
            ["USPTO — cómo patentar", "https://www.uspto.gov/patents/basics"],
            ["EPO — cómo llevar a cabo la tramitación", "https://www.epo.org/es/learning/online-library/practical-guides"],
            ["Invenciones que no se pueden patentar (ej. EPO)", "https://www.epo.org/es/learning/materials-inventors-handbook/novelties/exclusions"],
          ].map(([label, url]) => (
            <li key={url}>
              <a className="text-muted underline-offset-4 hover:text-accent hover:underline" href={url} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 border-t border-linesoft pt-6 font-mono text-xs text-dim">
        Contenido educativo con enlaces a fuentes oficiales. No constituye asesoría
        legal. Verifica los requisitos vigentes de tu oficina.
      </p>
    </div>
  );
}