---
description: "AI-DLC Operations phase for React Native + Re.Pack — build with Re.Pack (Module Federation chunks), serve/host remotes, verify, and monitor."
argument-hint: "[bolt id, release, or 'build' | 'verify' | 'deploy']"
---

Delegate to the `aidlc-operations` agent to run the Operations phase for: $ARGUMENTS

Run only after a bolt's code is implemented and its tests pass (`/bolt-start` → done). The agent must, with a confirmation checkpoint before any deploy/release or hosting change:

1. **Build** — run the Re.Pack/Rspack build; produce the host bundle + federated remote chunks (JS or Hermes bytecode). Check chunk sizes against the perf budget in `memory-bank/standards/tech-stack.md`.
2. **Serve/host remotes** — configure/confirm where remote chunks are hosted (env-aware: dev server vs. prod CDN) and how the host resolves them at runtime. Record in `memory-bank/operations/`.
3. **Verify** — smoke-test (optionally via `agent-device`): host boots, a remote chunk downloads + mounts, and the fallback path works on network failure.
4. **Monitor** — note what to watch post-release: chunk load failures, host/remote version skew, startup time.

Honor the Re.Pack release checklist (compatible `@module-federation` shared-deps versions, no React/RN duplication across chunks, source maps + symbolication). Record release context and rollback notes under `memory-bank/operations/`. If CI/CD is involved, the `github-actions` skill covers the pipeline.

Also generate/update `memory-bank/operations/activation-checklist.md` from the plugin's `${CLAUDE_PLUGIN_ROOT}/templates/activation-checklist.md` — the manual steps only the user can run to go from code-complete to a running app (migrations, function deploys, native rebuild, dashboard config, seed). Surface the unchecked items rather than claiming the app is live.
