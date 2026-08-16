import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { LabProvider } from "@/components/lab/LabContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "VersionLimitada — laboratorio de ideas",
  description:
    "Sistema operativo del laboratorio: señales, expedientes, hipótesis, experimentos, resultados y decisiones build / iterate / kill.",
};

const NAV = [
  { href: "/", label: "Laboratorio" },
  { href: "/construir", label: "Construir" },
  { href: "/patentes", label: "Patentar" },
  { href: "/transparencia", label: "Transparencia" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <a href="#principal" className="skip-link">
          Saltar al contenido
        </a>

        <header className="glass sticky top-0 z-20 border-b border-linesoft">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <Link href="/" className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight">
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(124,140,255,0.9)]" />
              VersionLimitada
              <span className="ml-1 hidden border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted sm:inline">
                código abierto
              </span>
            </Link>
            <nav aria-label="Principal" className="hidden items-center gap-1 font-mono text-xs text-muted xl:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-[6px] px-2.5 py-2 transition-colors hover:text-accent">
                  {n.label}
                </Link>
              ))}
            </nav>
            <p className="flex items-center gap-2 font-mono text-xs text-muted">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="hidden sm:inline">sistema en línea</span>
            </p>
          </div>
        </header>

        <LabProvider>
          <main id="principal" className="flex-1">
            {children}
          </main>
        </LabProvider>

        <footer className="border-t border-linesoft">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 font-mono text-xs text-dim sm:flex-row sm:items-center">
            <p>VersionLimitada · laboratorio de ideas · código abierto (MIT)</p>
            <p>{`build / iterate / kill · se aprende de lo que muere`}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}