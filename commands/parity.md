---
description: "Migration parity / gap analysis — compare a source app's surface against the mobile project's coverage and flag anything MISSING."
argument-hint: "[path/reference to the source surface, e.g. ../web-app/aidlc-docs]"
---

Delegate to the `parity-analyst` agent to run a web-vs-mobile gap analysis. Source surface: $ARGUMENTS

This is a **migration-only** tool — it verifies the mobile project hasn't silently dropped features from the source app. If no source surface is given or resolvable, the agent should say parity analysis needs a source (a greenfield project has nothing to compare) and stop.

The agent must:

1. Build the **source surface** from $ARGUMENTS (another AI-DLC project's `aidlc-docs/inception` units, route/screen files, an API doc, or a sitemap).
2. Build the **mobile coverage** from `memory-bank/intents/*/units`, `bolt-plan.md`, `progress.md`, and `DEFERRED.md`.
3. Map them semantically (names differ across web/mobile) and classify each source item as covered / planned / deferred / out-of-scope / **MISSING**.
4. Write `memory-bank/operations/parity-matrix.md` with the full matrix + a summary count.
5. For each **MISSING** item, ask whether to add it (→ `/aidlc-inception`), defer it (→ `DEFERRED.md`), or mark it out-of-scope. Do not decide for the user.

Run this after Inception (to confirm the decomposition covers the source) and before declaring a version "parity-complete".
