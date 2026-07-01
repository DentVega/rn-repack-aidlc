# Arquitectura

[English](ARCHITECTURE.md) · **Español**

Un análisis a fondo de cómo está construido **rn-repack-aidlc**: los siete agentes, los catorce comandos, las nueve skills, y cómo encajan. Para *cómo usar* el plugin, ver [USAGE.es.md](../USAGE.es.md); para una vista rápida, el [README](../README.es.md).

## Modelo mental

Tres capas, con los standards del `memory-bank/` como pegamento entre ellas:

```
AGENTES   = el proceso       (orquestación + fases + checkpoints)
COMANDOS  = los puntos de entrada (lo que escribes: /rn-repack-aidlc:<nombre>)
SKILLS    = el conocimiento   (perf, testing, CI aplicados en cada etapa DDD)
                  │
          memory-bank/standards/  ← decide qué skill corre en qué etapa
                                     (precedencia "ganan los standards")
```

AI-DLC corre en tres fases secuenciales, cada una a cargo de un agente especialista, y el trabajo se mide en **bolts** (ciclos acotados en el tiempo):

```
Inception  (QUÉ/POR QUÉ) → intents → requirements → units/stories → plan de bolts
Construction (CÓMO)      → por bolt: Model → Design → ADR → Implement → Test
Operations               → build (Re.Pack) → Dev → Staging → Prod → monitoreo
```

## Los siete agentes

Cada agente tiene una **persona** (rol / comunicación / principio) y lee `memory-bank/activeContext.md` + `progress.md` al iniciar. Están afinados desde los prompts canónicos de specs.md.

### 1. `aidlc-master` — orquestador
- **Rol:** navegador del flujo; enruta, nunca implementa.
- **En activación:** si el proyecto no está inicializado, explica AI-DLC y enruta a `/aidlc-init`; si no, restaura contexto desde el Memory Bank y enruta a la fase correcta.
- **Reglas duras:** nunca saltar un checkpoint humano; Re.Pack no Metro; trazabilidad total (código → story → unit → intent).

### 2. `aidlc-inception` — qué/por qué
- **Rol:** estratega de producto y arquitecto de requisitos. No escribe código.
- **Comportamiento clave:** exactamente **4 checkpoints** más una **regla auto-continue** — tras aprobar requirements genera context → units → stories → bolt-plan sin preguntar entre medio.
- **Pregunta siempre (RN+Re.Pack):** ¿remote federado o host?, ¿módulos nativos?, presupuesto de performance.

### 3. `aidlc-construction` — cómo (un bolt)
- **Rol:** ejecutor de bolts. "El plan define el trabajo — ejecutas, no inventas."
- **Cinco etapas DDD** con checkpoint entre cada una: Model → Design → ADR → Implement → Test.
- **Reglas:** nunca auto-selecciona un bolt; nunca crea bolts (redirige a Inception). Aplica las skills de perf en Implement, las de testing en Test.

### 4. `aidlc-operations` — build/deploy
- **Rol:** DevOps. "Verifica antes de producción; siempre ten rollback."
- **Progresión estricta de entornos:** Dev → Staging → Prod (saltarse está prohibido).
- **Específico Re.Pack:** construye host + chunks remotos, hostea remotes, vigila version skew; rollback = repuntar el host al chunk anterior.

### 5. `fire-executor` — flow FIRE
- **Rol:** ejecución rápida, adaptativa y **brownfield-first** que sigue las convenciones existentes.
- **Ceremonia adaptativa:** 0–2 checkpoints según complejidad; nunca excede 2 (recomienda AI-DLC si hace falta más).

### 6. `parity-analyst` — análisis de gap de migración
- **Rol:** auditor de migración (solo migraciones).
- **Qué hace:** compara la superficie de un app origen (pantallas/units/endpoints) contra la cobertura del proyecto mobile; escribe una matriz de cobertura y marca lo que **FALTA**.
- **Principio:** prefiere marcar FALTANTE antes que asumir cobertura.

### 7. `code-auditor` — auditoría de deuda técnica
- **Rol:** auditor de salud del código.
- **Qué hace:** corre el toolchain real (`tsc`, `eslint`, código muerto, deps circulares) y agrega un review RN-específico (anti-patrones de perf, estilos hardcodeados, gaps de test/a11y); escribe un `tech-debt.md` priorizado.
- **Principio:** corre las herramientas reales primero, luego agrega lo que no ven. Solo lectura.

## Los catorce comandos

