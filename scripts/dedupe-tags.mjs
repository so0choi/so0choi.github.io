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

function processFile(fp) {
  const src = readFileSync(fp, 'utf8');
  if (!src.startsWith('---')) return false;
  const end = src.indexOf('\n---', 3);
  if (end === -1) return false;
  const fm = src.slice(3, end + 1);
  const body = src.slice(end + 4);
  const lines = fm.split('\n');
  const tagIdxs = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*tags:\s*$/.test(lines[i])) tagIdxs.push(i);
  }
  if (tagIdxs.length <= 1) return false;
  // Keep first, remove the rest of exact 'tags:' duplicates
  const keep = tagIdxs[0];
  const newLines = lines.filter((_, idx) => idx === keep || !tagIdxs.includes(idx));
  const out = '---' + newLines.join('\n') + '\n---' + body;
  writeFileSync(fp, out, 'utf8');
  return true;
}

const files = walk('src/content');
let changed = 0;
for (const f of files) if (processFile(f)) changed++;
console.log(`Deduped tags key in ${changed} files.`);

