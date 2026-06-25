# rn-repack-aidlc

**English** · [Español](README.es.md)

A Claude Code plugin for **spec-driven React Native + Re.Pack development** using the **AI-DLC** methodology from [specs.md](https://specs.md).

It bundles the AI-DLC agents and workflow, pre-seeds standards for a Re.Pack (Module Federation) stack, and wires in four battle-tested callstack skills — with their triggers delimited so nothing collides.

## What's inside

| Layer | Provided by |
|---|---|
| **Process** (4 agents, bolts, DDD, memory-bank) | This plugin — AI-DLC adapted from specs.md |
| **Build** | Re.Pack (webpack/Rspack + Module Federation v2) — documented in standards |
| **Perf — write code** | `vercel-react-native-skills` (referenced) |
| **Perf — debug** | `react-native-best-practices` (referenced) |
| **Unit/component tests** | `react-native-testing-library` (referenced) |
| **Device E2E** | `agent-device` (referenced) |

The four RN skills are **referenced, not vendored** — install them with `/setup-skills` (uses `npx skills add`, always latest). The plugin also ships one **bundled** skill, `i18n-doc-sync`, which keeps localized Markdown variants (e.g. this README and `README.es.md`) in sync on every edit.

## Three flows (one ceremony level each)

specs.md offers three flows. All reuse the same `memory-bank/standards/` and the same four skills — only the process weight changes. Use `/spec-flow` if unsure which to pick.

| Flow | Use when | Command |
|---|---|---|
| **Simple** | Small, well-understood change. Spec only (requirements/design/tasks), no execution tracking. | `/simple-spec` |
| **FIRE** | Medium feature on an existing (brownfield) Re.Pack app. Rapid, adaptive, 0–2 checkpoints. | `/fire` |
| **AI-DLC** | New federated remote / complex domain. 4 agents, bolts, DDD, full traceability. | `/aidlc-inception` |

## Agents

- `aidlc-master` — orchestrates AI-DLC; routes between phases; keeps `memory-bank/` coherent.
- `aidlc-inception` — WHAT/WHY: intents → requirements → units/stories → bolt plan.
- `aidlc-construction` — HOW: Model → Design → ADR → Implement → Test, per bolt.
- `aidlc-operations` — Re.Pack build, serve federated chunks, verify, monitor.
- `fire-executor` — FIRE flow: adaptive, brownfield-aware execution with 0–2 checkpoints.

## Commands

- `/aidlc-init` — scaffold `memory-bank/` and seed the four standards.
- `/setup-skills` — install the four referenced skills.
- `/spec-flow [task]` — pick and start the right flow (Simple / FIRE / AI-DLC).
- `/simple-spec [change]` — Simple flow: generate requirements/design/tasks.
- `/fire [feature]` — FIRE flow: rapid adaptive execution on an existing app.
- `/aidlc-inception [objective]` — AI-DLC: run the Inception phase.
- `/bolt-start [bolt]` — AI-DLC: execute a bolt through the DDD stages.

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
skills/           i18n-doc-sync (bundled)
templates/standards/  tech-stack, coding-standards, system-architecture, testing-standards
templates/simple/     requirements, design, tasks
```

## License

MIT — see [LICENSE](LICENSE).

## Credits

- Methodology: [specs.md / AI-DLC](https://specs.md) ([fabriqaai/specs.md](https://github.com/fabriqaai/specs.md))
- Bundler: [Re.Pack](https://re-pack.dev)
- Skills: [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills), [callstackincubator/agent-device](https://github.com/callstackincubator/agent-device), [callstack/react-native-testing-library](https://github.com/callstack/react-native-testing-library)
