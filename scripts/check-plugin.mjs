#!/usr/bin/env node
// Plugin doctor — validates the plugin's own integrity so a broken agent,
// command, or skill can't ship. Catches whole classes of "won't load" bugs:
//   - manifest JSON invalid or missing required fields
//   - a command/agent file not registered in plugin.json (the 0.3.1/0.6.0 bug)
//   - a manifest entry pointing at a file that doesn't exist
//   - an agent/command/skill missing required frontmatter (name/description)
//
// Usage:  node scripts/check-plugin.mjs
// Exit:   0 = healthy, 1 = problems found.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const problems = [];
const fail = (msg) => problems.push(msg);

// --- manifests parse + required fields ---
const manifestPath = join(ROOT, '.claude-plugin', 'plugin.json');
let manifest = {};
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  for (const field of ['name', 'version', 'description']) {
    if (!manifest[field]) fail(`plugin.json is missing required field "${field}"`);
  }
} catch (e) {
  fail(`plugin.json does not parse: ${e.message}`);
}
try {
  JSON.parse(readFileSync(join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
} catch (e) {
  fail(`marketplace.json does not parse: ${e.message}`);
}

// --- frontmatter helper ---
function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  return text.slice(3, end);
}

// --- generic: dir files ↔ manifest array, and required frontmatter keys ---
function checkGroup(dir, manifestKey, requiredKeys) {
  if (!existsSync(join(ROOT, dir))) return;
  const files = readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.md'));
  const registered = new Set(
    (manifest[manifestKey] ?? []).map((p) => p.replace(new RegExp(`^\\./${dir}/`), ''))
  );
  for (const f of files) {
    if (!registered.has(f)) fail(`${dir}/${f} is not registered in plugin.json "${manifestKey}" (it won't load)`);
    const fm = frontmatter(join(ROOT, dir, f));
    if (fm === null) { fail(`${dir}/${f} has no YAML frontmatter`); continue; }
    for (const key of requiredKeys) {
      if (!new RegExp(`^${key}:`, 'm').test(fm)) fail(`${dir}/${f} frontmatter is missing "${key}"`);
    }
  }
  for (const reg of registered) {
    if (!files.includes(reg)) fail(`plugin.json "${manifestKey}" lists "${reg}" but ${dir}/${reg} does not exist`);
  }
}

checkGroup('agents', 'agents', ['name', 'description']);
checkGroup('commands', 'commands', ['description']);

// --- skills: each skills/*/SKILL.md needs name + description ---
const skillsDir = join(ROOT, 'skills');
if (existsSync(skillsDir)) {
  for (const entry of readdirSync(skillsDir)) {
    const skillFile = join(skillsDir, entry, 'SKILL.md');
    if (statSync(join(skillsDir, entry)).isDirectory() && existsSync(skillFile)) {
      const fm = frontmatter(skillFile);
      if (fm === null) { fail(`skills/${entry}/SKILL.md has no frontmatter`); continue; }
      for (const key of ['name', 'description']) {
        if (!new RegExp(`^${key}:`, 'm').test(fm)) fail(`skills/${entry}/SKILL.md frontmatter is missing "${key}"`);
      }
    }
  }
}

// --- template smoke tests: shipped .mjs must parse, .json must be valid ---
function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}
for (const file of [...walkFiles(join(ROOT, 'templates')), ...walkFiles(join(ROOT, 'scripts'))]) {
  if (file.endsWith('.mjs')) {
    try { execSync(`node --check "${file}"`, { stdio: 'pipe' }); }
    catch (e) { fail(`${file.replace(ROOT + '/', '')} has a syntax error: ${String(e.stderr || e).split('\n').find((l) => l.includes('Error')) || 'parse failed'}`); }
  } else if (file.endsWith('.json')) {
    try { JSON.parse(readFileSync(file, 'utf8')); }
    catch (e) { fail(`${file.replace(ROOT + '/', '')} is not valid JSON: ${e.message}`); }
  }
}

if (problems.length) {
  console.error('check-plugin: problems found —');
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('check-plugin: manifest, agents, commands, skills, and templates are all valid. ✓');
