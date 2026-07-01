#!/usr/bin/env node
// Keeps the plugin's commands, its manifest, and its docs in lockstep. Fails if
// a command in commands/ is either (a) NOT registered in .claude-plugin/plugin.json
// (so it silently won't load — the 0.3.1 bug class), or (b) NOT referenced (as
// /<name>) in every required doc. Adding/renaming a command without wiring both
// breaks CI.
//
// Usage:  node scripts/check-docs-commands.mjs
// Exit:   0 = every command registered + documented, 1 = gaps found.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const COMMANDS_DIR = join(ROOT, 'commands');
const REQUIRED_DOCS = ['USAGE.md', 'USAGE.es.md', 'README.md', 'README.es.md'];

if (!existsSync(COMMANDS_DIR)) {
  console.log('check-docs-commands: no commands/ dir, nothing to check. ✓');
  process.exit(0);
}

const commands = readdirSync(COMMANDS_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.slice(0, -3)); // basename = slash-command name

const docs = REQUIRED_DOCS
  .filter((d) => existsSync(join(ROOT, d)))
  .map((d) => ({ name: d, text: readFileSync(join(ROOT, d), 'utf8') }));

let failed = false;

// (0) Every command file must be registered in the plugin manifest, or Claude
// Code won't load it. This is the check that catches the "command exists +
// documented but not invokable" bug.
const MANIFEST = join(ROOT, '.claude-plugin', 'plugin.json');
if (existsSync(MANIFEST)) {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const registered = new Set(
    (manifest.commands ?? []).map((c) => c.replace(/^\.\/commands\//, '').replace(/\.md$/, ''))
  );
  for (const cmd of commands) {
    if (!registered.has(cmd)) {
      failed = true;
      console.error(`✗ /${cmd} is not registered in .claude-plugin/plugin.json "commands" (it won't load)`);
    }
  }
  for (const reg of registered) {
    if (!commands.includes(reg)) {
      failed = true;
      console.error(`✗ manifest lists "${reg}" but commands/${reg}.md does not exist`);
    }
  }
}

for (const cmd of commands) {
  // Match "/cmd" as a whole token (followed by space, ], ), backtick, EOL, etc.)
  const re = new RegExp(`/${cmd}(?![\\w-])`);
  const missing = docs.filter((d) => !re.test(d.text)).map((d) => d.name);
  if (missing.length) {
    failed = true;
    console.error(`✗ /${cmd} is not documented in: ${missing.join(', ')}`);
  }
}

if (failed) {
  console.error(
    '\ncheck-docs-commands: document every command (as /<name>) in USAGE.md, USAGE.es.md, and both READMEs before committing.'
  );
  process.exit(1);
}
console.log(`check-docs-commands: ${commands.length} command(s) registered in the manifest and documented in ${docs.length} doc(s). ✓`);
