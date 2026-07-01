---
description: "Retrospective of the AI-DLC cycle — what was built, key decisions, friction points, and improvement recommendations. Read-only."
argument-hint: "[intent or scope to reflect on, default: the active intent]"
---

Delegate to the `aidlc-master` agent to run a retrospective for: $ARGUMENTS (default: the active intent).

**Do NOT modify code or artifacts** — this is analysis only. Read the Memory Bank (`progress.md`, `activeContext.md`, `memory-bank/audit.md` if present), the bolt records under `memory-bank/bolts/`, and the ADRs, then summarize:

1. **What was built** — intents/bolts completed, scale (screens, functions, tests).
2. **Key decisions** — the ADRs and scope calls that shaped the work, and whether they held up.
3. **Friction points** — where the flow slowed down or a bolt had to be replanned: assumptions that proved wrong, gaps discovered mid-Construction, activation surprises, tooling issues.
4. **Recommendations** — concrete improvements for the next intent, each classified as: a standards update (`memory-bank/standards/`), a process change, a deferred idea (→ `DEFERRED.md`), or feedback for the plugin itself.

Write the retro to `memory-bank/operations/retro-<intent-id>.md` and present the summary. Suggest — but don't apply — the recommended changes; the user decides which to act on.

Run this at the end of an intent (or a major version), while the context is fresh. Retros are where the process improves — treat friction as data, not failure.
