# rn-repack-aidlc

**English** · [Español](README.es.md)

A Claude Code plugin for **spec-driven React Native + Re.Pack development** using the **AI-DLC** methodology from [specs.md](https://specs.md).

It bundles the AI-DLC agents and workflow, pre-seeds standards for a Re.Pack (Module Federation) stack, and wires in eight battle-tested RN/React skills — with their triggers delimited so nothing collides.

## What's inside

| Layer | Provided by |
|---|---|
| **Process** (5 agents, bolts, DDD, memory-bank) | This plugin — AI-DLC adapted from specs.md |
| **Build** | Re.Pack (webpack/Rspack + Module Federation v2) — documented in standards |
| **Perf — write code (RN)** | `vercel-react-native-skills` (referenced) |
| **Perf — debug (RN)** | `react-native-best-practices` (referenced) |
| **Unit/component tests** | `react-native-testing-library` (referenced) |
| **Device E2E** | `agent-device` (referenced) |
| **Perf — React-general** | `react-best-practices` (referenced) |
| **Component composition** | `composition-patterns` (referenced) |
| **CI/CD** | `github-actions` (referenced) |
| **RN version upgrades** | `upgrading-react-native` (referenced) |

The eight RN/React skills are **referenced, not vendored** — install them with `/setup-skills` (uses `npx skills add`, user-level, always latest). The last four are curated from the sibling `expo-config-template` project (the Expo/EAS-specific skills are intentionally excluded — this stack uses Re.Pack, not Metro). The plugin also ships one **bundled** skill, `i18n-doc-sync`, which keeps localized Markdown variants (e.g. this README and `README.es.md`) in sync on every edit.

## Three flows (one ceremony level each)

specs.md offers three flows. All reuse the same `memory-bank/standards/` and the same skills — only the process weight changes. Use `/spec-flow` if unsure which to pick.

| Flow | Use when | Command |
|---|---|---|
| **Simple** | Small, well-understood change. Spec only (requirements/design/tasks), no execution tracking. | `/simple-spec` |
| **FIRE** | Medium feature on an existing (brownfield) Re.Pack app. Rapid, adaptive, 0–2 checkpoints. | `/fire` |
| **AI-DLC** | New federated remote / complex domain. 5 agents, bolts, DDD, full traceability. | `/aidlc-inception` |

## Agents

- `aidlc-master` — orchestrates AI-DLC; routes between phases; keeps `memory-bank/` coherent.
- `aidlc-inception` — WHAT/WHY: intents → requirements → units/stories → bolt plan.
- `aidlc-construction` — HOW: Model → Design → ADR → Implement → Test, per bolt.
- `aidlc-operations` — Re.Pack build, serve federated chunks, verify, monitor.
- `fire-executor` — FIRE flow: adaptive, brownfield-aware execution with 0–2 checkpoints.

## Commands

> Plugin commands are **namespaced**: invoke as `/rn-repack-aidlc:<name>` (e.g. `/rn-repack-aidlc:aidlc-init`). Type `/` and let autocomplete fill it in. The short `/name` forms below are for brevity.

- `/aidlc-init` — scaffold `memory-bank/`, seed the standards + Memory Bank (`activeContext.md`, `progress.md`), and generate a project `CLAUDE.md`.
- `/setup-skills` — install the eight referenced skills.
- `/repack-init` — scaffold a real Re.Pack + Module Federation setup (host + remote).
- `/spec-flow [task]` — pick and start the right flow (Simple / FIRE / AI-DLC).
- `/simple-spec [change]` — Simple flow: generate requirements/design/tasks.
- `/fire [feature]` — FIRE flow: rapid adaptive execution on an existing app.
- `/aidlc-inception [objective]` — AI-DLC: run the Inception phase.
- `/bolt-start [bolt]` — AI-DLC: execute a bolt through the DDD stages.
- `/change [description] [source of truth?]` — AI-DLC: evolve artifacts when a new requirement, architectural change, or spec inconsistency surfaces mid-Construction; produces a classified impact summary and waits for approval before resuming.
- `/operations [bolt|build|verify|deploy]` — AI-DLC: build with Re.Pack, serve chunks, verify, deploy (Dev → Staging → Prod).

## Install

This repo is a Claude Code **plugin marketplace**. Add it, then install the plugin:

```text
/plugin marketplace add DentVega/rn-repack-aidlc
/plugin install rn-repack-aidlc@rn-repack-aidlc
```

(Or from a local clone: `/plugin marketplace add /path/to/rn-repack-aidlc`.)

## Quick start

```text
/setup-skills
/aidlc-init my offline-first store app on Re.Pack
/aidlc-inception checkout flow as a federated remote
/bolt-start <first bolt from the plan>
```

Full step-by-step (Expo and bare-RN tracks): **[USAGE.md](USAGE.md)**. Deep dive on every agent, command, and skill: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## Design notes — why the skills don't clash

- The two perf skills **overlap** on lists/memoization/animations. Resolved by **delimited triggers**: Vercel rules while *writing*, best-practices while *debugging*. See `templates/standards/coding-standards.md`.
- `agent-device` (device E2E) and `react-native-testing-library` (Jest components) are **complementary halves** of the testing pyramid.
- **Re.Pack replaces Metro.** All standards say so explicitly so agents never emit Metro config.
- AI-DLC sits **above** everything as the orchestration process; the skills plug into specific DDD stages via `memory-bank/standards/`.

## Layout

```
.claude-plugin/   plugin.json, marketplace.json
agents/           aidlc-{master,inception,construction,operations}, fire-executor
commands/         aidlc-init, setup-skills, spec-flow, simple-spec, fire,
                  aidlc-inception, bolt-start
commands/         …, operations
skills/           i18n-doc-sync (bundled)
scripts/          check-i18n-docs.mjs, pre-commit (i18n hard guard)
.github/workflows/  i18n-docs.yml (CI enforcement)
templates/          activeContext, progress, CLAUDE.md, activation-checklist, repack/
templates/standards/  tech-stack, coding-standards, system-architecture, testing-standards
templates/simple/     requirements, design, tasks
```

The bundled `i18n-doc-sync` skill is backed by a **hard guard**: `scripts/check-i18n-docs.mjs` compares the structural skeleton (headings, code blocks, tables) of every `<name>.md` / `<name>.<lang>.md` family and fails in CI (and optionally pre-commit) if they drift.

## Versioning

Changes are tracked in [CHANGELOG.md](CHANGELOG.md) following Keep a Changelog + SemVer. Current version: **0.7.0**.

## License

MIT — see [LICENSE](LICENSE).

## Credits

- Methodology: [specs.md / AI-DLC](https://specs.md) ([fabriqaai/specs.md](https://github.com/fabriqaai/specs.md))
- Bundler: [Re.Pack](https://re-pack.dev)
- Skills: [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills), [callstackincubator/agent-device](https://github.com/callstackincubator/agent-device), [callstack/react-native-testing-library](https://github.com/callstack/react-native-testing-library)
