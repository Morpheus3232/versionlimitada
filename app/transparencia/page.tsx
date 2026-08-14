import type { Metadata } from "next";
import {
  MARKUP,
  TOPUP_USD,
  FREE_REAL_USD,
  trim,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Transparencia — VersionLimitada",
  description:
    "Cómo funciona el modelo de tokens: cuánto paga el dueño, cuánto pagás vos, el margen de 8x y los precios reales por millón de tokens.",
};

const MODELS = [
  { name: "DeepSeek Chat (deepseek-chat)", real: 0.14, user: 0.14 * MARKUP },
  { name: "DeepSeek Chat v4 Flash", real: 0.14, user: 0.14 * MARKUP },
];

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-linesoft py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={`font-mono text-sm ${strong ? "text-gold" : "text-ink"}`}>{value}</dd>
    </div>
  );
}

export default function TransparenciaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="mb-8 font-mono text-sm text-muted">
        <span className="text-accent">~/versionlimitada</span> $ transparencia
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
        Transparencia total
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Este sitio es de código abierto y no esconde nada: ni en el código ni
        en los precios. Acá está, paso a paso, cómo funciona el motor de tokens.
      </p>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold text-ink">Cómo se cobra</h2>
        <dl className="mt-4">
          <Row label="Primeros casos (free)" value={`USD ${FREE_REAL_USD} de cómputo real, lo paga el dueño`} strong />
          <Row label="Cuando se acaba el free" value="Se bloquea y se pide un top-up" />
          <Row label="Top-up mínimo" value={`USD ${TOPUP_USD} por recarga`} strong />
          <Row label="Costo real por caso" value="Lo que el proveedor cobra al dueño" />
          <Row label="Vos pagás" value={`${MARKUP}x el costo real`} strong />
          <Row label="Margen del laboratorio" value={`${MARKUP - 1}x para el dueño/site`} />
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          En la práctica: un caso que le cuesta al dueño <strong className="text-ink">USD $
          {trim(0.045)}</strong> de cómputo (≈ por ejemplo), te cuesta a vos{" "}
          <strong className="text-gold">USD ${trim(0.045 * MARKUP)}</strong>. Cada recarga de{" "}
          <strong className="text-gold">USD {TOPUP_USD}</strong> te acredita{" "}
          <strong className="text-ink">USD ${trim(TOPUP_USD / MARKUP)}</strong> de consumo real.
          Los primeros <strong className="text-ink">USD {FREE_REAL_USD}</strong> de consumo real son gratis
          (el dueño los paga del propio bolsillo).
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold text-ink">Precios por millón de tokens</h2>
        <p className="mt-2 text-sm text-muted">
          El costo real depende del modelo y el proveedor. Los montos son
          indicativos (fuente: precios públicos de OpenRouter).
        </p>
        <dl className="mt-4">
          {MODELS.map((m) => (
            <Row key={m.name} label={`${m.name} — real`} value={`USD ${m.real}/M`} />
          ))}
          {MODELS.map((m) => (
            <Row key={m.name} label={`${m.name} — vos pagás`} value={`USD ${trim(m.user)}/M`} strong />
          ))}
        </dl>
        <p className="mt-3 text-xs text-dim">
          Fuente: <a className="text-accent hover:underline" href="https://openrouter.ai/models" target="_blank" rel="noreferrer">openrouter.ai/models</a> y{" "}
          <a className="text-accent hover:underline" href="https://openrouter.ai/docs/quickstart" target="_blank" rel="noreferrer">openrouter.ai/docs</a>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold text-ink">Preguntas frecuentes</h2>
        <div className="mt-4 space-y-4">
          {[
            ["¿Necesito una cuenta?", "No. El sitio funciona sin registro. El saldo se asocia a un identificador anónimo de tu navegador."],
            ["¿Por qué pagar 8x?", "Es el modelo del laboratorio: cubre cóstos, mantenimiento y margen. Es fijo y transparente — nunca más de 8x el cómputo real."],
            ["¿Quién paga mis primeros casos?", "El dueño del laboratorio. Vos arrancás gratis hasta agotar el saldo inicial."],
            ["¿Cómo recargo?", "Con Mercado Pago o PayPal (USD 2.80 por recarga), la misma pasarela que usa molino.app."],
            ["¿Qué pasa si el proveedor está caído?", "El error es claro y no se te descuenta nada (se devuelve la reserva)."],
            ["¿Esto es asesoría legal o financiera?", "No. Es educativo y transparente. La sección de patentes no reemplaza a un profesional."],
          ].map(([q, a]) => (
            <details key={q} className="rounded-[10px] border border-line bg-panel p-4">
              <summary className="cursor-pointer font-heading text-sm font-semibold text-ink">{q}</summary>
              <p className="mt-2 text-sm text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-10 border-t border-linesoft pt-6 font-mono text-xs text-dim">
        Código abierto (MIT) · GitHub:{" "}
        <a className="text-accent hover:underline" href="https://github.com/Morpheus3232/versionlimitada" target="_blank" rel="noreferrer">
          Morpheus3232/versionlimitada
        </a>
      </p>
    </div>
  );
}