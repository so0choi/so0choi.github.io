#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
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

function normalizeTags(frontmatter) {
  const lines = frontmatter.split('\n');
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = /^(\s*)tags:\s*(.*)$/.exec(line);
    if (!m) continue;
    const indent = m[1] ?? '';
    const rest = (m[2] ?? '').trim();

    // Case: inline array
    if (rest.startsWith('[')) {
      if (rest === '[]') {
        // remove empty array -> drop the line
        lines.splice(i, 1);
        changed = true;
      }
      // else leave as-is
      break;
    }

    // Case: empty or no inline value -> check if block list exists
    if (rest === '') {
      // Look ahead for list items indented under this key
      let j = i + 1;
      let hasList = false;
      while (j < lines.length) {
        const l = lines[j];
        if (l.trim() === '') { j++; continue; }
        if (l.startsWith(indent + '  - ')) { hasList = true; }
        break;
      }
      if (!hasList) {
        // No list items provided -> remove tags key entirely
        lines.splice(i, 1);
        changed = true;
      }
      break;
    }

    // Case: inline string -> convert to YAML array list
    let raw = rest;
    // Strip surrounding quotes if present
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      raw = raw.slice(1, -1);
    }
    // If value becomes empty -> remove the key
    if (raw.trim() === '') {
      lines.splice(i, 1);
      changed = true;
      break;
    }
    // Split by comma if present, else single item
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
    const listLines = [indent + 'tags:'];
    for (const p of parts) {
      listLines.push(indent + '  - ' + p);
    }
    lines.splice(i, 1, ...listLines);
    changed = true;
    break;
  }
  return { text: lines.join('\n'), changed };
}

function processFile(fp) {
  const src = readFileSync(fp, 'utf8');
  // Require frontmatter at the very top
  const start = src.indexOf('---');
  if (start !== 0) return { changed: false };
  const end = src.indexOf('\n---', 3);
  if (end === -1) return { changed: false };
  const fmStart = 3; // after initial ---
  const fmEnd = end + 1; // position of '\n' before the closing ---
  const front = src.slice(fmStart, fmEnd);
  const rest = src.slice(end + 4); // skip '\n---'
  const { text: newFront, changed } = normalizeTags(front);
  if (!changed) return { changed: false };
  const out = '---' + newFront + '\n---' + rest;
  writeFileSync(fp, out, 'utf8');
  return { changed: true };
}

const root = 'src/content';
const files = walk(root);
let changedCount = 0;
for (const f of files) {
  const res = processFile(f);
  if (res.changed) changedCount++;
}
console.log(`Processed ${files.length} files; updated ${changedCount}.`);

