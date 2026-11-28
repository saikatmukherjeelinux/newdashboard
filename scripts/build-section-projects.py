"""Execute Python projects in disposable directories, then build the content bank."""
from pathlib import Path
import json, subprocess, sys, tempfile, re
from section_projects import PROJECTS
import dsa_section_projects, unix_section_projects
ROOT=Path(__file__).resolve().parents[1]
dsa_section_projects.install();unix_section_projects.install()
assert len(PROJECTS)==77, len(PROJECTS)
seen=set()
for project in PROJECTS:
    key=(project['lab'],project['section'])
    assert key not in seen,key
    seen.add(key)
    project['id']=re.sub('[^a-z0-9]+','-',project['section'].lower()).strip('-')
    project['lines']=len(project['code'].splitlines())
    assert project['lines']>=18,(key,project['lines'])
    if project['language']=='python':
        with tempfile.TemporaryDirectory(prefix='lab-section-') as directory:
            completed=subprocess.run([sys.executable,'-I','-c',project['code']],cwd=directory,capture_output=True,text=True,timeout=15)
        if completed.returncode:
            raise RuntimeError(f"{key}: {completed.stderr}")
        project['output']=completed.stdout.rstrip('\n')
        project['verified']=True
    else:
        assert project['output'] is not None,key
        project['verified']=False
    assert project['output'],key
bank={lab:[p for p in PROJECTS if p['lab']==lab] for lab in sorted(set(p['lab'] for p in PROJECTS))}
(ROOT/'section-projects-data.js').write_text('window.SECTION_PROJECTS = '+json.dumps(bank,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(ROOT/'scripts/section-projects.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for lab in bank:
    (ROOT/lab/'section-projects.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Complete section programs</title><link rel="stylesheet" href="../reading.css?v=projects-1"><link rel="stylesheet" href="../library.css?v=projects-1"></head><body class="code-guide" data-project-lab="{lab}"><main id="main"><p class="library-wordmark">Learning Library</p><h1>Complete section programs</h1><p>One substantial program for each topic group. Choose a section to read the code, explained steps and output.</p><label for="project-choice">Browse section programs</label><select id="project-choice"><option value="back">Back to this lab</option></select><div id="project-view"></div><p id="project-status" role="status" aria-live="polite"></p><noscript>JavaScript is needed to browse these programs. Return to <a href="index.html">the lab</a>.</noscript></main><script src="../section-projects-data.js?v=1"></script><script src="../section-projects-ui.js?v=1"></script></body></html>''',encoding='utf-8')
print(f'Built {len(PROJECTS)} section programs: 62 Python programs executed with assertions; 15 Bash outputs authored, not shell-verified.')
