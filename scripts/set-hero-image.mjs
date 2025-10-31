import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, extname, basename, relative } from 'node:path';

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
  return { fm, body, endIndex: end + 4 };
}

function hasKey(fm, key) {
  const re = new RegExp(`^${key}:(\\s|$)`, 'm');
  return re.test(fm);
}

function insertAfterKey(fm, key, newLine) {
  const lines = fm.split(/\r?\n/);
  const re = new RegExp(`^${key}:(\\s|$)`);
  const i = lines.findIndex((l) => re.test(l));
  if (i === -1) return `${newLine}\n${fm}`;
  const out = lines.slice();
  out.splice(i + 1, 0, newLine);
  return out.join('\n');
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

function pickFirstLocalImage(postPath, body) {
  const relBase = dirname(postPath);
  const images = parseImageLinks(body).filter((p) => p && !isUrl(p));
  if (images.length) return images[0];
  // Fallback: look for assets/posts/<slug>/*
  const slug = basename(postPath, extname(postPath));
  try {
    const dir = join(POSTS_ASSETS_DIR, slug);
    const files = readdirSync(dir)
      .filter((n) => IMAGE_EXTS.has(extname(n).toLowerCase()))
      .map((n) => join(dir, n));
    if (files.length) {
      const rel = relative(relBase, files[0]).split('\\').join('/');
      return rel;
    }
  } catch {}
  return null;
}

function main() {
  const files = walk(BLOG_DIR);
  let updated = 0;
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const fmRes = extractFrontmatter(text);
    if (!fmRes) continue;
    let { fm, body } = fmRes;
    if (hasKey(fm, 'heroImage')) continue;
    const firstImg = pickFirstLocalImage(f, body);
    if (!firstImg) continue;
    const newLine = `heroImage: '${firstImg}'`;
    // place after description if present, else after title, else at top
    if (hasKey(fm, 'description')) fm = insertAfterKey(fm, 'description', newLine);
    else if (hasKey(fm, 'title')) fm = insertAfterKey(fm, 'title', newLine);
    else fm = `${newLine}\n${fm}`;
    const output = `---\n${fm}\n---\n${body}`;
    writeFileSync(f, output, 'utf8');
    updated++;
  }
  console.log(`Set heroImage on ${updated} posts`);
}

main();

