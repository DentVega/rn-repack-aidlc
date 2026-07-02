---
description: "Analyze the app and recommend which parts could become federated mini-apps (Re.Pack Module Federation remotes) — or whether to stay single-bundle."
argument-hint: "[path or feature to analyze, default: the whole app]"
---

Delegate to the `federation-analyst` agent to analyze federation candidates for: $ARGUMENTS (default: the whole app).

The agent must:

1. **Map the seams** — feature folders/modules, their screens and navigation entry points, imports in/out, and native-dependency usage.
2. **Score each seam** against the federation criteria: native deps (hard gate), coupling, startup-criticality, weight, update cadence, ownership. Every verdict cites evidence.
3. **Classify** each as 🟢 strong candidate / 🟡 possible / 🔴 keep in host, and — if there's a 🟢 — recommend the **first carve** with the concrete next step (`/repack-init`, or merging `ModuleFederationPluginV2` into an existing config; the plugin's `${CLAUDE_PLUGIN_ROOT}/docs/OTA.md` explains what it unlocks — it is a plugin file, NOT a project file; don't report it missing or create it in the project).
4. **Write the report** to `memory-bank/operations/federation-candidates.md`, including shared-singleton notes and a revisit trigger.

**"Stay single-bundle" is a valid recommendation** — federation must earn its complexity (chunk hosting, version skew, fallbacks). If nothing clears the bar, the agent says so plainly and notes what would change the answer.

Run this when the host bundle grows heavy, a feature area stabilizes behind navigation, or you're considering OTA updates — and re-run it as the app evolves.
