---
description: "Tech-debt / code-health audit — run the toolchain (tsc, eslint, dead-code, circular deps) plus an RN-specific review, and write a prioritized report."
argument-hint: "[path to audit, default src/]"
---

Delegate to the `code-auditor` agent to audit code health for: $ARGUMENTS (default `src/`).

The agent must:

1. **Run the real toolchain** that the project has: `tsc --noEmit`, `eslint`, and (if present) `knip`/`ts-prune` for dead code and `madge --circular`. Capture errors + warnings; note any missing tool as a recommendation. Do not install tools without asking.
2. **Add an RN-specific review** the linters can't do — unmemoized lists, inline render objects, non-`transform`/`opacity` animations, hardcoded colors/spacing (vs `design-standards.md`), testing gaps, a11y gaps, oversized components, stray `console.log`/TODO, and any Metro config that slipped in.
3. **Write `memory-bank/operations/tech-debt.md`** — a severity summary plus a prioritized table (🔴/🟡/🟢 · category · `file:line` · finding · fix), tool-found findings separated from review-found ones.

Read-only: present and rank the debt; only fix if the user asks afterward. This is on-demand analysis, not real-time editor inspection.
