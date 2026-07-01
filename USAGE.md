# Usage

[English](USAGE.md) · [Español](USAGE.es.md)

How to apply **rn-repack-aidlc** in a real project. Run these slash commands in a Claude Code session opened on **your app's folder** (not on this plugin repo). Install the plugin first — see [README](README.md#install).

> **Invoking commands:** they are namespaced — type `/rn-repack-aidlc:aidlc-init` (autocomplete after `/` helps). This guide uses the short `/aidlc-init` form for brevity. If a command says "Unknown command", restart the Claude Code session so it picks up the plugin.

## Track A — Existing Expo app

Use the methodology + skills, **without** Re.Pack (Expo managed uses Metro).

**Step 1 — Install the skills (once per machine)**
```text
/setup-skills
```
Runs eight `npx skills add`. Wait for "success" on each. They are user-level, so you don't repeat this per project.

**Step 2 — Initialize AI-DLC in the project**
```text
/aidlc-init recipes app with Expo Router and Firebase
```
Creates `memory-bank/standards/` (4 files), generates a root `CLAUDE.md`, and tells you the next step. Then edit `memory-bank/standards/tech-stack.md` to say "Expo + Metro" instead of Re.Pack for this project, and fill the `[PROJECT]` blanks in `CLAUDE.md`.

**Step 3 — Pick a flow by size**
```text
/spec-flow add a favorites screen
```
It recommends Simple / FIRE / AI-DLC. Or go direct: `/simple-spec <small change>`, `/fire <medium feature>`, or `/aidlc-inception <large feature>` → `/bolt-start` → `/operations`.

## Track B — Bare React Native (Re.Pack microfrontends)

**Step 0 — Create/open a bare RN app**
```bash
npx @react-native-community/cli init MyAppMF
cd MyAppMF
```

**Steps 1–2** — same as Track A (`/setup-skills`, `/aidlc-init`). Here you keep Re.Pack in the tech stack.

**Step 3 — Scaffold Re.Pack + Module Federation**
```text
/repack-init HostApp MiniApp 8082
```
Copies the host/remote configs and the `ScriptManager.setup.js`, replaces placeholders, asks to install `@callstack/repack` + `@rspack/core`, and prints the run commands.

**Step 4 — Run (two terminals)**
```bash
pnpm react-native start --config rspack.config.remote.mjs --port 8082
pnpm react-native start --config rspack.config.mjs
```

**Step 5 — Build a feature with a flow**
```text
/aidlc-inception gallery as a federated remote
```
Then `/bolt-start <first bolt>` and `/operations build`.

> **Mid-Construction change** — if a new requirement or inconsistency surfaces while a bolt is in progress, pause and run `/change <description> [source of truth]`. It classifies the change (omitted requirement, new requirement, architectural change…), updates only the affected artifacts, and tells you which bolts to regenerate — without writing any code. Resume Construction once you approve the updated plan.

> **Check progress anytime** — run `/status` for a read-only dashboard of the active intent, current phase, bolts done vs total, blockers, and the suggested next command (read from the Memory Bank).

> **Migrations only** — if you're porting an existing app, run `/parity <path to the source surface>` (e.g. the web app's `aidlc-docs`, routes, or API doc) to compare source coverage against your mobile project and flag anything MISSING. Run it after Inception and before declaring a version "parity-complete".

> **Worried about tech debt?** Run `/audit [path]` — it runs your toolchain (tsc, eslint, dead-code, circular deps) plus an RN-specific review (perf, hardcoded styles, missing tests, a11y) and writes a prioritized `tech-debt.md`. On-demand, not real-time editor inspection.

## How to know it's working

| Signal | Means |
|---|---|
| The `/commands` autocomplete when you type `/` | The plugin loaded |
| `/aidlc-init` creates `memory-bank/` + `CLAUDE.md` | Init OK |
| `/setup-skills` reports "success" ×8 | Skills installed |
| Next session Claude already "knows" your stack | `CLAUDE.md` is being loaded |

## Troubleshooting

- **A command doesn't appear** → reload the window; check `/plugin` shows `rn-repack-aidlc` enabled.
- **`/setup-skills` fails an `npx`** → usually network or missing `npx`; retry that single line.
- **Any other error** → open an issue with the exact message.

## Maintaining this guide

**Update this guide whenever the plugin's usability changes** — a new, renamed, or removed command; a change in how commands are invoked (e.g. the namespace); install/update steps; flow behavior; or anything a user types or sees. This file is the source of truth for *how to use* the plugin.

When you edit it:
- Mirror the change in the other language (`USAGE.es.md`) — enforced by `scripts/check-i18n-docs.mjs`.
- Keep every command documented — enforced by `scripts/check-docs-commands.mjs`.
- Both run in CI and pre-commit, so an out-of-date guide blocks the merge.
