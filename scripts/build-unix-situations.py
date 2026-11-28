"""Build one command-specific situation for every Unix lesson; no shell execution."""
from pathlib import Path
import json,hashlib
from unix_situations import CASES, PREFIX
import unix_situations_more, unix_situations_tools
ROOT=Path(__file__).resolve().parents[1]
inventory=json.loads((ROOT/'scripts/unix-command-inventory.json').read_text(encoding='utf-8'))
lookup={item['id']:item for item in inventory}
assert len(CASES)==len(lookup)==80
assert {case['id'] for case in CASES}==set(lookup)
assert len({case['id'] for case in CASES})==80
TOOLS={'shell':'printf','help':'help','regex':'grep','head-tail':'head tail seq','file-stat':'file stat','quoting':'printf','globs':'shopt','redirect':'printf','pipes':'tee sort uniq awk','status':'test','env':'env bash','identity':'id whoami stat','umask':'umask stat','jobs':'wait','system':'uname date','disk':'df du','network':'ip ss ping','loops':'read','conditions':'test','functions':'wc','scripts':'bash','temp':'mktemp','expand':'expand unexpand','read':'read','getopts':'getopts','alias':'alias unalias','zip':'zip unzip','history':'history'}
CHECK='''# Check required commands before creating any practice files.
require_tools() {
    local tool
    for tool in "$@"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            printf 'Required command missing: %s\\n' "$tool" >&2
            return 127
        fi
    done
}
require_tools mktemp rm {tools}
'''
COMMON=[
 'set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.',
 'set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.',
 'require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.',
 'mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.',
 'trap ... EXIT: defer cleanup until this script exits. rm -rf -- "$work" removes only the newly allocated practice directory; never replace it with an existing folder.',
 'printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted "$var" preserves one argument; "$@" preserves separate arguments.',
 '> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags.'
]
checks_path=ROOT/'scripts/unix-situations-checks.json'
checks={x['id']:x for x in json.loads(checks_path.read_text(encoding='utf-8'))} if checks_path.exists() else {}
ordered=[]
for item in inventory:
    case=next(case for case in CASES if case['id']==item['id'])
    tools=TOOLS.get(case['id'],case['id'])
    # The primary command is checked even when optional tools have their own checks.
    code=case['code'].replace('export LC_ALL=C\n','export LC_ALL=C\n'+CHECK.replace('{tools}',tools),1)
    case.update(lessonTitle=item['title'],group=item['group'],code=code,lines=len(code.splitlines()),commonFlags=COMMON,source=item['source'],verified=False)
    assert len(case['steps'])>=4 and len(case['flags'])>=3,item['id']
    assert case['lines']>=28,(item['id'],case['lines'])
    assert case['output'] and case['title'] and case['tryIt']
    check=checks.get(case['id'],{})
    if check.get('codeHash')!=hashlib.sha256(code.encode()).hexdigest():check={}
    case['execution']=check.get('execution','not run')
    case['syntaxChecked']=check.get('syntax',False)
    case['verified']=case['execution']=='matched'
    ordered.append(case)
(ROOT/'unix-motion-lab/assets/situations-data.js').write_text('window.UNIX_SITUATIONS = '+json.dumps(ordered,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(ROOT/'scripts/unix-situations.json').write_text(json.dumps(ordered,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Built {len(ordered)} command situations; {sum(not x["variable"] for x in ordered)} fixed-fixture outputs and {sum(x["variable"] for x in ordered)} illustrative/variable outputs. Execution status is recorded per case from the optional validation report.')
