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

function fixOrphanTagLists(fm) {
  const lines = fm.split('\n');
  const hasTags = lines.some(l => /^\s*tags:\b/.test(l));
  if (hasTags) return { fm, changed: false };

  // Find first orphan list item in frontmatter
  let firstIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*-\s+.+$/.test(l)) { firstIdx = i; break; }
  }
  if (firstIdx === -1) return { fm, changed: false };

  // Collect contiguous list block
  const newLines = [];
  for (let i = 0; i < firstIdx; i++) newLines.push(lines[i]);
  newLines.push('tags:');
  let i = firstIdx;
  while (i < lines.length) {
    const l = lines[i];
    if (!/^\s*-\s+.+$/.test(l)) break;
    const item = l.replace(/^\s*-\s+/, '').trim();
    newLines.push(`  - ${item}`);
    i++;
  }
  // Append the rest
  for (; i < lines.length; i++) newLines.push(lines[i]);
  return { fm: newLines.join('\n'), changed: true };
}

const files = walk('src/content');
let fixed = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const parsed = extractFM(src);
  if (!parsed) continue;
  const { fm, body } = parsed;
  const { fm: fm2, changed } = fixOrphanTagLists(fm);
  if (changed) {
    writeFileSync(f, '---' + fm2 + '\n---' + body, 'utf8');
    fixed++;
  }
}
console.log(`Fixed orphan tag lists in ${fixed} files.`);

