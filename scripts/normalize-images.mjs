import { readdirSync, readFileSync, writeFileSync, mkdirSync, cpSync, statSync } from 'node:fs';
import { join, dirname, extname, basename, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const ASSETS_DIR = join(ROOT, 'src', 'assets', 'posts');
const OLD_ROOT = resolve(ROOT, '..', 'hexo_blog_private');

const IMG_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP', '.SVG']);

function ensureDir(p) { try { mkdirSync(p, { recursive: true }); } catch {} }
function walk(dir) { let res=[]; for (const e of readdirSync(dir, { withFileTypes:true })) { if (e.name.startsWith('.')) continue; const full=join(dir,e.name); if (e.isDirectory()) res=res.concat(walk(full)); else if (['.md','.mdx'].includes(extname(e.name))) res.push(full);} return res; }
function isUrl(s){return /^(https?:)?\/\//i.test(s)||s.startsWith('data:');}
function fileExists(p){try{return statSync(p).isFile();}catch{return false;}}

function parseBodyImageRefs(md){
  const refs=new Set();
  const mdImg=/!\[[^\]]*\]\(([^)]+)\)/g; let m;
  while((m=mdImg.exec(md))) refs.add(m[1].trim().replace(/^['"]|['"]$/g,''));
  const htmlImg=/<img[^>]*src=["']([^"']+)["'][^>]*>/gi; while((m=htmlImg.exec(md))) refs.add(m[1]);
  return Array.from(refs);
}

function extractFrontmatter(text){ if(!text.startsWith('---')) return null; const end=text.indexOf('\n---',3); if(end===-1) return null; const fm=text.slice(3,end+1).replace(/^\n/,''); const body=text.slice(end+4); return {fm,body}; }
function parseKey(fm,key){ const m=fm.match(new RegExp(`^${key}:\\s*(.*)$`,'m')); if(!m) return null; let v=m[1].trim(); if(v.startsWith("'")&&v.endsWith("'")) v=v.slice(1,-1); if(v.startsWith('"')&&v.endsWith('"')) v=v.slice(1,-1); return {value:v,line:m[0]}; }
function replaceKey(fm,key,newLine){ const lines=fm.split(/\r?\n/); const re=new RegExp(`^${key}:(\\s|$)`); const idx=lines.findIndex(l=>re.test(l)); if(idx===-1){ if(newLine) return `${fm}\n${newLine}`; return fm;} if(!newLine){ lines.splice(idx,1);} else { lines[idx]=newLine;} return lines.join('\n'); }

function findOldImage(absPostPath, ref){
  // normalize
  const clean=ref.trim().replace(/^['"]|['"]$/g,'');
  if(isUrl(clean)) return null;
  const filename=basename(clean);
  const candidates=[];
  if(clean.startsWith('/')){
    const noSlash=clean.replace(/^\//,'');
    candidates.push(join(OLD_ROOT,'source',noSlash));
  }
  if(clean.startsWith('images/')||clean.startsWith('/images/')){
    candidates.push(join(OLD_ROOT,'source','images',filename));
  }
  // try alongside post in old repo based on slug
  // map current astro slug to old post by basename assumption
  // fallback: direct under source/
  candidates.push(join(OLD_ROOT,'source',clean));

  for(const c of candidates){ if(fileExists(c)) return c; }
  // last resort: search by filename under source/images
  const c2=join(OLD_ROOT,'source','images',filename); if(fileExists(c2)) return c2;
  return null;
}

function normalizeFile(postPath){
  const orig=readFileSync(postPath,'utf8');
  const fmRes=extractFrontmatter(orig); if(!fmRes) return null; let {fm,body}=fmRes; let changed=false;
  const slug=basename(postPath,extname(postPath));
  const destDir=join(ASSETS_DIR,slug); ensureDir(destDir);

  // fix heroImage if it points to images/
  const hero=parseKey(fm,'heroImage');
  if(hero && /(^|\/)images\//.test(hero.value)){
    // Some corrupted cases may contain markdown like ![...](...)
    let ref=hero.value;
    const mdMatch=ref.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if(mdMatch) ref=mdMatch[1];
    ref=ref.trim().replace(/^['"]|['"]$/g,'');
    const old= findOldImage(postPath, ref);
    if(old){
      const filename=basename(old);
      const dest=join(destDir,filename);
      try{ cpSync(old,dest); }catch{}
      const rel=relative(dirname(postPath),dest).split('\\').join('/');
      fm=replaceKey(fm,'heroImage',`heroImage: '${rel}'`);
      changed=true;
    } else {
      // remove invalid heroImage if unresolved
      fm=replaceKey(fm,'heroImage',null);
      changed=true;
    }
  }

  // fix body refs that start with images/ or /images/
  const refs=parseBodyImageRefs(body).filter(r=>/(^|\/)images\//.test(r));
  for(const ref0 of refs){
    const ref=ref0.trim().replace(/^['"]|['"]$/g,'');
    const old=findOldImage(postPath,ref);
    if(!old) continue;
    const filename=basename(old);
    const dest=join(destDir,filename);
    try{ cpSync(old,dest); }catch{}
    const newRel=relative(dirname(postPath),dest).split('\\').join('/');
    // replace raw and quoted
    const patterns=[ref0, ref];
    for(const p of patterns){
      const reMd=new RegExp(`(\\(|src=["'])${escapeRegExp(p)}(["']?\\))`,'g');
      body=body.replace(reMd,(m,p1,p2)=>`${p1}${newRel}${p2}`);
    }
  }

  // Cleanup: fix accidental double closing parens after image links
  body = body.replace(/(!\[[^\]]*\]\([^\)]*\))\)/g, '$1');

  if(changed || body!==fmRes.body){
    const out=`---\n${fm}\n---\n${body}`;
    writeFileSync(postPath,out,'utf8');
    return true;
  }
  return false;
}

function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

function main(){
  const files=walk(BLOG_DIR);
  let updated=0;
  for(const f of files){
    try{ if(normalizeFile(f)) updated++; }catch(e){ console.error('Failed',f,e.message); }
  }
  console.log(`Normalized ${updated} files`);
}

main();
