#!/usr/bin/env python3
"""Check that every citation in the Constitution, the bills, and the README
points to a subsection or section that exists.

Run from the repository root:  python3 scripts/check_refs.py
Exits with status 1 if any citation is broken.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
ROMAN_RE = "(?:X|IX|VIII|VII|VI|V|IV|III|II|I)"

articles = sorted((ROOT / "constitution").glob("article_*.md"))
sources = articles + sorted((ROOT / "constitution" / "bills").glob("*.md")) + [ROOT / "README.md"]

subsections, sections = set(), set()
for path in articles:
    roman = ROMAN[int(path.stem.split("_")[1]) - 1]
    for line in path.read_text().splitlines():
        m = re.match(r"### (" + ROMAN_RE + r"\.\d+\.[a-z]+) — ", line)
        if m:
            subsections.add(m.group(1))
        m = re.match(r"## Section (\d+) — ", line)
        if m:
            sections.add(f"{roman}.{m.group(1)}")

sub_ref = re.compile(r"(?<![\w.])(" + ROMAN_RE + r"\.\d+\.[a-z])(?![a-z])")
sec_ref = re.compile(r"(?<![\w.])(" + ROMAN_RE + r"\.\d+)(?![.\d]?\w)")
prose_ref = re.compile(r"Article (" + ROMAN_RE + r"), Sections? (\d+)(?: and (\d+))?")

broken = []
for path in sources:
    for n, line in enumerate(path.read_text().splitlines(), 1):
        if line.startswith("#"):
            continue
        for m in sub_ref.finditer(line):
            if m.group(1) not in subsections:
                broken.append((path, n, m.group(1)))
        for m in sec_ref.finditer(line):
            if m.group(1) not in sections:
                broken.append((path, n, m.group(1)))
        for m in prose_ref.finditer(line):
            for num in (m.group(2), m.group(3)):
                if num and f"{m.group(1)}.{num}" not in sections:
                    broken.append((path, n, f"Article {m.group(1)}, Section {num}"))

for path, n, ref in broken:
    print(f"{path.relative_to(ROOT)}:{n}: broken reference {ref}")
print(f"{len(subsections)} subsections, {len(sections)} sections; {len(broken)} broken references.")
sys.exit(1 if broken else 0)
