# VersionLimitada

> No construimos lo que suena bien. Construimos lo que se demuestra.

**VersionLimitada** es una máquina que descubre problemas reales, reúne evidencia,
formula hipótesis, ejecuta experimentos y toma decisiones `build / iterate / kill`.
La unidad principal del sistema es `problema + evidencia + experimento`, no una idea.

> **Acceso público y código abierto (MIT).** Este repositorio y su utilidad son libres: podés usarlo, modificarlo y compartirlo. La web vive en `https://versionlimitada.online` y está en síntonia visual con `molino.app`.

Este repositorio es la **casa / vitrina del laboratorio** y el punto de partida de todo proyecto que nace acá.

---

## Manifiesto

- **Problemas antes que tecnología.** No construimos porque podemos, sino porque existe un problema que merece ser resuelto.
- **Valor antes que funcionalidades.** Una feature que nadie usa es deuda.
- **Usuarios antes que opiniones.** Una idea debe sobrevivir al contacto real; si no hay uso, retención o disposición a pagar, se itera o se mata.
- **Simplicidad antes que arquitectura.** Monolito modular mientras alcance. Nada de abstracciones prematuras.
- **Ingresos antes que escala.** Un producto que nadie paga es una hipótesis fallida.

El laboratorio **no se enamora de sus productos.**

Todo proyecto atraviesa: `PROBLEMA → INVESTIGACIÓN → HIPÓTESIS → PROTOTIPO → MVP → USUARIOS → PAGO → RETENCIÓN → ITERAR / ESCALAR / MATAR`.

---

## Qué construye el laboratorio

| Área              | Descripción                                                       |
| ----------------- | ----------------------------------------------------------------- |
| **Apps (web)**    | Productos web funcionales, directos al público.                   |
| **Agentes de IA** | Agentes y asistentes sobre APIs (OpenRouter, OpenAI, Claude, etc).|
| **Herramientas**  | Automatizaciones y utilidades propias del laboratorio.            |

### Proyecto de muestra

- **Molino** (`~/Projects/molino`) — web de autoconocimiento con numerología/astrología. Caso de estudio real del laboratorio: motores de cálculo, pagos, IA, SEO programático, testing. Fuente de patrones reutilizables (billing, ai, kv, ui).

Otros proyectos van apareciendo en `apps/` y `agents/` (ver estructura).

---

## Estructura

```
versionlimitada/
├── app/                 # Web del laboratorio (Next.js App Router)
│   └── page.tsx         # Landing / hub
├── apps/                # (futuro) Apps y productos independientes del lab
├── agents/              # (futuro) Agentes e integraciones de IA
├── shared/              # (futuro) Código compartido solo cuando 2+ proyectos lo usen
└── docs/                # Visión, roadmap y decisiones
```

> Regla de oro: `apps/`, `agents/` y `shared/` se pueblan **por demanda**, no por adelantado. No construimos una "plataforma para crear plataformas".

## Funcionalidades

- **`/` — Estado de la máquina**: radar de señales (fuentes públicas), expediente #001 con anatomía y evidencia, experimentos y cementerio. Cada afirmación declara su origen: `observado / inferido / estimado / generado (IA)`.
- **`/construir` — Constructor de webs (estilo Lovable)**: generá un sitio con una descripción, publicá en `/s/[slug]` o descargá el HTML. Motor de tokens tipo OpenRouter (ver transparencia).
- **`/patentes` — Guía para patentar ideas**: simple y didáctica, multi-país, con fuentes oficiales y disclaimers.
- **`/transparencia` — Modelo de precios del motor de tokens.**

### Motor de tokens (`/construir`)

- Los **primeros USD 0.35 de cómputo real son gratis** (los paga el dueño).
- Cada recarga es de **USD 2.80** y acredita USD (2.80/8) de cómputo real.
- Se cobra **8× el costo real** que el proveedor le factura al dueño (como OpenRouter).
- Pagos con **Mercado Pago + PayPal** (la misma pasarela de molino.app).
- Cuando el saldo llega a 0, el usuario se bloquea y se le pide recargar.

**Requisitos para que `/construir` pague en producción:**
1. Fondear la cuenta de OpenRouter (si no hay crédito, devuelve 402).
2. Agregar `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel KV / Upstash) para persistir saldo y sitios publicados.
3. Completar credenciales de Mercado Pago y PayPal (ver `.env.example`).

---

## Desarrollo local

```bash
git clone https://github.com/Morpheus3232/versionlimitada.git
cd versionlimitada
npm install
npm run dev        # http://localhost:3001 (si molino ocupa el 3000)
```

Despliegue: Vercel, auto-deploy sobre `main` → `https://versionlimitada.online`.

## Licencia

MIT — libre para usar, modificar y compartir. Ver [LICENSE](./LICENSE).

---

## Roadmap (anteproyecto)

1. Consolidar la web del laboratorio (landing + fichas de proyectos).
2. Definir y validar el **primer producto propio** (problema → hipótesis → MVP).
3. Primera **app** y primer **agente de IA** desplegados.
4. Extraer infraestructura compartida (`billing`, `ai`, `kv`, `ui`) **solo** cuando un segundo proyecto la necesite (patrón surgido de Molino).

Las decisiones importantes se documentan en `docs/`.