from unix_situations import a

a('xargs','Count lines in files whose names contain spaces',r'''
mkdir notes
printf 'a\nb\n' > 'notes/first note.txt'
printf 'c\n' > notes/second.txt
printf 'Counts for each file:\n'
find notes -type f -print0 | sort -z |
    xargs -0 -r -n 1 sh -c '
        file=$1
        count=$(wc -l < "$file")
        printf "%s: %s\n" "$file" "$count"
    ' sh
printf 'Empty discovery runs no worker:\n'
find notes -name '*.missing' -print0 |
    xargs -0 -r printf 'Unexpected: %s\n'
printf 'Done\n'
''','Counts for each file:\nnotes/first note.txt: 2\nnotes/second.txt: 1\nEmpty discovery runs no worker:\nDone',
'Discovered filenames must become separate command arguments without breaking spaces.|find -print0 and xargs -0 agree on NUL delimiters; sort -z orders those records.|-n 1 sends one file per worker; the extra sh fills $0 so the filename becomes $1.|GNU -r avoids calling the worker when input is empty. Do not interpolate filenames into shell source.',
'xargs -0: NUL-delimited input.|-r: do not run on empty input (GNU).|-n 1: one input argument per invocation.|sh -c code sh file: execute fixed code with file in $1.|sort -z: NUL-delimited sorting.')
a('diff','Review a changed configuration and handle comparison status',r'''
printf 'mode=test\nworkers=2\n' > old.conf
printf 'mode=test\nworkers=4\n' > new.conf
printf 'Changed lines:\n'
if diff old.conf new.conf > changes.txt; then
    printf 'No changes\n'
else
    result=$?
    [ "$result" -eq 1 ] || exit "$result"
    cat changes.txt
fi
cp new.conf backup.conf
if cmp -s new.conf backup.conf; then
    printf 'Backup bytes match\n'
fi
''','Changed lines:\n2c2\n< workers=2\n---\n> workers=4\nBackup bytes match',
'A configuration review needs to distinguish changed content from a failed comparison.|diff returns 0 for identical files, 1 for differences, and a larger status for errors.|The ordinary diff format identifies line two as changed.|cmp -s independently checks that the backup is byte-for-byte identical.',
'diff file1 file2: compare lines; -u is an optional unified display.|cmp -s: suppress output and use status.|$?: status of the immediately preceding command.|[ value -eq 1 ]: numeric equality test.')
a('printf','Format a small invoice with aligned numeric columns',r'''
items=(book pen folder)
quantities=(2 4 1)
prices=(500 125 250)
grand=0
printf '%-10s %3s %7s\n' ITEM QTY CENTS
for index in "${!items[@]}"; do
    total=$((quantities[index] * prices[index]))
    grand=$((grand + total))
    printf '%-10s %3d %7d\n' "${items[index]}" "${quantities[index]}" "$total"
done
printf 'Total: %d.%02d\n' "$((grand / 100))" "$((grand % 100))"
label='Save 10% today'
printf 'Message: %s\n' "$label"
[ "$grand" -eq 1750 ]
''','ITEM       QTY   CENTS\nbook         2    1000\npen          4     500\nfolder       1     250\nTotal: 17.50\nMessage: Save 10% today',
'An invoice should keep columns aligned and show amounts consistently.|Arrays keep product names, quantities and integer-cent prices aligned by index.|The format string is fixed; variable text is supplied through %s, so its percent sign is not treated as a format instruction.|Integer cents avoid decimal floating-point arithmetic in this limited calculation.',
'%-10s: left-aligned string in at least ten columns.|%3d / %7d: integer field widths.|%02d: two-digit zero padding.|${!array[@]}: array indices.|printf is more predictable than echo for escapes and -n-like text.')
a('quoting','Preserve spaces, wildcard characters and empty arguments',r'''
mkdir samples
printf '%s\n' 'data' > 'samples/a note.txt'
show_arguments() {
    printf 'Argument count: %s\n' "$#"
    index=0
    for value in "$@"; do
        index=$((index + 1))
        printf '%s: <%s>\n' "$index" "$value"
    done
}
path='samples/a note.txt'
literal='*.txt'
show_arguments "$path" "$literal" ''
printf 'Contents: '
cat -- "$path"
printf 'Literal variable name: %s\n' '$path'
''','Argument count: 3\n1: <samples/a note.txt>\n2: <*.txt>\n3: <>\nContents: data\nLiteral variable name: $path',
'A helper must receive the exact arguments the caller intends.|Double quotes allow variable expansion while preserving spaces and empty values.|Single quotes preserve literal characters such as a dollar sign.|Quoted "$@" expands to one argument per positional parameter; it does not concatenate them.',
'"$var": expand one variable without word splitting or globbing.|Single quotes: suppress expansion.|$#: number of arguments.|"$@": individually quoted arguments.|--: end command options.')
a('globs','Process a known set of reports with empty-match handling',r'''
mkdir -p reports/{daily,weekly}
printf '%s\n' 'A' > reports/daily/a.txt
printf '%s\n' 'B' > reports/daily/b.txt
printf '%s\n' 'image' > reports/daily/c.bin
shopt -s nullglob
files=(reports/daily/*.txt)
printf 'Matched text files: %s\n' "${#files[@]}"
for file in "${files[@]}"; do
    printf '%s: ' "${file##*/}"
    cat "$file"
done
missing=(reports/weekly/*.txt)
printf 'Weekly text files: %s\n' "${#missing[@]}"
shopt -u nullglob
''','Matched text files: 2\na.txt: A\nb.txt: B\nWeekly text files: 0',
'Brace expansion creates two named folders; it is different from matching existing filenames.|The *.txt glob selects existing text files.|nullglob makes an unmatched pattern expand to no words instead of the literal pattern.|Quoted array expansion preserves each discovered path.',
'shopt -s nullglob: enable empty unmatched globs.|shopt -u nullglob: disable that option.|{daily,weekly}: brace alternatives.|${#array[@]}: number of array elements.|*.txt: shell filename pattern, not a regular expression.')
a('redirect','Keep successful records and diagnostics in separate files',r'''
produce_report() {
    printf 'row-1 accepted\n'
    printf 'row-2 rejected\n' >&2
    printf 'row-3 accepted\n'
}
produce_report > accepted.txt 2> rejected.txt
printf 'Normal output:\n'
cat accepted.txt
printf 'Errors:\n'
cat rejected.txt
produce_report > combined.txt 2>&1
printf 'Combined in emission order:\n'
cat combined.txt
printf 'Additional accepted row\n' >> accepted.txt
printf 'Accepted lines after append: '
wc -l < accepted.txt
''','Normal output:\nrow-1 accepted\nrow-3 accepted\nErrors:\nrow-2 rejected\nCombined in emission order:\nrow-1 accepted\nrow-2 rejected\nrow-3 accepted\nAccepted lines after append: 3',
'A report producer sends usable rows to stdout and diagnostics to stderr.|> and 2> capture these streams independently.|> combined.txt 2>&1 opens the output file and then points stderr to the same destination; redirection order matters.|>> appends while < supplies a file as standard input.',
'1 / 2: stdout and stderr file descriptors.|>: create or truncate; >>: append.|2>&1: duplicate the current stdout destination onto stderr.|<: redirect standard input.')
a('pipes','Display a transformed report while saving the same content',r'''
printf '%s\n' apple pear apple plum pear apple > events.txt
printf 'Frequency report:\n'
sort events.txt | uniq -c |
    awk '{printf "%s: %d\n", $2, $1}' |
    tee frequency.txt
printf '\nSaved report lines: '
wc -l < frequency.txt
printf '\nAppend a footer through tee:\n'
printf 'Report complete\n' | tee -a frequency.txt
printf '\nFinal saved line: '
tail -n 1 frequency.txt
grep -q '^apple: 3$' frequency.txt
''','Frequency report:\napple: 3\npear: 2\nplum: 1\n\nSaved report lines: 3\n\nAppend a footer through tee:\nReport complete\n\nFinal saved line: Report complete',
'A pipeline should produce a useful terminal display and an identical saved report.|Each pipe sends stdout into the next command’s stdin; stderr is separate by default.|tee writes input both to its file operand and stdout.|tee -a appends instead of replacing. Pipeline failure handling requires care: Bash normally reports the last stage’s status unless pipefail is enabled.',
'Pipe symbol: connect standard streams.|tee file: copy stdin to file and stdout.|tee -a: append.|uniq -c: adjacent group counts.|awk printf: format the count/name fields.')
a('status','Validate inputs before generating a summary',r'''
printf '%s\n' 'ready' > input.txt
validate() {
    [ -f "$1" ] || return 2
    [ -s "$1" ] || return 3
    return 0
}
for path in input.txt absent.txt; do
    if validate "$path"; then
        printf 'Ready: %s\n' "$path"
    else
        code=$?
        printf 'Rejected: %s (status %s)\n' "$path" "$code"
    fi
done
validate input.txt && printf 'Summary may proceed\n'
printf 'A failed test is handled: '
[ -f absent.txt ] || printf 'file missing\n'
''','Ready: input.txt\nRejected: absent.txt (status 2)\nSummary may proceed\nA failed test is handled: file missing',
'Validation returns distinct statuses for missing and empty input.|if uses status rather than text output to choose its branch.|&& executes the next command only after success; || executes it after failure.|Capture $? immediately, before another command replaces it.',
'return N: finish the function with status N.|0: success; nonzero: failure convention.|[ -f ] / [ -s ]: file existence/type and size tests.|&& / ||: conditional command lists.')
a('env','Pass selected configuration into a child shell',r'''
private_note='not exported'
export APP_MODE=training
export REPORT_NAME=summary
bash -c '
    printf "Mode: %s\n" "$APP_MODE"
    printf "Report: %s\n" "$REPORT_NAME"
    printf "Private variable: %s\n" "${private_note-unset}"
'
env APP_MODE=preview bash -c 'printf "One-call override: %s\n" "$APP_MODE"'
printf 'Parent still uses: %s\n' "$APP_MODE"
command_path=$(command -v sort)
printf 'sort is discoverable: '
[ -n "$command_path" ] && printf 'yes\n'
''','Mode: training\nReport: summary\nPrivate variable: unset\nOne-call override: preview\nParent still uses: training\nsort is discoverable: yes',
'A child process needs selected settings, not every local variable.|export puts a variable into the environment inherited by child processes.|env NAME=value changes that invocation’s environment without changing the parent.|PATH participates in command discovery; the script checks availability without printing machine-specific paths.',
'export NAME=value: inherit this variable in child processes.|env NAME=value command: override for one invocation.|bash -c string: execute the supplied Bash source.|${name-unset}: fallback when unset.|command -v: command discovery.')
a('chmod','Make a private script executable for its owner',r'''
mkdir private
chmod 700 private
cat > private/report.sh <<'SCRIPT'
#!/usr/bin/env bash
printf 'Practice report completed\n'
SCRIPT
chmod 600 private/report.sh
printf 'Before: '; stat -c '%a' private/report.sh
chmod u+x private/report.sh
printf 'After: '; stat -c '%a' private/report.sh
private/report.sh
chmod go-rwx private/report.sh
printf 'Final owner-only mode: '; stat -c '%a' private/report.sh
[ -x private/report.sh ]
''','Before: 600\nAfter: 700\nPractice report completed\nFinal owner-only mode: 700',
'A newly written shell script should run for its owner without granting other users access.|Directory execute permission permits traversal; file execute permission permits execution.|u+x adds only the owner’s execute bit.|go-rwx removes group/other read, write and execute bits. ACLs and privileged access are additional considerations.',
'chmod 700: owner read/write/execute only.|chmod 600: owner read/write only.|u+x: add owner execution.|go-rwx: remove group/other permissions.|[ -x path ]: current-process executable access test.')
a('identity','Check ownership before deciding whether a file is yours',r'''
printf '%s\n' 'practice content' > owned.txt
uid=$(id -u)
gid=$(id -g)
owner=$(stat -c '%u' owned.txt)
group=$(stat -c '%g' owned.txt)
printf 'Current user: '; whoami
printf 'Effective UID: %s\n' "$uid"
printf 'Primary GID: %s\n' "$gid"
if [ "$owner" = "$uid" ]; then
    printf 'Practice file is owned by this user\n'
fi
printf 'Practice file group: %s\n' "$group"
printf 'No ownership changes were requested\n'
''','Current user: student\nEffective UID: 1000\nPrimary GID: 1000\nPractice file is owned by this user\nPractice file group: 1000\nNo ownership changes were requested',
'Before changing ownership, inspect the current identity and actual file metadata.|id -u and -g report effective numeric IDs; whoami reports the user name.|stat reads owner and group IDs from the practice file.|The output IDs are illustrative. chown and chgrp require appropriate permissions and are intentionally not used to alter unrelated files.',
'id -u: effective user ID.|id -g: effective primary group ID.|stat %u / %g: file owner/group IDs.|whoami: effective user name.|chown user file / chgrp group file: ownership operations, shown only as concepts here.',True)
a('umask','Create private files and restore the previous creation mask',r'''
previous=$(umask)
umask 077
mkdir private
printf '%s\n' 'private note' > private/note.txt
printf 'Private directory: '; stat -c '%a' private
printf 'Private file: '; stat -c '%a' private/note.txt
umask 022
mkdir shared-style
printf '%s\n' 'readable note' > shared-style/note.txt
printf 'Other directory: '; stat -c '%a' shared-style
printf 'Other file: '; stat -c '%a' shared-style/note.txt
umask "$previous"
printf 'Previous mask restored\n'
''','Private directory: 700\nPrivate file: 600\nOther directory: 755\nOther file: 644\nPrevious mask restored',
'Different workflows need different initial permissions on newly created paths.|umask removes permission bits from the modes requested by programs; it is not generally decimal subtraction.|Ordinary new files request no executable bits, while directories normally request them.|The results assume normal Unix permissions and no default ACL. The mask does not retroactively change existing files.',
'umask with no argument: display the current mask.|umask 077: mask all group/other bits.|umask 022: mask group/other write bits.|stat -c %a: inspect actual octal modes.')
a('ps','Inspect only the current script and its child',r'''
sleep 2 &
child=$!
printf 'Selected processes:\n'
ps -p "$$,$child" -o pid=,ppid=,comm=
printf 'Parent script PID: %s\n' "$$"
printf 'Owned child PID: %s\n' "$child"
if wait "$child"; then
    printf 'Child completed normally\n'
else
    printf 'Child failed\n' >&2
    exit 1
fi
printf 'No unrelated process was inspected by PID selection\n'
''','Selected processes:\n12340 12300 bash\n12341 12340 sleep\nParent script PID: 12340\nOwned child PID: 12341\nChild completed normally\nNo unrelated process was inspected by PID selection',
'A script starts a child and wants to confirm the relationship.|$$ identifies this shell; $! identifies its most recent asynchronous child.|ps -p limits the report to those PIDs and -o chooses only the relevant fields.|IDs, executable names and timing vary. The script waits for its own child rather than polling all system processes.',
'ps -p PIDLIST: select specified PIDs.|-o pid=,ppid=,comm=: choose fields and omit their headings.|$$: shell PID; $!: last background PID.|wait PID: wait for an owned child.',True,'Bash, GNU utilities and procps ps')
a('jobs','Run two background tasks and collect each result',r'''
(printf 'first result\n' > first.txt) &
first=$!
(printf 'second result\n' > second.txt) &
second=$!
printf 'Started two background tasks\n'
failures=0
for pid in "$first" "$second"; do
    if wait "$pid"; then
        printf 'Task completed\n'
    else
        failures=$((failures + 1))
    fi
done
cat first.txt second.txt
printf 'Failures: %s\n' "$failures"
[ "$failures" -eq 0 ]
''','Started two background tasks\nTask completed\nTask completed\nfirst result\nsecond result\nFailures: 0',
'Two independent tasks can start before either result is read.|Capture each $! immediately so a later launch does not overwrite the remembered PID.|wait observes each task’s completion; files are read afterward in a chosen order.|jobs, bg and fg refer to shell job control. Interactive job control is different from this noninteractive PID-based waiting pattern.',
'&: start an asynchronous command.|( commands ): subshell group.|wait PID: collect child status.|jobs -l: interactive job listing with PIDs; bg and fg resume jobs when job control is available.')
a('kill','Cancel only a background task created by this script',r'''
sleep 30 &
child=$!
printf 'Started a disposable sleep task\n'
if kill -0 "$child" 2>/dev/null; then
    printf 'Child is addressable by this user\n'
fi
kill -TERM "$child"
if wait "$child" 2>/dev/null; then
    printf 'Child exited normally before cancellation\n'
else
    status=$?
    printf 'Child stopped with nonzero status: %s\n' "$status"
fi
printf 'Only the stored child PID was signalled\n'
''','Started a disposable sleep task\nChild is addressable by this user\nChild stopped with nonzero status: 143\nOnly the stored child PID was signalled',
'A long-running task needs cancellation without touching unrelated processes.|The script stores the PID of its own sleep child.|Signal 0 checks existence/permission without delivering a signal; it is not a guarantee against races.|TERM requests termination. Bash commonly reports 128+signal, giving 143 for TERM, but process timing and environment can affect output.',
'kill -0 PID: existence/permission check.|kill -TERM PID: send termination signal.|wait PID: reap the child and collect status.|2>/dev/null: suppress expected diagnostics for the check.',True)
a('system','Collect a small read-only system summary',r'''
printf 'Kernel: '
uname -s
printf 'Machine architecture: '
uname -m
printf 'Current UTC timestamp: '
date -u '+%Y-%m-%dT%H:%M:%SZ'
printf 'Fixed sample timestamp: '
date -u -d '2024-01-02 03:04:05 UTC' '+%Y-%m-%dT%H:%M:%SZ'
if command -v uptime >/dev/null 2>&1; then
    printf 'Uptime summary:\n'
    uptime
else
    printf 'uptime is not installed\n'
fi
printf 'Report finished\n'
''','Kernel: Linux\nMachine architecture: x86_64\nCurrent UTC timestamp: <current UTC time>\nFixed sample timestamp: 2024-01-02T03:04:05Z\nUptime summary:\n<uptime, users and load averages vary>\nReport finished',
'A troubleshooting note needs a few system facts, not a full environment dump.|uname identifies kernel and machine architecture.|date -u uses UTC, while the explicit format avoids ambiguous local date notation.|uptime is optional and its numbers change continuously. The fixed timestamp line is the only exact date result in this sample.',
'uname -s: kernel name; -m: machine architecture.|date -u: UTC.|GNU date -d: parse the supplied date string.|%Y %m %d %H %M %S: year, month, day, hour, minute, second.',True)
a('disk','Distinguish file size from filesystem free capacity',r'''
mkdir report-data
printf 'alpha\n' > report-data/a.txt
printf 'beta\n' > report-data/b.txt
printf 'Apparent file bytes:\n'
du -b report-data/*.txt
printf '\nAllocated directory usage:\n'
du -sh report-data
printf '\nFilesystem containing this directory:\n'
df -h .
printf '\nExact content bytes: '
cat report-data/*.txt | wc -c
[ "$(cat report-data/*.txt | wc -c)" -eq 11 ]
''','Apparent file bytes:\n6 report-data/a.txt\n5 report-data/b.txt\n\nAllocated directory usage:\n<allocation-dependent size> report-data\n\nFilesystem containing this directory:\n<filesystem capacity and free space vary>\n\nExact content bytes: 11',
'An archive-size check is not the same as checking free disk space.|du reports usage of paths, while df reports the containing filesystem’s capacity.|GNU du -b reports apparent byte sizes; allocated blocks can be larger or smaller for special file layouts.|The exact eleven content bytes are checked separately from machine-dependent allocation and capacity.',
'du -b: apparent bytes (GNU).|-s: summarize each operand; -h: human-readable units.|df -h .: human-readable capacity for the filesystem containing dot.|wc -c: byte count.',True)
a('tar','Create an archive and validate restored content',r'''
mkdir source restored
printf 'alpha\n' > source/a.txt
printf 'beta\n' > source/b.txt
tar -cf bundle.tar -C source a.txt b.txt
printf 'Archive entries:\n'
tar -tf bundle.tar
tar -xf bundle.tar -C restored
verified=0
for name in a.txt b.txt; do
    cmp -s "source/$name" "restored/$name"
    printf 'Restored correctly: %s\n' "$name"
    verified=$((verified + 1))
done
printf 'Verified files: %s\n' "$verified"
''','Archive entries:\na.txt\nb.txt\nRestored correctly: a.txt\nRestored correctly: b.txt\nVerified files: 2',
'A handoff needs one archive containing two sample files.|tar -c creates it, -t lists members and -x extracts into the separate empty directory.|-C sets the base directory so archived names do not include source/.|cmp verifies restored contents. Listing an unfamiliar archive is not sufficient protection against every hostile archive behavior; this fixture is created locally.',
'tar -c / -t / -x: create, list or extract.|-f archive: use this archive filename.|-C directory: change base directory for subsequent operands.|cmp -s: quiet content comparison.')
a('gzip','Compress a report while retaining and checking the original',r'''
for n in $(seq 1 20); do
    printf 'Record %02d: repeating sample text\n' "$n"
done > report.txt
gzip -c report.txt > report.txt.gz
gzip -t report.txt.gz
printf 'Compressed stream passed integrity check\n'
gunzip -c report.txt.gz > restored.txt
cmp -s report.txt restored.txt
printf 'Restored bytes match original\n'
printf 'Original lines: '
wc -l < report.txt
printf 'Restored lines: '
wc -l < restored.txt
[ -f report.txt ]
printf 'Original file retained\n'
''','Compressed stream passed integrity check\nRestored bytes match original\nOriginal lines: 20\nRestored lines: 20\nOriginal file retained',
'A report should be compressed without removing its original.|gzip -c sends compressed bytes to stdout, leaving the source in place.|gzip -t checks stream integrity without emitting decompressed content.|gunzip -c reconstructs the text; cmp checks exact bytes, not merely line count.',
'gzip -c: stdout output, keep input.|gzip -t: test compressed integrity.|gunzip -c: decompress to stdout.|cmp -s: quiet byte equality check.')
a('curl','Copy a local report through curl without network access',r'''
command -v curl >/dev/null 2>&1 || { printf 'curl is required\n'; exit 1; }
printf 'local transfer example\n' > source.txt
source_url="file://$PWD/source.txt"
curl --silent --show-error --output received.txt "$source_url"
if cmp -s source.txt received.txt; then
    printf 'Local URL transfer verified\n'
else
    printf 'Content mismatch\n' >&2
    exit 1
fi
printf 'Received: '
cat received.txt
printf 'Bytes: '
wc -c < received.txt
''','Local URL transfer verified\nReceived: local transfer example\nBytes: 23',
'Practice curl’s transfer and output options with a file:// URL, so no remote server is contacted.|The absolute fixture path forms a local URL; this sample path must be URL-safe.|--silent removes progress output while --show-error retains error messages.|For real HTTPS requests, add an appropriate timeout and HTTP-failure handling; TLS verification should remain enabled.',
'--silent: suppress progress and routine messages.|--show-error: still print transfer errors with silent mode.|--output path: save response bytes.|file://: local file transfer; not an HTTP status example.',False,'Bash, GNU utilities and curl with file-protocol support')
a('ssh','Inspect an SSH connection plan without connecting',r'''
command -v ssh >/dev/null 2>&1 || { printf 'OpenSSH client is required\n'; exit 1; }
host='training.example'
user='student'
port=2222
ssh -G -F /dev/null -o "User=$user" -o "Port=$port" "$host" > effective.conf
printf 'Planned SSH settings:\n'
awk '$1 == "hostname" || $1 == "user" || $1 == "port" {print}' effective.conf
printf '\nSCP command preview only:\n'
printf 'scp -P %s ./report.txt %s@%s:incoming/\n' "$port" "$user" "$host"
printf 'No remote session or upload was started\n'
grep -q '^port 2222$' effective.conf
''','Planned SSH settings:\nuser student\nhostname training.example\nport 2222\n\nSCP command preview only:\nscp -P 2222 ./report.txt student@training.example:incoming/\nNo remote session or upload was started',
'Before a transfer, inspect client settings without contacting a host.|ssh -G prints evaluated configuration and exits; -F /dev/null avoids local per-user configuration.|The host is a reserved example name; the scp line is printed, not executed.|Actual sessions require an authorized host and user plus host-key verification. Configuration output ordering may vary by client version.',
'ssh -G: display configuration, do not connect.|-F file: alternative configuration file.|-o User=value / Port=value: configuration options.|scp -P: uppercase P selects the port; ssh uses lowercase -p for a connection.',True,'Bash, GNU utilities and OpenSSH client')
a('network','Inspect loopback networking and a bounded ping',r'''
for tool in ip ss ping; do
    command -v "$tool" >/dev/null 2>&1 || { printf 'Missing: %s\n' "$tool"; exit 1; }
done
printf 'Loopback address:\n'
ip -brief address show dev lo
printf '\nListening TCP sockets (read-only):\n'
ss -ltn
printf '\nOne local reachability check:\n'
if ping -c 1 -W 1 127.0.0.1 > ping.txt 2>&1; then
    printf 'Loopback answered\n'
else
    printf 'Ping unavailable or blocked; inspect the captured diagnostic\n'
fi
printf 'No external destination was contacted\n'
''','Loopback address:\n<loopback addresses vary>\n\nListening TCP sockets (read-only):\n<current listening sockets vary>\n\nOne local reachability check:\nLoopback answered\nNo external destination was contacted',
'A basic network check can stay entirely on the local machine.|ip shows addresses for the loopback interface; ss lists listening TCP endpoints without resolving service names.|ping is restricted to one local packet with a short reply wait.|A failed ping can reflect policy or privileges rather than a broken network. Socket lists reveal only current state, not historical traffic.',
'ip -brief address show dev lo: short loopback address view.|ss -ltn: listening, TCP, numeric endpoints.|ping -c 1: one request; -W 1: one-second response wait in iputils.|127.0.0.1: local IPv4 loopback.',True,'Linux, iproute2 and iputils ping')
a('loops','Validate and total a series of quantities',r'''
printf '%s\n' 3 5 bad 2 > quantities.txt
accepted=0
rejected=0
total=0
while IFS= read -r value; do
    case "$value" in
        ''|*[!0-9]*) rejected=$((rejected + 1)); continue ;;
    esac
    total=$((total + 10#$value))
    accepted=$((accepted + 1))
done < quantities.txt
for label in accepted rejected total; do
    printf '%s=%s\n' "$label" "${!label}"
done
[ "$total" -eq 10 ]
''','accepted=3\nrejected=1\ntotal=10',
'A text file contains one quantity per line and one invalid row.|The while loop reads through input redirection, so its variable updates remain in this shell rather than a pipeline subshell.|case rejects nondigits before arithmetic; 10# makes leading-zero numbers decimal.|The for loop prints selected summary variables using Bash indirect expansion.',
'read -r: no backslash interpretation.|IFS=: no field trimming.|continue: skip to the next iteration.|10#value: base-ten arithmetic.|${!name}: value of the variable named by name.')
a('conditions','Route files according to their size and extension',r'''
mkdir incoming
printf 'text\n' > incoming/a.txt
printf 'binary sample\n' > incoming/b.bin
: > incoming/empty.txt
for path in incoming/*; do
    name=${path##*/}
    if [ ! -s "$path" ]; then
        printf '%s: empty, skip\n' "$name"
        continue
    fi
    case "$name" in
        *.txt) printf '%s: text workflow\n' "$name" ;;
        *.bin) printf '%s: binary workflow\n' "$name" ;;
        *) printf '%s: unknown extension\n' "$name" ;;
    esac
done
''','a.txt: text workflow\nb.bin: binary workflow\nempty.txt: empty, skip',
'A dispatcher needs both a general validation check and several mutually exclusive routes.|if rejects empty input before examining its extension.|case patterns choose a route; they are shell patterns, not regular expressions.|An extension is only a routing hint, not reliable proof of content type.',
'[ ! -s path ]: not nonempty.|: > file: create or truncate an empty file with the no-op command.|case pattern): choose a matching branch.|;;: end the branch.')
a('functions','Build a reusable file-report function with validation',r'''
describe_file() {
    if [ "$#" -ne 1 ]; then
        printf 'Usage: describe_file PATH\n' >&2
        return 2
    fi
    local path=$1
    if [ ! -f "$path" ]; then
        printf 'Not a regular file: %s\n' "$path" >&2
        return 3
    fi
    printf '%s: %s lines\n' "$path" "$(wc -l < "$path")"
}
printf 'a\nb\n' > report.txt
describe_file report.txt
if describe_file missing.txt 2> error.txt; then exit 1; else status=$?; fi
printf 'Rejected call status: %s\n' "$status"
cat error.txt
''','report.txt: 2 lines\nRejected call status: 3\nNot a regular file: missing.txt',
'A reusable function should specify its accepted arguments and failure statuses.|$# validates the number of arguments; local keeps the path variable scoped to the function.|The regular-file check prevents a missing path from reaching wc.|The caller handles a predictable error and preserves its diagnostic for display.',
'local: Bash function-scoped variable.|$1: first argument; $#: count.|return N: function exit status.|2> file: capture stderr.|wc -l: line count.')
a('scripts','Validate syntax, trace execution and clean up a child script',r'''
cat > task.sh <<'SCRIPT'
#!/usr/bin/env bash
set -eu
trap 'printf "Child cleanup ran\n"' EXIT
name=${1:-sample}
printf 'Working on: %s\n' "$name"
SCRIPT
bash -n task.sh
printf 'Syntax check passed\n'
bash -x task.sh report > result.txt 2> trace.txt
printf 'Normal output:\n'
cat result.txt
printf 'Trace recorded: '
[ -s trace.txt ] && printf 'yes\n'
printf 'No confidential arguments were used in this trace\n'
''','Syntax check passed\nNormal output:\nWorking on: report\nChild cleanup ran\nTrace recorded: yes\nNo confidential arguments were used in this trace',
'A script should pass a syntax check before it is executed.|bash -n parses without running commands; it does not prove logic is correct.|bash -x records expanded commands on stderr, separately from normal output.|EXIT runs the child cleanup action. Tracing real secrets or credentials could expose them, so this example uses only fictional text.',
'bash -n: syntax checking only.|bash -x: execution tracing.|trap command EXIT: run on shell exit.|${1:-sample}: fallback when the first argument is unset or empty.')
a('temp','Allocate a private scratch directory and verify automatic cleanup',r'''
outer=$PWD
scratch=$(mktemp -d "$outer/scratch.XXXXXX")
(
    trap 'rm -rf -- "$scratch"' EXIT
    printf 'temporary result\n' > "$scratch/result.txt"
    printf 'Scratch contains: '
    cat "$scratch/result.txt"
    printf 'Scratch directory exists during work: '
    [ -d "$scratch" ] && printf 'yes\n'
)
if [ -e "$scratch" ]; then
    printf 'Cleanup failed\n' >&2
    exit 1
fi
printf 'Scratch directory removed after child exit\n'
''','Scratch contains: temporary result\nScratch directory exists during work: yes\nScratch directory removed after child exit',
'Temporary files should not use a predictable shared filename.|mktemp creates a unique directory from the XXXXXX template.|A subshell owns the cleanup trap, so its exit removes only that newly allocated scratch path.|The parent checks the postcondition instead of assuming cleanup happened.',
'mktemp -d template: create a unique directory.|XXXXXX: randomized placeholder characters.|trap ... EXIT: deferred cleanup.|rm -rf -- "$scratch": recursive removal limited to the newly created path; never substitute an existing project directory.')
