# shared/

Código reutilizable entre productos del laboratorio.

**Regla:** solo existe cuando **dos o más proyectos lo usan**. Candidatos a extraer desde Molino cuando haga falta: `billing` (pagos webhook/idempotencia), `ai` (router, PII, costos), `kv`, `ui`, `i18n`, `rate-limit`.

No construimos abstracciones por adelantado.