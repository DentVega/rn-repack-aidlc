# Coding Standards

> Applied during the Construction **Implement** stage.

## Performance skills — delimited triggers (avoid overlap)

These two skills both cover RN performance. Use them at **different moments**:

| Skill | When | Role |
|---|---|---|
| `vercel-react-native-skills` | While **writing** components | Prescriptive ruleset (30+ rules). The default. |
| `react-native-best-practices` | While **debugging** a measured problem | Diagnostic/profiling (jank, leaks, frame drops, TTI). |

Do not invoke both for the same task. If you are authoring code → Vercel rules. If you are chasing a perf bug → best-practices.

## Baseline rules (from the Vercel ruleset, summarized)
- Virtualize lists with **FlashList**; never map large arrays into a ScrollView.
- **Memoize** list items and stable callbacks; avoid inline objects/functions in hot render paths.
- Animate **only `transform` and `opacity`** (drive with Reanimated on the UI thread).
- Prefer **native navigators** over JS-driven navigation.
- Keep the host bundle lean — push heavy/optional features into **federated remote chunks** (Re.Pack).
- Pin shared singletons (react, react-native, nav, state) across federated chunks.

## TypeScript / general
- Strict mode on. No `any` in domain code.
- Domain logic (Model stage output) lives separate from UI and is unit-tested.
