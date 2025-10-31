import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (['.md', '.mdx'].includes(extname(e.name))) files.push(full);
  }
  return files;
}

function extractFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const fm = text.slice(3, end + 1); // include leading newline
  const body = text.slice(end + 4); // skip "\n---\n"
  return { fm: fm.replace(/^\n/, ''), body, start: 0, end: end + 4 };
}

function getLineMap(fm) {
  const lines = fm.split(/\r?\n/);
  return lines;
}

function hasKey(lines, key) {
  const re = new RegExp(`^${key}:(\\s|$)`);
  return lines.some((l) => re.test(l));
}

function replaceKey(lines, fromKey, toKey) {
  const re = new RegExp(`^${fromKey}:(\\s*)(.*)$`);
  let replaced = false;
  const out = lines.map((l) => {
    const m = l.match(re);
    if (m) {
      replaced = true;
      return `${toKey}:${m[1]}${m[2]}`;
    }
    return l;
  });
  return { lines: out, replaced };
}

function removeKey(lines, key) {
  const re = new RegExp(`^${key}:(\\s|$)`);
  return lines.filter((l) => !re.test(l));
}

function insertAfter(lines, key, newLine) {
  const re = new RegExp(`^${key}:(\\s|$)`);
  const idx = lines.findIndex((l) => re.test(l));
  if (idx === -1) return [newLine, ...lines];
  const out = lines.slice();
  out.splice(idx + 1, 0, newLine);
  return out;
}

function summarize(md) {
  // Grab first non-empty paragraph-like line(s)
  const text = md
    .replace(/```[\s\S]*?```/g, ' ') // remove code fences
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/^>.*$/gm, ' ') // blockquotes
    .replace(/\!\[[^\]]*\]\([^\)]*\)/g, ' ') // images
    .replace(/\[[^\]]*\]\([^\)]*\)/g, (m) => m.replace(/\[|\]|\([^)]*\)/g, '')) // links -> text
    .replace(/[#*_>-]/g, ' ') // markdown symbols
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  const MAX = 180;
  if (!text) return '';
  return text.length > MAX ? text.slice(0, MAX - 1).trim() + '…' : text;
}

function processFile(path) {
  const original = readFileSync(path, 'utf8');
  const fmRes = extractFrontmatter(original);
  if (!fmRes) return null;
  const { fm, body } = fmRes;
  let lines = getLineMap(fm);

  // Ensure pubDate exists; migrate date -> pubDate if needed
  const hasPub = hasKey(lines, 'pubDate');
  const hasDate = hasKey(lines, 'date');
  if (!hasPub && hasDate) {
    const r = replaceKey(lines, 'date', 'pubDate');
    lines = r.lines;
  } else if (hasPub && hasDate) {
    lines = removeKey(lines, 'date');
  }

  // Ensure description exists
  const hasDesc = hasKey(lines, 'description');
  if (!hasDesc) {
    // Try to summarize body; fallback to title
    const desc = summarize(body);
    let titleLine = lines.find((l) => /^title:(\s|$)/.test(l));
    let fallback = '';
    if (!desc) {
      if (titleLine) fallback = titleLine.replace(/^title:\s*/, '').replace(/^['"]|['"]$/g, '');
      else fallback = '';
    }
    const value = (desc || fallback || '...').replace(/\r?\n/g, ' ').trim();
    const newLine = `description: '${value.replace(/'/g, "’")}'`;
    lines = insertAfter(lines, 'title', newLine);
  }

  const newFm = lines.join('\n');
  const updated = `---\n${newFm}\n---\n${body}`;
  if (updated !== original) {
    writeFileSync(path, updated, 'utf8');
    return { path, changed: true };
  }
  return { path, changed: false };
}

function main() {
  const files = walk(BLOG_DIR);
  const results = [];
  for (const f of files) {
    try {
      const r = processFile(f);
      if (r && r.changed) results.push(r.path);
    } catch (e) {
      console.error('Failed to process', f, e.message);
    }
  }
  console.log(`Updated ${results.length} files`);
  for (const p of results) console.log(p);
}

main();

