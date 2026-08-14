export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-20 sm:py-28">
        <p className="text-xs font-medium tracking-[0.35em] text-zinc-500 uppercase">
          Laboratorio
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
          VersionLimitada
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Transformamos ideas en realidad: productos digitales, aplicaciones y
          agentes de IA. Cada proyecto empieza como un problema real, no como
          una tecnología.
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <span className="inline-flex border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
            Apps
          </span>
          <span className="inline-flex border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
            Agentes de IA
          </span>
          <span className="inline-flex border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
            Herramientas
          </span>
        </div>

        <div className="mt-16 grid gap-6 border-t border-zinc-800 pt-10 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
              Proyecto de muestra
            </h2>
            <p className="mt-3 text-base text-zinc-300">Molino</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">
              Web de autoconocimiento. Sirve de referencia y caso de estudio
              del laboratorio.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
              Cómo trabajamos
            </h2>
            <ol className="mt-3 space-y-1 text-sm leading-relaxed text-zinc-400">
              <li>1. Problema</li>
              <li>2. Investigación e hipótesis</li>
              <li>3. Prototipo mínimo</li>
              <li>4. Usuarios y medición</li>
              <li>5. Iterar, escalar o descartar</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}