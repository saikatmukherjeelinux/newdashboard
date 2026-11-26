"""Run deterministic authored examples in isolated temporary directories on Linux.

Requires Bash, Node.js, GNU coreutils/findutils/grep/sed, awk, diff, gzip and tar.
No network, administrative or illustrative examples are executed.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
if os.name == "nt" or not shutil.which("bash"):
    raise SystemExit("Run this verifier on Linux/WSL with Bash and GNU utilities; Windows PowerShell cannot execute Unix examples.")
lessons = json.loads(subprocess.check_output([
    "node", "-e", "console.log(JSON.stringify(require('./tests/load-content.cjs').lessons))"
], cwd=ROOT, text=True))
fixtures = {
    "names.txt": "Ada\nLinus\nAda\nGrace\n",
    "people.csv": "name,age\nAda,36\nLinus,54\nGrace,85\n",
    "logs.txt": "INFO start\nERROR disk\nWARN memory\nERROR network\nINFO done\n",
    "docs/guide.txt": "Read the manual.\n",
    ".hidden": "",
}
passed = skipped = 0
failures = []
for lesson in lessons:
    for index, example in enumerate(lesson["examples"]):
        if example["variable"]:
            skipped += 1
            continue
        with tempfile.TemporaryDirectory(prefix="uml-example-") as directory:
            for name, contents in fixtures.items():
                file = Path(directory, name)
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_text(contents, encoding="utf-8")
            env = {**os.environ, "LC_ALL": "C", "BASH_ENV": "/dev/null", "TMPDIR": directory}
            result = subprocess.run(["bash", "--noprofile", "--norc", "-c", example["code"]], cwd=directory,
                                    env=env, capture_output=True, text=True, timeout=15)
            expected_status = 1 if lesson["id"] == "diff" and index == 1 else 0
            if result.stdout.rstrip("\n") != example["output"] or result.returncode != expected_status or result.stderr:
                failures.append(f"{lesson['id']} example {index+1}: exit={result.returncode}\nExpected: {example['output']!r}\nActual: {result.stdout!r}\nStderr: {result.stderr}")
            else:
                passed += 1
print(f"{passed} passed; {skipped} illustrative examples excluded; {len(failures)} failed")
if failures:
    raise SystemExit("\n\n".join(failures))
