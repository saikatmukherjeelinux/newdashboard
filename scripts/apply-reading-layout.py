"""Integrate the Statistics Lab and a reading-first layer into an existing checkout."""
from pathlib import Path
import argparse,re
p=argparse.ArgumentParser();p.add_argument('--root',required=True);root=Path(p.parse_args().root).resolve()
labs={'python-motion-lab':'python','dsa-motion-lab':'dsa','unix-motion-lab':'unix','ml-motion-lab':'ml','statistics-lab':'statistics'}
for folder,key in labs.items():
    path=root/folder/'index.html';s=path.read_text(encoding='utf-8')
    if '../reading.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="../reading.css"></head>')
    s=re.sub(r'<body(?![^>]*data-lab)([^>]*)>',rf'<body\1 data-lab="{key}">',s,count=1)
    if '../reading.js' not in s:s=s.replace('</body>','<script src="../reading.js"></script></body>')
    path.write_text(s,encoding='utf-8')
path=root/'index.html';s=path.read_text(encoding='utf-8')
s=re.sub(r'<body(?![^>]*data-lab)([^>]*)>','<body\\1 data-lab="dashboard">',s,count=1)
if 'reading.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="reading.css"></head>')
start=s.find('    <section class="intro"');end=s.find('    <nav class="labs"',start)
if start<0 or end<0:raise SystemExit('Expected dashboard intro and lab navigation markers.')
s=s[:start]+'''    <section class="intro" aria-labelledby="title"><h1 id="title">Learning labs</h1><p>Choose a subject. Read a clear explanation, follow worked examples, then try the code and compare its output.</p><p>Python · Data structures and algorithms · Unix · Machine learning · Statistics</p></section>
'''+s[end:]
if 'href="statistics-lab/index.html"' not in s:
    card='''      <a class="lab statistics" href="statistics-lab/index.html"><div class="card-top"><span class="category">DATA &amp; UNCERTAINTY</span></div><h2>Statistics Lab</h2><p>Learn statistics from the basics through inference, experiments and models. Read plain-language explanations, calculations and their limits.</p><div class="tags"><span>60 topics</span><span>180 worked examples</span><span>Python code &amp; output</span></div><div class="open">Open Statistics Lab</div></a>
'''
    s=s.replace('    </nav>',card+'    </nav>',1)
for script in ['wizard.js','voldemort.js','bubble-characters.js','humor-feed.js','dashboard.js']:
    s=re.sub(r'\s*<script src="'+re.escape(script)+r'"></script>','',s)
s=s.replace('Python, DSA, Unix and ML Lab.','Python, DSA, Unix, ML and Statistics labs.')
path.write_text(s,encoding='utf-8')
path=root/'README.md';s=path.read_text(encoding='utf-8').replace('Four standalone learning projects','Five standalone learning projects')
if '## Statistics Lab' not in s:s+='''
## Statistics Lab

[Statistics Lab](statistics-lab/index.html) covers 60 topics across 12 chapters with 180 original worked examples, a descriptive calculator and a method-selection starting guide. See [its project guide](statistics-lab/README.md) for scope and assumptions.

## Reading-first layout and coding guides

All five labs share larger reading text, compact introductions and prominent worked-code links. Decorative dashboard scripts are no longer loaded. Existing learning tools and useful instructional diagrams remain available. Each lab includes eight new standalone examples with complete code, expected output and four explanatory steps. Python snippets use only the standard library; Unix snippets target Bash with GNU utilities. Browser pages display code rather than execute it.

Generate the guides with `python scripts/build-study-guides.py`; verify code with `python scripts/verify-study-examples.py`. The shared reading layer is `reading.css` and `reading.js`. This change does not claim that every pre-existing lesson was rewritten.
'''
path.write_text(s,encoding='utf-8')
print('Integrated Statistics Lab and reading-first navigation across all five labs.')
