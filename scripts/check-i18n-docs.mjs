#!/usr/bin/env node
// Hard guard for i18n-doc-sync: fails if localized Markdown variants drift
// out of structural sync. Compares the *skeleton* (heading level sequence,
// fenced code-block count, table count) across each <name>.md / <name>.<lang>.md
// family — language-agnostic, so translated prose is fine but a section added
// to one language and not the others is caught.
//
// Usage:  node scripts/check-i18n-docs.mjs
// Exit:   0 = all families in sync (or no families found), 1 = drift detected.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const IGNORE = new Set(['node_modules', '.git', '.idea', '.vscode', 'dist']);
const LANG_RE = /^(.*)\.([a-z]{2})\.md$/; // README.es.md -> base "README", lang "es"

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

// Reduce a doc to a comparable structural skeleton.
function skeleton(text) {
  const lines = text.split('\n');
  const headings = [];
  let fences = 0;
  let tables = 0;
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) { fences++; inFence = !inFence; continue; }
    if (inFence) continue;
    const h = /^(#{1,6})\s+\S/.exec(line);
    if (h) headings.push(h[1].length);
    if (/^\s*\|?\s*:?-{3,}/.test(line) && line.includes('|')) tables++;
  }
  return { headings, fences: Math.floor(fences / 2), tables };
}

function diffSkeleton(a, b) {
  const issues = [];
  if (a.headings.length !== b.headings.length)
    issues.push(`heading count ${a.headings.length} vs ${b.headings.length}`);
  else if (a.headings.join(',') !== b.headings.join(','))
    issues.push(`heading level sequence differs`);
  if (a.fences !== b.fences) issues.push(`code blocks ${a.fences} vs ${b.fences}`);
  if (a.tables !== b.tables) issues.push(`tables ${a.tables} vs ${b.tables}`);
  return issues;
}

// Group files into families keyed by base name (sans .<lang>).
const families = new Map(); // base -> { base?: path, variants: Map<lang, path> }
for (const file of walk(ROOT)) {
  const name = file.slice(ROOT.length + 1);
  const m = LANG_RE.exec(name);
  if (m) {
    const base = m[1];
    if (!families.has(base)) families.set(base, { variants: new Map() });
    families.get(base).variants.set(m[2], file);
  } else if (name.endsWith('.md')) {
    const base = name.slice(0, -3);
    if (!families.has(base)) families.set(base, { variants: new Map() });
    families.get(base).base = file;
  }
}

let failed = false;
let checked = 0;
for (const [base, fam] of families) {
  if (!fam.variants.size) continue; // single-language doc, nothing to sync
  if (!fam.base) {
    console.error(`✗ ${base}: has localized variant(s) but no base ${base}.md`);
    failed = true;
    continue;
  }
  checked++;
  const baseSkel = skeleton(readFileSync(fam.base, 'utf8'));
  for (const [lang, file] of fam.variants) {
    const issues = diffSkeleton(baseSkel, skeleton(readFileSync(file, 'utf8')));
    if (issues.length) {
      failed = true;
      console.error(
        `✗ ${relative(ROOT, file)} out of sync with ${relative(ROOT, fam.base)}:\n    - ${issues.join('\n    - ')}`
      );
    }
  }
}

if (failed) {
  console.error(
    '\ni18n-doc-sync: localized Markdown variants have drifted. Apply the same change to every language version (see skills/i18n-doc-sync/SKILL.md).'
  );
  process.exit(1);
}
console.log(`i18n-doc-sync: ${checked} doc family(ies) in sync. ✓`);
