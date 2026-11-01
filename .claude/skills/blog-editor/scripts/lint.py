#!/usr/bin/env python3
"""Mechanical readability checks for a Korean blog post (Markdown/MDX).

Usage: python3 lint.py <post.md>

Prints a paragraph outline (first sentence of each paragraph), long paragraphs,
long or heavily chained sentences, filler words, and inconsistent spellings of
English terms. These are signals for the editor, not verdicts.
"""

import re
import sys
from collections import defaultdict

LONG_PARAGRAPH_SENTENCES = 5
LONG_PARAGRAPH_CHARS = 400
LONG_SENTENCE_CHARS = 110
CHAIN_LIMIT = 3  # connective endings in one sentence before it reads as run-on

# Clause endings that chain one sentence into the next ("~했고, ~했는데, ~해서").
CONNECTIVES = re.compile(r"(고|는데|은데|ㄴ데|해서|어서|아서|지만|으며|며|니까|더니|다가),")
FILLERS = ["사실", "아무래도", "뭔가", "그냥", "약간", "정말", "굉장히", "너무", "엄청", "일단", "솔직히", "어쨌든"]
# Korean prose ends sentences with punctuation; splitting on a bare "다" would cut "아니다 싶었다" in half.
SENTENCE_END = re.compile(r"(?<=[.?!…])\s+(?=\S)")


def strip_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            body_start = text.find("\n", end + 4)
            return text[body_start + 1 :] if body_start != -1 else "", text[4:end]
    return text, ""


def blocks(body):
    """Yield (kind, text, line_no, heading) for prose paragraphs, headings, and list items.

    Code fences, tables, images, blockquotes, and HTML lines are skipped.
    """
    in_code = False
    para, para_line = [], 0
    heading = "(도입부)"

    def flush():
        nonlocal para
        if para:
            yield_list.append(("p", " ".join(para), para_line, heading))
            para = []

    yield_list = []
    for i, raw in enumerate(body.splitlines(), 1):
        line = raw.strip()
        if line.startswith("```") or line.startswith("~~~"):
            flush()
            in_code = not in_code
            continue
        if in_code:
            continue
        if not line or line.startswith(("|", "![", "<", ">")):
            flush()
            continue
        m = re.match(r"^(#{1,6})\s+(.*)", line)
        if m:
            flush()
            heading = m.group(2).strip()
            yield_list.append(("h", heading, i, heading))
            continue
        if re.match(r"^([-*+]|\d+\.)\s+", line):
            flush()
            yield_list.append(("li", re.sub(r"^([-*+]|\d+\.)\s+", "", line), i, heading))
            continue
        if not para:
            para_line = i
        para.append(line)
    flush()
    return yield_list


def plain(text):
    text = re.sub(r"`[^`]*`", "CODE", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    return re.sub(r"[*_]{1,2}", "", text)


def sentences(text):
    return [s.strip() for s in SENTENCE_END.split(plain(text)) if s.strip()]


def short(s, n=60):
    return s if len(s) <= n else s[:n] + "…"


def term_variants(body):
    """Group English words by lowercase form and report groups spelled more than one way."""
    no_code = re.sub(r"```.*?```", "", body, flags=re.S)
    no_code = re.sub(r"`[^`]*`", "", no_code)
    no_code = re.sub(r"\]\([^)]*\)", "]", no_code)  # link targets
    no_code = re.sub(r"https?://\S+", "", no_code)
    groups = defaultdict(lambda: defaultdict(int))
    # \b fails before Korean particles ("Codebuild를"), so bound on ASCII letters/digits instead.
    for w in re.findall(r"(?<![A-Za-z0-9])[A-Za-z][A-Za-z0-9]+(?![A-Za-z0-9])", no_code):
        groups[w.lower()][w] += 1
    out = []
    for forms in groups.values():
        if len(forms) > 1:
            out.append(", ".join(f"{w}×{c}" for w, c in sorted(forms.items(), key=lambda x: -x[1])))
    return out


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    with open(sys.argv[1], encoding="utf-8") as f:
        body, fm = strip_frontmatter(f.read())
    items = blocks(body)
    paras = [b for b in items if b[0] == "p"]

    title = re.search(r"^title:\s*(.*)$", fm, re.M)
    desc = re.search(r"^description:\s*(.*)$", fm, re.M)
    print("# frontmatter")
    print(f"- title: {title.group(1).strip() if title else '(없음)'}")
    print(f"- description: {desc.group(1).strip() if desc else '(없음)'}")

    print("\n# 개요 (소제목과 문단 첫 문장)")
    for kind, text, line, _ in items:
        if kind == "h":
            print(f"\n## {text}  (L{line})")
        elif kind == "p":
            first = sentences(text)
            print(f"- L{line}: {short(first[0], 80) if first else ''}")

    print("\n# 긴 문단")
    found = False
    for _, text, line, heading in paras:
        ss = sentences(text)
        if len(ss) >= LONG_PARAGRAPH_SENTENCES or len(text) >= LONG_PARAGRAPH_CHARS:
            found = True
            print(f"- L{line} [{heading}] {len(ss)}문장 / {len(text)}자: \"{short(ss[0] if ss else text, 40)}\"")
    if not found:
        print("- 없음")

    print("\n# 긴 문장 / 연결어미가 많은 문장")
    found = False
    for kind, text, line, heading in items:
        if kind not in ("p", "li"):
            continue
        for s in sentences(text):
            chains = len(CONNECTIVES.findall(s))
            if len(s) >= LONG_SENTENCE_CHARS or chains >= CHAIN_LIMIT:
                found = True
                print(f"- L{line} [{heading}] {len(s)}자, 연결 {chains}회: \"{short(s, 70)}\"")
    if not found:
        print("- 없음")

    print("\n# 군더더기 표현")
    counts = defaultdict(list)
    for kind, text, line, _ in items:
        if kind in ("p", "li"):
            for w in FILLERS:
                for _ in re.finditer(rf"(?<![가-힣]){w}(?=[\s,])", plain(text)):
                    counts[w].append(line)
    if counts:
        for w, lines in sorted(counts.items(), key=lambda x: -len(x[1])):
            print(f"- {w} ×{len(lines)} (L{', L'.join(map(str, lines[:6]))}{'…' if len(lines) > 6 else ''})")
    else:
        print("- 없음")

    print("\n# 영문 용어 표기 혼용 (코드 밖)")
    variants = term_variants(body)
    print("\n".join(f"- {v}" for v in variants) if variants else "- 없음")


if __name__ == "__main__":
    main()
