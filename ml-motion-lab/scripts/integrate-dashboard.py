"""Add the ML lab to an existing Motion Lab checkout without replacing unrelated HTML."""
from pathlib import Path
import argparse
p=argparse.ArgumentParser()
p.add_argument('--root',required=True)
args=p.parse_args()
root=Path(args.root).resolve()
if not (root/'unix-motion-lab/index.html').is_file() or not (root/'dashboard.css').is_file():
    raise SystemExit('Expected an existing Motion Lab dashboard root.')
card='''      <a class="lab ml" href="ml-motion-lab/index.html">
        <div class="card-top"><span class="lab-icon" aria-hidden="true">∑</span><span class="category">MATHEMATICS FOR AI &amp; ML</span></div>
        <div class="illustration ml-art" aria-hidden="true"><span class="math-line">Ideas → equations → understanding</span><strong>ŷ = wx + b</strong><span class="math-caption">Small steps. Deeper understanding.</span></div>
        <h2>ML Lab</h2>
        <p>Understand the mathematics behind AI. Start with everyday examples and small steps. Open formulas and deeper explanations when you feel ready.</p>
        <div class="tags"><span>40 lessons</span><span>160 examples</span><span>AI &amp; ML mathematics</span></div>
        <div class="open">Open ML lab</div>
      </a>
'''
f=root/'index.html';s=f.read_text(encoding='utf-8')
if 'href="ml-motion-lab/index.html"' not in s:
    if '    </nav>' not in s: raise SystemExit('Dashboard navigation marker missing')
    s=s.replace('    </nav>',card+'    </nav>',1)
s=s.replace('THREE LABS. ONE STARTING POINT.','FOUR LABS. ONE STARTING POINT.').replace('Python, DSA and Unix Motion Lab.','Python, DSA, Unix and ML Lab.')
f.write_text(s,encoding='utf-8')
f=root/'dashboard.css';s=f.read_text(encoding='utf-8')
if '/* ML Lab dashboard card */' not in s:
    s+='''
/* ML Lab dashboard card */
.ml{--accent:#f0c884}.ml-art{display:flex;flex-direction:column;justify-content:center;gap:12px}.ml-art strong{font:26px/1.4 Consolas,monospace;color:var(--accent)}.math-line,.math-caption{font-size:12px;color:#b9c6dc}.labs{grid-template-columns:repeat(2,minmax(0,1fr))}.unix{grid-column:auto}@media(max-width:700px){.labs{grid-template-columns:1fr}}
'''
f.write_text(s,encoding='utf-8')
f=root/'README.md';s=f.read_text(encoding='utf-8').replace('Three standalone learning projects','Four standalone learning projects')
if '## ML Lab' not in s:
    s+='''
## ML Lab

[Open ML Lab](ml-motion-lab/index.html): 40 mathematics lessons in 10 modules, 160 examples, 40 explained practice answers, compact original diagrams and interactive experiments. Covers foundations, linear algebra, calculus, probability, statistics, information theory, optimization and their connections to modern AI. See [the ML Lab guide](ml-motion-lab/README.md) for scope, sources and validation.
'''
f.write_text(s,encoding='utf-8')
for lab in ['python-motion-lab','dsa-motion-lab','unix-motion-lab']:
    f=root/lab/'index.html';s=f.read_text(encoding='utf-8')
    if '../ml-motion-lab/index.html' not in s:
        if lab=='unix-motion-lab':
            old='<a href="../dsa-motion-lab/index.html">DSA</a>'
            if old not in s: raise SystemExit('Unix cross-navigation marker missing')
            s=s.replace(old,old+'<a href="../ml-motion-lab/index.html">ML Lab</a>',1)
        else:
            old='<a class="motion-dashboard-link" href="../index.html">'
            start=s.find(old)
            if start<0: raise SystemExit(f'{lab} navigation marker missing')
            end=s.index('</a>',start)+4
            s=s[:end]+'<a class="motion-dashboard-link" href="../ml-motion-lab/index.html">ML Lab · Mathematics for AI</a>'+s[end:]
        f.write_text(s,encoding='utf-8')
print('Integrated ML Lab into dashboard and existing lab navigation.')
