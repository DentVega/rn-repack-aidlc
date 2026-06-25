---
description: Choose the right specs.md flow (Simple, FIRE, or AI-DLC) for the task at hand and start it.
argument-hint: "[what you want to build]"
---

Help the user pick and start the right specs.md flow for: $ARGUMENTS

specs.md offers three flows at different ceremony levels. All three reuse the same `memory-bank/standards/` (React Native + Re.Pack) and the same four skills — only the process weight changes.

| Flow | Use when | Command |
|---|---|---|
| **Simple** | Small, well-understood change: one component, a bug fix, a tweak. Spec only, no execution tracking. | `/simple-spec` |
| **FIRE** | Medium feature on an **existing** (brownfield) Re.Pack app. Rapid, adaptive, 0–2 checkpoints. | `/fire` |
| **AI-DLC** | New federated remote, complex domain, needs DDD + full traceability. | `/aidlc-inception` |

Decision guide:
1. Is this just generating a spec to hand off / think through? → **Simple**.
2. Is it execution on an existing codebase where you want speed with light guardrails? → **FIRE**.
3. Is it a substantial new domain/remote needing modeling, ADRs, and bolts? → **AI-DLC**.

If `memory-bank/standards/` doesn't exist yet, run `/aidlc-init` first (all flows read those standards). Then recommend ONE flow with a one-line rationale and invoke its command.
