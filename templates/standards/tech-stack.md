# Tech Stack

> Read by every AI-DLC agent before acting. Keep current.

## Core
- **Framework:** React Native (New Architecture / Fabric + TurboModules).
- **Bundler:** **Re.Pack** (webpack/Rspack) — **NOT Metro**. Do not generate Metro-specific config.
- **Code splitting / microfrontends:** Module Federation v2 — host app + on-demand remote chunks (JS or Hermes bytecode).
- **JS engine:** Hermes (bytecode chunks, tree-shaking enabled).
- **Language:** TypeScript.

## Conventions
- Lists: **FlashList** (not FlatList) for any scrolling collection.
- Navigation: native-stack / native navigators (not JS-only stacks).
- State: <fill in — e.g. Zustand / Redux Toolkit / React Query>.
- Package manager / monorepo: <fill in — e.g. pnpm workspaces; remotes as workspace packages>.

## Federation boundaries (fill in per project)
- Host bundle contains: <core nav, auth, shared UI>.
- Federated remotes: <feature A, feature B> — downloaded on demand.
- Shared singletons across chunks: react, react-native, navigation, state lib (pin versions to avoid duplication).

## Performance budget
- Target FPS: 60. Time-to-interactive: <fill in> ms. Host chunk ceiling: <fill in> KB.
