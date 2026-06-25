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
