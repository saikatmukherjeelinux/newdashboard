"""Execute authored Python snippets in isolated temporary directories; report shell limitations."""
from pathlib import Path
import json,subprocess,sys,tempfile,shutil
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'scripts/study-examples.json').read_text(encoding='utf-8'))
count=0;shell_count=0
for lab,examples in data.items():
    assert len(examples)==8
    for e in examples:
        assert len(e['steps'])==4
        if e['language']=='bash':shell_count+=1;continue
        with tempfile.TemporaryDirectory(prefix='lab-example-') as directory:
            result=subprocess.run([sys.executable,'-I','-c',e['code']],cwd=directory,capture_output=True,text=True,timeout=10)
            assert result.returncode==0,(lab,e['title'],result.stderr)
            assert result.stdout==e['output'],(lab,e['title'],repr(result.stdout),repr(e['output']))
            count+=1
print(f'PASS: {count} Python snippets executed with exact expected output across four labs.')
print(f'NOTE: {shell_count} GNU/Bash snippets have authored fixture outputs; shell execution is not verified on this Windows host.')
