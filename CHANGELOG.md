# Changelog

All notable changes to **rn-repack-aidlc** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/), and the project
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.8.0] — 2026-06-26

### Added
- **Backend question in Inception** — `aidlc-inception` now asks, at Checkpoint 1
  (especially for migrations): reuse an existing backend, build your own, or
  hybrid? Do you control it? Are the writes callable from a native client
  (server actions/RSC are not)? The answer plans backend bolts up front instead
  of letting a "reuse backend, no changes" assumption slip into requirements and
  get disproven mid-Construction. Retro learning from the Betmeet migration,
  where the Write-Path Audit spike caught this late.

## [0.7.0] — 2026-06-26

### Added
- **Activation checklist** (`templates/activation-checklist.md`) — a structured
  template the Operations agent fills into `memory-bank/operations/`, making the
  "code-complete ≠ running" boundary explicit: the manual, environment-specific
  steps only the user can run (apply migrations, deploy functions, native
  rebuild, dashboard config, seed). Wired into `aidlc-operations` and the
  `/operations` command. Emerged as a retro learning from the Betmeet build,
  which wrote such a checklist by hand.

### Documentation
- README (EN/ES) accuracy pass: corrected stale counts in the intro and
  "What's inside" table — **5 agents** (was 4) and **eight skills** (was four).

## [0.6.0] — 2026-06-26

### Fixed
- **`/change` command didn't load** — it existed in `commands/change.md` and was
  documented, but was missing from the `plugin.json` `commands` array (the same
  "won't load" bug class as 0.3.1). Registered it; `/rn-repack-aidlc:change` now
  works. Surfaced by real-world use (the Betmeet migration).

### Changed
- **`scripts/check-docs-commands.mjs` now also verifies the manifest** — every
  `commands/*.md` must be registered in `plugin.json` (and vice versa), not just
  documented. This guard would have caught the `/change` bug; it now runs in CI
  and pre-commit.
- `docs/ARCHITECTURE.md` / `.es.md` updated to ten commands (added `/change`).

### Added
- **`/change`** is now a first-class, loadable command — evolves the AI-DLC
  artifacts mid-Construction when a new/omitted requirement, architectural
  change, or spec inconsistency surfaces; produces a classified impact summary
  and waits for approval before resuming. (Emerged from the Betmeet build.)

## [0.5.0] — 2026-06-26

### Added
- **`docs/ARCHITECTURE.md` / `docs/ARCHITECTURE.es.md`** — a consolidated deep
  dive into the five agents (personas, checkpoints, DDD stages), the nine
  commands, and the nine skills, plus how the layers fit together. Linked from
  both READMEs. The detail previously lived scattered across the source files;
  this is the first human-facing reference doc for the plugin's architecture.

## [0.4.0] — 2026-06-26

### Added
- **Memory Bank** — `templates/activeContext.md` (short-term: current focus,
  recent decisions, blockers, next step) and `templates/progress.md` (long-term:
  milestones, bolt statuses, deferred tasks). `/aidlc-init` copies both into
  `memory-bank/`, and all five agents read them at start and update them at
  phase/bolt boundaries. (PR #1, by @ricardofco.)
- `CLAUDE.md.template` now has a "Session start" section instructing Claude to
  read and update the two memory files every session — so the Memory Bank
  actually drives cross-session continuity.

### Documentation
- Clarify that plugin commands are **namespaced** — invoke as
  `/rn-repack-aidlc:<name>` (e.g. `/rn-repack-aidlc:aidlc-init`). Noted in both
  READMEs and usage guides, with a reminder to restart the session if a command
  shows "Unknown command".
- Add a "Maintaining this guide" section to `USAGE.md` / `USAGE.es.md`: the usage
  guide must be updated on any usability change, kept in sync across languages,
  and with every command documented (both enforced by the docs guards).

## [0.3.1] — 2026-06-25

### Fixed
- Commands and agents were not loaded after install (`Unknown command: /aidlc-init`).
  0.2.1 removed the `commands`/`agents` keys to pass validation, but they are
  **required as arrays of file paths** (matching the official Vercel plugin) —
  auto-discovery alone does not register them. Declared all 9 commands and 5
  agents explicitly.

## [0.3.0] — 2026-06-25

### Added
- **`USAGE.md` / `USAGE.es.md`** — step-by-step guide for applying the plugin in
  a project (Expo and bare-RN tracks), linked from both READMEs.
- **Command-coverage guard** (`scripts/check-docs-commands.mjs`) — fails CI and
  pre-commit if any command in `commands/` is not documented in the usage docs
  and READMEs, so docs can't silently fall behind the commands.

### Changed
- The docs CI workflow and pre-commit hook now run both guards (i18n sync +
  command coverage) and trigger on `commands/**` changes too.

## [0.2.1] — 2026-06-25

### Fixed
- Plugin failed to install with `agents: Invalid input` — the manifest declared
  `commands`/`agents` as string paths. Removed both keys; Claude Code
  auto-discovers the `commands/`, `agents/`, and `skills/` directories.

## [0.2.0] — 2026-06-25

### Added
- **`/repack-init`** command + `templates/repack/` — scaffolds a real Re.Pack +
  Module Federation v2 setup (host + remote configs, runtime `ScriptManager`
  resolver, `SETUP.md`), based on the official `callstack/repack` example.
- **Per-project `CLAUDE.md`** generation (`templates/CLAUDE.md.template`), wired
  into `/aidlc-init` so the standards load every session (persistent memory).
- **`/operations`** command driving the `aidlc-operations` agent (Dev → Staging
  → Prod progression, rollback).
- **Simple** and **FIRE** flows — `/simple-spec`, `/fire` + `fire-executor`
  agent + `templates/simple/`, plus a `/spec-flow` selector. All three specs.md
  flows are now covered.
- **Four ported skills** from the `expo-config-template` project:
  `react-best-practices`, `composition-patterns`, `github-actions`,
  `upgrading-react-native` (Expo/EAS-specific skills excluded — this stack uses
  Re.Pack, not Metro). Now 8 referenced skills.
- **`i18n-doc-sync`** bundled skill + a hard guard: `scripts/check-i18n-docs.mjs`,
  CI workflow, and a pre-commit hook keep localized Markdown variants in sync.
- **Bilingual docs** — `README.es.md` with a language toggle.
- **Marketplace** manifest (`.claude-plugin/marketplace.json`) — installable via
  `/plugin marketplace add`.
- **MIT license.**
- **Skill-precedence** block in `coding-standards.md` (project standards win).

### Changed
- The four AI-DLC agents refined against the canonical `specs.md` prompts:
  personas, Inception's 4-checkpoint + auto-continue rule, Construction's
  never-auto-select / never-create-bolt rule, Operations' strict environment
  progression.

## [0.1.0] — 2026-06-25

### Added
- Initial plugin: AI-DLC flow for React Native + Re.Pack — 4 agents
  (`aidlc-master/inception/construction/operations`), `/aidlc-init`,
  `/aidlc-inception`, `/bolt-start`, `/setup-skills`, and the four
  `memory-bank/standards/` templates. References the four core callstack skills.

[Unreleased]: https://github.com/DentVega/rn-repack-aidlc/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.8.0
[0.7.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.7.0
[0.6.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.6.0
[0.5.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.5.0
[0.4.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.4.0
[0.3.1]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.3.1
[0.3.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.3.0
[0.2.1]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.2.1
[0.2.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.2.0
[0.1.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.1.0
