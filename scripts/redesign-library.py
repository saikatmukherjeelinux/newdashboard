from pathlib import Path
import re
import argparse
p=argparse.ArgumentParser();p.add_argument('--root',default='.');root=Path(p.parse_args().root)
labs=[('python-motion-lab','Python','Understand the language through clear explanations and runnable examples.'),('dsa-motion-lab','Data structures & algorithms','Learn how algorithms work, then follow them step by step.'),('unix-motion-lab','Unix','Understand commands, flags, shell concepts and their output.'),('ml-motion-lab','Machine learning','Build the mathematics behind models, one worked example at a time.'),('statistics-lab','Statistics','Understand data, probability and what your results mean.')]
rows=''.join(f'<a href="{folder}/index.html"><span class="subject-number">0{i}</span><div><h2>{title}</h2><p>{description}</p></div><span class="subject-arrow" aria-hidden="true">→</span></a>' for i,(folder,title,description) in enumerate(labs,1))
(root/'index.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Learning Library</title><meta name="description" content="A simple library of Python, algorithms, Unix, machine learning and statistics lessons."><link rel="stylesheet" href="library.css?v=1"></head><body class="library-home"><main><p class="library-wordmark">Learning Library</p><h1>What would you like<br>to learn?</h1><p class="intro">Choose a subject. Open a lesson. Learn through explanations, examples and their results.</p><nav class="subject-list" aria-label="Choose a subject">{rows}</nav><footer>Five subjects. Learn at your own pace.</footer></main></body></html>''',encoding='utf-8')
# Replace the previous navigation implementation; keep content enhancements.
p=root/'reading.js';s=p.read_text(encoding='utf-8');s=s.split('// A single navigation model shared by all five labs.')[0];p.write_text(s.rstrip()+'\n',encoding='utf-8')
for folder,_,_ in labs:
 p=root/folder/'index.html';s=p.read_text(encoding='utf-8')
 s=re.sub(r'\.\./reading\.(css|js)(?:\?[^"\s]*)?',r'../reading.\1?v=library-1',s)
 if 'library.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="../library.css?v=1"></head>')
 if 'library-navigation.js' not in s:s=s.replace('</body>','<script src="../library-navigation.js?v=1"></script></body>')
 p.write_text(s,encoding='utf-8')
 for name in ['cheat-sheet.html','worked-examples.html']:
  p=root/folder/name;s=p.read_text(encoding='utf-8')
  if 'library.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="../library.css?v=1"></head>')
  s=re.sub(r'<header>.*?</header>',f'<header><a href="index.html">← Back to {dict((x[0],x[1]) for x in labs)[folder]}</a></header>',s,count=1,flags=re.S)
  p.write_text(s,encoding='utf-8')
print('Rebuilt dashboard, installed one-menu lab navigation and simplified resource page headers.')
