"""Apply the visual supplement without replacing unrelated lab changes."""
from pathlib import Path
import re
import sys
import shutil

source = Path(__file__).resolve().parents[1]
root = Path(sys.argv[1]) if len(sys.argv) > 1 else source
assets = root / 'unix-motion-lab/assets'
if root.resolve() != source.resolve():
    shutil.copytree(source / 'unix-motion-lab/assets/architecture/details', assets / 'architecture/details', dirs_exist_ok=True)
    shutil.copy2(source / 'unix-motion-lab/assets/architecture-visuals.js', assets / 'architecture-visuals.js')
renderer = assets / 'architecture.js'
text = renderer.read_text(encoding='utf8')
if 'function visualGuide' not in text:
    text = text.replace('  function render(id){', '''  function visualGuide(id){
    const visuals=(window.UNIX_ARCHITECTURE_VISUALS||{})[id]||[];
    return `<section class="arch-visual-guide" aria-label="More illustrated explanations"><h3>Understand it with pictures</h3><p>Read each picture from top to bottom, then read the explanation below it.</p>${visuals.map(v=>`<figure class="arch-figure arch-detail"><h4>${escape(v.title)}</h4><img src="assets/architecture/${escape(v.image)}" alt="${escape(v.alt)}" width="480" height="300" loading="lazy"><figcaption>${escape(v.explanation)}</figcaption></figure>`).join('')}</section>`;
  }
  function render(id){''')
    text = text.replace('<section class="arch-takeaway">', '${visualGuide(chapter.id)}<section class="arch-takeaway">')
text = text.replace('11 original diagrams', '91 explanatory diagrams')
renderer.write_text(text, encoding='utf8')
css = assets / 'architecture.css'
style = css.read_text(encoding='utf8')
if 'Medium-sized architecture illustrations' not in style:
    style += '''
/* Medium-sized architecture illustrations, including the original diagrams. */
#architectureView .arch-figure img{display:block;width:100%;max-width:480px;height:auto;max-height:340px;object-fit:contain;margin-inline:auto;border-radius:10px;background:#f6f8f5}
#architectureView .arch-figure{max-width:600px;margin:28px auto}
#architectureView .arch-detail h4{font-size:1.1rem;margin:0 0 14px}
#architectureView .arch-detail figcaption{font-size:1rem;line-height:1.8;color:var(--text)}
#architectureView .arch-visual-guide{margin-top:32px;border-top:1px solid var(--line);padding-top:20px}
'''
css.write_text(style, encoding='utf8')
index = root / 'unix-motion-lab/index.html'
html = index.read_text(encoding='utf8')
if 'assets/architecture-visuals.js' not in html:
    html = re.sub(r'(<script src="assets/architecture\.js[^\"]*">)', '<script src="assets/architecture-visuals.js?v=80-diagrams-1"></script>\\1', html)
html = re.sub(r'assets/architecture\.(css|js)(?:\?[^\"]*)?', r'assets/architecture.\1?v=80-diagrams-1', html)
index.write_text(html, encoding='utf8')
print('Installed architecture diagrams in', root)
