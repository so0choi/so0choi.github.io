import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');

function walk(dir) {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else if (['.md', '.mdx'].includes(extname(e.name))) out.push(full);
  }
  return out;
}

function extractFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const fm = text.slice(3, end + 1).replace(/^\n/, '');
  const body = text.slice(end + 4);
  return { fm, body };
}

function parseKey(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!m) return null;
  let v = m[1].trim();
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    v = v.slice(1, -1);
  }
  return v;
}

function norm(s) {
  return s.trim().replace(/\s+/g, '');
}

function stripInlineMd(s) {
  return s.replace(/`([^`]*)`/g, '$1').replace(/[*_]/g, '').trim();
}

function removeDuplicateHeading(body, title) {
  const lines = body.split(/\r?\n/);
  let i = 0;
  // skip leading blank lines
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i >= lines.length) return null;

  // Case 1: Hash heading
  const hashMatch = lines[i].match(/^#{1,6}\s+(.*)$/);
  if (hashMatch) {
    const h = stripInlineMd(hashMatch[1]);
    if (norm(h) === norm(title)) {
      // remove this heading and following single blank line
      const removeCount = (i + 1 < lines.length && lines[i + 1].trim() === '') ? 2 : 1;
      lines.splice(i, removeCount);
      return lines.join('\n');
    }
  }

  // Case 2: Setext heading
  if (i + 1 < lines.length) {
    const line1 = stripInlineMd(lines[i]);
    const line2 = lines[i + 1];
    if (/^=+$/.test(line2) || /^-+$/.test(line2)) {
      if (norm(line1) === norm(title)) {
        // remove both lines and optional following blank line
        let removeCount = 2;
        if (i + 2 < lines.length && lines[i + 2].trim() === '') removeCount++;
        lines.splice(i, removeCount);
        return lines.join('\n');
      }
    }
  }
  return null;
}

function main() {
  const files = walk(BLOG_DIR);
  let updated = 0;
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const fmRes = extractFrontmatter(text);
    if (!fmRes) continue;
    const title = parseKey(fmRes.fm, 'title');
    if (!title) continue;
    const newBody = removeDuplicateHeading(fmRes.body, title);
    if (newBody !== null) {
      const out = `---\n${fmRes.fm}\n---\n${newBody}`;
      writeFileSync(f, out, 'utf8');
      updated++;
    }
  }
  console.log(`Removed duplicate heading in ${updated} posts`);
}

main();

