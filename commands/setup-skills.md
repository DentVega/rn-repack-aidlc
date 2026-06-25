---
description: Install the four referenced callstack skills used by the AI-DLC RN + Re.Pack flow.
---

Install the four skills this plugin references (they are not vendored — always pulled fresh). Run each command and report success/failure:

```bash
# Performance — prescriptive ruleset (use while writing code)
npx -y skills add callstackincubator/agent-skills --skill vercel-react-native-skills --agent claude-code

# Performance — diagnostic/profiling (use while debugging jank/leaks)
npx -y skills add callstackincubator/agent-skills --skill react-native-best-practices --agent claude-code

# Device automation — E2E / smoke verification on iOS/Android/tvOS/macOS
npx -y skills add callstackincubator/agent-device --skill agent-device --agent claude-code

# Component/unit testing — React Native Testing Library
npx -y skills add callstack/react-native-testing-library --skill react-native-testing --agent claude-code
```

After installing, remind the user of the delimited triggers to avoid the two perf skills colliding:
- **vercel-react-native-skills** → while WRITING components (default coding standard).
- **react-native-best-practices** → only when DEBUGGING a measured perf problem.

Verify with the user that the skill registry/network was reachable; if any command failed, surface the exact error.
