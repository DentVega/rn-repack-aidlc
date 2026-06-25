---
description: Scaffold the AI-DLC memory-bank for a React Native + Re.Pack project, seeding the four standards from this plugin's templates.
argument-hint: "[project description]"
---

Initialize the AI-DLC workspace for this React Native + Re.Pack project.

Steps:

1. Create the `memory-bank/` tree if it does not exist:
   ```
   memory-bank/
   ├── standards/
   ├── intents/
   ├── bolts/
   └── operations/
   ```
2. Copy the four standards templates from this plugin's `templates/standards/` into `memory-bank/standards/`:
   - `tech-stack.md`
   - `coding-standards.md`
   - `system-architecture.md`
   - `testing-standards.md`
   Then fill in any project-specific blanks based on what you can detect in the repo (package.json, app config, existing Re.Pack config) and on this argument: $ARGUMENTS
3. Remind the user to install the referenced skills with `/setup-skills` if they haven't.
4. Tell the user the next step is `/aidlc-inception` to capture the first intent.

Do not write any feature code in this command. Stop after the workspace and standards exist, and show the user the resulting tree.
