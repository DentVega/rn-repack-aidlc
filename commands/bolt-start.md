---
description: Execute a planned bolt through the AI-DLC Construction DDD stages (Model → Design → ADR → Implement → Test).
argument-hint: "[bolt id or story name]"
---

Delegate to the `aidlc-construction` agent to execute the bolt: $ARGUMENTS

The agent must walk the five DDD stages in order with a checkpoint between each:

1. **Model** — domain logic / ubiquitous language
2. **Design** — components, state, and host-vs-federated-remote placement (Re.Pack)
3. **ADR** — record each non-trivial decision under `memory-bank/bolts/{bolt-id}/`
4. **Implement** — write code; apply `vercel-react-native-skills` rules while writing
5. **Test** — `react-native-testing-library` for component tests, then `agent-device` for device-level verification

If a performance problem is measured during Implement/Test, pull in `react-native-best-practices` (diagnostic). Record the bolt outcome under `memory-bank/bolts/{bolt-id}/`.
