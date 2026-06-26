# Architecture

**English** · [Español](ARCHITECTURE.es.md)

A deep dive into how **rn-repack-aidlc** is built: the five agents, the nine commands, the nine skills, and how they fit together. For *how to use* the plugin, see [USAGE.md](../USAGE.md); for a quick overview, the [README](../README.md).

## Mental model

Three layers, with the `memory-bank/` standards as the glue between them:

```
AGENTS    = the process      (orchestration + phases + checkpoints)
COMMANDS  = the entry points (what you type: /rn-repack-aidlc:<name>)
SKILLS    = the knowledge     (perf, testing, CI applied at each DDD stage)
                  │
          memory-bank/standards/  ← decides which skill runs in which stage
                                     ("project standards win" precedence)
```

AI-DLC runs in three sequential phases, each owned by a specialist agent, and work is measured in **bolts** (time-boxed cycles):

```
Inception  (WHAT/WHY)  → intents → requirements → units/stories → bolt plan
Construction (HOW)     → per bolt: Model → Design → ADR → Implement → Test
Operations             → build (Re.Pack) → Dev → Staging → Prod → monitor
```

## The five agents

Each agent has a **persona** (role / communication / principle) and reads `memory-bank/activeContext.md` + `progress.md` on start. They are refined from the canonical specs.md prompts.

### 1. `aidlc-master` — orchestrator
- **Role:** flow navigator; routes work, never implements.
- **On activation:** if the project is uninitialized, explains AI-DLC and routes to `/aidlc-init`; otherwise restores context from the Memory Bank and routes to the right phase.
- **Hard rules:** never skip a human checkpoint; Re.Pack not Metro; full traceability (code → story → unit → intent).

### 2. `aidlc-inception` — what/why
- **Role:** product strategist & requirements architect. Writes no code.
- **Key behavior:** exactly **4 checkpoints** plus an **auto-continue rule** — once requirements are approved it generates context → units → stories → bolt-plan without prompting between each.
- **Always asks (RN+Re.Pack):** federated remote vs. host? native modules? performance budget.

### 3. `aidlc-construction` — how (one bolt)
- **Role:** bolt executor. "The plan defines the work — you execute, you don't invent."
- **Five DDD stages** with a checkpoint between each: Model → Design → ADR → Implement → Test.
- **Rules:** never auto-selects a bolt; never creates bolts (redirects to Inception). Applies the perf skills in Implement, the testing skills in Test.

### 4. `aidlc-operations` — build/deploy
- **Role:** DevOps. "Verify before production; always keep a rollback."
- **Strict environment progression:** Dev → Staging → Prod (skipping is forbidden).
- **Re.Pack specifics:** builds host + remote chunks, hosts remotes, watches version skew; rollback = repoint the host to the previous chunk.

### 5. `fire-executor` — FIRE flow
- **Role:** rapid, adaptive, **brownfield-first** execution that follows existing conventions.
- **Adaptive ceremony:** 0–2 checkpoints by complexity; never exceeds 2 (recommends AI-DLC if more is needed).

## The nine commands

Invoked with the plugin namespace: `/rn-repack-aidlc:<command>`.

| Command | Group | What it does |
|---|---|---|
| `aidlc-init [desc]` | Setup | Scaffolds `memory-bank/` (standards + Memory Bank) and a project `CLAUDE.md` |
| `setup-skills` | Setup | Installs the 8 referenced skills (`npx skills add`, user-level) |
| `repack-init [host] [remote] [port]` | Setup | Scaffolds real Re.Pack + Module Federation config (bare RN only) |
| `spec-flow [task]` | Selector | Recommends and starts the right flow by size |
| `simple-spec [change]` | Simple flow | Generates requirements/design/tasks (spec only) |
| `fire [feature]` | FIRE flow | Adaptive, brownfield execution via `fire-executor` |
| `aidlc-inception [goal]` | AI-DLC | Runs the Inception phase |
| `bolt-start [bolt]` | AI-DLC | Executes a bolt through the five DDD stages |
| `operations [target]` | AI-DLC | Build/serve/verify/deploy (Dev → Staging → Prod) |

Typical AI-DLC flow: `aidlc-init` → `setup-skills` → `aidlc-inception` → `bolt-start` (×N) → `operations`.

## The nine skills

Eight are **referenced** (external, installed by `setup-skills`); one is **bundled** (lives inside the plugin).

| Skill | Source | Category | When |
|---|---|---|---|
| `vercel-react-native-skills` | Vercel | Performance | While **writing** RN components (default ruleset) |
| `react-native-best-practices` | Callstack | Performance | While **debugging** a measured perf problem |
| `react-best-practices` | Vercel | Performance | React-general logic (waterfalls, re-renders) |
| `composition-patterns` | Vercel | Performance | Designing reusable components |
| `react-native-testing` | Callstack | Testing | Component/unit tests (RTL, Jest) |
| `agent-device` | Callstack | Testing | Device E2E (iOS/Android/tvOS/macOS) |
| `github-actions` | Callstack | Ops | PR workflows and CI/CD for RN |
| `upgrading-react-native` | Callstack | Ops | Step-by-step bare RN upgrades |
| `i18n-doc-sync` | **Bundled** | Docs | Keep localized Markdown variants in sync |

The four performance skills overlap, so their triggers are **delimited** in `coding-standards.md` (Vercel rules while writing, best-practices while debugging, etc.). The two testing skills are complementary halves of the testing pyramid. `i18n-doc-sync` is the only skill that ships inside the plugin and is backed by a CI/pre-commit guard.

## How the layers fit

```
You type a command  →  it routes to an agent  →  the agent reads memory-bank/standards/
        →  runs its phase/stage  →  applies the relevant skill  →  updates the Memory Bank
```

The `memory-bank/standards/` files (tech-stack, coding-standards, system-architecture, testing-standards) are the contract: they tell each agent which skill to apply in which DDD stage, and the precedence rule is **the project's standards always win** over any skill.

## Maintaining this document

Update this file whenever the plugin's structure changes — a new/removed agent, command, or skill; a changed agent behavior; or a new flow. Mirror every edit in `ARCHITECTURE.es.md` (enforced by `scripts/check-i18n-docs.mjs`), and keep the command list in step with `commands/` (enforced by `scripts/check-docs-commands.mjs`). Both run in CI and pre-commit.
