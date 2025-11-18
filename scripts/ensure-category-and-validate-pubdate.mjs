#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname, sep } from 'path';

const ROOT = 'src/content';
const BLOG_ROOT = `${ROOT}${sep}blog${sep}`;

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

function extractFrontmatter(src) {
  if (!src.startsWith('---')) return null;
  const endIdx = src.indexOf('\n---', 3);
  if (endIdx === -1) return null;
  const fm = src.slice(3, endIdx + 1); // includes trailing \n
  const body = src.slice(endIdx + 4); // skip "\n---"
  return { fm, body, endIdx };
}

function deriveCategoryFromPath(fp) {
  const i = fp.indexOf(BLOG_ROOT);
  if (i === -1) return null;
  const after = fp.slice(i + BLOG_ROOT.length);
  const firstSegment = after.split(sep)[0];
  return firstSegment || null;
}

const PUBDATE_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

function updateCategoryAndValidateDate(fp) {
  const src = readFileSync(fp, 'utf8');
  const parsed = extractFrontmatter(src);
  if (!parsed) return { changed: false, invalidDate: false };

  const { fm, body } = parsed;
  const lines = fm.split('\n');

  // Find pubDate
  let pubDateVal = null;
  for (const line of lines) {
    const m = /^\s*pubDate:\s*(.*)$/.exec(line);
    if (m) {
      pubDateVal = (m[1] || '').trim();
      // Strip surrounding quotes
      if ((pubDateVal.startsWith('"') && pubDateVal.endsWith('"')) || (pubDateVal.startsWith("'") && pubDateVal.endsWith("'"))) {
        pubDateVal = pubDateVal.slice(1, -1);
      }
      break;
    }
  }
  const invalidDate = !pubDateVal || !PUBDATE_RE.test(pubDateVal);

  // Determine expected category
  const category = deriveCategoryFromPath(fp);
  if (!category) return { changed: false, invalidDate };

  // Find and update/insert category
  let changed = false;
  let foundIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = /^\s*category:\s*(.*)$/.exec(lines[i]);
    if (m) { foundIdx = i; break; }
  }
  const desiredLine = `category: ${category}`;
  if (foundIdx >= 0) {
    if (lines[foundIdx] !== desiredLine) {
      lines[foundIdx] = desiredLine;
      changed = true;
    }
  } else {
    // Insert before the closing newline that precedes ---
    // Trim trailing empty lines inside frontmatter to keep it clean
    let insertAt = lines.length; // before we rejoin
    while (insertAt > 0 && lines[insertAt - 1].trim() === '') insertAt--;
    lines.splice(insertAt, 0, desiredLine, '');
    changed = true;
  }

  if (changed) {
    const newFront = lines.join('\n');
    const out = '---' + newFront + '\n---' + body;
    writeFileSync(fp, out, 'utf8');
  }
  return { changed, invalidDate };
}

const files = walk(ROOT);
const invalidList = [];
let updated = 0;
for (const f of files) {
  const { changed, invalidDate } = updateCategoryAndValidateDate(f);
  if (changed) updated++;
  if (invalidDate) invalidList.push(f);
}

console.log(`Updated category in ${updated} files.`);
if (invalidList.length) {
  console.log('Invalid pubDate format in:');
  for (const f of invalidList) console.log(f);
} else {
  console.log('All pubDate values match yyyy-mm-dd HH:MM:SS');
}

