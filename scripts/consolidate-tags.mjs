#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

function walk(dir) {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else if (extname(e.name).toLowerCase() === '.md') out.push(full);
  }
  return out;
}

function extractFM(src) {
  if (!src.startsWith('---')) return null;
  const endIdx = src.indexOf('\n---', 3);
  if (endIdx === -1) return null;
  const fm = src.slice(3, endIdx + 1);
  const body = src.slice(endIdx + 4);
  return { fm, body };
}

function parseInlineArray(rest) {
  // Strip [ ] and split by comma, allow quotes
  const inner = rest.replace(/^\[/, '').replace(/\]$/, '');
  return inner
    .split(',')
    .map((s) => s.trim().replace(/^['\"]|['\"]$/g, ''))
    .filter(Boolean);
}

function consolidateTags(fm) {
  const lines = fm.split('\n');
  let items = [];
  const seen = new Set();
  let insertAt = -1;

  const newLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = /^(\s*)tags:\s*(.*)$/.exec(line);
    if (!m) {
      newLines.push(line);
      continue;
    }
    if (insertAt === -1) insertAt = newLines.length; // remember where to reinsert once
    const indent = m[1] ?? '';
    const rest = (m[2] ?? '').trim();

    // Collect items depending on style
    if (rest === '') {
      // Collect following list items
      let j = i + 1;
      while (j < lines.length) {
        const l = lines[j];
        if (/^\s*$/.test(l)) { j++; continue; }
        const li = new RegExp('^' + indent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '  - (.+)$').exec(l);
        if (!li) break;
        const val = li[1].trim();
        if (val && !seen.has(val)) { seen.add(val); items.push(val); }
        j++;
      }
      // Skip consumed lines
      i = j - 1;
    } else if (rest.startsWith('[') && rest.endsWith(']')) {
      for (const val of parseInlineArray(rest)) {
        if (val && !seen.has(val)) { seen.add(val); items.push(val); }
      }
    } else {
      // inline string
      const val = rest.replace(/^['\"]|['\"]$/g, '');
      if (val && !seen.has(val)) { seen.add(val); items.push(val); }
    }
    // Do not push the original tags line; we will reinsert later
  }

  // If there was 0 or 1 tags occurrences, we still might return unchanged
  const tagOccurrences = lines.filter((l) => /^\s*tags:\b/.test(l)).length;
  if (tagOccurrences <= 1) {
    // If only one tags occurrence, leave fm unchanged
    return { changed: false, fm };
  }

  // Rebuild with a single consolidated tags block if items exist
  if (items.length > 0) {
    const out = [...newLines];
    if (insertAt < 0) insertAt = 0;
    const tagBlock = ['tags:', ...items.map((v) => `  - ${v}`), ''];
    out.splice(insertAt, 0, ...tagBlock);
    return { changed: true, fm: out.join('\n') };
  } else {
    // No items; omit tags entirely
    return { changed: true, fm: newLines.join('\n') };
  }
}

const files = walk('src/content');
let changed = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const parsed = extractFM(src);
  if (!parsed) continue;
  const { fm, body } = parsed;
  const { changed: ch, fm: fm2 } = consolidateTags(fm);
  if (ch) {
    writeFileSync(f, '---' + fm2 + '\n---' + body, 'utf8');
    changed++;
  }
}
console.log(`Consolidated tags in ${changed} files.`);

