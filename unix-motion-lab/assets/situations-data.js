window.UNIX_SITUATIONS = [
  {
    "id": "shell",
    "title": "Check a batch of filenames and report accepted work",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm printf\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir incoming\nprintf '%s\\n' 'ready' > 'incoming/day one.txt'\nprintf '%s\\n' 'ready' > incoming/day-two.txt\nprocessed=0\nfor file in incoming/*.txt; do\n    [ -f \"$file\" ] || continue\n    name=${file##*/}\n    printf 'Checking <%s>\\n' \"$name\"\n    if [ -s \"$file\" ]; then\n        printf 'Accepted\\n'\n        processed=$((processed + 1))\n    else\n        printf 'Empty file\\n'\n    fi\ndone\nprintf 'Processed: %s\\n' \"$processed\"",
    "output": "Checking <day one.txt>\nAccepted\nChecking <day-two.txt>\nAccepted\nProcessed: 2",
    "steps": [
      "You received two text files and need to inspect each filename without splitting names containing spaces.",
      "The shell expands incoming/*.txt before executing the loop; quotes preserve each path as one argument.",
      "${file##*/} removes the longest prefix ending in a slash. Arithmetic expansion increments a counter.",
      "The script reports two nonempty files; an empty file would be reported but not counted."
    ],
    "flags": [
      "[ -f path ]: test for a regular file.",
      "[ -s path ]: test for nonzero file size.",
      "printf %s: format one string; \n adds a newline.",
      "for / if: shell control structures, not options passed to another command."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "The shell & command anatomy",
    "group": "Start here",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "help",
    "title": "Check required tools before starting a report",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm help\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmissing=0\nfor tool in printf sort awk; do\n    if command -v \"$tool\" >/dev/null 2>&1; then\n        printf 'Available: %s\\n' \"$tool\"\n    else\n        printf 'Missing: %s\\n' \"$tool\"\n        missing=$((missing + 1))\n    fi\ndone\nprintf 'Bash help for read:\\n'\nhelp read > read-help.txt\nhead -n 2 read-help.txt\nif [ \"$missing\" -ne 0 ]; then\n    printf 'Install missing tools before continuing\\n' >&2\n    exit 1\nfi\nprintf 'Prerequisite check passed\\n'",
    "output": "Available: printf\nAvailable: sort\nAvailable: awk\nBash help for read:\nread: read [options] [name ...]\n    Read a line from the standard input ...\nPrerequisite check passed",
    "steps": [
      "Before a longer workflow, check that its commands can be found.",
      "command -v searches shell command resolution, including built-ins and executable paths.",
      "help reads Bash built-in documentation; man sort would open an external command manual when installed.",
      "The displayed help syntax is a shortened illustration and varies by Bash version."
    ],
    "flags": [
      "command -v: report how a name resolves; status indicates whether it was found.",
      ">/dev/null 2>&1: discard normal output and errors for the availability check.",
      "help read: show Bash documentation for the read built-in.",
      "head -n 2: show two initial lines.",
      "-ne: integer not-equal comparison in test."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "man, help & command discovery",
    "group": "Start here",
    "lines": 36,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "pwd",
    "title": "Confirm a script is running in its project root",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm pwd\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir -p project/reports\ncd project\nroot=$(pwd -P)\nprintf 'Root directory name: %s\\n' \"${root##*/}\"\ncd reports\ncurrent=$(pwd -P)\nprintf 'Current directory name: %s\\n' \"${current##*/}\"\nif [ \"$current\" = \"$root/reports\" ]; then\n    printf 'Location check passed\\n'\nelse\n    printf 'Unexpected working directory\\n' >&2\n    exit 1\nfi\nprintf '%s\\n' 'summary ready' > summary.txt\nprintf 'File under root: reports/summary.txt\\n'\ncat \"$root/reports/summary.txt\"",
    "output": "Root directory name: project\nCurrent directory name: reports\nLocation check passed\nFile under root: reports/summary.txt\nsummary ready",
    "steps": [
      "A report script must confirm its location before using relative paths.",
      "pwd -P returns the physical absolute directory; it does not change directories.",
      "The root variable retains that absolute path after cd changes the current directory.",
      "Only the final path components are printed, so the random temporary-directory name does not affect this output."
    ],
    "flags": [
      "pwd -P: resolve symbolic-link components in the working directory.",
      "mkdir -p: create missing parent directories.",
      "${path##*/}: keep the last path component.",
      "[ a = b ]: compare two quoted strings."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "pwd — where am I?",
    "group": "Files & paths",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "cd",
    "title": "Visit several folders without losing the starting directory",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm cd\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir -p project/input project/output\ncd project\nstarting=$(pwd -P)\nfor folder in input output missing; do\n    if [ ! -d \"$folder\" ]; then\n        printf 'Skip unavailable folder: %s\\n' \"$folder\"\n        continue\n    fi\n    (\n        cd -- \"$folder\"\n        printf 'Inside: %s\\n' \"${PWD##*/}\"\n        printf '%s\\n' 'checked' > checked.txt\n    )\ndone\n[ \"$(pwd -P)\" = \"$starting\" ]\nprintf 'Back in project: yes\\n'\nfind . -name checked.txt -type f | sort",
    "output": "Inside: input\nInside: output\nSkip unavailable folder: missing\nBack in project: yes\n./input/checked.txt\n./output/checked.txt",
    "steps": [
      "A batch task must visit input and output folders and return reliably.",
      "Each parenthesized group runs in a subshell, so its cd cannot change the parent shell’s directory.",
      "The -d test rejects a missing directory before entering it.",
      "The final assertion proves the parent remains in the starting project directory."
    ],
    "flags": [
      "cd -- path: change directory; -- ends option parsing.",
      "[ -d path ]: directory test; ! negates it.",
      "pwd -P: physical working directory.",
      "find -name checked.txt -type f: select regular files with that name."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "cd — navigate directories",
    "group": "Files & paths",
    "lines": 36,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "ls",
    "title": "Prepare a visible inventory including hidden files",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm ls\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir review\nprintf '%s\\n' 'public' > review/report.txt\nprintf '%s\\n' 'configuration' > review/.settings\nmkdir review/archive\nprintf 'Visible entries:\\n'\nls -1 -- review\nprintf '\\nIncluding hidden entries:\\n'\nls -1A -- review\nprintf '\\nDirectory itself:\\n'\nls -d -- review\nprintf '\\nCheck required report:\\n'\nif [ -f review/report.txt ]; then\n    printf 'report.txt exists\\n'\nelse\n    exit 1\nfi",
    "output": "Visible entries:\narchive\nreport.txt\n\nIncluding hidden entries:\n.settings\narchive\nreport.txt\n\nDirectory itself:\nreview\n\nCheck required report:\nreport.txt exists",
    "steps": [
      "Before sharing a folder, inspect visible and hidden entries separately.",
      "ls -1 prints one entry per line; -A also includes hidden names except . and ...",
      "ls -d lists the directory operand rather than its contents.",
      "Use file tests or find for program logic; do not parse arbitrary ls output because filenames can contain newlines."
    ],
    "flags": [
      "ls -1: one entry per line.",
      "ls -A: include dotfiles but omit . and ...",
      "ls -d: list the directory itself.",
      "--: stop option parsing."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "ls — list directory entries",
    "group": "Files & paths",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "mkdir",
    "title": "Create a batch workspace and remove only empty folders",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm mkdir\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir -p batch/incoming batch/processed batch/unused\nprintf '%s\\n' 'sample' > batch/incoming/item.txt\nmkdir -p batch/processed\nprintf 'Created folders:\\n'\nfind batch -type d | sort\nrmdir batch/unused\nprintf '\\nRemoved empty unused folder\\n'\nif rmdir batch/incoming 2> reason.txt; then\n    printf 'Unexpected removal\\n'\n    exit 1\nelse\n    printf 'Kept incoming: it still contains a file\\n'\nfi\nprintf 'Remaining file:\\n'\nfind batch -type f",
    "output": "Created folders:\nbatch\nbatch/incoming\nbatch/processed\nbatch/unused\n\nRemoved empty unused folder\nKept incoming: it still contains a file\nRemaining file:\nbatch/incoming/item.txt",
    "steps": [
      "Create a directory tree that a recurring batch job can reuse.",
      "mkdir -p tolerates an existing directory and creates missing parents.",
      "rmdir removes only an empty directory, so it fails on incoming while the sample file exists.",
      "The failure is handled inside if rather than hidden; the file stays intact."
    ],
    "flags": [
      "mkdir -p: create parents as necessary.",
      "rmdir path: remove an empty directory; no recursive removal here.",
      "find -type d / -type f: select directories or regular files.",
      "2>: capture diagnostic output separately."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "mkdir & rmdir — directory lifecycle",
    "group": "Files & paths",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "touch",
    "title": "Use a timestamp marker to identify a newer result",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm touch\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'old result' > old.txt\nprintf '%s\\n' 'new result' > new.txt\ntouch -t 202401010000 old.txt\ntouch -t 202401020000 checkpoint\ntouch -t 202401030000 new.txt\nprintf 'Files newer than checkpoint:\\n'\nfind . -type f -newer checkpoint -printf '%f\\n' | sort\nprintf '\\nMake an empty marker:\\n'\ntouch complete.marker\n[ -f complete.marker ]\n[ ! -s complete.marker ]\nprintf 'complete.marker exists and is empty\\n'\nprintf 'Existing content is preserved:\\n'\ntouch old.txt\ncat old.txt",
    "output": "Files newer than checkpoint:\nnew.txt\n\nMake an empty marker:\ncomplete.marker exists and is empty\nExisting content is preserved:\nold result",
    "steps": [
      "A workflow needs to distinguish results written after a checkpoint.",
      "Fixed timestamps make the ordering reproducible; the fixture uses three consecutive local dates.",
      "touch creates an absent file or updates timestamps on an existing one without clearing its content.",
      "find -newer compares modification times; this is not a content-change detector."
    ],
    "flags": [
      "touch -t YYYYMMDDhhmm: set an explicit timestamp.",
      "find -newer file: select newer modification times.",
      "GNU find -printf %f\\n: print the basename and newline.",
      "-s test: true for a file with nonzero size."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "touch — timestamps and empty files",
    "group": "Files & paths",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "cp",
    "title": "Copy a delivery directory and verify each file",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm cp\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir source delivery\nprintf '%s\\n' 'one' > 'source/first note.txt'\nprintf '%s\\n' 'two' > source/second.txt\ncp -R -- source/. delivery/\ncount=0\nfor original in source/*; do\n    name=${original##*/}\n    if cmp -s -- \"$original\" \"delivery/$name\"; then\n        printf 'Verified: %s\\n' \"$name\"\n        count=$((count + 1))\n    else\n        printf 'Copy mismatch\\n' >&2\n        exit 1\n    fi\ndone\nprintf 'Verified files: %s\\n' \"$count\"",
    "output": "Verified: first note.txt\nVerified: second.txt\nVerified files: 2",
    "steps": [
      "Prepare a separate delivery directory while leaving source files untouched.",
      "cp -R recursively copies source/. contents into the destination.",
      "Quoted paths preserve the space in first note.txt.",
      "cmp -s checks exact bytes; the loop counts only successfully verified copies."
    ],
    "flags": [
      "cp -R: recursively copy directories.",
      "source/.: copy the contents represented by this directory.",
      "--: treat later operands as paths, not options.",
      "cmp -s: quiet byte comparison; zero means identical."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "cp — copy files and directories",
    "group": "Files & paths",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "mv",
    "title": "Move approved files while refusing duplicate names",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm mv\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir incoming approved\nprintf '%s\\n' 'draft A' > incoming/a.txt\nprintf '%s\\n' 'draft B' > incoming/b.txt\nprintf '%s\\n' 'existing B' > approved/b.txt\nfor source in incoming/*.txt; do\n    name=${source##*/}\n    if [ -e \"approved/$name\" ]; then\n        printf 'Skipped existing destination: %s\\n' \"$name\"\n        continue\n    fi\n    mv -- \"$source\" \"approved/$name\"\n    printf 'Moved: %s\\n' \"$name\"\ndone\nprintf 'Remaining incoming files:\\n'\nfind incoming -type f -printf '%f\\n' | sort\nprintf 'Existing destination content: '\ncat approved/b.txt",
    "output": "Moved: a.txt\nSkipped existing destination: b.txt\nRemaining incoming files:\nb.txt\nExisting destination content: existing B",
    "steps": [
      "Only files with unused destination names should be moved.",
      "The -e test checks the destination before the move.",
      "mv removes the old directory entry and creates the new one; across filesystems it may copy and remove instead.",
      "This is an isolated teaching example. The separate check and move are not an atomic overwrite-protection protocol under concurrent writers."
    ],
    "flags": [
      "mv -- source destination: move or rename; -- ends options.",
      "[ -e path ]: path exists.",
      "continue: skip the remaining loop body.",
      "find -printf %f: print each matching basename."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "mv — move and rename",
    "group": "Files & paths",
    "lines": 36,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "rm",
    "title": "Delete only the disposable files explicitly marked temporary",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm rm\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir session\nprintf '%s\\n' 'keep' > session/report.txt\nprintf '%s\\n' 'scratch' > session/cache.tmp\nprintf '%s\\n' 'scratch' > 'session/other cache.tmp'\nprintf 'Candidates:\\n'\nfind session -maxdepth 1 -type f -name '*.tmp' -print\nremoved=0\nfor file in session/*.tmp; do\n    [ -f \"$file\" ] || continue\n    rm -- \"$file\"\n    removed=$((removed + 1))\ndone\nprintf 'Removed: %s\\n' \"$removed\"\n[ -f session/report.txt ]\nprintf 'Kept report: '\ncat session/report.txt",
    "output": "Candidates:\nsession/cache.tmp\nsession/other cache.tmp\nRemoved: 2\nKept report: keep",
    "steps": [
      "A cleanup task should target only scratch files, not the whole report directory.",
      "The quoted find pattern is passed to find without shell expansion; candidate order may vary.",
      "The loop quotes each expanded path and uses -- before removal.",
      "rm normally does not use the desktop recycle bin. This script operates only in its newly created temporary workspace."
    ],
    "flags": [
      "find -maxdepth 1: inspect only the starting directory and its direct entries.",
      "-name *.tmp: match the filename pattern.",
      "rm -- path: unlink the named entry, with no recursive option.",
      "-f in [ -f path ] is a regular-file test, not rm -f."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "rm — remove directory entries",
    "group": "Files & paths",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "ln",
    "title": "Compare a hard link, a symbolic link and a copy",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm ln\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'version one' > original.txt\nln original.txt hard.txt\nln -s original.txt shortcut.txt\ncp original.txt copy.txt\nprintf '%s\\n' 'version two' > original.txt\nprintf 'Hard link content: '; cat hard.txt\nprintf 'Symbolic link content: '; cat shortcut.txt\nprintf 'Copy content: '; cat copy.txt\nprintf 'Symbolic target: '; readlink shortcut.txt\nrm -- original.txt\nprintf 'Hard link after original name removal: '; cat hard.txt\nif [ -L shortcut.txt ] && [ ! -e shortcut.txt ]; then\n    printf 'Symbolic link is now dangling\\n'\nfi",
    "output": "Hard link content: version two\nSymbolic link content: version two\nCopy content: version one\nSymbolic target: original.txt\nHard link after original name removal: version two\nSymbolic link is now dangling",
    "steps": [
      "A project wants to understand whether an alternate filename shares content or stores a separate copy.",
      "A hard link names the same inode; a symbolic link stores a target path.",
      "Overwriting the existing file changes what both links read, but not the copy.",
      "After removing the original name, the hard link still references the inode while the symbolic target no longer resolves."
    ],
    "flags": [
      "ln source link: create a hard link.",
      "ln -s: create a symbolic link.",
      "readlink path: print the stored symbolic target.",
      "[ -L path ]: test the link itself; [ -e path ] follows it."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "ln & readlink — links",
    "group": "Files & paths",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "cat",
    "title": "Assemble a daily report from separate sections",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm cat\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'Daily report' > header.txt\nprintf '%s\\n' 'Orders: 12' 'Returns: 1' > body.txt\nprintf '%s\\n' 'End of report' > footer.txt\ncat header.txt body.txt footer.txt > combined.txt\nprintf 'Combined report:\\n'\ncat combined.txt\nprintf '\\nAdd a human note:\\n'\nprintf '%s\\n' 'Reviewed locally' >> combined.txt\ncat -n combined.txt\nlines=$(wc -l < combined.txt)\n[ \"$lines\" -eq 5 ]\nprintf 'Checked line count: %s\\n' \"$lines\"",
    "output": "Combined report:\nDaily report\nOrders: 12\nReturns: 1\nEnd of report\n\nAdd a human note:\n     1\tDaily report\n     2\tOrders: 12\n     3\tReturns: 1\n     4\tEnd of report\n     5\tReviewed locally\nChecked line count: 5",
    "steps": [
      "Several report fragments need to be joined in a deliberate order.",
      "cat reads operands sequentially and writes their contents to standard output.",
      "> creates the combined file; >> appends a note without replacing existing data.",
      "cat -n adds display line numbers; it does not modify combined.txt."
    ],
    "flags": [
      "cat -n: number all output lines.",
      ">: replace output file content.",
      ">>: append output.",
      "wc -l: count newline characters."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "cat — concatenate content",
    "group": "Read & inspect",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "less",
    "title": "Review a generated report without opening an editor",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm less\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v less >/dev/null 2>&1 || { printf 'Install less first\\n'; exit 1; }\nfor number in $(seq 1 40); do\n    printf 'Record %02d: sample item\\n' \"$number\"\ndone > report.txt\nprintf '%s\\n' 'Type /Record 20 then Enter to search.'\nprintf '%s\\n' 'Use n for the next match, space for a page, q to quit.'\nif [ -t 0 ] && [ -t 1 ]; then\n    less -N -S report.txt\nelse\n    printf 'No interactive terminal; showing first three rows instead.\\n'\n    head -n 3 report.txt\nfi\nprintf 'Review finished; report remains unchanged.\\n'",
    "output": "Type /Record 20 then Enter to search.\nUse n for the next match, space for a page, q to quit.\nNo interactive terminal; showing first three rows instead.\nRecord 01: sample item\nRecord 02: sample item\nRecord 03: sample item\nReview finished; report remains unchanged.",
    "steps": [
      "A larger file is easier to inspect in a pager than by printing it all at once.",
      "The program generates forty numbered sample rows.",
      "The interactive branch opens less; the displayed output here illustrates the noninteractive fallback.",
      "Searching and scrolling change the view, not the input file."
    ],
    "flags": [
      "less -N: show line numbers.",
      "less -S: chop long lines rather than wrap them.",
      "[ -t descriptor ]: test whether the descriptor is a terminal.",
      "seq 1 40: generate consecutive numbers.",
      "printf %02d: print a two-digit zero-padded integer."
    ],
    "variable": true,
    "requires": "Bash, GNU utilities and less",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "less — page through large text",
    "group": "Read & inspect",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Linux manual pages",
      "https://www.kernel.org/doc/man-pages/"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "head-tail",
    "title": "Check the beginning and end of a batch export",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm head tail seq\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'id,value' > export.csv\nfor id in $(seq 1 6); do\n    printf '%s,%s\\n' \"$id\" \"$((id * 10))\" >> export.csv\ndone\nprintf 'Header and first two rows:\\n'\nhead -n 3 export.csv\nprintf '\\nLast two rows:\\n'\ntail -n 2 export.csv\nprintf '\\nData without header:\\n'\ntail -n +2 export.csv > data.csv\ncat data.csv\nrows=$(wc -l < data.csv)\n[ \"$rows\" -eq 6 ]\nprintf 'Data rows: %s\\n' \"$rows\"",
    "output": "Header and first two rows:\nid,value\n1,10\n2,20\n\nLast two rows:\n5,50\n6,60\n\nData without header:\n1,10\n2,20\n3,30\n4,40\n5,50\n6,60\nData rows: 6",
    "steps": [
      "A batch export needs a quick header and completion check.",
      "head -n 3 includes the header plus two records.",
      "tail -n 2 returns the final two lines; tail -n +2 starts at line two instead.",
      "The exported fixture is simple CSV without embedded newlines; general CSV record counts can differ from line counts."
    ],
    "flags": [
      "head -n N: first N lines.",
      "tail -n N: last N lines.",
      "tail -n +N: start at line N.",
      "wc -l: count newline characters."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "head & tail — inspect file edges",
    "group": "Read & inspect",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "wc",
    "title": "Compare bytes, words and lines in submitted notes",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm wc\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf 'one two\\nthree\\n' > complete.txt\nprintf 'one two\\nthree' > no-final-newline.txt\nfor file in complete.txt no-final-newline.txt; do\n    lines=$(wc -l < \"$file\")\n    words=$(wc -w < \"$file\")\n    bytes=$(wc -c < \"$file\")\n    printf '%s: lines=%s words=%s bytes=%s\\n' \"$file\" \"$lines\" \"$words\" \"$bytes\"\ndone\nprintf '\\nCombined totals:\\n'\ncat complete.txt no-final-newline.txt > combined.txt\nprintf 'Lines: '; wc -l < combined.txt\nprintf 'Words: '; wc -w < combined.txt\nprintf 'Bytes: '; wc -c < combined.txt\n[ \"$(wc -c < complete.txt)\" -eq 14 ]",
    "output": "complete.txt: lines=2 words=3 bytes=14\nno-final-newline.txt: lines=1 words=3 bytes=13\n\nCombined totals:\nLines: 3\nWords: 6\nBytes: 27",
    "steps": [
      "Two visually similar notes differ only in their final newline.",
      "wc -l counts newline characters, not the number of visible text fragments.",
      "wc -w counts whitespace-separated words; -c counts bytes.",
      "Combining the files gives additive byte and newline counts for these inputs."
    ],
    "flags": [
      "wc -l: newline count.",
      "wc -w: word count.",
      "wc -c: byte count; use -m for characters under the chosen locale.",
      "< file: feed content through standard input so the filename is omitted."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "wc — count lines, words and bytes",
    "group": "Read & inspect",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "file-stat",
    "title": "Verify file type, size and permissions before processing",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm file stat\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v file >/dev/null 2>&1 || { printf 'Install file first\\n'; exit 1; }\nprintf 'hello\\n' > note.txt\nprintf '\\x00\\x01\\x02' > sample.bin\nchmod 600 note.txt\nfor item in note.txt sample.bin; do\n    printf 'Inspecting: %s\\n' \"$item\"\n    printf 'Type: '; file -b -- \"$item\"\n    printf 'Bytes: '; stat -c '%s' -- \"$item\"\ndone\nprintf 'Text mode: '; stat -c '%a' note.txt\nsize=$(stat -c '%s' note.txt)\n[ \"$size\" -eq 6 ]\nprintf 'Size check passed\\n'",
    "output": "Inspecting: note.txt\nType: ASCII text\nBytes: 6\nInspecting: sample.bin\nType: data\nBytes: 3\nText mode: 600\nSize check passed",
    "steps": [
      "An extension alone is not enough to identify a file.",
      "file examines content and reports a type; the exact wording depends on its database/version.",
      "stat reads metadata such as byte size and permission mode.",
      "The size assertion checks an exact fixture fact, independently of the descriptive type wording."
    ],
    "flags": [
      "file -b: brief output without filename.",
      "stat -c FORMAT: GNU output format.",
      "%s: size in bytes; %a: octal mode.",
      "chmod 600: owner read/write only."
    ],
    "variable": true,
    "requires": "Bash, GNU stat and file",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "file & stat — identify and inspect",
    "group": "Read & inspect",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "grep",
    "title": "Find failed jobs and preserve their original line numbers",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm grep\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncat > jobs.log <<'DATA'\nINFO job=load complete\nERROR job=export unavailable\nINFO job=report complete\nERROR job=load invalid-input\nDATA\nprintf 'Error records with line numbers:\\n'\ngrep -n -F 'ERROR' jobs.log > errors.txt\ncat errors.txt\nprintf '\\nError count: '\ngrep -c -F 'ERROR' jobs.log\nif grep -q -F 'FATAL' jobs.log; then\n    printf 'Fatal condition found\\n'\nelse\n    status=$?\n    [ \"$status\" -eq 1 ] || exit \"$status\"\n    printf 'No fatal condition found\\n'\nfi",
    "output": "Error records with line numbers:\n2:ERROR job=export unavailable\n4:ERROR job=load invalid-input\n\nError count: 2\nNo fatal condition found",
    "steps": [
      "A fictional job log needs a readable failure extract and a quick severity check.",
      "-F treats ERROR as literal text; -n keeps original line positions in the report.",
      "-c counts matching lines, not occurrences inside one line.",
      "The -q branch distinguishes no match (1) from an actual grep error (>1), instead of treating all failures as harmless."
    ],
    "flags": [
      "grep -F: literal pattern.",
      "-n: original line number.",
      "-c: matching-line count.",
      "-q: no normal output, use status.",
      "Status 0=match, 1=no match, 2=error in GNU grep."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "grep — select matching lines",
    "group": "Search & transform",
    "lines": 37,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Grep manual",
      "https://www.gnu.org/software/grep/manual/grep.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "regex",
    "title": "Separate well-formed ticket IDs from malformed text",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm grep\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'JOB-001' 'JOB-42' 'job-003' 'JOB-004 extra' 'JOB-999' > tickets.txt\npattern='^JOB-[0-9]{3}$'\nprintf 'Accepted IDs:\\n'\ngrep -E \"$pattern\" tickets.txt > accepted.txt\ncat accepted.txt\nprintf '\\nRejected rows:\\n'\ngrep -E -v \"$pattern\" tickets.txt > rejected.txt\ncat rejected.txt\nprintf '\\nAccepted count: '\nwc -l < accepted.txt\nprintf 'Rejected count: '\nwc -l < rejected.txt\n[ \"$(wc -l < accepted.txt)\" -eq 2 ]",
    "output": "Accepted IDs:\nJOB-001\nJOB-999\n\nRejected rows:\nJOB-42\njob-003\nJOB-004 extra\n\nAccepted count: 2\nRejected count: 3",
    "steps": [
      "A ticket ID must be uppercase JOB-, followed by exactly three decimal digits.",
      "^ and $ anchor the expression to the whole line; the digit class and repetition enforce the shape.",
      "The second grep uses the same expression with inverted selection.",
      "Shape validation does not prove that an ID exists in a database or that leading zeros have business meaning."
    ],
    "flags": [
      "grep -E: extended regular expressions.",
      "grep -v: select nonmatching lines.",
      "[0-9]{3}: exactly three ASCII digits.",
      "^ / $: beginning/end of line."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Regular expressions — matching text",
    "group": "Search & transform",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Grep manual",
      "https://www.gnu.org/software/grep/manual/grep.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "find",
    "title": "Discover text files beneath nested folders safely",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm find\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir -p documents/old documents/new\nprintf '%s\\n' 'A' > documents/old/a.txt\nprintf '%s\\n' 'B' > 'documents/new/b note.txt'\nprintf '%s\\n' 'image' > documents/new/picture.bin\nprintf 'Matching relative paths:\\n'\nfind documents -type f -name '*.txt' -print | sort\nprintf '\\nRead every matched file safely:\\n'\nfind documents -type f -name '*.txt' -print0 |\nwhile IFS= read -r -d '' path; do\n    printf '%s: ' \"${path##*/}\"\n    cat -- \"$path\"\ndone\nprintf 'Search completed\\n'",
    "output": "Matching relative paths:\ndocuments/new/b note.txt\ndocuments/old/a.txt\n\nRead every matched file safely:\na.txt: A\nb note.txt: B\nSearch completed",
    "steps": [
      "A nested document tree contains mixed file types and a filename with spaces.",
      "find tests each visited entry; -type f and -name combine with logical AND by default.",
      "-print0 separates paths with NUL, which cannot appear inside a Unix filename.",
      "read -d empty-string consumes NUL-delimited records. Traversal order is not guaranteed; the reading section shown is illustrative."
    ],
    "flags": [
      "find -type f: regular files.",
      "-name pattern: filename pattern; quote it to prevent shell expansion.",
      "-print0: NUL-delimited paths.",
      "read -r: preserve backslashes; -d empty string: NUL delimiter.",
      "IFS=: no whitespace trimming."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "find — walk a directory tree",
    "group": "Search & transform",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Findutils manual",
      "https://www.gnu.org/software/findutils/manual/html_mono/find.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "sort",
    "title": "Rank numeric sales records with a predictable tie-breaker",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm sort\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncat > sales.txt <<'DATA'\npear 9\napple 12\nplum 12\nbanana 2\nDATA\nprintf 'Largest totals first, name breaks ties:\\n'\nsort -k2,2nr -k1,1 sales.txt > ranked.txt\ncat ranked.txt\nprintf '\\nTop two rows:\\n'\nhead -n 2 ranked.txt\nprintf '\\nUnique product names:\\n'\ncut -d ' ' -f1 sales.txt | sort -u\n[ \"$(head -n 1 ranked.txt)\" = 'apple 12' ]",
    "output": "Largest totals first, name breaks ties:\napple 12\nplum 12\npear 9\nbanana 2\n\nTop two rows:\napple 12\nplum 12\n\nUnique product names:\napple\nbanana\npear\nplum",
    "steps": [
      "Text sorting would put 9 before 12; numeric ranking needs a numeric key.",
      "The first key is field two, numeric and descending.",
      "The second key is field one in ascending order so equal totals have a clear order.",
      "The input fixture uses one-word names and space-separated integer totals."
    ],
    "flags": [
      "sort -k2,2nr: field two only, numeric, reverse.",
      "-k1,1: first-field secondary key.",
      "sort -u: remove equal sorted lines.",
      "head -n 2: select first two rows."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "sort — order lines",
    "group": "Search & transform",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "uniq",
    "title": "Count repeated events across a whole file",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm uniq\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'login' 'logout' 'login' 'login' 'download' 'logout' > events.txt\nprintf 'Adjacent groups only:\\n'\nuniq -c events.txt | awk '{print $2 \": \" $1}'\nprintf '\\nWhole-file frequencies:\\n'\nsort events.txt | uniq -c | awk '{print $2 \": \" $1}'\nprintf '\\nRepeated event names:\\n'\nsort events.txt | uniq -d\nprintf '\\nNames occurring once:\\n'\nsort events.txt | uniq -u",
    "output": "Adjacent groups only:\nlogin: 1\nlogout: 1\nlogin: 2\ndownload: 1\nlogout: 1\n\nWhole-file frequencies:\ndownload: 1\nlogin: 3\nlogout: 2\n\nRepeated event names:\nlogin\nlogout\n\nNames occurring once:\ndownload",
    "steps": [
      "The same event can occur at several unrelated positions.",
      "uniq collapses adjacent equal lines only, which is why the first report has multiple login groups.",
      "Sorting brings all equal names together before counting.",
      "-d returns repeated groups; -u returns groups occurring once, not a deduplicated list of all names."
    ],
    "flags": [
      "uniq -c: prefix each group with its count.",
      "uniq -d: output repeated groups once.",
      "uniq -u: output groups with one occurrence.",
      "awk $1/$2: read the count and name in this simple fixture."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "uniq — adjacent duplicate groups",
    "group": "Search & transform",
    "lines": 28,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "cut",
    "title": "Extract selected columns from a simple delimited export",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm cut\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncat > people.csv <<'DATA'\nid,name,team\n1,Alice,blue\n2,Ben,green\n3,Casey,blue\nDATA\nprintf 'Name and team columns:\\n'\ncut -d, -f2,3 people.csv > selected.csv\ncat selected.csv\nprintf '\\nTeams without header:\\n'\ntail -n +2 people.csv | cut -d, -f3 | sort -u\nprintf '\\nExpected record count: '\ntail -n +2 selected.csv | wc -l\n[ \"$(head -n 1 selected.csv)\" = 'name,team' ]",
    "output": "Name and team columns:\nname,team\nAlice,blue\nBen,green\nCasey,blue\n\nTeams without header:\nblue\ngreen\n\nExpected record count: 3",
    "steps": [
      "Only two columns are needed for a team report.",
      "cut numbers fields from one and uses a single-character delimiter.",
      "The header is handled deliberately before collecting unique teams.",
      "This fixture has no quoted commas or multiline values. cut is not a general CSV parser."
    ],
    "flags": [
      "cut -d,: use comma as the delimiter.",
      "-f2,3: output fields two and three.",
      "-f3: output field three only.",
      "tail -n +2: omit the first line.",
      "sort -u: unique sorted teams."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "cut — select simple fields",
    "group": "Search & transform",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "tr",
    "title": "Normalize a list of short labels",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm tr\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '  Red\\r\\nBLUE\\r\\nGreen\\r\\n\\n' > raw.txt\nprintf 'Normalize case and remove carriage returns:\\n'\ntr -d '\\r' < raw.txt | tr '[:upper:]' '[:lower:]' > lower.txt\ncat lower.txt\nprintf 'Collapse repeated spaces:\\n'\ntr -s ' ' < lower.txt > compact.txt\ncat compact.txt\nprintf 'Keep only letters and newlines:\\n'\ntr -cd '[:alpha:]\\n' < compact.txt > labels.txt\ncat labels.txt\nprintf 'Nonempty labels: '\ngrep -c . labels.txt",
    "output": "Normalize case and remove carriage returns:\n  red\nblue\ngreen\n\nCollapse repeated spaces:\n red\nblue\ngreen\n\nKeep only letters and newlines:\nred\nblue\ngreen\n\nNonempty labels: 3",
    "steps": [
      "Labels from a simple text source contain CRLF line endings, uppercase letters and repeated spaces.",
      "tr operates on characters, not words or regex matches.",
      "-s squeezes runs of the selected character; it does not trim all leading whitespace.",
      "The final -cd removes the complement of letters and newlines. LC_ALL=C makes this an ASCII-oriented example."
    ],
    "flags": [
      "tr -d: delete selected characters.",
      "tr set1 set2: translate corresponding characters.",
      "tr -s: squeeze repeated selected characters.",
      "tr -c: complement the selected set; -cd deletes the complement."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "tr — translate or delete characters",
    "group": "Search & transform",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "sed",
    "title": "Create a revised configuration without editing the original",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm sed\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncat > original.conf <<'DATA'\n# training configuration\nmode=dev\nworkers=2\npath=/old/data\nDATA\nsed -e 's/^mode=dev$/mode=test/' -e 's|/old/|/practice/|g' original.conf > revised.conf\nprintf 'Revised configuration:\\n'\ncat revised.conf\nprintf '\\nActive lines only:\\n'\nsed '/^#/d; /^$/d' revised.conf\nprintf '\\nOriginal mode remains: '\ngrep '^mode=' original.conf\ngrep -q '^mode=test$' revised.conf",
    "output": "Revised configuration:\n# training configuration\nmode=test\nworkers=2\npath=/practice/data\n\nActive lines only:\nmode=test\nworkers=2\npath=/practice/data\n\nOriginal mode remains: mode=dev",
    "steps": [
      "A testing configuration should be derived from the original without overwriting it.",
      "Two -e expressions change an exact mode line and a path fragment.",
      "The alternate substitution delimiter avoids escaping the slashes in paths.",
      "The second sed deletes comment and empty lines for display; no -i option is used."
    ],
    "flags": [
      "sed -e script: add an editing expression.",
      "s/pattern/replacement/: substitute the first match per line.",
      "g suffix: replace every match on the line.",
      "/pattern/d: delete matching lines.",
      "^ and $: whole-line boundaries."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "sed — stream editing",
    "group": "Search & transform",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Sed manual",
      "https://www.gnu.org/software/sed/manual/sed.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "awk",
    "title": "Summarize quantities and reject malformed records",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm awk\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncat > quantities.txt <<'DATA'\napple 3\npear 2\napple 4\nbroken unknown\nDATA\nawk '\nNF != 2 || $2 !~ /^[0-9]+$/ { rejected++; next }\n{ totals[$1] += $2; accepted++ }\nEND {\n    printf \"apple=%d\\n\", totals[\"apple\"]\n    printf \"pear=%d\\n\", totals[\"pear\"]\n    printf \"accepted=%d rejected=%d\\n\", accepted, rejected\n}' quantities.txt > report.txt\ncat report.txt\ngrep -q '^apple=7$' report.txt",
    "output": "apple=7\npear=2\naccepted=3 rejected=1",
    "steps": [
      "A small inventory feed can have repeated names and invalid quantities.",
      "NF checks the field count; a digit-only regex validates quantity text.",
      "Associative-array totals accumulate values by item name.",
      "END prints after all input. The fixed display order avoids relying on awk array iteration order."
    ],
    "flags": [
      "NF: field count; $1/$2: first/second field.",
      "!~: does not match a regex.",
      "next: skip remaining actions for this record.",
      "END: run once after input.",
      "printf %d: format an integer."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "awk — records, fields and calculations",
    "group": "Search & transform",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Awk manual",
      "https://www.gnu.org/software/gawk/manual/gawk.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "xargs",
    "title": "Count lines in files whose names contain spaces",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm xargs\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir notes\nprintf 'a\\nb\\n' > 'notes/first note.txt'\nprintf 'c\\n' > notes/second.txt\nprintf 'Counts for each file:\\n'\nfind notes -type f -print0 | sort -z |\n    xargs -0 -r -n 1 sh -c '\n        file=$1\n        count=$(wc -l < \"$file\")\n        printf \"%s: %s\\n\" \"$file\" \"$count\"\n    ' sh\nprintf 'Empty discovery runs no worker:\\n'\nfind notes -name '*.missing' -print0 |\n    xargs -0 -r printf 'Unexpected: %s\\n'\nprintf 'Done\\n'",
    "output": "Counts for each file:\nnotes/first note.txt: 2\nnotes/second.txt: 1\nEmpty discovery runs no worker:\nDone",
    "steps": [
      "Discovered filenames must become separate command arguments without breaking spaces.",
      "find -print0 and xargs -0 agree on NUL delimiters; sort -z orders those records.",
      "-n 1 sends one file per worker; the extra sh fills $0 so the filename becomes $1.",
      "GNU -r avoids calling the worker when input is empty. Do not interpolate filenames into shell source."
    ],
    "flags": [
      "xargs -0: NUL-delimited input.",
      "-r: do not run on empty input (GNU).",
      "-n 1: one input argument per invocation.",
      "sh -c code sh file: execute fixed code with file in $1.",
      "sort -z: NUL-delimited sorting."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "xargs — turn input into arguments",
    "group": "Search & transform",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Findutils manual",
      "https://www.gnu.org/software/findutils/manual/html_mono/find.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "diff",
    "title": "Review a changed configuration and handle comparison status",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm diff\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf 'mode=test\\nworkers=2\\n' > old.conf\nprintf 'mode=test\\nworkers=4\\n' > new.conf\nprintf 'Changed lines:\\n'\nif diff old.conf new.conf > changes.txt; then\n    printf 'No changes\\n'\nelse\n    result=$?\n    [ \"$result\" -eq 1 ] || exit \"$result\"\n    cat changes.txt\nfi\ncp new.conf backup.conf\nif cmp -s new.conf backup.conf; then\n    printf 'Backup bytes match\\n'\nfi",
    "output": "Changed lines:\n2c2\n< workers=2\n---\n> workers=4\nBackup bytes match",
    "steps": [
      "A configuration review needs to distinguish changed content from a failed comparison.",
      "diff returns 0 for identical files, 1 for differences, and a larger status for errors.",
      "The ordinary diff format identifies line two as changed.",
      "cmp -s independently checks that the backup is byte-for-byte identical."
    ],
    "flags": [
      "diff file1 file2: compare lines; -u is an optional unified display.",
      "cmp -s: suppress output and use status.",
      "$?: status of the immediately preceding command.",
      "[ value -eq 1 ]: numeric equality test."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "diff & cmp — compare files",
    "group": "Search & transform",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Linux manual pages",
      "https://www.kernel.org/doc/man-pages/"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "printf",
    "title": "Format a small invoice with aligned numeric columns",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm printf\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nitems=(book pen folder)\nquantities=(2 4 1)\nprices=(500 125 250)\ngrand=0\nprintf '%-10s %3s %7s\\n' ITEM QTY CENTS\nfor index in \"${!items[@]}\"; do\n    total=$((quantities[index] * prices[index]))\n    grand=$((grand + total))\n    printf '%-10s %3d %7d\\n' \"${items[index]}\" \"${quantities[index]}\" \"$total\"\ndone\nprintf 'Total: %d.%02d\\n' \"$((grand / 100))\" \"$((grand % 100))\"\nlabel='Save 10% today'\nprintf 'Message: %s\\n' \"$label\"\n[ \"$grand\" -eq 1750 ]",
    "output": "ITEM       QTY   CENTS\nbook         2    1000\npen          4     500\nfolder       1     250\nTotal: 17.50\nMessage: Save 10% today",
    "steps": [
      "An invoice should keep columns aligned and show amounts consistently.",
      "Arrays keep product names, quantities and integer-cent prices aligned by index.",
      "The format string is fixed; variable text is supplied through %s, so its percent sign is not treated as a format instruction.",
      "Integer cents avoid decimal floating-point arithmetic in this limited calculation."
    ],
    "flags": [
      "%-10s: left-aligned string in at least ten columns.",
      "%3d / %7d: integer field widths.",
      "%02d: two-digit zero padding.",
      "${!array[@]}: array indices.",
      "printf is more predictable than echo for escapes and -n-like text."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "printf & echo — produce text",
    "group": "Shell building blocks",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "quoting",
    "title": "Preserve spaces, wildcard characters and empty arguments",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm printf\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir samples\nprintf '%s\\n' 'data' > 'samples/a note.txt'\nshow_arguments() {\n    printf 'Argument count: %s\\n' \"$#\"\n    index=0\n    for value in \"$@\"; do\n        index=$((index + 1))\n        printf '%s: <%s>\\n' \"$index\" \"$value\"\n    done\n}\npath='samples/a note.txt'\nliteral='*.txt'\nshow_arguments \"$path\" \"$literal\" ''\nprintf 'Contents: '\ncat -- \"$path\"\nprintf 'Literal variable name: %s\\n' '$path'",
    "output": "Argument count: 3\n1: <samples/a note.txt>\n2: <*.txt>\n3: <>\nContents: data\nLiteral variable name: $path",
    "steps": [
      "A helper must receive the exact arguments the caller intends.",
      "Double quotes allow variable expansion while preserving spaces and empty values.",
      "Single quotes preserve literal characters such as a dollar sign.",
      "Quoted \"$@\" expands to one argument per positional parameter; it does not concatenate them."
    ],
    "flags": [
      "\"$var\": expand one variable without word splitting or globbing.",
      "Single quotes: suppress expansion.",
      "$#: number of arguments.",
      "\"$@\": individually quoted arguments.",
      "--: end command options."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Quoting, variables & expansion",
    "group": "Shell building blocks",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "globs",
    "title": "Process a known set of reports with empty-match handling",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm shopt\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir -p reports/{daily,weekly}\nprintf '%s\\n' 'A' > reports/daily/a.txt\nprintf '%s\\n' 'B' > reports/daily/b.txt\nprintf '%s\\n' 'image' > reports/daily/c.bin\nshopt -s nullglob\nfiles=(reports/daily/*.txt)\nprintf 'Matched text files: %s\\n' \"${#files[@]}\"\nfor file in \"${files[@]}\"; do\n    printf '%s: ' \"${file##*/}\"\n    cat \"$file\"\ndone\nmissing=(reports/weekly/*.txt)\nprintf 'Weekly text files: %s\\n' \"${#missing[@]}\"\nshopt -u nullglob",
    "output": "Matched text files: 2\na.txt: A\nb.txt: B\nWeekly text files: 0",
    "steps": [
      "Brace expansion creates two named folders; it is different from matching existing filenames.",
      "The *.txt glob selects existing text files.",
      "nullglob makes an unmatched pattern expand to no words instead of the literal pattern.",
      "Quoted array expansion preserves each discovered path."
    ],
    "flags": [
      "shopt -s nullglob: enable empty unmatched globs.",
      "shopt -u nullglob: disable that option.",
      "{daily,weekly}: brace alternatives.",
      "${#array[@]}: number of array elements.",
      "*.txt: shell filename pattern, not a regular expression."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Globs & brace expansion",
    "group": "Shell building blocks",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "redirect",
    "title": "Keep successful records and diagnostics in separate files",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm printf\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nproduce_report() {\n    printf 'row-1 accepted\\n'\n    printf 'row-2 rejected\\n' >&2\n    printf 'row-3 accepted\\n'\n}\nproduce_report > accepted.txt 2> rejected.txt\nprintf 'Normal output:\\n'\ncat accepted.txt\nprintf 'Errors:\\n'\ncat rejected.txt\nproduce_report > combined.txt 2>&1\nprintf 'Combined in emission order:\\n'\ncat combined.txt\nprintf 'Additional accepted row\\n' >> accepted.txt\nprintf 'Accepted lines after append: '\nwc -l < accepted.txt",
    "output": "Normal output:\nrow-1 accepted\nrow-3 accepted\nErrors:\nrow-2 rejected\nCombined in emission order:\nrow-1 accepted\nrow-2 rejected\nrow-3 accepted\nAccepted lines after append: 3",
    "steps": [
      "A report producer sends usable rows to stdout and diagnostics to stderr.",
      "> and 2> capture these streams independently.",
      "> combined.txt 2>&1 opens the output file and then points stderr to the same destination; redirection order matters.",
      ">> appends while < supplies a file as standard input."
    ],
    "flags": [
      "1 / 2: stdout and stderr file descriptors.",
      ">: create or truncate; >>: append.",
      "2>&1: duplicate the current stdout destination onto stderr.",
      "<: redirect standard input."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Redirection — stdin, stdout & stderr",
    "group": "Shell building blocks",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "pipes",
    "title": "Display a transformed report while saving the same content",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm tee sort uniq awk\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' apple pear apple plum pear apple > events.txt\nprintf 'Frequency report:\\n'\nsort events.txt | uniq -c |\n    awk '{printf \"%s: %d\\n\", $2, $1}' |\n    tee frequency.txt\nprintf '\\nSaved report lines: '\nwc -l < frequency.txt\nprintf '\\nAppend a footer through tee:\\n'\nprintf 'Report complete\\n' | tee -a frequency.txt\nprintf '\\nFinal saved line: '\ntail -n 1 frequency.txt\ngrep -q '^apple: 3$' frequency.txt",
    "output": "Frequency report:\napple: 3\npear: 2\nplum: 1\n\nSaved report lines: 3\n\nAppend a footer through tee:\nReport complete\n\nFinal saved line: Report complete",
    "steps": [
      "A pipeline should produce a useful terminal display and an identical saved report.",
      "Each pipe sends stdout into the next command’s stdin; stderr is separate by default.",
      "tee writes input both to its file operand and stdout.",
      "tee -a appends instead of replacing. Pipeline failure handling requires care: Bash normally reports the last stage’s status unless pipefail is enabled."
    ],
    "flags": [
      "Pipe symbol: connect standard streams.",
      "tee file: copy stdin to file and stdout.",
      "tee -a: append.",
      "uniq -c: adjacent group counts.",
      "awk printf: format the count/name fields."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Pipes & tee — compose small tools",
    "group": "Shell building blocks",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "status",
    "title": "Validate inputs before generating a summary",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm test\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'ready' > input.txt\nvalidate() {\n    [ -f \"$1\" ] || return 2\n    [ -s \"$1\" ] || return 3\n    return 0\n}\nfor path in input.txt absent.txt; do\n    if validate \"$path\"; then\n        printf 'Ready: %s\\n' \"$path\"\n    else\n        code=$?\n        printf 'Rejected: %s (status %s)\\n' \"$path\" \"$code\"\n    fi\ndone\nvalidate input.txt && printf 'Summary may proceed\\n'\nprintf 'A failed test is handled: '\n[ -f absent.txt ] || printf 'file missing\\n'",
    "output": "Ready: input.txt\nRejected: absent.txt (status 2)\nSummary may proceed\nA failed test is handled: file missing",
    "steps": [
      "Validation returns distinct statuses for missing and empty input.",
      "if uses status rather than text output to choose its branch.",
      "&& executes the next command only after success; || executes it after failure.",
      "Capture $? immediately, before another command replaces it."
    ],
    "flags": [
      "return N: finish the function with status N.",
      "0: success; nonzero: failure convention.",
      "[ -f ] / [ -s ]: file existence/type and size tests.",
      "&& / ||: conditional command lists."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Exit status, &&, || & tests",
    "group": "Shell building blocks",
    "lines": 36,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "env",
    "title": "Pass selected configuration into a child shell",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm env bash\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprivate_note='not exported'\nexport APP_MODE=training\nexport REPORT_NAME=summary\nbash -c '\n    printf \"Mode: %s\\n\" \"$APP_MODE\"\n    printf \"Report: %s\\n\" \"$REPORT_NAME\"\n    printf \"Private variable: %s\\n\" \"${private_note-unset}\"\n'\nenv APP_MODE=preview bash -c 'printf \"One-call override: %s\\n\" \"$APP_MODE\"'\nprintf 'Parent still uses: %s\\n' \"$APP_MODE\"\ncommand_path=$(command -v sort)\nprintf 'sort is discoverable: '\n[ -n \"$command_path\" ] && printf 'yes\\n'",
    "output": "Mode: training\nReport: summary\nPrivate variable: unset\nOne-call override: preview\nParent still uses: training\nsort is discoverable: yes",
    "steps": [
      "A child process needs selected settings, not every local variable.",
      "export puts a variable into the environment inherited by child processes.",
      "env NAME=value changes that invocation’s environment without changing the parent.",
      "PATH participates in command discovery; the script checks availability without printing machine-specific paths."
    ],
    "flags": [
      "export NAME=value: inherit this variable in child processes.",
      "env NAME=value command: override for one invocation.",
      "bash -c string: execute the supplied Bash source.",
      "${name-unset}: fallback when unset.",
      "command -v: command discovery."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "env, export & PATH",
    "group": "Shell building blocks",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "chmod",
    "title": "Make a private script executable for its owner",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm chmod\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir private\nchmod 700 private\ncat > private/report.sh <<'SCRIPT'\n#!/usr/bin/env bash\nprintf 'Practice report completed\\n'\nSCRIPT\nchmod 600 private/report.sh\nprintf 'Before: '; stat -c '%a' private/report.sh\nchmod u+x private/report.sh\nprintf 'After: '; stat -c '%a' private/report.sh\nprivate/report.sh\nchmod go-rwx private/report.sh\nprintf 'Final owner-only mode: '; stat -c '%a' private/report.sh\n[ -x private/report.sh ]",
    "output": "Before: 600\nAfter: 700\nPractice report completed\nFinal owner-only mode: 700",
    "steps": [
      "A newly written shell script should run for its owner without granting other users access.",
      "Directory execute permission permits traversal; file execute permission permits execution.",
      "u+x adds only the owner’s execute bit.",
      "go-rwx removes group/other read, write and execute bits. ACLs and privileged access are additional considerations."
    ],
    "flags": [
      "chmod 700: owner read/write/execute only.",
      "chmod 600: owner read/write only.",
      "u+x: add owner execution.",
      "go-rwx: remove group/other permissions.",
      "[ -x path ]: current-process executable access test."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "chmod — permissions",
    "group": "Permissions & identity",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "identity",
    "title": "Check ownership before deciding whether a file is yours",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm id whoami stat\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'practice content' > owned.txt\nuid=$(id -u)\ngid=$(id -g)\nowner=$(stat -c '%u' owned.txt)\ngroup=$(stat -c '%g' owned.txt)\nprintf 'Current user: '; whoami\nprintf 'Effective UID: %s\\n' \"$uid\"\nprintf 'Primary GID: %s\\n' \"$gid\"\nif [ \"$owner\" = \"$uid\" ]; then\n    printf 'Practice file is owned by this user\\n'\nfi\nprintf 'Practice file group: %s\\n' \"$group\"\nprintf 'No ownership changes were requested\\n'",
    "output": "Current user: student\nEffective UID: 1000\nPrimary GID: 1000\nPractice file is owned by this user\nPractice file group: 1000\nNo ownership changes were requested",
    "steps": [
      "Before changing ownership, inspect the current identity and actual file metadata.",
      "id -u and -g report effective numeric IDs; whoami reports the user name.",
      "stat reads owner and group IDs from the practice file.",
      "The output IDs are illustrative. chown and chgrp require appropriate permissions and are intentionally not used to alter unrelated files."
    ],
    "flags": [
      "id -u: effective user ID.",
      "id -g: effective primary group ID.",
      "stat %u / %g: file owner/group IDs.",
      "whoami: effective user name.",
      "chown user file / chgrp group file: ownership operations, shown only as concepts here."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "id, whoami, chown & chgrp",
    "group": "Permissions & identity",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "umask",
    "title": "Create private files and restore the previous creation mask",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm umask stat\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprevious=$(umask)\numask 077\nmkdir private\nprintf '%s\\n' 'private note' > private/note.txt\nprintf 'Private directory: '; stat -c '%a' private\nprintf 'Private file: '; stat -c '%a' private/note.txt\numask 022\nmkdir shared-style\nprintf '%s\\n' 'readable note' > shared-style/note.txt\nprintf 'Other directory: '; stat -c '%a' shared-style\nprintf 'Other file: '; stat -c '%a' shared-style/note.txt\numask \"$previous\"\nprintf 'Previous mask restored\\n'",
    "output": "Private directory: 700\nPrivate file: 600\nOther directory: 755\nOther file: 644\nPrevious mask restored",
    "steps": [
      "Different workflows need different initial permissions on newly created paths.",
      "umask removes permission bits from the modes requested by programs; it is not generally decimal subtraction.",
      "Ordinary new files request no executable bits, while directories normally request them.",
      "The results assume normal Unix permissions and no default ACL. The mask does not retroactively change existing files."
    ],
    "flags": [
      "umask with no argument: display the current mask.",
      "umask 077: mask all group/other bits.",
      "umask 022: mask group/other write bits.",
      "stat -c %a: inspect actual octal modes."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "umask — default permission mask",
    "group": "Permissions & identity",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "ps",
    "title": "Inspect only the current script and its child",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm ps\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nsleep 2 &\nchild=$!\nprintf 'Selected processes:\\n'\nps -p \"$$,$child\" -o pid=,ppid=,comm=\nprintf 'Parent script PID: %s\\n' \"$$\"\nprintf 'Owned child PID: %s\\n' \"$child\"\nif wait \"$child\"; then\n    printf 'Child completed normally\\n'\nelse\n    printf 'Child failed\\n' >&2\n    exit 1\nfi\nprintf 'No unrelated process was inspected by PID selection\\n'",
    "output": "Selected processes:\n12340 12300 bash\n12341 12340 sleep\nParent script PID: 12340\nOwned child PID: 12341\nChild completed normally\nNo unrelated process was inspected by PID selection",
    "steps": [
      "A script starts a child and wants to confirm the relationship.",
      "$$ identifies this shell; $! identifies its most recent asynchronous child.",
      "ps -p limits the report to those PIDs and -o chooses only the relevant fields.",
      "IDs, executable names and timing vary. The script waits for its own child rather than polling all system processes."
    ],
    "flags": [
      "ps -p PIDLIST: select specified PIDs.",
      "-o pid=,ppid=,comm=: choose fields and omit their headings.",
      "$$: shell PID; $!: last background PID.",
      "wait PID: wait for an owned child."
    ],
    "variable": true,
    "requires": "Bash, GNU utilities and procps ps",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "ps — inspect running processes",
    "group": "Processes & system",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Linux manual pages",
      "https://www.kernel.org/doc/man-pages/"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "jobs",
    "title": "Run two background tasks and collect each result",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm wait\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\n(printf 'first result\\n' > first.txt) &\nfirst=$!\n(printf 'second result\\n' > second.txt) &\nsecond=$!\nprintf 'Started two background tasks\\n'\nfailures=0\nfor pid in \"$first\" \"$second\"; do\n    if wait \"$pid\"; then\n        printf 'Task completed\\n'\n    else\n        failures=$((failures + 1))\n    fi\ndone\ncat first.txt second.txt\nprintf 'Failures: %s\\n' \"$failures\"\n[ \"$failures\" -eq 0 ]",
    "output": "Started two background tasks\nTask completed\nTask completed\nfirst result\nsecond result\nFailures: 0",
    "steps": [
      "Two independent tasks can start before either result is read.",
      "Capture each $! immediately so a later launch does not overwrite the remembered PID.",
      "wait observes each task’s completion; files are read afterward in a chosen order.",
      "jobs, bg and fg refer to shell job control. Interactive job control is different from this noninteractive PID-based waiting pattern."
    ],
    "flags": [
      "&: start an asynchronous command.",
      "( commands ): subshell group.",
      "wait PID: collect child status.",
      "jobs -l: interactive job listing with PIDs; bg and fg resume jobs when job control is available."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "jobs, bg, fg & wait",
    "group": "Processes & system",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "kill",
    "title": "Cancel only a background task created by this script",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm kill\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nsleep 30 &\nchild=$!\nprintf 'Started a disposable sleep task\\n'\nif kill -0 \"$child\" 2>/dev/null; then\n    printf 'Child is addressable by this user\\n'\nfi\nkill -TERM \"$child\"\nif wait \"$child\" 2>/dev/null; then\n    printf 'Child exited normally before cancellation\\n'\nelse\n    status=$?\n    printf 'Child stopped with nonzero status: %s\\n' \"$status\"\nfi\nprintf 'Only the stored child PID was signalled\\n'",
    "output": "Started a disposable sleep task\nChild is addressable by this user\nChild stopped with nonzero status: 143\nOnly the stored child PID was signalled",
    "steps": [
      "A long-running task needs cancellation without touching unrelated processes.",
      "The script stores the PID of its own sleep child.",
      "Signal 0 checks existence/permission without delivering a signal; it is not a guarantee against races.",
      "TERM requests termination. Bash commonly reports 128+signal, giving 143 for TERM, but process timing and environment can affect output."
    ],
    "flags": [
      "kill -0 PID: existence/permission check.",
      "kill -TERM PID: send termination signal.",
      "wait PID: reap the child and collect status.",
      "2>/dev/null: suppress expected diagnostics for the check."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "kill — send process signals",
    "group": "Processes & system",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "system",
    "title": "Collect a small read-only system summary",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm uname date\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf 'Kernel: '\nuname -s\nprintf 'Machine architecture: '\nuname -m\nprintf 'Current UTC timestamp: '\ndate -u '+%Y-%m-%dT%H:%M:%SZ'\nprintf 'Fixed sample timestamp: '\ndate -u -d '2024-01-02 03:04:05 UTC' '+%Y-%m-%dT%H:%M:%SZ'\nif command -v uptime >/dev/null 2>&1; then\n    printf 'Uptime summary:\\n'\n    uptime\nelse\n    printf 'uptime is not installed\\n'\nfi\nprintf 'Report finished\\n'",
    "output": "Kernel: Linux\nMachine architecture: x86_64\nCurrent UTC timestamp: <current UTC time>\nFixed sample timestamp: 2024-01-02T03:04:05Z\nUptime summary:\n<uptime, users and load averages vary>\nReport finished",
    "steps": [
      "A troubleshooting note needs a few system facts, not a full environment dump.",
      "uname identifies kernel and machine architecture.",
      "date -u uses UTC, while the explicit format avoids ambiguous local date notation.",
      "uptime is optional and its numbers change continuously. The fixed timestamp line is the only exact date result in this sample."
    ],
    "flags": [
      "uname -s: kernel name; -m: machine architecture.",
      "date -u: UTC.",
      "GNU date -d: parse the supplied date string.",
      "%Y %m %d %H %M %S: year, month, day, hour, minute, second."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "uname, uptime & date",
    "group": "Processes & system",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "disk",
    "title": "Distinguish file size from filesystem free capacity",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm df du\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir report-data\nprintf 'alpha\\n' > report-data/a.txt\nprintf 'beta\\n' > report-data/b.txt\nprintf 'Apparent file bytes:\\n'\ndu -b report-data/*.txt\nprintf '\\nAllocated directory usage:\\n'\ndu -sh report-data\nprintf '\\nFilesystem containing this directory:\\n'\ndf -h .\nprintf '\\nExact content bytes: '\ncat report-data/*.txt | wc -c\n[ \"$(cat report-data/*.txt | wc -c)\" -eq 11 ]",
    "output": "Apparent file bytes:\n6 report-data/a.txt\n5 report-data/b.txt\n\nAllocated directory usage:\n<allocation-dependent size> report-data\n\nFilesystem containing this directory:\n<filesystem capacity and free space vary>\n\nExact content bytes: 11",
    "steps": [
      "An archive-size check is not the same as checking free disk space.",
      "du reports usage of paths, while df reports the containing filesystem’s capacity.",
      "GNU du -b reports apparent byte sizes; allocated blocks can be larger or smaller for special file layouts.",
      "The exact eleven content bytes are checked separately from machine-dependent allocation and capacity."
    ],
    "flags": [
      "du -b: apparent bytes (GNU).",
      "-s: summarize each operand; -h: human-readable units.",
      "df -h .: human-readable capacity for the filesystem containing dot.",
      "wc -c: byte count."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "df & du — disk capacity and usage",
    "group": "Processes & system",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "tar",
    "title": "Create an archive and validate restored content",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm tar\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir source restored\nprintf 'alpha\\n' > source/a.txt\nprintf 'beta\\n' > source/b.txt\ntar -cf bundle.tar -C source a.txt b.txt\nprintf 'Archive entries:\\n'\ntar -tf bundle.tar\ntar -xf bundle.tar -C restored\nverified=0\nfor name in a.txt b.txt; do\n    cmp -s \"source/$name\" \"restored/$name\"\n    printf 'Restored correctly: %s\\n' \"$name\"\n    verified=$((verified + 1))\ndone\nprintf 'Verified files: %s\\n' \"$verified\"",
    "output": "Archive entries:\na.txt\nb.txt\nRestored correctly: a.txt\nRestored correctly: b.txt\nVerified files: 2",
    "steps": [
      "A handoff needs one archive containing two sample files.",
      "tar -c creates it, -t lists members and -x extracts into the separate empty directory.",
      "-C sets the base directory so archived names do not include source/.",
      "cmp verifies restored contents. Listing an unfamiliar archive is not sufficient protection against every hostile archive behavior; this fixture is created locally."
    ],
    "flags": [
      "tar -c / -t / -x: create, list or extract.",
      "-f archive: use this archive filename.",
      "-C directory: change base directory for subsequent operands.",
      "cmp -s: quiet content comparison."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "tar — bundle and extract files",
    "group": "Archives & transfer",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Tar manual",
      "https://www.gnu.org/software/tar/manual/tar.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "gzip",
    "title": "Compress a report while retaining and checking the original",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm gzip\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nfor n in $(seq 1 20); do\n    printf 'Record %02d: repeating sample text\\n' \"$n\"\ndone > report.txt\ngzip -c report.txt > report.txt.gz\ngzip -t report.txt.gz\nprintf 'Compressed stream passed integrity check\\n'\ngunzip -c report.txt.gz > restored.txt\ncmp -s report.txt restored.txt\nprintf 'Restored bytes match original\\n'\nprintf 'Original lines: '\nwc -l < report.txt\nprintf 'Restored lines: '\nwc -l < restored.txt\n[ -f report.txt ]\nprintf 'Original file retained\\n'",
    "output": "Compressed stream passed integrity check\nRestored bytes match original\nOriginal lines: 20\nRestored lines: 20\nOriginal file retained",
    "steps": [
      "A report should be compressed without removing its original.",
      "gzip -c sends compressed bytes to stdout, leaving the source in place.",
      "gzip -t checks stream integrity without emitting decompressed content.",
      "gunzip -c reconstructs the text; cmp checks exact bytes, not merely line count."
    ],
    "flags": [
      "gzip -c: stdout output, keep input.",
      "gzip -t: test compressed integrity.",
      "gunzip -c: decompress to stdout.",
      "cmp -s: quiet byte equality check."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "gzip & gunzip — compress a stream",
    "group": "Archives & transfer",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "curl",
    "title": "Copy a local report through curl without network access",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm curl\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v curl >/dev/null 2>&1 || { printf 'curl is required\\n'; exit 1; }\nprintf 'local transfer example\\n' > source.txt\nsource_url=\"file://$PWD/source.txt\"\ncurl --silent --show-error --output received.txt \"$source_url\"\nif cmp -s source.txt received.txt; then\n    printf 'Local URL transfer verified\\n'\nelse\n    printf 'Content mismatch\\n' >&2\n    exit 1\nfi\nprintf 'Received: '\ncat received.txt\nprintf 'Bytes: '\nwc -c < received.txt",
    "output": "Local URL transfer verified\nReceived: local transfer example\nBytes: 23",
    "steps": [
      "Practice curl’s transfer and output options with a file:// URL, so no remote server is contacted.",
      "The absolute fixture path forms a local URL; this sample path must be URL-safe.",
      "--silent removes progress output while --show-error retains error messages.",
      "For real HTTPS requests, add an appropriate timeout and HTTP-failure handling; TLS verification should remain enabled."
    ],
    "flags": [
      "--silent: suppress progress and routine messages.",
      "--show-error: still print transfer errors with silent mode.",
      "--output path: save response bytes.",
      "file://: local file transfer; not an HTTP status example."
    ],
    "variable": false,
    "requires": "Bash, GNU utilities and curl with file-protocol support",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "curl — transfer URLs",
    "group": "Archives & transfer",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "curl manual",
      "https://curl.se/docs/manpage.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "ssh",
    "title": "Inspect an SSH connection plan without connecting",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm ssh\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v ssh >/dev/null 2>&1 || { printf 'OpenSSH client is required\\n'; exit 1; }\nhost='training.example'\nuser='student'\nport=2222\nssh -G -F /dev/null -o \"User=$user\" -o \"Port=$port\" \"$host\" > effective.conf\nprintf 'Planned SSH settings:\\n'\nawk '$1 == \"hostname\" || $1 == \"user\" || $1 == \"port\" {print}' effective.conf\nprintf '\\nSCP command preview only:\\n'\nprintf 'scp -P %s ./report.txt %s@%s:incoming/\\n' \"$port\" \"$user\" \"$host\"\nprintf 'No remote session or upload was started\\n'\ngrep -q '^port 2222$' effective.conf",
    "output": "Planned SSH settings:\nuser student\nhostname training.example\nport 2222\n\nSCP command preview only:\nscp -P 2222 ./report.txt student@training.example:incoming/\nNo remote session or upload was started",
    "steps": [
      "Before a transfer, inspect client settings without contacting a host.",
      "ssh -G prints evaluated configuration and exits; -F /dev/null avoids local per-user configuration.",
      "The host is a reserved example name; the scp line is printed, not executed.",
      "Actual sessions require an authorized host and user plus host-key verification. Configuration output ordering may vary by client version."
    ],
    "flags": [
      "ssh -G: display configuration, do not connect.",
      "-F file: alternative configuration file.",
      "-o User=value / Port=value: configuration options.",
      "scp -P: uppercase P selects the port; ssh uses lowercase -p for a connection."
    ],
    "variable": true,
    "requires": "Bash, GNU utilities and OpenSSH client",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "ssh & scp — remote work",
    "group": "Archives & transfer",
    "lines": 30,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "OpenBSD SSH manual",
      "https://man.openbsd.org/ssh"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "network",
    "title": "Inspect loopback networking and a bounded ping",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm ip ss ping\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nfor tool in ip ss ping; do\n    command -v \"$tool\" >/dev/null 2>&1 || { printf 'Missing: %s\\n' \"$tool\"; exit 1; }\ndone\nprintf 'Loopback address:\\n'\nip -brief address show dev lo\nprintf '\\nListening TCP sockets (read-only):\\n'\nss -ltn\nprintf '\\nOne local reachability check:\\n'\nif ping -c 1 -W 1 127.0.0.1 > ping.txt 2>&1; then\n    printf 'Loopback answered\\n'\nelse\n    printf 'Ping unavailable or blocked; inspect the captured diagnostic\\n'\nfi\nprintf 'No external destination was contacted\\n'",
    "output": "Loopback address:\n<loopback addresses vary>\n\nListening TCP sockets (read-only):\n<current listening sockets vary>\n\nOne local reachability check:\nLoopback answered\nNo external destination was contacted",
    "steps": [
      "A basic network check can stay entirely on the local machine.",
      "ip shows addresses for the loopback interface; ss lists listening TCP endpoints without resolving service names.",
      "ping is restricted to one local packet with a short reply wait.",
      "A failed ping can reflect policy or privileges rather than a broken network. Socket lists reveal only current state, not historical traffic."
    ],
    "flags": [
      "ip -brief address show dev lo: short loopback address view.",
      "ss -ltn: listening, TCP, numeric endpoints.",
      "ping -c 1: one request; -W 1: one-second response wait in iputils.",
      "127.0.0.1: local IPv4 loopback."
    ],
    "variable": true,
    "requires": "Linux, iproute2 and iputils ping",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "ip, ss & ping — inspect networking",
    "group": "Processes & system",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Linux manual pages",
      "https://www.kernel.org/doc/man-pages/"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "loops",
    "title": "Validate and total a series of quantities",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm read\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 3 5 bad 2 > quantities.txt\naccepted=0\nrejected=0\ntotal=0\nwhile IFS= read -r value; do\n    case \"$value\" in\n        ''|*[!0-9]*) rejected=$((rejected + 1)); continue ;;\n    esac\n    total=$((total + 10#$value))\n    accepted=$((accepted + 1))\ndone < quantities.txt\nfor label in accepted rejected total; do\n    printf '%s=%s\\n' \"$label\" \"${!label}\"\ndone\n[ \"$total\" -eq 10 ]",
    "output": "accepted=3\nrejected=1\ntotal=10",
    "steps": [
      "A text file contains one quantity per line and one invalid row.",
      "The while loop reads through input redirection, so its variable updates remain in this shell rather than a pipeline subshell.",
      "case rejects nondigits before arithmetic; 10# makes leading-zero numbers decimal.",
      "The for loop prints selected summary variables using Bash indirect expansion."
    ],
    "flags": [
      "read -r: no backslash interpretation.",
      "IFS=: no field trimming.",
      "continue: skip to the next iteration.",
      "10#value: base-ten arithmetic.",
      "${!name}: value of the variable named by name."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "for & while — repeat work",
    "group": "Shell scripting",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "conditions",
    "title": "Route files according to their size and extension",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm test\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir incoming\nprintf 'text\\n' > incoming/a.txt\nprintf 'binary sample\\n' > incoming/b.bin\n: > incoming/empty.txt\nfor path in incoming/*; do\n    name=${path##*/}\n    if [ ! -s \"$path\" ]; then\n        printf '%s: empty, skip\\n' \"$name\"\n        continue\n    fi\n    case \"$name\" in\n        *.txt) printf '%s: text workflow\\n' \"$name\" ;;\n        *.bin) printf '%s: binary workflow\\n' \"$name\" ;;\n        *) printf '%s: unknown extension\\n' \"$name\" ;;\n    esac\ndone",
    "output": "a.txt: text workflow\nb.bin: binary workflow\nempty.txt: empty, skip",
    "steps": [
      "A dispatcher needs both a general validation check and several mutually exclusive routes.",
      "if rejects empty input before examining its extension.",
      "case patterns choose a route; they are shell patterns, not regular expressions.",
      "An extension is only a routing hint, not reliable proof of content type."
    ],
    "flags": [
      "[ ! -s path ]: not nonempty.",
      ": > file: create or truncate an empty file with the no-op command.",
      "case pattern): choose a matching branch.",
      ";;: end the branch."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "if & case — choose behavior",
    "group": "Shell scripting",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "functions",
    "title": "Build a reusable file-report function with validation",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm wc\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ndescribe_file() {\n    if [ \"$#\" -ne 1 ]; then\n        printf 'Usage: describe_file PATH\\n' >&2\n        return 2\n    fi\n    local path=$1\n    if [ ! -f \"$path\" ]; then\n        printf 'Not a regular file: %s\\n' \"$path\" >&2\n        return 3\n    fi\n    printf '%s: %s lines\\n' \"$path\" \"$(wc -l < \"$path\")\"\n}\nprintf 'a\\nb\\n' > report.txt\ndescribe_file report.txt\nif describe_file missing.txt 2> error.txt; then exit 1; else status=$?; fi\nprintf 'Rejected call status: %s\\n' \"$status\"\ncat error.txt",
    "output": "report.txt: 2 lines\nRejected call status: 3\nNot a regular file: missing.txt",
    "steps": [
      "A reusable function should specify its accepted arguments and failure statuses.",
      "$# validates the number of arguments; local keeps the path variable scoped to the function.",
      "The regular-file check prevents a missing path from reaching wc.",
      "The caller handles a predictable error and preserves its diagnostic for display."
    ],
    "flags": [
      "local: Bash function-scoped variable.",
      "$1: first argument; $#: count.",
      "return N: function exit status.",
      "2> file: capture stderr.",
      "wc -l: line count."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Functions & script arguments",
    "group": "Shell scripting",
    "lines": 36,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "scripts",
    "title": "Validate syntax, trace execution and clean up a child script",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm bash\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncat > task.sh <<'SCRIPT'\n#!/usr/bin/env bash\nset -eu\ntrap 'printf \"Child cleanup ran\\n\"' EXIT\nname=${1:-sample}\nprintf 'Working on: %s\\n' \"$name\"\nSCRIPT\nbash -n task.sh\nprintf 'Syntax check passed\\n'\nbash -x task.sh report > result.txt 2> trace.txt\nprintf 'Normal output:\\n'\ncat result.txt\nprintf 'Trace recorded: '\n[ -s trace.txt ] && printf 'yes\\n'\nprintf 'No confidential arguments were used in this trace\\n'",
    "output": "Syntax check passed\nNormal output:\nWorking on: report\nChild cleanup ran\nTrace recorded: yes\nNo confidential arguments were used in this trace",
    "steps": [
      "A script should pass a syntax check before it is executed.",
      "bash -n parses without running commands; it does not prove logic is correct.",
      "bash -x records expanded commands on stderr, separately from normal output.",
      "EXIT runs the child cleanup action. Tracing real secrets or credentials could expose them, so this example uses only fictional text."
    ],
    "flags": [
      "bash -n: syntax checking only.",
      "bash -x: execution tracing.",
      "trap command EXIT: run on shell exit.",
      "${1:-sample}: fallback when the first argument is unset or empty."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "Scripts, debugging & traps",
    "group": "Shell scripting",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Bash manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "temp",
    "title": "Allocate a private scratch directory and verify automatic cleanup",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm mktemp\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nouter=$PWD\nscratch=$(mktemp -d \"$outer/scratch.XXXXXX\")\n(\n    trap 'rm -rf -- \"$scratch\"' EXIT\n    printf 'temporary result\\n' > \"$scratch/result.txt\"\n    printf 'Scratch contains: '\n    cat \"$scratch/result.txt\"\n    printf 'Scratch directory exists during work: '\n    [ -d \"$scratch\" ] && printf 'yes\\n'\n)\nif [ -e \"$scratch\" ]; then\n    printf 'Cleanup failed\\n' >&2\n    exit 1\nfi\nprintf 'Scratch directory removed after child exit\\n'",
    "output": "Scratch contains: temporary result\nScratch directory exists during work: yes\nScratch directory removed after child exit",
    "steps": [
      "Temporary files should not use a predictable shared filename.",
      "mktemp creates a unique directory from the XXXXXX template.",
      "A subshell owns the cleanup trap, so its exit removes only that newly allocated scratch path.",
      "The parent checks the postcondition instead of assuming cleanup happened."
    ],
    "flags": [
      "mktemp -d template: create a unique directory.",
      "XXXXXX: randomized placeholder characters.",
      "trap ... EXIT: deferred cleanup.",
      "rm -rf -- \"$scratch\": recursive removal limited to the newly created path; never substitute an existing project directory."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "mktemp — temporary working files",
    "group": "Shell scripting",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "basename",
    "title": "Make display labels from full incoming paths",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm basename\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir -p incoming/one incoming/two\nprintf 'A\\n' > 'incoming/one/monthly report.txt'\nprintf 'B\\n' > incoming/two/summary.txt\nfor path in 'incoming/one/monthly report.txt' incoming/two/summary.txt; do\n    full_name=$(basename -- \"$path\")\n    stem=$(basename -- \"$path\" .txt)\n    printf 'Path: %s\\n' \"$path\"\n    printf 'Filename: %s\\n' \"$full_name\"\n    printf 'Label: %s\\n' \"$stem\"\ndone\nprintf 'Suffix removal is exact: '\nbasename -- report.csv .txt",
    "output": "Path: incoming/one/monthly report.txt\nFilename: monthly report.txt\nLabel: monthly report\nPath: incoming/two/summary.txt\nFilename: summary.txt\nLabel: summary\nSuffix removal is exact: report.csv",
    "steps": [
      "A report needs short labels instead of directory paths.",
      "basename removes the leading directory components.",
      "A second operand strips the exact matching suffix; it does not remove an arbitrary extension.",
      "Names from different directories can still collide, so these labels are not unique identifiers."
    ],
    "flags": [
      "basename -- path: trailing filename component.",
      "Optional suffix operand: remove it only when it matches the end.",
      "--: terminate options.",
      "Quoted command substitution preserves spaces in the result."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "basename — extract a filename",
    "group": "Paths & text utilities",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "dirname",
    "title": "Recreate parent folders before writing reports",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm dirname\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\npaths=('reports/daily/summary.txt' 'reports/monthly/totals.txt')\nfor target in \"${paths[@]}\"; do\n    parent=$(dirname -- \"$target\")\n    mkdir -p -- \"$parent\"\n    printf 'generated\\n' > \"$target\"\n    printf 'Created parent: %s\\n' \"$parent\"\ndone\nprintf 'Generated paths:\\n'\nfind reports -type f | sort\nprintf 'Parent of a bare filename: '\ndirname notes.txt\n[ -f reports/daily/summary.txt ]",
    "output": "Created parent: reports/daily\nCreated parent: reports/monthly\nGenerated paths:\nreports/daily/summary.txt\nreports/monthly/totals.txt\nParent of a bare filename: .",
    "steps": [
      "A target path cannot be written until its parent directory exists.",
      "dirname calculates the directory component without creating or accessing it.",
      "mkdir -p then creates that parent hierarchy.",
      "A bare filename has dot as its parent, meaning the current directory."
    ],
    "flags": [
      "dirname -- path: directory portion of a path string.",
      "mkdir -p: create missing parent directories.",
      ">: create or truncate each report.",
      "find -type f: list generated regular files."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "dirname — extract a parent path",
    "group": "Paths & text utilities",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "realpath",
    "title": "Resolve an existing symbolic path before reading it",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm realpath\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir -p project/data\nprintf 'verified content\\n' > project/data/note.txt\nln -s data project/current\nphysical=$(realpath -e -- project/current/../data/note.txt)\nroot=$(realpath -e -- project)\ncase \"$physical\" in\n    \"$root\"/*) printf 'Resolved path remains inside project\\n' ;;\n    *) printf 'Unexpected destination\\n' >&2; exit 1 ;;\nesac\nprintf 'Final filename: %s\\n' \"${physical##*/}\"\ncat \"$physical\"\nif realpath -e project/missing 2>/dev/null; then exit 1; fi\nprintf 'Missing path correctly rejected\\n'",
    "output": "Resolved path remains inside project\nFinal filename: note.txt\nverified content\nMissing path correctly rejected",
    "steps": [
      "A symbolic path should be resolved before a basic location check.",
      "realpath -e requires every component to exist and resolves links and dot components.",
      "The prefix check uses a slash boundary, avoiding a false match with a similarly named neighboring folder.",
      "This check is a teaching guard, not a race-free sandbox: filesystem links can change between checks and use."
    ],
    "flags": [
      "realpath -e: canonicalize existing paths only.",
      "--: end options.",
      "case \"$root\"/*: require a path beneath that root.",
      "2>/dev/null: suppress the expected missing-path diagnostic."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "realpath — resolve a path",
    "group": "Paths & text utilities",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "nl",
    "title": "Create a numbered review copy while preserving blank lines",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm nl\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf 'Introduction\\n\\nDetails\\nConclusion\\n' > draft.txt\nprintf 'Default: number nonempty lines\\n'\nnl -w 2 -s ': ' draft.txt > default.txt\ncat default.txt\nprintf '\\nNumber every line for review:\\n'\nnl -ba -w 2 -s ': ' draft.txt > review.txt\ncat review.txt\nprintf '\\nOriginal file still has: '\nwc -l < draft.txt\n[ \"$(wc -l < review.txt)\" -eq 4 ]\nprintf 'Review copy created\\n'",
    "output": "Default: number nonempty lines\n 1: Introduction\n    \n 2: Details\n 3: Conclusion\n\nNumber every line for review:\n 1: Introduction\n 2: \n 3: Details\n 4: Conclusion\n\nOriginal file still has: 4\nReview copy created",
    "steps": [
      "Reviewers need stable line references, including empty lines.",
      "By default nl numbers nonempty body lines; blank-line padding can differ with formatting options.",
      "-ba numbers all body lines.",
      "The numbered output is a new file; no line numbers are inserted into the original."
    ],
    "flags": [
      "nl -ba: body style all lines.",
      "-w 2: number field width.",
      "-s string: separator after the number.",
      "wc -l: verify the line count."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "nl — number lines",
    "group": "Paths & text utilities",
    "lines": 30,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "tac",
    "title": "Review recent events in reverse chronological file order",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm tac\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncat > timeline.txt <<'DATA'\n09:00 started\n09:10 loaded\n09:20 checked\n09:30 finished\nDATA\nprintf 'Newest recorded line first:\\n'\ntac timeline.txt > reverse.txt\ncat reverse.txt\nprintf '\\nMost recent two recorded lines:\\n'\nhead -n 2 reverse.txt\ntac reverse.txt > restored.txt\ncmp -s timeline.txt restored.txt\nprintf 'Reversing twice restored the original\\n'",
    "output": "Newest recorded line first:\n09:30 finished\n09:20 checked\n09:10 loaded\n09:00 started\n\nMost recent two recorded lines:\n09:30 finished\n09:20 checked\nReversing twice restored the original",
    "steps": [
      "An append-ordered text timeline should be viewed from the end.",
      "tac reverses record order, not characters within a line.",
      "Newest-first is valid only because this fixture was written chronologically.",
      "Reversing twice and comparing bytes checks the operation on this newline-terminated input."
    ],
    "flags": [
      "tac file: reverse newline-separated records.",
      "head -n 2: show two lines.",
      "cmp -s: quiet byte comparison.",
      "tac differs from rev, which reverses characters."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "tac — reverse record order",
    "group": "Paths & text utilities",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "paste",
    "title": "Combine parallel columns after checking equal lengths",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm paste\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' Alice Ben Casey > names.txt\nprintf '%s\\n' blue green blue > teams.txt\nnames_count=$(wc -l < names.txt)\nteams_count=$(wc -l < teams.txt)\nif [ \"$names_count\" -ne \"$teams_count\" ]; then\n    printf 'Column lengths differ\\n' >&2\n    exit 1\nfi\nprintf 'Combined columns:\\n'\npaste -d, names.txt teams.txt > joined.csv\ncat joined.csv\nprintf '\\nNames on one line:\\n'\npaste -s -d ';' names.txt\n[ \"$(wc -l < joined.csv)\" -eq 3 ]",
    "output": "Combined columns:\nAlice,blue\nBen,green\nCasey,blue\n\nNames on one line:\nAlice;Ben;Casey",
    "steps": [
      "Two files contain related values on corresponding lines.",
      "paste joins by position, not by a matching key.",
      "Equal line counts prevent accidental blank columns but do not prove records correspond correctly.",
      "-s serializes one input file into a single delimiter-separated line."
    ],
    "flags": [
      "paste -d,: comma separator.",
      "paste -s: serial mode.",
      "-d semicolon: choose a semicolon delimiter.",
      "-ne: numeric inequality test."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "paste — combine columns",
    "group": "Paths & text utilities",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "join",
    "title": "Find matched and unmatched records by identifier",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm join\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' 'B Ben' 'A Alice' 'C Casey' > names.txt\nprintf '%s\\n' 'A 8' 'C 10' 'D 7' > marks.txt\nsort -k1,1 names.txt > names.sorted\nsort -k1,1 marks.txt > marks.sorted\nprintf 'Matched rows:\\n'\njoin names.sorted marks.sorted\nprintf '\\nNames without marks:\\n'\njoin -v 1 names.sorted marks.sorted\nprintf '\\nMarks without names:\\n'\njoin -v 2 names.sorted marks.sorted\nprintf '\\nAll left-side identifiers:\\n'\njoin -a 1 names.sorted marks.sorted",
    "output": "Matched rows:\nA Alice 8\nC Casey 10\n\nNames without marks:\nB Ben\n\nMarks without names:\nD 7\n\nAll left-side identifiers:\nA Alice 8\nB Ben\nC Casey 10",
    "steps": [
      "Two exports must be matched by a stable identifier rather than row position.",
      "Both inputs are sorted on the join field using the same locale.",
      "The default join emits matching keys; -v isolates unmatched records.",
      "-a 1 also includes unmatched records from the first input, approximating a simple left join."
    ],
    "flags": [
      "sort -k1,1: sort the first field.",
      "join: match field one by default.",
      "join -v 1 / -v 2: unmatched rows only.",
      "join -a 1: include unmatched first-file rows."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "join — match sorted records",
    "group": "Paths & text utilities",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "comm",
    "title": "Compare yesterday’s and today’s identifier sets",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm comm\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' A B C C > yesterday.txt\nprintf '%s\\n' B C D > today.txt\nsort -u yesterday.txt > old.set\nsort -u today.txt > new.set\nprintf 'Removed:\\n'\ncomm -23 old.set new.set\nprintf '\\nAdded:\\n'\ncomm -13 old.set new.set\nprintf '\\nUnchanged:\\n'\ncomm -12 old.set new.set\nprintf '\\nDistinct old IDs: '\nwc -l < old.set",
    "output": "Removed:\nA\n\nAdded:\nD\n\nUnchanged:\nB\nC\n\nDistinct old IDs: 3",
    "steps": [
      "Daily snapshots should be compared as sets, not raw repeated lines.",
      "sort -u both deduplicates and satisfies comm’s sorted-input requirement.",
      "comm has three columns: first-only, second-only and common.",
      "Suppressing two columns gives a plain list for the remaining category."
    ],
    "flags": [
      "comm -23: suppress second-only and common, retain first-only.",
      "-13: retain second-only.",
      "-12: retain common.",
      "sort -u: unique lines in the same collation order."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "comm — compare sorted sets of lines",
    "group": "Paths & text utilities",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "expand",
    "title": "Convert tab-indented text for consistent display",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm expand unexpand\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf 'A\\tB\\n12\\tC\\n' > tabbed.txt\nexpand -t 4 tabbed.txt > spaced.txt\nprintf 'Spaces shown as dots:\\n'\ntr ' ' '.' < spaced.txt\nunexpand -a -t 4 spaced.txt > retabbed.txt\nprintf '\\nTabs shown as <TAB>:\\n'\nsed $'s/\\t/<TAB>/g' retabbed.txt\nexpand -t 4 retabbed.txt > roundtrip.txt\ncmp -s spaced.txt roundtrip.txt\nprintf 'Expanded display survived round trip\\n'",
    "output": "Spaces shown as dots:\nA...B\n12..C\n\nTabs shown as <TAB>:\nA<TAB>B\n12<TAB>C\nExpanded display survived round trip",
    "steps": [
      "A report uses tabs whose apparent width differs between viewers.",
      "expand moves to the next tab stop, so a tab does not always become the same number of spaces.",
      "unexpand -a converts eligible spaces throughout a line, not only leading indentation.",
      "The check compares expanded display positions; it is not a guarantee that arbitrary original whitespace bytes are preserved."
    ],
    "flags": [
      "expand -t 4: tab stops every four columns.",
      "unexpand -a: convert eligible spaces anywhere.",
      "unexpand -t 4: matching tab-stop rule.",
      "Bash $quoted string: interpret backslash escapes such as tab."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "expand & unexpand — tabs and spaces",
    "group": "Paths & text utilities",
    "lines": 29,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "fold",
    "title": "Wrap a simple text note to a fixed display width",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm fold\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf 'alpha beta gamma delta\\n' > note.txt\nprintf 'Original:\\n'\ncat note.txt\nprintf '\\nWrap at ten columns:\\n'\nfold -w 10 note.txt > fixed.txt\ncat fixed.txt\nprintf '\\nPrefer word boundaries:\\n'\nfold -s -w 10 note.txt > words.txt\ncat words.txt\nprintf '\\nWrapped line count: '\nwc -l < words.txt\n[ -s words.txt ]",
    "output": "Original:\nalpha beta gamma delta\n\nWrap at ten columns:\nalpha beta\n gamma del\nta\n\nPrefer word boundaries:\nalpha \nbeta \ngamma \ndelta\n\nWrapped line count: 4",
    "steps": [
      "A plain-text note needs narrow terminal formatting.",
      "-w limits display columns, while -s prefers a space as the break point.",
      "Whitespace at wrap points can remain visible in the saved output.",
      "This ASCII example does not demonstrate all terminal-width behavior for Unicode or escape sequences; the word-wrapped sample is illustrative."
    ],
    "flags": [
      "fold -w N: wrap at N display columns.",
      "fold -s: break at spaces when possible.",
      "fold -b: an alternative byte-counting mode, not used here.",
      "wc -l: count the resulting lines."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "fold — wrap long text",
    "group": "Paths & text utilities",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "split",
    "title": "Divide an export into chunks and reconstruct it",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm split\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nfor id in $(seq 1 7); do\n    printf 'row-%s\\n' \"$id\"\ndone > export.txt\nmkdir chunks\nsplit -l 3 -d -a 2 export.txt chunks/part-\nprintf 'Chunk sizes:\\n'\nfor path in chunks/part-*; do\n    printf '%s: %s lines\\n' \"${path##*/}\" \"$(wc -l < \"$path\")\"\ndone\ncat chunks/part-* > restored.txt\ncmp -s export.txt restored.txt\nprintf 'Reassembled export matches\\n'\n[ \"$(wc -l < restored.txt)\" -eq 7 ]",
    "output": "Chunk sizes:\npart-00: 3 lines\npart-01: 3 lines\npart-02: 1 lines\nReassembled export matches",
    "steps": [
      "An export must be divided into manageable batches.",
      "split -l uses lines, not bytes, so each newline-delimited record stays together.",
      "Numeric suffixes with fixed width preserve the intended order under the C locale.",
      "Concatenating chunks and comparing bytes checks that no row was lost or reordered."
    ],
    "flags": [
      "split -l 3: at most three lines per chunk.",
      "-d: numeric suffixes.",
      "-a 2: suffix width two.",
      "Output prefix chunks/part-: controls names.",
      "cmp -s: exact restoration check."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "split — divide a large file",
    "group": "Paths & text utilities",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "seq",
    "title": "Generate numbered daily task folders",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm seq\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nmkdir days\nfor day in $(seq -w 1 12); do\n    mkdir \"days/day-$day\"\n    printf 'day=%s\\n' \"$day\" > \"days/day-$day/status.txt\"\ndone\nprintf 'First and last generated names:\\n'\nprintf '%s\\n' days/day-* | head -n 1\nprintf '%s\\n' days/day-* | tail -n 1\nprintf 'A step sequence: '\nseq -s ',' 2 2 10\nprintf '\\nFolder count: '\nfind days -mindepth 1 -maxdepth 1 -type d | wc -l",
    "output": "First and last generated names:\ndays/day-01\ndays/day-12\nA step sequence: 2,4,6,8,10\n\nFolder count: 12",
    "steps": [
      "A predictable numeric range can drive repeated folder creation.",
      "seq -w pads the sequence to a consistent width based on its endpoints.",
      "The three-operand form supplies first, increment and last values.",
      "Integer examples avoid the precision surprises of fractional sequence generation."
    ],
    "flags": [
      "seq -w: equal-width, zero-padded numbers.",
      "seq FIRST INCREMENT LAST: explicit step.",
      "-s comma: separator between values.",
      "find -mindepth 1 -maxdepth 1: direct children only."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "seq — generate number sequences",
    "group": "Paths & text utilities",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "shuf",
    "title": "Select a small sample and verify membership",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm shuf\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' A B C D E > population.txt\nshuf -n 3 population.txt > sample.txt\nprintf 'Random sample (one possible run):\\n'\ncat sample.txt\nprintf 'Sample size: '\nwc -l < sample.txt\nsort population.txt > population.sorted\nsort sample.txt > sample.sorted\ncomm -23 sample.sorted population.sorted > outside.txt\n[ ! -s outside.txt ]\n[ \"$(sort -u sample.txt | wc -l)\" -eq 3 ]\nprintf 'All sampled labels belong to the population\\n'\nprintf 'No duplicate input lines were sampled twice\\n'",
    "output": "Random sample (one possible run):\nC\nA\nE\nSample size: 3\nAll sampled labels belong to the population\nNo duplicate input lines were sampled twice",
    "steps": [
      "Take three randomly ordered input lines from a five-line fixture.",
      "Without -r, shuf samples input lines without replacement; duplicate text in the input could still appear twice.",
      "The membership check verifies that no unexpected label was introduced.",
      "The actual sample changes each run; this is not a fixed seed or a model of every sampling design."
    ],
    "flags": [
      "shuf -n 3: output at most three lines.",
      "shuf -r: sampling with replacement, intentionally not used.",
      "comm -23: sample-only labels after sorting.",
      "sort -u: deduplicate for the assertion."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "shuf — shuffle and sample",
    "group": "Paths & text utilities",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "timeout",
    "title": "Bound a child command and distinguish timeout from success",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm timeout\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf 'Fast task:\\n'\ntimeout 2s bash -c 'printf \"finished quickly\\n\"'\nprintf 'Slow task:\\n'\nif timeout 0.2s sleep 5; then\n    printf 'Unexpected early completion\\n'\n    exit 1\nelse\n    status=$?\nfi\ncase \"$status\" in\n    124) printf 'Stopped after the deadline (status 124)\\n' ;;\n    *) printf 'Different failure: %s\\n' \"$status\"; exit 1 ;;\nesac\nprintf 'The parent script continued\\n'",
    "output": "Fast task:\nfinished quickly\nSlow task:\nStopped after the deadline (status 124)\nThe parent script continued",
    "steps": [
      "A helper command should not be allowed to run indefinitely.",
      "The fast task finishes before its deadline.",
      "GNU timeout sends TERM when the slow task reaches its limit and normally reports 124.",
      "A timeout is handled explicitly instead of being mistaken for successful work; more complex children may need a kill-after policy."
    ],
    "flags": [
      "timeout DURATION COMMAND: run with a time bound.",
      "s: seconds; fractional durations are accepted by GNU timeout.",
      "124: timeout status unless options change preservation behavior.",
      "--kill-after DURATION: optional later forced termination, not used here."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "timeout — bound command duration",
    "group": "Process monitoring",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "GNU Coreutils manual",
      "https://www.gnu.org/software/coreutils/manual/coreutils.html"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "watch",
    "title": "Observe a report counter for a few seconds",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm watch\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v watch >/dev/null 2>&1 || { printf 'watch is required\\n'; exit 1; }\nprintf 'first\\nsecond\\n' > report.txt\nprintf 'Interactive display uses one-second refreshes.\\n'\nif [ -t 0 ] && [ -t 1 ]; then\n    if timeout 3s watch -n 1 -t 'wc -l < report.txt'; then\n        :\n    else\n        status=$?\n        [ \"$status\" -eq 124 ] || exit \"$status\"\n    fi\nelse\n    printf 'No terminal: equivalent single observation: '\n    wc -l < report.txt\nfi\nprintf 'Monitoring finished\\n'",
    "output": "Interactive display uses one-second refreshes.\nNo terminal: equivalent single observation: 2\nMonitoring finished",
    "steps": [
      "A small status command can be repeated on a terminal without writing a custom refresh loop.",
      "watch owns the terminal display; -n sets the interval and -t removes its header.",
      "An outer timeout limits the demonstration.",
      "The shown transcript is the noninteractive fallback. Interactive screens refresh in place rather than producing this transcript."
    ],
    "flags": [
      "watch -n 1: one-second interval.",
      "watch -t: suppress title/header.",
      "timeout 3s: bound the demonstration.",
      "-t in [ -t 0 ] is a terminal test, unrelated to watch -t."
    ],
    "variable": true,
    "requires": "Bash, GNU timeout and procps watch",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "watch — repeat a status command",
    "group": "Process monitoring",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "procps-ng documentation",
      "https://gitlab.com/procps-ng/procps"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "history",
    "title": "Practice history operations without using personal history",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm history\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nHISTFILE=\"$work/practice-history\"\nHISTSIZE=100\nHISTFILESIZE=100\nHISTTIMEFORMAT=\nset +o history\nhistory -c\nhistory -s 'printf sample-one'\nhistory -s 'printf sample-two'\nhistory -w \"$HISTFILE\"\nprintf 'Practice entries written: '\nwc -l < \"$HISTFILE\"\nprintf 'Stored commands (not executed):\\n'\ncat \"$HISTFILE\"\nhistory -c\nset +o history\nprintf 'Only disposable practice history was used\\n'",
    "output": "Practice entries written: 2\nStored commands (not executed):\nprintf sample-one\nprintf sample-two\nOnly disposable practice history was used",
    "steps": [
      "History practice should not expose or rewrite a user’s real command history.",
      "This separate script points HISTFILE to a disposable path and clears only its own shell history.",
      "history -s adds text without executing it; -w writes the selected history file.",
      "Noninteractive history recording is disabled while two entries are added explicitly; no commands from the real interactive session are read."
    ],
    "flags": [
      "set -o history / +o history: enable/disable history recording.",
      "history -c: clear this shell’s history list.",
      "history -s text: add an entry.",
      "history -w file: write entries.",
      "HISTFILE: chosen history destination."
    ],
    "variable": true,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "history — recall previous commands",
    "group": "Shell productivity",
    "lines": 35,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Bash reference manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "alias",
    "title": "Create a temporary command shortcut inside a script",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm alias unalias\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nshopt -s expand_aliases\nalias sayready='printf \"Ready for practice\\n\"'\nprintf 'Alias definition:\\n'\nalias sayready\nprintf 'Calling alias:\\n'\nsayready\nunalias sayready\nif alias sayready >/dev/null 2>&1; then\n    printf 'Alias was not removed\\n' >&2\n    exit 1\nfi\nprintf 'Alias removed\\n'\nshopt -u expand_aliases",
    "output": "Alias definition:\nalias sayready='printf \"Ready for practice\\n\"'\nCalling alias:\nReady for practice\nAlias removed",
    "steps": [
      "A repetitive fixed command can have a temporary short name.",
      "Noninteractive Bash normally does not expand aliases, so this script enables that option.",
      "Alias definitions must be parsed before their use; separate top-level lines matter.",
      "Use a function instead when you need positional arguments or more complex logic. No shell startup file is modified."
    ],
    "flags": [
      "shopt -s expand_aliases: enable script alias expansion.",
      "alias name=value: define a textual command shortcut.",
      "unalias name: remove it.",
      "shopt -u: restore the usual disabled state."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "alias & unalias — short command names",
    "group": "Shell productivity",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Bash reference manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "type",
    "title": "Identify whether a name is a function, builtin or executable",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm type\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\npractice_action() { printf 'function result\\n'; }\nprintf 'practice_action kind: '\ntype -t practice_action\nprintf 'cd kind: '\ntype -t cd\nprintf 'sort kind: '\ntype -t sort\nprintf 'Function call: '\npractice_action\nunset -f practice_action\nif type practice_action >/dev/null 2>&1; then\n    printf 'Unexpected remaining definition\\n'\n    exit 1\nfi\nprintf 'Function definition removed\\n'",
    "output": "practice_action kind: function\ncd kind: builtin\nsort kind: file\nFunction call: function result\nFunction definition removed",
    "steps": [
      "When commands behave unexpectedly, inspect how their names resolve.",
      "type -t produces a short category rather than a full path or implementation.",
      "The fixture defines a function and contrasts it with a shell builtin and external executable.",
      "The sort result assumes no custom function or alias shadows it in this script environment."
    ],
    "flags": [
      "type -t: report command kind.",
      "type -a: optional listing of all resolutions, not used here.",
      "unset -f: remove a function definition.",
      "command resolution can differ between interactive and clean shells."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "type — understand command resolution",
    "group": "Shell productivity",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Bash reference manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "read",
    "title": "Read full text lines without losing spaces or backslashes",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm read\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nprintf '%s\\n' '  first item  ' 'path\\with\\slashes' 'last item' > input.txt\ncount=0\nwhile IFS= read -r line || [ -n \"$line\" ]; do\n    count=$((count + 1))\n    printf 'Line %s: <%s>\\n' \"$count\" \"$line\"\ndone < input.txt\nprintf 'Read lines: %s\\n' \"$count\"\nprintf 'name=Alice\\nteam=blue\\n' > pairs.txt\nwhile IFS='=' read -r key value; do\n    printf '%s -> %s\\n' \"$key\" \"$value\"\ndone < pairs.txt\n[ \"$count\" -eq 3 ]",
    "output": "Line 1: <  first item  >\nLine 2: <path\\with\\slashes>\nLine 3: <last item>\nRead lines: 3\nname -> Alice\nteam -> blue",
    "steps": [
      "Text may contain leading/trailing spaces or backslashes that must remain data.",
      "IFS= avoids whitespace trimming and read -r avoids backslash interpretation.",
      "The fallback condition also handles a final nonempty line lacking a newline.",
      "A second loop deliberately chooses = as a field separator for simple key-value records."
    ],
    "flags": [
      "read -r: literal backslashes.",
      "IFS=: no field splitting for the whole line.",
      "IFS= delimiter before read: choose the separator for that command.",
      "read key value: assign fields to named variables.||| [ -n \"$line\" ]: process a nonempty final partial line."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "read — accept input safely",
    "group": "Shell productivity",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Bash reference manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "getopts",
    "title": "Give a report function named options and validate them",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm getopts\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nreport() {\n    local OPTIND=1 option name='sample' count=1\n    while getopts ':n:c:' option; do\n        case \"$option\" in\n            n) name=$OPTARG ;;\n            c) count=$OPTARG ;;\n            :) printf 'Missing option value\\n' >&2; return 2 ;;\n            \\?) printf 'Unknown option\\n' >&2; return 2 ;;\n        esac\n    done\n    shift \"$((OPTIND - 1))\"\n    case \"$count\" in ''|*[!0-9]*) return 2 ;; esac\n    [ \"$count\" -le 10 ] || return 2\n    printf 'name=%s count=%s remaining=%s\\n' \"$name\" \"$count\" \"$#\"\n}\nreport -n 'daily report' -c 3 extra\nreport\nif report -c bad; then exit 1; else printf 'Bad count rejected\\n'; fi",
    "output": "name=daily report count=3 remaining=1\nname=sample count=1 remaining=0\nBad count rejected",
    "steps": [
      "A reusable script interface should support explicit options rather than guessing argument positions.",
      "The option string marks n and c as requiring values; its leading colon requests silent diagnostic handling.",
      "OPTIND is reset for each function call and then used to remove parsed arguments.",
      "Option parsing does not validate business values; the count is checked separately."
    ],
    "flags": [
      "getopts :n:c: option: parse two short options with arguments.",
      "OPTARG: current option argument.",
      "OPTIND: index of the next argument.",
      "shift N: remove N positional parameters.",
      "case escaped question-mark: invalid option; colon branch: missing argument."
    ],
    "variable": false,
    "requires": "Bash and GNU utilities",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "getopts — parse script options",
    "group": "Shell scripting",
    "lines": 37,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Bash reference manual",
      "https://www.gnu.org/software/bash/manual/bash.html"
    ],
    "verified": true,
    "execution": "matched",
    "syntaxChecked": true
  },
  {
    "id": "rsync",
    "title": "Preview and perform a local directory synchronization",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm rsync\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v rsync >/dev/null 2>&1 || { printf 'rsync is required\\n'; exit 1; }\nmkdir source destination\nprintf 'new\\n' > source/report.txt\nprintf 'old\\n' > destination/report.txt\nprintf 'keep\\n' > destination/extra.txt\nprintf 'Preview changed file:\\n'\nrsync -rcn --out-format='%n' source/ destination/\nrsync -rc source/ destination/\ncmp -s source/report.txt destination/report.txt\n[ -f destination/extra.txt ]\nprintf 'Destination report: '\ncat destination/report.txt\nprintf 'Unrelated destination file retained\\n'",
    "output": "Preview changed file:\nreport.txt\nDestination report: new\nUnrelated destination file retained",
    "steps": [
      "A local copy should be previewed before it is changed.",
      "-n performs a dry run. Removing -n performs the same basic synchronization.",
      "-c compares checksums, avoiding a false match when same-size files have equal timestamps.",
      "The trailing slash means source contents. No --delete option is used, so the extra destination file remains."
    ],
    "flags": [
      "rsync -r: recurse through directories.",
      "-c: checksum-based change detection.",
      "-n: dry run.",
      "--out-format=%n: print item names.",
      "source/: transfer contents, not a wrapper directory."
    ],
    "variable": false,
    "requires": "Bash, GNU utilities and rsync",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "rsync — synchronize copies",
    "group": "Archives & transfer",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "rsync manual",
      "https://download.samba.org/pub/rsync/rsync.1"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "zip",
    "title": "Build and test an archive before extracting it",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm zip unzip\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\nfor tool in zip unzip; do\n    command -v \"$tool\" >/dev/null 2>&1 || { printf 'Missing: %s\\n' \"$tool\"; exit 1; }\ndone\nmkdir source restored\nprintf 'one\\n' > source/a.txt\nprintf 'two\\n' > source/b.txt\n(cd source; zip -q ../bundle.zip a.txt b.txt)\nunzip -tqq bundle.zip\nprintf 'Archive integrity check passed\\n'\nunzip -q bundle.zip -d restored\nfor name in a.txt b.txt; do\n    cmp -s \"source/$name\" \"restored/$name\"\n    printf 'Verified: %s\\n' \"$name\"\ndone",
    "output": "Archive integrity check passed\nVerified: a.txt\nVerified: b.txt",
    "steps": [
      "Two files must be packaged in a common archive format.",
      "Creating the archive from inside source keeps member names relative.",
      "unzip -t checks compressed data without extracting; quiet options suppress routine listings.",
      "Only this locally created archive is extracted into a new directory; contents are then compared."
    ],
    "flags": [
      "zip -q: quiet output.",
      "unzip -t: test integrity.",
      "-qq: quieter routine output.",
      "unzip -d directory: extract into that directory.",
      "cmp -s: verify byte equality."
    ],
    "variable": false,
    "requires": "Bash, GNU utilities and Info-ZIP zip/unzip",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "zip & unzip — portable archives",
    "group": "Archives & transfer",
    "lines": 33,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "Info-ZIP documentation",
      "https://infozip.sourceforge.net/"
    ],
    "verified": false,
    "execution": "unavailable dependency",
    "syntaxChecked": true
  },
  {
    "id": "dig",
    "title": "Make a bounded DNS lookup for a public example domain",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm dig\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v dig >/dev/null 2>&1 || { printf 'dig is required\\n'; exit 1; }\ndomain=example.com\nprintf 'Query: %s A\\n' \"$domain\"\nif dig +time=2 +tries=1 +noall +comments +answer \"$domain\" A > answer.txt; then\n    printf 'DNS reply:\\n'\n    cat answer.txt\nelse\n    printf 'Lookup command failed; check resolver/network access\\n'\nfi\nprintf '\\nA-record answers only, if present:\\n'\nawk '$4 == \"A\" {print $1, $5}' answer.txt\nprintf 'No addresses are hard-coded as guaranteed results\\n'",
    "output": "Query: example.com A\nDNS reply:\n<reply status, TTLs and addresses depend on DNS at runtime>\n\nA-record answers only, if present:\nexample.com. <returned IPv4 address>\nNo addresses are hard-coded as guaranteed results",
    "steps": [
      "A DNS diagnostic should name its query and limit retries.",
      "dig asks the configured resolver; this script contacts DNS only when you choose to run it.",
      "A successful command can still contain NXDOMAIN or another DNS status, so inspect the reply header.",
      "Returned addresses and TTLs are not fixed teaching constants."
    ],
    "flags": [
      "+time=2: response timeout seconds.",
      "+tries=1: one attempt.",
      "+noall: disable output sections; +comments and +answer re-enable selected sections.",
      "A: IPv4 address record type."
    ],
    "variable": true,
    "requires": "Bash, awk, BIND dig and permitted DNS access",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "dig — query DNS records",
    "group": "Network & services",
    "lines": 31,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "BIND dig manual",
      "https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "lsof",
    "title": "Inspect one file descriptor opened by this script",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm lsof\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v lsof >/dev/null 2>&1 || { printf 'lsof is required\\n'; exit 1; }\nprintf 'open descriptor example\\n' > note.txt\nexec 3< note.txt\nprintf 'Selected open descriptor (machine-dependent fields):\\n'\nif lsof -a -p \"$$\" -d 3 -F pfn; then\n    printf 'Descriptor inspection succeeded\\n'\nelse\n    printf 'Inspection restricted or no matching descriptor\\n'\nfi\nIFS= read -r line <&3\nprintf 'Read through descriptor 3: %s\\n' \"$line\"\nexec 3<&-\nprintf 'Descriptor 3 closed\\n'",
    "output": "Selected open descriptor (machine-dependent fields):\np<shell PID>\nf3\nn<temporary directory>/note.txt\nDescriptor inspection succeeded\nRead through descriptor 3: open descriptor example\nDescriptor 3 closed",
    "steps": [
      "A file can be open through a descriptor without its contents being read yet.",
      "exec 3< opens the practice file on descriptor three in this shell.",
      "lsof is restricted to this PID and descriptor; permissions may still limit visibility.",
      "The script reads through that descriptor and then closes it explicitly."
    ],
    "flags": [
      "lsof -a: AND the selection criteria.",
      "-p PID: process filter.",
      "-d 3: descriptor filter.",
      "-F pfn: field output for process, descriptor and filename.",
      "exec 3<&-: close descriptor three."
    ],
    "variable": true,
    "requires": "Linux/Unix with lsof and permission to inspect the current process",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "lsof — find open files and sockets",
    "group": "Process monitoring",
    "lines": 32,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "lsof documentation",
      "https://lsof.readthedocs.io/en/stable/"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "free",
    "title": "Capture a read-only memory snapshot and identify the units",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm free\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v free >/dev/null 2>&1 || { printf 'free is required\\n'; exit 1; }\nprintf 'Human-readable memory report:\\n'\nfree -h\nprintf '\\nByte-based report:\\n'\nfree -b > memory.txt\ncat memory.txt\nprintf '\\nReported total RAM bytes: '\nawk '$1 == \"Mem:\" {print $2}' memory.txt\nprintf 'Reported free RAM bytes: '\nawk '$1 == \"Mem:\" {print $4}' memory.txt\nprintf 'Free RAM is not the same as available RAM.\\n'",
    "output": "Human-readable memory report:\n<current RAM/swap values>\n\nByte-based report:\n<current byte counts>\n\nReported total RAM bytes: <total>\nReported free RAM bytes: <free>\nFree RAM is not the same as available RAM.",
    "steps": [
      "A report should state whether memory numbers are bytes or scaled units.",
      "free -h is readable for a person; -b is explicit about units.",
      "Linux may reclaim some cache, so free and available represent different ideas.",
      "Values change over time; do not infer a memory leak from one snapshot or sum overlapping categories blindly."
    ],
    "flags": [
      "free -h: human-readable units.",
      "free -b: bytes.",
      "awk $1 == Mem:: choose the memory row.",
      "Column layouts can vary across procps versions; inspect the header."
    ],
    "variable": true,
    "requires": "Linux and procps free",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "free — inspect Linux memory",
    "group": "Process monitoring",
    "lines": 30,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "procps-ng documentation",
      "https://gitlab.com/procps-ng/procps"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "top",
    "title": "Capture one process-focused activity snapshot",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm top\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v top >/dev/null 2>&1 || { printf 'top is required\\n'; exit 1; }\nprintf 'Collecting one batch snapshot for this shell\\n'\nif top -b -n 1 -p \"$$\" > snapshot.txt 2> diagnostic.txt; then\n    head -n 20 snapshot.txt\n    printf '\\nSnapshot saved in the temporary workspace\\n'\nelse\n    printf 'top could not collect the snapshot\\n'\n    cat diagnostic.txt\nfi\nprintf 'Interpret CPU and memory using the displayed headings.\\n'",
    "output": "Collecting one batch snapshot for this shell\n<top header and the selected shell process; values vary>\n\nSnapshot saved in the temporary workspace\nInterpret CPU and memory using the displayed headings.",
    "steps": [
      "An unattended diagnostic needs a bounded text snapshot rather than an interactive full-screen session.",
      "-b selects batch mode and -n 1 limits the number of iterations.",
      "-p restricts the process list to the current shell.",
      "The first CPU sample and displayed fields depend on top version/configuration, so this is a sample view rather than a stable parsing format."
    ],
    "flags": [
      "top -b: batch output.",
      "-n 1: one iteration.",
      "-p PID: selected process.",
      "head -n 20: limit displayed lines from the saved snapshot."
    ],
    "variable": true,
    "requires": "Linux and procps top",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "top — inspect activity live",
    "group": "Process monitoring",
    "lines": 29,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "procps-ng documentation",
      "https://gitlab.com/procps-ng/procps"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "systemctl",
    "title": "Inspect user-service state without starting or stopping services",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm systemctl\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v systemctl >/dev/null 2>&1 || { printf 'systemctl is required\\n'; exit 1; }\nprintf 'Running user services:\\n'\nif systemctl --user --no-pager --type=service --state=running list-units > services.txt 2> error.txt; then\n    cat services.txt\nelse\n    printf 'User service manager unavailable or inaccessible\\n'\n    cat error.txt\nfi\nprintf '\\nInstalled user-service unit files:\\n'\nif systemctl --user --no-pager --type=service list-unit-files > units.txt 2> error.txt; then\n    head -n 12 units.txt\nelse\n    printf 'Could not enumerate user unit files\\n'\nfi\nprintf 'No service state was changed\\n'",
    "output": "Running user services:\n<running user service units, or an unavailable-manager message>\n\nInstalled user-service unit files:\n<installed user unit files, or an unavailable-manager message>\nNo service state was changed",
    "steps": [
      "A service inspection should distinguish currently loaded/running units from installed unit files.",
      "--user targets the current user’s service manager, not the system manager.",
      "list-units and list-unit-files answer different questions.",
      "No start, stop, restart, enable or disable operation is performed. Containers and minimal systems may have no accessible user manager."
    ],
    "flags": [
      "--user: user service manager.",
      "--no-pager: direct output.",
      "--type=service: service units only.",
      "--state=running: running substate filter.",
      "list-units: loaded units; list-unit-files: unit-file installation state."
    ],
    "variable": true,
    "requires": "Linux with systemd; an accessible user manager is optional for the failure branch",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "systemctl — inspect services",
    "group": "Network & services",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "systemd manuals",
      "https://www.freedesktop.org/software/systemd/man/latest/"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  },
  {
    "id": "journalctl",
    "title": "Read a short user-journal excerpt without altering logs",
    "code": "#!/usr/bin/env bash\nset -eu\nexport LC_ALL=C\n# Check required commands before creating any practice files.\nrequire_tools() {\n    local tool\n    for tool in \"$@\"; do\n        if ! command -v \"$tool\" >/dev/null 2>&1; then\n            printf 'Required command missing: %s\\n' \"$tool\" >&2\n            return 127\n        fi\n    done\n}\nrequire_tools mktemp rm journalctl\n# Work only inside a new disposable directory.\nwork=$(mktemp -d)\ntrap 'rm -rf -- \"$work\"' EXIT\ncd \"$work\"\n\ncommand -v journalctl >/dev/null 2>&1 || { printf 'journalctl is required\\n'; exit 1; }\nprintf 'Five recent user-journal entries:\\n'\nif journalctl --user --no-pager -n 5 -o short-iso > recent.txt 2> error.txt; then\n    cat recent.txt\nelse\n    printf 'User journal unavailable or permission denied\\n'\n    cat error.txt\nfi\nprintf '\\nWarnings or worse from the last hour:\\n'\nif journalctl --user --no-pager --since '1 hour ago' -p warning -n 5 -o short-iso > warnings.txt 2> error.txt; then\n    cat warnings.txt\nelse\n    printf 'No accessible query result\\n'\nfi\nprintf 'No logs were deleted or modified\\n'",
    "output": "Five recent user-journal entries:\n<local entries or an unavailable/empty-journal message>\n\nWarnings or worse from the last hour:\n<matching local entries or an empty-journal message>\nNo logs were deleted or modified",
    "steps": [
      "A troubleshooting excerpt should be bounded by count and time.",
      "--user selects the user journal; access and journal availability vary.",
      "-p warning includes warning and more severe priorities, not just exact warning severity.",
      "Real local logs can contain sensitive information. The page includes no copied production logs, and running this script does not upload them."
    ],
    "flags": [
      "-n 5: at most five recent entries.",
      "-o short-iso: concise ISO-style timestamps.",
      "--since: time filter.",
      "-p warning: maximum numeric priority threshold (warning and more severe).",
      "--no-pager: no interactive pager."
    ],
    "variable": true,
    "requires": "Linux with systemd-journald and permission to read user-journal entries",
    "tryIt": "Change the sample input and predict the output before running again.",
    "lessonTitle": "journalctl — query service logs",
    "group": "Network & services",
    "lines": 34,
    "commonFlags": [
      "set -e: stop on many unhandled failing commands. Failures inside if/&&/|| and pipelines have special rules; this is not universal error detection.",
      "set -u: reject unset variable expansion. LC_ALL=C fixes collation and character classes for these examples.",
      "require_tools: a local helper, not a Unix utility. command -v checks each required name; a missing command returns 127 before setup.",
      "mktemp -d: allocate a new temporary directory. cd enters it, keeping relative file operations isolated.",
      "trap ... EXIT: defer cleanup until this script exits. rm -rf -- \"$work\" removes only the newly allocated practice directory; never replace it with an existing folder.",
      "printf uses a fixed format: %s is a string, %d is an integer, and \\n ends the line. Quoted \"$var\" preserves one argument; \"$@\" preserves separate arguments.",
      "> replaces a file; >> appends; < supplies input; 2> redirects errors. A pipe passes stdout to the next program. These are shell syntax, not command flags."
    ],
    "source": [
      "systemd manuals",
      "https://www.freedesktop.org/software/systemd/man/latest/"
    ],
    "verified": false,
    "execution": "variable/interactive/system case; not run",
    "syntaxChecked": true
  }
];
