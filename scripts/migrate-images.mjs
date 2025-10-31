import { readdirSync, readFileSync, writeFileSync, mkdirSync, cpSync, statSync } from 'node:fs';
import { join, dirname, extname, basename, relative, resolve } from 'node:path';

// Configure paths
const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const ASSETS_DIR = join(ROOT, 'src', 'assets', 'posts');
const OLD_ROOT = resolve(ROOT, '..', 'hexo_blog_private');

const IMG_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

function ensureDir(p) { try { mkdirSync(p, { recursive: true }); } catch {} }

function walk(dir, filterExts = null) {
  let res = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) res = res.concat(walk(full, filterExts));
    else if (!filterExts || filterExts.has(extname(e.name).toLowerCase())) res.push(full);
  }
  return res;
}

function parseImageLinks(md) {
  const links = new Set();
  // Markdown image syntax
  const mdImg = /!\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = mdImg.exec(md))) {
    links.add(m[1]);
  }
  // HTML <img src="...">
  const htmlImg = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  while ((m = htmlImg.exec(md))) {
    links.add(m[1]);
  }
  return Array.from(links);
}

function isUrl(pathStr) {
  return /^(https?:)?\/\//i.test(pathStr) || pathStr.startsWith('data:');
}

function resolveOldPath(oldPostPath, imgRef) {
  if (isUrl(imgRef)) return null;
  const sourceDir = join(OLD_ROOT, 'source');
  const candidates = [];
  if (imgRef.startsWith('/')) {
    // absolute from site root -> try under hexo source
    candidates.push(join(sourceDir, imgRef));
    candidates.push(join(OLD_ROOT, imgRef));
  } else if (imgRef.startsWith('public/')) {
    const rest = imgRef.replace(/^public\//, '');
    // common hexo patterns: source/images, source/public
    candidates.push(join(sourceDir, 'images', rest));
    candidates.push(join(sourceDir, 'public', rest));
    candidates.push(join(sourceDir, rest));
  } else {
    const base = dirname(oldPostPath);
    candidates.push(join(base, imgRef));
    // also try post asset folder pattern: <post-basename>/<filename>
    const fileOnly = basename(imgRef);
    const postBase = basename(oldPostPath, extname(oldPostPath));
    candidates.push(join(base, postBase, fileOnly));
  }
  for (const c of candidates) {
    try {
      const st = statSync(c);
      if (st.isFile() && IMG_EXTS.has(extname(c).toLowerCase())) return c;
    } catch {}
  }
  return null;
}

function extractFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const fm = text.slice(3, end + 1).replace(/^\n/, '');
  const body = text.slice(end + 4);
  return { fm, body };
}

function migrate() {
  // Index old posts by slug (basename without ext)
  const oldPostsDir = join(OLD_ROOT, 'source', '_posts');
  const oldPosts = walk(oldPostsDir).filter((p) => ['.md', '.markdown', '.mdx'].includes(extname(p)));
  const oldIndex = new Map();
  for (const p of oldPosts) {
    oldIndex.set(basename(p, extname(p)), p);
  }

  const astroPosts = walk(BLOG_DIR).filter((p) => ['.md', '.mdx'].includes(extname(p)));
  const updates = [];
  const copies = [];

  for (const postPath of astroPosts) {
    const slug = basename(postPath, extname(postPath));
    const oldPath = oldIndex.get(slug);
    if (!oldPath) continue;

    const oldContent = readFileSync(oldPath, 'utf8');
    const imgRefs = parseImageLinks(oldContent);
    if (!imgRefs.length) continue;

    const destDir = join(ASSETS_DIR, slug);
    ensureDir(destDir);

    const mdOrig = readFileSync(postPath, 'utf8');
    let md = mdOrig;
    const relBase = dirname(postPath);

    for (const ref of imgRefs) {
      const cleanRef = ref.trim().replace(/^['"]|['"]$/g, '');
      const resolved = resolveOldPath(oldPath, cleanRef);
      if (!resolved) continue;
      const filename = basename(resolved);
      const dest = join(destDir, filename);
      try {
        cpSync(resolved, dest, { recursive: false });
        copies.push(dest);
      } catch {}

      // New relative path from md file location to the asset
      const newRel = relative(relBase, dest).split('\\').join('/');
      // Replace exact original ref (may include stray quotes)
      md = md.replace(new RegExp(`(\\(|src=["'])${escapeRegExp(ref)}(["']?\\))`, 'g'), (m, p1, p2) => `${p1}${newRel}${p2}`);
      // Replace cleaned ref
      md = md.replace(new RegExp(`(\\(|src=["'])${escapeRegExp(cleanRef)}(["']?\\))`, 'g'), (m, p1, p2) => `${p1}${newRel}${p2}`);
      // Replace by filename regardless of old path
      md = md.replace(new RegExp(`(\\(|src=["'])(?:[^)"']*?/)?${escapeRegExp(filename)}(["']?\\))`, 'g'), (m, p1, p2) => `${p1}${newRel}${p2}`);
    }

    if (md !== mdOrig) {
      writeFileSync(postPath, md, 'utf8');
      updates.push(postPath);
    }
  }

  console.log(`Copied ${copies.length} images for ${updates.length} posts`);
  for (const u of updates) console.log('Updated:', u);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

migrate();
