#!/usr/bin/env node
// Keeps usage docs in step with the plugin's commands. Fails if any command in
// commands/ is NOT referenced (as /<name>) in every required doc — so adding or
// renaming a command without documenting it breaks CI.
//
// Usage:  node scripts/check-docs-commands.mjs
// Exit:   0 = every command documented everywhere, 1 = gaps found.

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
console.log(`check-docs-commands: ${commands.length} command(s) documented in ${docs.length} doc(s). ✓`);
