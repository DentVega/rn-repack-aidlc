---
description: "specs.md Simple flow — generate requirements, design, and tasks docs for a small RN + Re.Pack change. Spec only, no execution tracking."
argument-hint: "[the change to spec]"
---

Run the specs.md **Simple flow** for: $ARGUMENTS

Generate three lightweight documents under `specs/{slug}/` (no agents, no bolts, no execution tracking). Read `memory-bank/standards/` first so the design respects the RN + Re.Pack stack.

Produce, with a single review checkpoint at the end:

1. **`specs/{slug}/requirements.md`** — problem, goal, acceptance criteria (bullet list), non-goals.
2. **`specs/{slug}/design.md`** — approach in the RN + Re.Pack context: components touched, host-vs-remote placement if relevant, state/data flow. Keep it short.
3. **`specs/{slug}/tasks.md`** — an ordered, checkbox task list small enough to implement directly.

Apply the standards' coding rules (FlashList, memoization, transform/opacity animations, Re.Pack — never Metro). Use the templates in the plugin's `${CLAUDE_PLUGIN_ROOT}/templates/simple/` as the starting structure.

Stop after the three docs exist. Do NOT start implementing unless the user explicitly asks — Simple flow is spec-only. If the work turns out larger than expected, suggest switching to `/fire` or `/aidlc-inception`.
