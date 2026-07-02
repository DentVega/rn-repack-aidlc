---
description: "Scaffold a real Re.Pack + Module Federation v2 setup (host + one remote) into the current React Native project."
argument-hint: "[host name] [remote name] [remote port, default 8082]"
---

Scaffold a working **Re.Pack + Module Federation v2** setup into this project using the plugin's `${CLAUDE_PLUGIN_ROOT}/templates/repack/` files. Parse names/port from: $ARGUMENTS (defaults: host `HostApp`, remote `MiniApp`, port `8082`).

Steps:

1. **Confirm the stack.** Verify this is a bare React Native project (not Expo-managed — Expo uses Metro and is incompatible with this Re.Pack setup). If Metro config is present, flag it: Re.Pack replaces Metro.
2. **Copy templates** from `${CLAUDE_PLUGIN_ROOT}/templates/repack/`:
   - `rspack.config.host.mjs` → `rspack.config.mjs` (host)
   - `rspack.config.remote.mjs` → the remote's config
   - `ScriptManager.setup.js` → host source, imported at the top of the host `index.js`
   - `SETUP.md` → project root (or `docs/`)
3. **Replace placeholders** in every copied file: `[HOST_NAME]`, `[REMOTE_NAME]`, `[REMOTE_PORT]`.
4. **Wire the runtime resolver:** ensure the host `index.js` imports `./ScriptManager.setup` BEFORE the app registers/renders.
5. **Pin shared singletons:** read the project's `package.json` and confirm `react`, `react-native`, and the navigation libs exist; the configs share them `singleton: true` (host `eager: true`, remote `eager: false`). Keep the version lists identical between host and remote.
6. **Install deps** if missing (ask first): `@callstack/repack`, `@rspack/core`, and the shared navigation libs (see `SETUP.md`).
7. **Print run commands** from `SETUP.md` (remote dev server on the chosen port, then host).

Record the host/remote topology in `memory-bank/standards/system-architecture.md` if AI-DLC is initialized. Do NOT introduce any Metro config. Stop after the files exist and the run commands are shown; don't start the bundler unless asked.
