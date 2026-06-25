---
description: Install the four referenced callstack skills used by the AI-DLC RN + Re.Pack flow.
---

Install the four skills this plugin references (they are not vendored — always pulled fresh). Run each command and report success/failure:

```bash
# --- Core 4 (RN + Re.Pack) ---

# Performance — prescriptive ruleset (use while writing code)
npx -y skills add callstackincubator/agent-skills --skill vercel-react-native-skills --agent claude-code

# Performance — diagnostic/profiling (use while debugging jank/leaks)
npx -y skills add callstackincubator/agent-skills --skill react-native-best-practices --agent claude-code

# Device automation — E2E / smoke verification on iOS/Android/tvOS/macOS
npx -y skills add callstackincubator/agent-device --skill agent-device --agent claude-code

# Component/unit testing — React Native Testing Library
npx -y skills add callstack/react-native-testing-library --skill react-native-testing --agent claude-code

# --- Stack-agnostic 4 (curated from the expo-config-template project) ---

# Pure-React performance: request waterfalls, re-renders, data-fetching patterns
npx -y skills add vercel-labs/agent-skills --skill react-best-practices --agent claude-code

# Component composition: compound components, render props, avoid boolean-prop-hell
npx -y skills add vercel-labs/agent-skills --skill composition-patterns --agent claude-code

# CI/CD: PR workflows and GitHub Actions for RN (pairs with the Operations phase)
npx -y skills add callstackincubator/agent-skills --skill github-actions --agent claude-code

# Bare React Native version upgrades (keep a Re.Pack app current)
npx -y skills add callstackincubator/agent-skills --skill upgrading-react-native --agent claude-code
```

> These skills install **user-level** (`~/.claude/skills/`), so they apply across all your projects once installed — you do not need to re-run them per project.

After installing, remind the user of the delimited triggers to avoid the two RN perf skills colliding:
- **vercel-react-native-skills** → while WRITING components (default coding standard).
- **react-native-best-practices** → only when DEBUGGING a measured perf problem.
- **react-best-practices** (Vercel) is React-general (data fetching, re-renders) and complements — does not replace — the RN-specific rules.

Precedence: when any skill contradicts `memory-bank/standards/`, the standards win (see coding-standards.md).

Verify with the user that the skill registry/network was reachable; if any command failed, surface the exact error.
