import type { Metadata } from "next";
import Builder from "@/components/Builder";

export const metadata: Metadata = {
  title: "Construir sitio — VersionLimitada",
  description:
    "Generá un sitio web con IA en segundos. Pagás solo el cómputo real (×8, transparente), con saldo gratis incluido. Publicás en un link público.",
};

export default function ConstruirPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="-mt-4 mb-8 font-mono text-sm text-muted">
        <span className="text-accent">~/versionlimitada</span> $ construir
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
        Construí un sitio con{" "}
        <span className="grad">una descripción</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Escribí qué querés y genero el HTML autocontenido. Lo editás, lo
        publicás en un link público o lo descargás. Primero usás saldo gratis
        (lo pago yo); cuando se acaba, pagás un top-up de USD 2,80 para seguir.
      </p>

      <div className="mt-10">
        <Builder />
      </div>
    </div>
  );
}