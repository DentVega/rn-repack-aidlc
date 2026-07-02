# Contributing to rn-repack-aidlc

Thanks for contributing! This plugin enforces a few invariants with automated
guards so nothing silently breaks. Read this before opening a PR — it will save
you a red CI run.

## Run the guards locally

```bash
node scripts/check-plugin.mjs        # manifest/agents/commands/skills valid + registered
node scripts/check-i18n-docs.mjs     # localized docs (README/USAGE/ARCHITECTURE) in sync
node scripts/check-docs-commands.mjs # every command documented + in the manifest
```

Optional — run them automatically before each commit:

```bash
ln -sf ../../scripts/pre-commit .git/hooks/pre-commit
```

All three also run in CI on every PR.

## Adding a command (read this — it's the #1 source of breakage)

A command needs **three** things, or it silently won't load (this bit us twice):

1. Create `commands/<name>.md` with YAML frontmatter (`description:`, optional `argument-hint:`).
2. **Register it in `.claude-plugin/plugin.json`** under `"commands"` as `"./commands/<name>.md"`. This is required — commands are NOT auto-discovered.
3. Document it as `/<name>` in **all four** docs: `README.md`, `README.es.md`, `USAGE.md`, `USAGE.es.md` (and add a row to `docs/ARCHITECTURE.md` + `.es.md`).

`check-plugin.mjs` enforces (2); `check-docs-commands.mjs` enforces (3).

> Commands are invoked namespaced: `/rn-repack-aidlc:<name>`.

## Adding an agent
1. Create `agents/<name>.md` with frontmatter `name:` + `description:`.
2. Register it in `plugin.json` under `"agents"`.

## Referencing plugin files from agents/commands
Agents and commands run **in the user's project**, so a bare path like
`docs/OTA.md` or `templates/repack/` gets looked up in the project — and
reported "missing" (this happened in the field). Always qualify:
- **Commands:** use `${CLAUDE_PLUGIN_ROOT}/…` (Claude Code resolves it to the
  plugin install directory).
- **Agents:** say "the plugin's `<path>` (a plugin file, not a project file)"
  and, for docs, add the GitHub URL.

## Editing docs — keep languages in sync
Every user-facing doc has a base (`<name>.md`) and a Spanish variant
(`<name>.es.md`). **Any edit to one must be mirrored in the other** — same
structure (headings, code blocks, tables); translate prose, keep code/commands
identical. `check-i18n-docs.mjs` compares the skeletons and fails on drift.
Maintainer/internal docs (agents, `docs/DEFERRED.md`) are single-language and exempt.

## Versioning
[Keep a Changelog](https://keepachangelog.com/) + [SemVer](https://semver.org/).
Bump `version` in `plugin.json` **and** both `version` fields in
`marketplace.json`, add a `CHANGELOG.md` entry, and update the "Current version"
line in both READMEs. Tag `vX.Y.Z` and cut a GitHub release.

## Scope
The plugin is **frontend-first** (React Native + Re.Pack). Backend concerns are
intentionally out of scope for now — see [docs/DEFERRED.md](docs/DEFERRED.md).
