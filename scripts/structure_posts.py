#!/usr/bin/env python3
import os
import re
import shutil
from typing import List, Set

ROOT = 'src/content/blog'

img_pattern_md = re.compile(r"!\[[^\]]*\]\(([^)]+\.(?:png|jpe?g|gif|svg|PNG))\)")
img_pattern_html = re.compile(r"<img[^>]*src=\"([^\"]+\.(?:png|jpe?g|gif|svg|PNG))\"")
hero_pattern = re.compile(r"^\s*heroImage:\s*['\"]([^'\"]+\.(?:png|jpe?g|gif|svg|PNG))['\"]\s*$", re.MULTILINE)

def read(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write(path: str, content: str):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def is_remote(p: str) -> bool:
    return p.startswith('http://') or p.startswith('https://')

def collect_image_basenames(content: str) -> Set[str]:
    names: Set[str] = set()
    for m in img_pattern_md.finditer(content):
        p = m.group(1)
        if not is_remote(p):
            names.add(os.path.basename(p))
    for m in img_pattern_html.finditer(content):
        p = m.group(1)
        if not is_remote(p):
            names.add(os.path.basename(p))
    for m in hero_pattern.finditer(content):
        p = m.group(1)
        if not is_remote(p):
            names.add(os.path.basename(p))
    return names

def process_file(file_path: str):
    parent = os.path.dirname(file_path)
    base, ext = os.path.splitext(os.path.basename(file_path))
    if base == 'index':
        return  # Already structured

    content = read(file_path)
    img_basenames = collect_image_basenames(content)

    # Create new folder and move markdown as index.mdx
    new_dir = os.path.join(parent, base)
    os.makedirs(new_dir, exist_ok=True)
    new_md_path = os.path.join(new_dir, 'index.mdx')

    # Write content to new path first, then remove old file
    write(new_md_path, content)
    os.remove(file_path)

    # Move images with matching basenames into the new folder
    for name in img_basenames:
        src = os.path.join(parent, name)
        dst = os.path.join(new_dir, name)
        if os.path.isfile(src):
            if not os.path.exists(dst):
                shutil.move(src, dst)
                print(f"MOVED IMG: {src} -> {dst}")
        # else: image might already be elsewhere or remote; skip

    print(f"STRUCTURED: {file_path} -> {new_md_path}")

def main():
    targets: List[str] = []
    for root, _, files in os.walk(ROOT):
        for fn in files:
            if fn.endswith('.md') or fn.endswith('.mdx'):
                targets.append(os.path.join(root, fn))

    # Sort longer paths first so nested files are handled last predictably
    for path in sorted(targets, key=lambda p: (p.count(os.sep), p)):
        process_file(path)

if __name__ == '__main__':
    main()

