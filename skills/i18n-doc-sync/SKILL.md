---
name: i18n-doc-sync
description: Keep localized Markdown variants in sync. Use whenever editing, adding to, or restructuring any Markdown doc that has translated counterparts (e.g. README.md and README.es.md). Triggers on any change to a base `<name>.md` or a localized `<name>.<lang>.md` file — the same change must be mirrored to every language variant so docs never drift out of sync.
---

# i18n Doc Sync

Documentation in this repo is **multilingual**. Each document has a base file and one localized variant per supported language. They must always stay equivalent in content and structure — only the prose language differs.

## Naming convention

- **Base / default (English):** `<name>.md` (e.g. `README.md`)
- **Localized variants:** `<name>.<lang>.md` where `<lang>` is an ISO 639-1 code (e.g. `README.es.md` for Spanish)

The set of supported languages = every `<name>.<lang>.md` that exists for a given base, plus the base itself. To discover them, glob the sibling files: `README*.md` → `README.md`, `README.es.md`, …

## The rule

**Any edit to one language version of a doc MUST be applied to every other language version in the same edit/turn.** Never leave variants out of sync.

This applies to:
- Editing existing content (text, tables, code blocks, links)
- Adding or removing sections
- Reordering or renaming headings
- Updating commands, file paths, or examples

## Workflow when you change a localized doc

1. **Identify the family.** From the file you're editing, glob its siblings (`<name>*.md`) to list every language variant.
2. **Apply the change to all of them**, translating prose into each target language. Keep these *identical* across variants (do NOT translate them):
   - Code blocks, commands, file paths, slash-command names, and identifiers
   - Heading anchors that are linked elsewhere (keep structure parallel so cross-links work)
   - URLs
3. **Keep structure parallel.** Same heading order, same number of sections, same tables. A reader should get the same information regardless of language.
4. **Update the language switcher** at the top of each file if you add/remove a language (the `English · Español · …` line).
5. **Verify before finishing:** every variant has the same set of headings and the same code/commands. If you cannot translate a part confidently, add it in the base language and flag it with a `<!-- TODO: translate -->` comment rather than silently omitting it.

## Adding a new language

1. Copy the base `<name>.md` to `<name>.<lang>.md`, translate the prose.
2. Add the new language to the switcher line in **every** existing variant.
3. From now on, this language is part of the sync set — include it in all future edits.

## Scope

Applies to all human-facing Markdown docs with variants (`README`, `CONTRIBUTING`, docs pages, etc.). It does **not** apply to single-language machine-facing files (agent prompts in `agents/`, command files in `commands/`, skill files) — those have no localized counterparts and are not translated.
