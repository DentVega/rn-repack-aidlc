---
description: Start the AI-DLC Inception phase — capture an intent, elaborate requirements, decompose into units/stories, and plan bolts.
argument-hint: "[the feature or objective]"
---

Delegate to the `aidlc-inception` agent to run the Inception phase for: $ARGUMENTS

Make sure `memory-bank/standards/` exists first (if not, tell the user to run `/aidlc-init`). The agent must produce, with a human checkpoint after each artifact:

1. `memory-bank/intents/{intent-id}/requirements.md`
2. `memory-bank/intents/{intent-id}/system-context.md` (include the Module Federation host/remote topology)
3. `units/{unit-id}/unit-brief.md` for each unit
4. `stories/` under each unit
5. A bolt plan

Remember to ask whether each feature is a federated remote or part of the host bundle, and whether native modules are required.
