import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, extname, basename, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const POSTS_ASSETS_DIR = join(ROOT, 'src', 'assets', 'posts');
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

function walk(dir) {
  let res = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) res = res.concat(walk(full));
    else if (['.md', '.mdx'].includes(extname(e.name))) res.push(full);
  }
  return res;
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
  if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  return { value: v, line: m[0] };
}

function replaceKey(fm, key, newValueLineOrNull) {
  const lines = fm.split(/\r?\n/);
  const re = new RegExp(`^${key}:(\\s|$)`);
  const idx = lines.findIndex((l) => re.test(l));
  if (idx === -1) {
    if (newValueLineOrNull) return `${fm}\n${newValueLineOrNull}`;
    return fm;
  }
  if (!newValueLineOrNull) {
    lines.splice(idx, 1);
  } else {
    lines[idx] = newValueLineOrNull;
  }
  return lines.join('\n');
}

function parseImageLinks(md) {
  const links = [];
  const mdImg = /!\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = mdImg.exec(md))) links.push(m[1]);
  const htmlImg = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  while ((m = htmlImg.exec(md))) links.push(m[1]);
  return links;
}

function isUrl(s) { return /^(https?:)?\/\//i.test(s) || s.startsWith('data:'); }

function fileExists(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}

function resolveHeroAbs(postPath, hero) {
  if (hero.startsWith('/')) return join(ROOT, hero.replace(/^\//, ''));
  return resolve(dirname(postPath), hero);
}

function pickCandidateFor(postPath, body) {
  // 1) Prefer assets/posts/<slug>/*
  const slug = basename(postPath, extname(postPath));
  const dir = join(POSTS_ASSETS_DIR, slug);
  try {
    const files = readdirSync(dir)
      .filter((n) => IMAGE_EXTS.has(extname(n).toLowerCase()))
      .map((n) => join(dir, n))
      .sort();
    if (files.length) {
      const rel = relative(dirname(postPath), files[0]).split('\\').join('/');
      return rel;
    }
  } catch {}
  // 2) Fallback: first inline image that resolves
  for (const ref of parseImageLinks(body)) {
    if (isUrl(ref)) continue;
    const abs = ref.startsWith('/') ? join(ROOT, ref.replace(/^\//, '')) : resolve(dirname(postPath), ref);
    if (fileExists(abs)) {
      const rel = relative(dirname(postPath), abs).split('\\').join('/');
      return rel;
    }
  }
  return null;
}

function main() {
  const files = walk(BLOG_DIR);
  let fixed = 0, removed = 0, checked = 0;
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const fmRes = extractFrontmatter(text);
    if (!fmRes) continue;
    let { fm, body } = fmRes;
    const cur = parseKey(fm, 'heroImage');
    if (!cur) continue;
    checked++;
    const abs = resolveHeroAbs(f, cur.value);
    if (fileExists(abs)) continue; // OK
    // Not found, try to pick a candidate
    const candidate = pickCandidateFor(f, body);
    if (candidate) {
      fm = replaceKey(fm, 'heroImage', `heroImage: '${candidate}'`);
      const output = `---\n${fm}\n---\n${body}`;
      writeFileSync(f, output, 'utf8');
      fixed++;
    } else {
      // Remove invalid heroImage to avoid breakage
      fm = replaceKey(fm, 'heroImage', null);
      const output = `---\n${fm}\n---\n${body}`;
      writeFileSync(f, output, 'utf8');
      removed++;
    }
  }
  console.log(`Checked ${checked} heroImages; fixed ${fixed}, removed ${removed}.`);
}

main();

