import { readdirSync, statSync, mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');

// Mapping from current top-level folder name -> new top-level folder name
const MAP = {
  // frontend
  Frontend: 'frontend',
  React: 'frontend',
  Javascript: 'frontend',

  // mobile
  ReactNative: 'mobile',

  // backend
  Nodejs: 'backend',
  NestJS: 'backend',
  Server: 'backend',
  GraphQL: 'backend',
  Python: 'backend',

  // cloud/devops
  AWS: 'cloud',
  Docker: 'cloud',

  // study areas
  CS: 'cs',
  Algorithm: 'algorithms',
  Test: 'testing',
  Security: 'security',
  Error: 'troubleshooting',
  History: 'history',
  Else: 'misc',
};

function ensureDir(path) {
  try { mkdirSync(path, { recursive: true }); } catch {}
}

function main() {
  const entries = readdirSync(BLOG_DIR, { withFileTypes: true });
  const targets = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'));

  // Use a single non-conflicting root to avoid case-insensitive collisions
  const AREA_ROOT = 'areas';
  ensureDir(join(BLOG_DIR, AREA_ROOT));
  const newTopLevels = new Set(Object.values(MAP));
  for (const dir of newTopLevels) ensureDir(join(BLOG_DIR, AREA_ROOT, dir));

  for (const e of targets) {
    const name = e.name;
    const destTop = MAP[name];
    if (!destTop) continue; // leave as-is
    const srcPath = join(BLOG_DIR, name);
    const destPath = join(BLOG_DIR, AREA_ROOT, destTop, name); // keep original subfolder name inside area
    // Move folder under new top-level area, preserving its name
    console.log(`Move: ${srcPath} -> ${destPath}`);
    try {
      ensureDir(join(BLOG_DIR, AREA_ROOT, destTop));
      renameSync(srcPath, destPath);
    } catch (e) {
      console.error('Failed to move', srcPath, '->', destPath, e.message);
    }
  }

  // Optionally move single files at blog root if desired (example: fargate.md -> cloud/)
  const moveSingles = [
    { from: 'fargate.md', toDir: join(AREA_ROOT, 'cloud') },
  ];
  for (const { from, toDir } of moveSingles) {
    const src = join(BLOG_DIR, from);
    try {
      if (statSync(src).isFile()) {
        const dest = join(BLOG_DIR, toDir, from);
        ensureDir(join(BLOG_DIR, toDir));
        console.log(`Move: ${src} -> ${dest}`);
        renameSync(src, dest);
      }
    } catch {}
  }

  // Move any previously created top-level buckets (cloud/, backend/, etc.) under areas/
  const existingBuckets = ['cloud','backend','frontend','security','history','cs','testing','troubleshooting','mobile','algorithms','misc'];
  for (const b of existingBuckets) {
    const src = join(BLOG_DIR, b);
    try {
      const dest = join(BLOG_DIR, AREA_ROOT, b);
      ensureDir(join(BLOG_DIR, AREA_ROOT));
      console.log(`Move bucket: ${src} -> ${dest}`);
      renameSync(src, dest);
    } catch {}
  }
}

main();
