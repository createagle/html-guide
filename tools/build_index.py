#!/usr/bin/env python3
"""Regenerate the root index.html from each chapter's README.md demo table.

Run after adding or renaming a demo:  python3 tools/build_index.py
A demo row in chapters/<dir>/README.md looks like:
| 5-1 srcset picker | [01-srcset.html](https://createagle.github.io/html-guide/chapters/05-images/01-srcset.html) | ... |
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent

PARTS = [
    ('Part 1 · Basics', [
        ('01-intro', 'Meet HTML'),
        ('02-syntax', 'Document Structure & Syntax'),
        ('03-text', 'Text & Typographic Semantics'),
        ('04-links', 'Links & URLs'),
        ('05-images', 'Images'),
        ('06-lists-tables', 'Lists & Tables'),
        ('07-forms', 'Form Basics'),
        ('08-head', 'The head & Metadata'),
    ]),
    ('Part 2 · Semantics & Content', [
        ('09-global-attributes', 'Global Attributes'),
        ('10-landmarks', 'Semantic Layout'),
        ('11-headings', 'Headings & Document Outline'),
        ('12-inline', 'Advanced Inline Semantics'),
        ('13-i18n', 'Internationalization'),
        ('14-media', 'Audio & Video'),
        ('15-embedding', 'Embedded Content'),
        ('16-graphics', 'Canvas, SVG & MathML'),
    ]),
    ('Part 3 · Forms', [
        ('17-input-types', 'Input Types in Depth'),
        ('18-validation', 'Native Validation'),
        ('19-constraint-api', 'Constraint Validation API'),
        ('20-input-ux', 'Input Experience'),
        ('21-submission', 'Form Submission & Data'),
        ('22-custom-controls', 'Custom Form Controls'),
    ]),
    ('Part 4 · Interaction & Components', [
        ('23-details', 'details & summary'),
        ('24-dialog', 'dialog'),
        ('25-popover', 'Popover API'),
        ('26-commands', 'Invoker Commands'),
        ('27-templates', 'template & slot'),
        ('28-web-components', 'Web Components'),
        ('29-scripting', 'HTML & DOM Scripting'),
        ('30-drag-edit', 'Drag & Drop and Editing'),
    ]),
    ('Part 5 · Engineering & Practice', [
        ('31-a11y', 'Accessibility Basics'),
        ('32-aria', 'ARIA in Practice'),
        ('33-performance', 'Performance & Resource Loading'),
        ('34-seo', 'SEO & Structured Data'),
        ('35-security', 'HTML Security'),
        ('36-debugging', 'Validation & Debugging'),
        ('37-frameworks', 'HTML in Frameworks'),
        ('38-pwa', 'PWA & Installable Apps'),
        ('39-capstone', 'Capstone Project'),
        ('40-tools-future', 'Tools, Resources & the Future'),
    ]),
]

ROW = re.compile(r'^\|\s*(\d+-\d+)\s+(.+?)\s*\|\s*\[([^\]]+?\.html)\]')


def demos(slug):
    readme = ROOT / 'chapters' / slug / 'README.md'
    if not readme.exists():
        return []
    out = []
    for line in readme.read_text(encoding='utf-8').splitlines():
        m = ROW.match(line)
        if m:
            out.append((m.group(1), m.group(2), f'chapters/{slug}/{m.group(3)}'))
    return out


def main():
    parts = []
    n = 0
    for title, chapters in PARTS:
        first, last = n + 1, n + len(chapters)
        items = []
        for slug, name in chapters:
            n += 1
            links = ' · '.join(f'<a href="{html.escape(href)}">{num} {html.escape(label)}</a>' for num, label, href in demos(slug))
            ex = f'\n      <div class="examples">{links}</div>' if links else '\n      <div class="examples">Coming soon</div>'
            items.append(f'    <li>{n}. {html.escape(name)}{ex}\n    </li>')
        parts.append(f'  <h2>{html.escape(title)} (Ch. {first}–{last})</h2>\n  <ul class="chapters">\n' + '\n'.join(items) + '\n  </ul>')
    page = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HTML Complete Guide · Demos</title>
  <meta name="description" content="Runnable demos for the HTML Complete Guide, 5 parts and 40 chapters.">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<main>
  <h1>HTML Complete Guide · Demos</h1>
  <p><a href="https://github.com/createagle/html-guide">Source on GitHub</a></p>

{chr(10).join(parts)}
</main>
</body>
</html>
'''
    (ROOT / 'index.html').write_text(page, encoding='utf-8')
    print('index.html written')


if __name__ == '__main__':
    main()
