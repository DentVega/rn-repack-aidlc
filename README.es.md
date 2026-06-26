# rn-repack-aidlc

[English](README.md) · **Español**

Un plugin de Claude Code para **desarrollo spec-driven en React Native + Re.Pack** usando la metodología **AI-DLC** de [specs.md](https://specs.md).

Empaqueta los agentes y el flujo de AI-DLC, pre-carga los *standards* de un stack Re.Pack (Module Federation) y conecta cuatro skills de callstack probadas en producción — con sus *triggers* delimitados para que ninguno choque.

## Qué incluye

| Capa | Provisto por |
|---|---|
| **Proceso** (4 agentes, bolts, DDD, memory-bank) | Este plugin — AI-DLC adaptado de specs.md |
| **Build** | Re.Pack (webpack/Rspack + Module Federation v2) — documentado en los standards |
| **Perf — escribir código (RN)** | `vercel-react-native-skills` (referenciada) |
| **Perf — depurar (RN)** | `react-native-best-practices` (referenciada) |
| **Tests unitarios/componente** | `react-native-testing-library` (referenciada) |
| **E2E en device** | `agent-device` (referenciada) |
| **Perf — React general** | `react-best-practices` (referenciada) |
| **Composición de componentes** | `composition-patterns` (referenciada) |
| **CI/CD** | `github-actions` (referenciada) |
| **Upgrades de RN** | `upgrading-react-native` (referenciada) |

Las ocho skills de RN/React están **referenciadas, no incrustadas** — instálalas con `/setup-skills` (usa `npx skills add`, a nivel usuario, siempre la última versión). Las últimas cuatro están curadas del proyecto hermano `expo-config-template` (las skills específicas de Expo/EAS se excluyen a propósito — este stack usa Re.Pack, no Metro). El plugin también incluye una skill **incrustada**, `i18n-doc-sync`, que mantiene sincronizadas las variantes de Markdown por idioma (p. ej. este README y `README.md`) en cada edición.

## Tres flows (un nivel de ceremonia cada uno)

specs.md ofrece tres flows. Todos reutilizan los mismos `memory-bank/standards/` y las mismas cuatro skills — solo cambia el peso del proceso. Usa `/spec-flow` si no estás seguro de cuál elegir.

| Flow | Cuándo usarlo | Comando |
|---|---|---|
| **Simple** | Cambio pequeño y bien entendido. Solo spec (requirements/design/tasks), sin seguimiento de ejecución. | `/simple-spec` |
| **FIRE** | Feature mediana sobre una app Re.Pack existente (brownfield). Rápido, adaptativo, 0–2 checkpoints. | `/fire` |
| **AI-DLC** | Remote federado nuevo / dominio complejo. 4 agentes, bolts, DDD, trazabilidad completa. | `/aidlc-inception` |

## Agentes

- `aidlc-master` — orquesta AI-DLC; enruta entre fases; mantiene `memory-bank/` coherente.
- `aidlc-inception` — QUÉ/POR QUÉ: intents → requirements → units/stories → plan de bolts.
- `aidlc-construction` — CÓMO: Model → Design → ADR → Implement → Test, por bolt.
- `aidlc-operations` — build con Re.Pack, servir chunks federados, verificar, monitorear.
- `fire-executor` — flow FIRE: ejecución adaptativa, consciente de brownfield, con 0–2 checkpoints.

## Comandos

> Los comandos del plugin van **con namespace**: invócalos como `/rn-repack-aidlc:<nombre>` (p. ej. `/rn-repack-aidlc:aidlc-init`). Escribe `/` y deja que el autocompletado lo llene. Los `/nombre` cortos de abajo son por brevedad.

- `/aidlc-init` — crea `memory-bank/`, siembra los standards + Memory Bank (`activeContext.md`, `progress.md`) y genera un `CLAUDE.md` del proyecto.
- `/setup-skills` — instala las ocho skills referenciadas.
- `/repack-init` — scaffoldea una config real de Re.Pack + Module Federation (host + remote).
- `/spec-flow [tarea]` — elige y arranca el flow adecuado (Simple / FIRE / AI-DLC).
- `/simple-spec [cambio]` — flow Simple: genera requirements/design/tasks.
- `/fire [feature]` — flow FIRE: ejecución rápida y adaptativa sobre una app existente.
- `/aidlc-inception [objetivo]` — AI-DLC: ejecuta la fase de Inception.
- `/bolt-start [bolt]` — AI-DLC: ejecuta un bolt por las etapas DDD.
- `/operations [bolt|build|verify|deploy]` — AI-DLC: build con Re.Pack, servir chunks, verificar, desplegar (Dev → Staging → Prod).

## Instalación

Este repo es un **marketplace de plugins** de Claude Code. Agrégalo y luego instala el plugin:

```text
/plugin marketplace add DentVega/rn-repack-aidlc
/plugin install rn-repack-aidlc@rn-repack-aidlc
```

(O desde un clon local: `/plugin marketplace add /ruta/a/rn-repack-aidlc`.)

## Inicio rápido

```text
/setup-skills
/aidlc-init mi app de tienda offline-first sobre Re.Pack
/aidlc-inception flujo de checkout como remote federado
/bolt-start <primer bolt del plan>
```

Guía paso a paso completa (tracks Expo y bare-RN): **[USAGE.es.md](USAGE.es.md)**.

## Notas de diseño — por qué las skills no chocan

- Las dos skills de perf **se solapan** en listas/memoización/animaciones. Resuelto con **triggers delimitados**: reglas de Vercel al *escribir*, best-practices al *depurar*. Ver `templates/standards/coding-standards.md`.
- `agent-device` (E2E en device) y `react-native-testing-library` (componentes en Jest) son **mitades complementarias** de la pirámide de testing.
- **Re.Pack reemplaza a Metro.** Todos los standards lo dicen explícitamente para que los agentes nunca generen config de Metro.
- AI-DLC se sitúa **por encima** de todo como proceso de orquestación; las skills se enchufan en etapas DDD concretas vía `memory-bank/standards/`.

## Estructura

```
.claude-plugin/   plugin.json, marketplace.json
agents/           aidlc-{master,inception,construction,operations}, fire-executor
commands/         aidlc-init, setup-skills, spec-flow, simple-spec, fire,
                  aidlc-inception, bolt-start
commands/         …, operations
skills/           i18n-doc-sync (incluida)
scripts/          check-i18n-docs.mjs, pre-commit (guard duro de i18n)
.github/workflows/  i18n-docs.yml (enforcement en CI)
templates/standards/  tech-stack, coding-standards, system-architecture, testing-standards
templates/simple/     requirements, design, tasks
```

La skill incluida `i18n-doc-sync` está respaldada por un **guard duro**: `scripts/check-i18n-docs.mjs` compara el esqueleto estructural (headings, bloques de código, tablas) de cada familia `<name>.md` / `<name>.<lang>.md` y falla en CI (y opcionalmente en pre-commit) si divergen.

## Versionado

Los cambios se registran en [CHANGELOG.md](CHANGELOG.md) siguiendo Keep a Changelog + SemVer. Versión actual: **0.4.0**.

## Licencia

MIT — ver [LICENSE](LICENSE).

## Créditos

- Metodología: [specs.md / AI-DLC](https://specs.md) ([fabriqaai/specs.md](https://github.com/fabriqaai/specs.md))
- Bundler: [Re.Pack](https://re-pack.dev)
- Skills: [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills), [callstackincubator/agent-device](https://github.com/callstackincubator/agent-device), [callstack/react-native-testing-library](https://github.com/callstack/react-native-testing-library)