Se invocan con el namespace del plugin: `/rn-repack-aidlc:<comando>`.

| Comando | Grupo | Qué hace |
|---|---|---|
| `aidlc-init [desc]` | Setup | Crea `memory-bank/` (standards + Memory Bank) y un `CLAUDE.md` del proyecto |
| `setup-skills` | Setup | Instala las 8 skills referenciadas (`npx skills add`, user-level) |
| `repack-init [host] [remote] [puerto]` | Setup | Scaffoldea config real Re.Pack + Module Federation (solo bare RN) |
| `status` | Selector | Dashboard de solo lectura: intent, fase, progreso de bolts, siguiente paso |
| `spec-flow [tarea]` | Selector | Recomienda y arranca el flow correcto según el tamaño |
| `simple-spec [cambio]` | Flow Simple | Genera requirements/design/tasks (solo specs) |
| `fire [feature]` | Flow FIRE | Ejecución adaptativa brownfield vía `fire-executor` |
| `aidlc-inception [objetivo]` | AI-DLC | Corre la fase de Inception |
| `bolt-start [bolt]` | AI-DLC | Ejecuta un bolt por las cinco etapas DDD |
| `change [desc] [fuente?]` | AI-DLC | Evoluciona los artefactos a mitad de Construction (requirement nuevo/omitido, cambio arq.); resumen de impacto clasificado, espera aprobación |
| `operations [target]` | AI-DLC | Build/servir/verificar/deploy (Dev → Staging → Prod) |
| `parity [origen]` | Migración | Compara superficie del origen vs cobertura mobile; marca FALTANTES (solo migraciones) |
| `audit [ruta]` | Calidad | Toolchain (tsc/eslint/código muerto/ciclos) + review RN → reporte de deuda priorizado |
| `reflect [intent]` | Calidad | Retrospectiva de solo lectura: qué se construyó, fricciones, recomendaciones |

Flujo AI-DLC típico: `aidlc-init` → `setup-skills` → `aidlc-inception` → `bolt-start` (×N) → `operations`.

## Las nueve skills

Ocho son **referenciadas** (externas, instaladas por `setup-skills`); una es **incrustada** (vive dentro del plugin).

| Skill | Origen | Categoría | Cuándo |
|---|---|---|---|
| `vercel-react-native-skills` | Vercel | Performance | Al **escribir** componentes RN (ruleset default) |
| `react-native-best-practices` | Callstack | Performance | Al **depurar** un problema de perf medido |
| `react-best-practices` | Vercel | Performance | Lógica React general (waterfalls, re-renders) |
| `composition-patterns` | Vercel | Performance | Diseñar componentes reutilizables |
| `react-native-testing` | Callstack | Testing | Tests de componente/unitarios (RTL, Jest) |
| `agent-device` | Callstack | Testing | E2E en device (iOS/Android/tvOS/macOS) |
| `github-actions` | Callstack | Ops | Workflows de PR y CI/CD para RN |
| `upgrading-react-native` | Callstack | Ops | Upgrades paso a paso de RN bare |
| `i18n-doc-sync` | **Incrustada** | Docs | Mantener sincronizadas las variantes de Markdown |

Las cuatro skills de performance se solapan, así que sus triggers están **delimitados** en `coding-standards.md` (reglas de Vercel al escribir, best-practices al depurar, etc.). Las dos de testing son mitades complementarias de la pirámide. `i18n-doc-sync` es la única que vive dentro del plugin y está respaldada por un guard de CI/pre-commit.

## Cómo encajan las capas

```
Escribes un comando  →  enruta a un agente  →  el agente lee memory-bank/standards/
        →  corre su fase/etapa  →  aplica la skill relevante  →  actualiza el Memory Bank
```

Los archivos de `memory-bank/standards/` (tech-stack, coding-standards, system-architecture, testing-standards) son el contrato: le dicen a cada agente qué skill aplicar en qué etapa DDD, y la regla de precedencia es que **los standards del proyecto siempre ganan** sobre cualquier skill.

## Mantenimiento de este documento

Actualiza este archivo cada vez que cambie la estructura del plugin — un agente, comando o skill nuevo/eliminado; un cambio de comportamiento de un agente; o un flow nuevo. Refleja cada edición en `ARCHITECTURE.md` (lo fuerza `scripts/check-i18n-docs.mjs`), y mantén la lista de comandos al día con `commands/` (lo fuerza `scripts/check-docs-commands.mjs`). Ambos corren en CI y pre-commit.
