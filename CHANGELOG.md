# Changelog

All notable changes to **rn-repack-aidlc** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/), and the project
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.3.1] — 2026-07-02

### Fixed
- **Plugin-internal paths reported "missing" in the field** — a real `/federate`
  run flagged `docs/OTA.md` as nonexistent and suggested creating it in the
  user's project. Agents/commands run in the project, so bare plugin paths
  (`docs/OTA.md`, `templates/…`) got looked up there. All 11 internal references
  are now qualified: commands use `${CLAUDE_PLUGIN_ROOT}/…`; agents say "the
  plugin's `<path>` (not a project file)" with the GitHub URL for docs. Added a
  CONTRIBUTING rule so the pattern isn't reintroduced.

## [1.3.0] — 2026-07-02

### Added
- **Library sharing between mini-apps, first-class** — verified against the
  official Re.Pack docs (global share scope, `loaded-first` default strategy,
  auto-shared react/RN deep imports) and upgraded the templates accordingly:
  - `templates/repack/*.mjs`: a commented **app-level shared singletons** block
    (TanStack Query, Zustand, i18next, session client) with the rule that
    **stateful libraries must be shared singletons** — a per-remote copy splits
    caches/stores/sessions; plus a consume-only (`import: false`) slimming note
    for remotes.
  - `templates/repack/SETUP.md`: section rewritten as "Sharing libraries between
    mini-apps" — share-scope semantics, stateful-singleton rule,
    `strictVersion`, consume-only trade-off.
  - `system-architecture.md` standard: shared-library rule (one identical
    `shared` list across host and all remotes, stateful libs included).
  - `federation-analyst`: its report now specifies which stateful libs the
    candidates must add to `shared`.

## [1.2.0] — 2026-07-02

### Added
- **Federation candidate analysis** — a `federation-analyst` agent + `/federate
  [path]` command that scan the codebase, score each feature against Module
  Federation criteria (native deps as a hard gate, coupling, startup-criticality,
  weight, update cadence, ownership) and recommend which parts could become
  federated mini-apps — writing `memory-bank/operations/federation-candidates.md`
  with a first-carve recommendation, or an explicit "stay single-bundle" verdict
  (federation must earn its complexity). Bridges the gap between the deliberate
  single-bundle default and `/repack-init`: the plugin now helps decide *what*
  to carve, not just *how*. The Operations OTA note suggests it for single-bundle
  apps. Now 8 agents / 15 commands.

## [1.1.0] — 2026-07-02

_First post-1.0 minor — every change here came from running `/reflect` on the
Betmeet v2 cycle (the retro command producing plugin improvements on its first
real use). All additive; the 1.0 surface is unchanged._

### Added
- **Native deps: probe-first** (`aidlc-construction`, ADR stage) — before
  designing around a new native dependency, verify it compiles on the project's
  RN version; a failed probe picks an alternative or defers NOW, recorded in the
  ADR. (An image-picker that broke codegen deferred a whole bolt after its
  screens were designed.)
- **`activation-pending` flag** (`aidlc-inception`, bolt planning) — bolts that
  depend on external infrastructure (push certs, WebAuthn domains, store
  config) are flagged up front; their exit criteria become "code-complete +
  activation steps documented", feeding the Operations activation checklist.
- **Minimum test per bolt** (`testing-standards.md`) — every screen bolt ships
  at least one RNTL component test or it is not done; domain bolts ship unit
  tests. (A real 15-bolt cycle ended with zero component tests — test debt
  drifts silently without a hard rule.)

### Noted
- The retro also suggested an Inception scope check (recommend `/simple-spec` /
  `/fire` for small intents); not adopted for now.

## [1.0.0] — 2026-07-02

**First stable release.** The plugin has completed a full cycle: built from
scratch, validated on a real-world migration (Betmeet: 24 bolts, own Supabase
backend, design parity), hardened by that use (manifest fixes, guards, retro
learnings), extended with capabilities that emerged from practice (`/change`,
activation checklist, `/parity`, `/audit`, `/reflect`, audit trail), and
protected by three CI/pre-commit guards.

### Stability commitment
- Command names/arguments, agent names, and the `memory-bank/` layout are
  **frozen** — breaking changes only in a major version. Additive features land
  in minors; fixes in patches.
- Surface at 1.0: **7 agents · 14 commands · 9 skills (8 referenced + 1
  bundled) · 5 standards templates · 3 guards.**

### Changed
- README (EN/ES) Layout block refreshed to the full current surface (all 7
  agents, 14 commands, 3 guard scripts, current templates); removed a stale
  duplicated `commands/` line.

## [0.13.0] — 2026-07-01

