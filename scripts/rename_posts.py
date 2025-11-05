#!/usr/bin/env python3
import os
import re
import sys
from collections import defaultdict

def parse_pubdate(txt: str):
    if not txt.startswith('---'):
        return None
    end = txt.find('\n---', 3)
    if end == -1:
        return None
    fm = txt[3:end]
    for line in fm.splitlines():
        if line.strip().startswith('pubDate:'):
            val = line.split(':', 1)[1].strip().strip('"\'')
            digits = ''.join(ch for ch in val if ch.isdigit() or ch == '-')
            if len(digits) >= 10:
                return digits[:10].replace('-', '')
    return None

def slugify(name: str) -> str:
    # Replace whitespace with hyphen, drop non-ASCII alnum and hyphen
    s = re.sub(r"\s+", '-', name)
    s = re.sub(r"[^A-Za-z0-9-]+", '', s)
    s = re.sub(r"-+", '-', s).strip('-').lower()
    return s

def main():
    root_dir = 'src/content/blog'
    candidates = []
    for root, _, files in os.walk(root_dir):
        for fn in files:
            if not fn.endswith(('.md', '.mdx')):
                continue
            # Already ASCII-safe?
            if re.match(r'^[A-Za-z0-9._-]+$', fn):
                continue
            full = os.path.join(root, fn)
            base, ext = os.path.splitext(fn)
            pub = None
            try:
                with open(full, 'r', encoding='utf-8') as f:
                    txt = f.read(4000)
                pub = parse_pubdate(txt)
            except Exception:
                pub = None

            raw_slug = slugify(base)
            if not raw_slug:
                # Build a hint from nearest two ASCII-safe parent dirs
                parts = [p for p in root.split(os.sep) if re.match(r'^[A-Za-z0-9._-]+$', p)]
                hint = '-'.join(p.lower() for p in parts[-2:]) if parts else 'post'
                raw_slug = hint
            candidates.append((root, fn, raw_slug, pub, ext))

    # Resolve conflicts per directory
    per_dir_used = defaultdict(set)
    renames = []
    for root, fn, raw_slug, pub, ext in candidates:
        proposed = raw_slug
        target = f"{proposed}{ext}"
        # If conflict, try appending date; then numeric suffix
        if target in per_dir_used[root] or os.path.exists(os.path.join(root, target)):
            if pub:
                proposed = f"{raw_slug}-{pub}"
                target = f"{proposed}{ext}"
        n = 2
        while target in per_dir_used[root] or (os.path.exists(os.path.join(root, target)) and target != fn):
            target = f"{proposed}-{n}{ext}"
            n += 1

        per_dir_used[root].add(target)
        if target == fn:
            continue
        old_path = os.path.join(root, fn)
        new_path = os.path.join(root, target)
        renames.append((old_path, new_path))

    # Apply renames
    for old, new in renames:
        os.rename(old, new)
        print(f"RENAMED: {old} -> {new}")

    print(f"TOTAL RENAMED: {len(renames)}")

if __name__ == '__main__':
    main()

