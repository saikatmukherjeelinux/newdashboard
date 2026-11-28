"""Make cheat sheets discoverable without requiring JavaScript."""
from pathlib import Path
import re
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--root', default='.')
root = Path(parser.parse_args().root)
for lab in ['python-motion-lab', 'dsa-motion-lab', 'unix-motion-lab', 'ml-motion-lab', 'statistics-lab']:
    page = root / lab / 'index.html'
    content = page.read_text(encoding='utf-8')
    if 'class="cheat-sheet-entry"' not in content:
        entry = '<nav class="cheat-sheet-entry" aria-label="Quick reference"><a href="cheat-sheet.html">Cheat Sheet</a><span>Quick reference · examples · outputs</span></nav>'
        content, count = re.subn(r'(<main\b[^>]*>)', lambda m: m[1]+entry, content, count=1)
        assert count == 1, lab
    content = re.sub(r'\.\./reading\.(css|js)(?:\?[^"\s]*)?', r'../reading.\1?v=cheats-2', content)
    page.write_text(content, encoding='utf-8')
print('Added permanent Cheat Sheet navigation to all five lab pages.')