### Added
_Ideas adopted after reviewing [dynamicdevs/claudecode-aidlc-plugin](https://github.com/dynamicdevs/claudecode-aidlc-plugin), which vendors the [AWS Labs aidlc-workflows](https://github.com/awslabs/aidlc-workflows) rules:_
- **`/reflect` command** — a read-only retrospective of the cycle: what was
  built, which decisions held up, friction points, and recommendations
  (classified as standards updates, process changes, deferred ideas, or plugin
  feedback), written to `memory-bank/operations/retro-<intent>.md`. Codifies the
  manual retro that produced releases 0.6–0.8.
- **Overconfidence prevention** in `aidlc-inception` — "when in doubt, ask":
  never skip question categories without a stated reason, follow up on unclear
  answers, and never proceed past Checkpoint 1 with a silent assumption
  (generalizes the "assumed backend reuse" lesson from the Betmeet migration).
- **Audit trail** — `templates/audit.md` seeded by `/aidlc-init` into
  `memory-bank/audit.md`: an append-only log of raw requests, checkpoint
  decisions, and skips, maintained by `aidlc-master`. "Why did we do X?" always
  has a traceable answer.
- `docs/DEFERRED.md`: noted the **opt-in extensions** mechanism (modular rule
  sets asked at Inception) as the generalized form of the conditional
  backend-standards idea.

## [0.12.0] — 2026-07-01

### Added
- **Tech-debt / code-health audit** — a `code-auditor` agent + `/audit [path]`
  command. Runs the real toolchain (`tsc --noEmit`, `eslint`, and — if present —
  `knip`/`ts-prune` for dead code and `madge` for circular deps), then adds an
  RN-specific review the linters can't do (unmemoized lists, inline render
  objects, hardcoded styles vs `design-standards.md`, testing/a11y gaps,
  oversized components, stray `console.log`, Metro config that slipped in). Writes
  a prioritized `memory-bank/operations/tech-debt.md` (🔴/🟡/🟢, tool-found vs
  review-found separated). Read-only; on-demand, not real-time editor inspection.
  Now 7 agents / 13 commands; ARCHITECTURE updated.

## [0.11.0] — 2026-07-01

### Added
- **Design standards** (`templates/standards/design-standards.md`) — a design-
  system standard seeded by `/aidlc-init`: design tokens (semantic color,
  spacing, typography scales), light/dark theming from day one, themed
  primitives instead of raw RN components, a11y baseline (44pt targets,
  contrast, dynamic type), and motion. The Construction Design stage now applies
  it. Closes the last real gap from the Betmeet build, whose theming was done as
  a late ad-hoc "design-parity" bolt.
- **Template smoke tests in the doctor** (`scripts/check-plugin.mjs`) — every
  shipped `.mjs` template/script must parse (`node --check`) and every `.json`
  must be valid, so a broken Re.Pack config template can't ship. Verified with a
  negative test.

## [0.10.0] — 2026-07-01

### Added
- **Migration parity toolkit** — a dedicated `parity-analyst` agent plus a
  `/parity [source]` command that compare a source app's surface (screens,
  units, endpoints) against the mobile project's coverage and produce a coverage
  matrix in `memory-bank/operations/parity-matrix.md`, flagging anything
  **MISSING** (in the source but not covered and not a recorded decision). Its
  principle: prefer flagging MISSING over assuming coverage. Migrations only —
  a greenfield project has no source to compare. The `aidlc-inception` agent now
  suggests running `/parity` after decomposition for migration intents.
  Automates the manual "web-vs-mobile gap analysis" the Betmeet migration did by
  hand. Now 6 agents / 12 commands; ARCHITECTURE updated accordingly.

## [0.9.0] — 2026-06-26

### Added
- **`/status` command** — a read-only dashboard that reports the active intent,
  current phase, bolts done vs total, blockers, and the suggested next command,
  read from the Memory Bank (`progress.md` / `activeContext.md`).
- **Plugin doctor** (`scripts/check-plugin.mjs`) — validates the plugin's own
  integrity: manifest parses with required fields, every agent/command file is
  registered in `plugin.json` (and vice versa), and agents/commands/skills have
  the required frontmatter. Catches the whole "won't load" bug class. Runs in CI
  and pre-commit alongside the other guards.
- **`CONTRIBUTING.md`** — how to run the guards, add a command (with the manifest
  step that bit us twice), keep docs bilingual, and version releases.
- **`docs/OTA.md` / `docs/OTA.es.md`** — guidance on shipping JS/Hermes updates
  without a store release via Re.Pack Module Federation (what's OTA-able, how it
  works, skew/fallback/rollout/rollback, store-policy note). Wired a note into
  the `aidlc-operations` agent.

### Changed
- The CI workflow and pre-commit hook now run three guards (plugin doctor + i18n
  sync + command coverage) and trigger on `agents/**`, `skills/**`,
  `.claude-plugin/**`, and `scripts/**` too.
- `docs/ARCHITECTURE.md` / `.es.md` updated to eleven commands (added `/status`).

### Documentation
- Add `docs/DEFERRED.md` — a maintainer backlog of intentionally-deferred ideas
  with their reasoning. First entry: backend standards (keep the plugin
  frontend-first for now; revisit conditionally if building backends becomes
  common). Linked from both READMEs.

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

[Unreleased]: https://github.com/DentVega/rn-repack-aidlc/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v1.3.1
[1.3.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v1.3.0
[1.2.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v1.2.0
[1.1.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v1.1.0
[1.0.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v1.0.0
[0.13.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.13.0
[0.12.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.12.0
[0.11.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.11.0
[0.10.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.10.0
[0.9.0]: https://github.com/DentVega/rn-repack-aidlc/releases/tag/v0.9.0
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
