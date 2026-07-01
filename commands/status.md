---
description: Report the current AI-DLC state — active intent, phase, bolt progress, and the next step — read from the Memory Bank.
---

Delegate to the `aidlc-master` agent to report the project's current AI-DLC status. Do NOT write code or modify artifacts — this is read-only.

Read and summarize from the Memory Bank:

1. **`memory-bank/activeContext.md`** — current focus, recent decisions, blockers, immediate next step.
2. **`memory-bank/progress.md`** — overall status, bolts completed vs total, milestones, deferred/blocked tasks.
3. **`memory-bank/intents/`** — which intents exist and which is active.

Present a concise status:

- **Intent:** `<active intent>` · **Phase:** `<Inception / Construction / Operations>`
- **Bolts:** `<done>` / `<total>` — next: `<next bolt or action>`
- **Blockers:** `<any, or "none">`
- **Suggested next command:** e.g. `/bolt-start <next>`, `/operations`, or `/aidlc-inception` for a new intent.

If `memory-bank/` does not exist, say the project isn't initialized and point to `/aidlc-init`. Keep it short — this is a dashboard, not a report.
