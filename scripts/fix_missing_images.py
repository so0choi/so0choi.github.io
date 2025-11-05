#!/usr/bin/env python3
import os
import re
import sys
import shutil
from typing import List, Tuple, Set, Optional

BLOG_ROOT = 'src/content/blog'
ASSETS_ROOT = 'src/assets/posts'

IMG_MD_RE = re.compile(r"!\[[^\]]*\]\(([^)]+\.(?:png|jpe?g|gif|svg|PNG))\)")
IMG_HTML_RE = re.compile(r"<img[^>]*src=\"([^\"]+\.(?:png|jpe?g|gif|svg|PNG))\"", re.IGNORECASE)
HERO_RE = re.compile(r"^\s*heroImage:\s*['\"]([^'\"]+\.(?:png|jpe?g|gif|svg|PNG))['\"]\s*$", re.MULTILINE)

def is_remote(path: str) -> bool:
    return path.startswith('http://') or path.startswith('https://')

def read_text(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_text(path: str, content: str):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def collect_image_paths(content: str) -> List[str]:
    paths: Set[str] = set()
    for m in IMG_MD_RE.finditer(content):
        paths.add(m.group(1))
    for m in IMG_HTML_RE.finditer(content):
        paths.add(m.group(1))
    for m in HERO_RE.finditer(content):
        paths.add(m.group(1))
    return list(paths)

def find_by_basename(root: str, basename: str) -> Optional[str]:
    # Walk to find first match by basename
    for r, _, files in os.walk(root):
        for fn in files:
            if fn == basename:
                return os.path.join(r, fn)
    return None

def resolve_or_copy(post_dir: str, ref_path: str, external_root: Optional[str]) -> Tuple[Optional[str], Optional[str]]:
    """
    Try to resolve ref_path to an existing local file path.
    If missing, search in post_dir, BLOG_ROOT, ASSETS_ROOT, then external_root.
    If found elsewhere, copy into post_dir and return (dest_path, './basename').
    Returns (resolved_abs_path, new_markdown_path) where new_markdown_path is what to write in md.
    If cannot resolve, returns (None, None).
    """
    if is_remote(ref_path):
        return (ref_path, ref_path)

    # Resolve relative
    abs_candidate = os.path.normpath(os.path.join(post_dir, ref_path))
    if os.path.isfile(abs_candidate):
        # Normalize to ./basename if inside same post_dir
        if os.path.dirname(abs_candidate) == post_dir:
            return (abs_candidate, './' + os.path.basename(abs_candidate))
        # If a subdir, keep relative from post_dir
        rel = os.path.relpath(abs_candidate, post_dir)
        return (abs_candidate, rel)

    basename = os.path.basename(ref_path)

    # 1) Same post folder by basename
    local = os.path.join(post_dir, basename)
    if os.path.isfile(local):
        return (local, './' + basename)

    # 2) Anywhere in blog root (some earlier copies may exist)
    found = find_by_basename(BLOG_ROOT, basename)
    if found:
        dest = os.path.join(post_dir, basename)
        if not os.path.exists(dest):
            shutil.copy(found, dest)
        return (dest, './' + basename)

    # 3) In assets root
    if os.path.isdir(ASSETS_ROOT):
        found = find_by_basename(ASSETS_ROOT, basename)
        if found:
            dest = os.path.join(post_dir, basename)
            if not os.path.exists(dest):
                shutil.copy(found, dest)
            return (dest, './' + basename)

    # 4) In external root
    if external_root and os.path.isdir(external_root):
        found = find_by_basename(external_root, basename)
        if found:
            dest = os.path.join(post_dir, basename)
            if not os.path.exists(dest):
                shutil.copy(found, dest)
            return (dest, './' + basename)

    return (None, None)

def fix_post(index_path: str, external_root: Optional[str]) -> Tuple[str, List[str]]:
    post_dir = os.path.dirname(index_path)
    content = read_text(index_path)
    refs = collect_image_paths(content)
    missing: List[str] = []
    changed = False

    def replace_all(pattern: re.Pattern, text: str, replacer) -> Tuple[str, bool]:
        pos = 0
        out = []
        changed_local = False
        for m in pattern.finditer(text):
            out.append(text[pos:m.start(1)])
            val = m.group(1)
            new_val = replacer(val)
            if new_val is None:
                out.append(val)
            else:
                out.append(new_val)
                if new_val != val:
                    changed_local = True
            pos = m.end(1)
        out.append(text[pos:])
        return ''.join(out), changed_local

    def fix_ref(val: str) -> Optional[str]:
        resolved, new_md = resolve_or_copy(post_dir, val, external_root)
        if resolved is None:
            missing.append(val)
            return None
        return new_md

    new_content, ch1 = replace_all(IMG_MD_RE, content, fix_ref)
    new_content, ch2 = replace_all(IMG_HTML_RE, new_content, fix_ref)
    new_content, ch3 = replace_all(HERO_RE, new_content, fix_ref)
    changed = ch1 or ch2 or ch3

    if changed:
        write_text(index_path, new_content)

    return index_path, missing

def main():
    external_root = None
    if len(sys.argv) > 1:
        external_root = sys.argv[1]

    all_missing: List[Tuple[str, List[str]]] = []
    for root, _, files in os.walk(BLOG_ROOT):
        for fn in files:
            if fn == 'index.mdx' or fn == 'index.md':
                idx = os.path.join(root, fn)
                post, miss = fix_post(idx, external_root)
                if miss:
                    all_missing.append((post, miss))
                    sys.stderr.write(f"MISSING in {post}:\n  " + "\n  ".join(miss) + "\n")

    # Summary
    print("\nSUMMARY: Missing images by post")
    for post, miss in all_missing:
        print(f"- {post}")
        for m in miss:
            print(f"  - {m}")
    print(f"TOTAL posts with missing images: {len(all_missing)}")

if __name__ == '__main__':
    main()

