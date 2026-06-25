---
description: "specs.md FIRE flow — rapid, adaptive execution on an existing (brownfield) RN + Re.Pack app, with intelligent 0–2 checkpoints."
argument-hint: "[the feature to build]"
---

Run the specs.md **FIRE flow** by delegating to the `fire-executor` agent for: $ARGUMENTS

FIRE = Fast, Iterative, Rapid Execution. It is the middle ground between Simple (spec-only) and AI-DLC (full ceremony): it executes, but places only **0–2 checkpoints** based on complexity, and is **brownfield-aware** — it respects the existing code's patterns instead of imposing new ones.

The agent must:
1. Read `memory-bank/standards/` and scan the existing codebase to learn its conventions (folder layout, state lib, navigation, existing Re.Pack federation setup).
2. Assess complexity and decide the checkpoint count (0 = trivial, 1 = moderate, 2 = risky/cross-cutting). State the count and why.
3. Produce a short inline plan, then implement following the existing patterns + the standards' RN performance rules.
4. Test with `react-native-testing-library`; for user-facing flows, smoke-verify with `agent-device`.

Use this when the app already exists and you want speed with light guardrails. If the change is trivial → suggest `/simple-spec`; if it needs domain modeling/ADRs → suggest `/aidlc-inception`.
