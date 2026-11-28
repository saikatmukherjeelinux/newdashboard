"""Check syntax and optionally execute fixed-fixture cases in isolated temporary roots."""
from pathlib import Path
import argparse,json,os,subprocess,tempfile,hashlib
p=argparse.ArgumentParser();p.add_argument('--shell',required=True);p.add_argument('--execute',action='store_true');args=p.parse_args()
root=Path(__file__).resolve().parents[1]
cases=json.loads((root/'scripts/unix-situations.json').read_text(encoding='utf-8'))
env=dict(os.environ);env['PATH']=str(Path(args.shell).parent)
results=[];failed=[]
for case in cases:
    with tempfile.TemporaryDirectory(prefix='unix-situation-') as directory:
        base=Path(directory).resolve()
        script=base/'scenario.sh';script.write_text(case['code']+'\n',encoding='utf-8',newline='\n')
        checked=subprocess.run([args.shell,'-n',str(script)],env=env,cwd=base,text=True,capture_output=True,timeout=10)
        item={'id':case['id'],'syntax':checked.returncode==0,'execution':'not run','codeHash':hashlib.sha256(case['code'].encode()).hexdigest()}
        if checked.returncode:failed.append((case['id'],'syntax',checked.stderr))
        elif args.execute and not case['variable']:
            # TMPDIR confines every mktemp allocation and recursive EXIT cleanup
            # to the resolved, newly allocated validation directory above.
            runenv=dict(env);runenv['TMPDIR']=str(base).replace('\\','/')
            run=subprocess.run([args.shell,'--noprofile','--norc','-c','set +o posix; source "$1"','bash',str(script)],env=runenv,cwd=base,text=True,capture_output=True,timeout=20)
            if run.returncode==127 and 'Required command missing:' in run.stderr:
                item['execution']='unavailable dependency'
                item['reason']=run.stderr.strip()
            elif run.returncode:
                item['execution']='failed';failed.append((case['id'],'execution',run.stderr,run.stdout))
            elif run.stdout.rstrip('\n')!=case['output'].rstrip('\n'):
                item['execution']='output mismatch';failed.append((case['id'],'output',repr(case['output']),repr(run.stdout.rstrip('\n'))))
            else:item['execution']='matched'
        elif case['variable']:item['execution']='variable/interactive/system case; not run'
        results.append(item)
(root/'scripts/unix-situations-checks.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
print('Syntax passed:',sum(r['syntax'] for r in results),'/',len(results))
print('Exact outputs matched:',sum(r['execution']=='matched' for r in results))
print('Missing dependencies:',sum(r['execution']=='unavailable dependency' for r in results))
for failure in failed:print(repr(failure))
if failed:raise SystemExit(1)
