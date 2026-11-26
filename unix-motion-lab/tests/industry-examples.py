"""Run only fixed-output exercises in disposable Linux directories.

Requires Bash, Node, GNU coreutils/findutils/grep/sed/tar/gzip, awk and diffutils.
Host/identity examples are explicitly skipped; no network requests are made.
"""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

if not sys.platform.startswith('linux'):
    sys.exit('Run this verifier on Linux with Bash and GNU utilities; host examples are never executed.')
root = Path(__file__).resolve().parents[1]
questions = json.loads(subprocess.check_output(
    ['node', '-e', "process.stdout.write(JSON.stringify(require('./assets/industry-data.js').questions))"],
    cwd=root, text=True))
failures = []
checked = 0
for question in questions:
    if question['variable']:
        continue
    with tempfile.TemporaryDirectory(prefix='unix-industry-check-') as directory:
        environment = {**os.environ, 'LC_ALL': 'C', 'TMPDIR': directory}
        setup = subprocess.run(['bash', '--noprofile', '--norc', '-c', question['setup']],
                               cwd=directory, env=environment, capture_output=True, text=True, timeout=15)
        if setup.returncode:
            failures.append((question['id'], 'setup', setup.stderr))
            continue
        result = subprocess.run(['bash', '--noprofile', '--norc', '-c', question['code']],
                                cwd=directory, env=environment, capture_output=True, text=True, timeout=15)
        expected = question['output'] + ('\n' if question['output'] else '')
        if result.returncode or result.stderr or result.stdout != expected:
            failures.append((question['id'], question['title'], {'status': result.returncode,
                'stderr': result.stderr, 'expected': expected, 'actual': result.stdout}))
        checked += 1
for failure in failures:
    print(failure)
print(f'{checked} fixed-output exercises checked; {sum(q["variable"] for q in questions)} illustrative examples skipped; {len(failures)} failures.')
sys.exit(bool(failures))
