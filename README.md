# rn-repack-aidlc

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

Skills are **referenced, not vendored** — install them with `/setup-skills` (uses `npx skills add`, always latest).

## Agents

- `aidlc-master` — orchestrates; routes between phases; keeps `memory-bank/` coherent.
- `aidlc-inception` — WHAT/WHY: intents → requirements → units/stories → bolt plan.
- `aidlc-construction` — HOW: Model → Design → ADR → Implement → Test, per bolt.
- `aidlc-operations` — Re.Pack build, serve federated chunks, verify, monitor.

## Commands

- `/aidlc-init` — scaffold `memory-bank/` and seed the four standards.
- `/setup-skills` — install the four referenced skills.
- `/aidlc-inception [objective]` — run the Inception phase.
- `/bolt-start [bolt]` — execute a bolt through the DDD stages.

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
.claude-plugin/plugin.json
agents/         aidlc-{master,inception,construction,operations}.md
commands/       aidlc-init, aidlc-inception, bolt-start, setup-skills
templates/standards/  tech-stack, coding-standards, system-architecture, testing-standards
```

## License

MIT — see [LICENSE](LICENSE).

## Credits

- Methodology: [specs.md / AI-DLC](https://specs.md) ([fabriqaai/specs.md](https://github.com/fabriqaai/specs.md))
- Bundler: [Re.Pack](https://re-pack.dev)
- Skills: [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills), [callstackincubator/agent-device](https://github.com/callstackincubator/agent-device), [callstack/react-native-testing-library](https://github.com/callstack/react-native-testing-library)
