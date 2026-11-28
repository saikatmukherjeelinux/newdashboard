from section_projects import add

SETUP='''#!/usr/bin/env bash
set -eu
export LC_ALL=C
# Only this new temporary directory is removed by the exit trap.
work=$(mktemp -d)
trap 'rm -rf -- "$work"' EXIT
cd "$work"
'''

def project(section,title,goal,body,steps,meaning,variation,output):
    add('unix-motion-lab',section,title,goal,SETUP+body,
        'Run this complete script in Bash with GNU utilities. set -e stops on many unhandled failures; -u rejects unset variables. LC_ALL=C makes sorting predictable. mktemp -d creates a disposable directory; cd enters it; the EXIT trap removes only that directory.|'+steps,
        meaning,variation,output)

def install():
    project('Start here','Create and inspect a practice workspace','Follow paths, files, line counts and text output in one small workflow.', '''
mkdir -p notes/archive
printf '%s\\n' 'First lesson' 'Practice every day' > notes/today.txt
cp notes/today.txt notes/archive/copy.txt
printf 'Files created:\\n'
find notes -type f | sort
printf '\\nContents:\\n'
cat notes/today.txt
printf '\\nLine count: '
wc -l < notes/today.txt
if cmp -s notes/today.txt notes/archive/copy.txt; then
    printf 'Copy matches original\\n'
else
    printf 'Copy differs\\n'
    exit 1
fi
''','mkdir -p creates both nested directories, including missing parents.|printf %s prints each string; \\n ends its line. > creates or replaces the fixture file.|find -type f selects regular files, and sort orders the paths.|wc -l counts newlines; input redirection avoids printing a filename. cmp -s compares quietly and communicates through its exit status.',
        'Two files contain the same two lines. No existing user directory is modified; all paths are relative to the new temporary directory.',
        'Append a third line to the original and explain why the copy comparison then fails.',
        'Files created:\nnotes/archive/copy.txt\nnotes/today.txt\n\nContents:\nFirst lesson\nPractice every day\n\nLine count: 2\nCopy matches original')
    project('Files & paths','Organize incoming files without overwriting a source','Copy a set of safely quoted paths into an archive and verify the result.', '''
mkdir -p incoming archive
printf '%s\\n' 'alpha' > 'incoming/first note.txt'
printf '%s\\n' 'beta' > 'incoming/second note.txt'
count=0
for source in incoming/*.txt; do
    [ -f "$source" ] || continue
    name=$(basename "$source")
    destination="archive/$name"
    if [ -e "$destination" ]; then
        printf 'Refusing to overwrite: %s\\n' "$name" >&2
        exit 1
    fi
    cp -- "$source" "$destination"
    cmp -s -- "$source" "$destination"
    count=$((count + 1))
    printf 'Copied: %s\\n' "$name"
done
printf 'Verified copies: %s\\n' "$count"
''','The glob selects txt paths; the -f test handles a glob with no matching regular file.|Quoted expansions keep spaces inside a single argument.|basename strips the directory component; -e checks whether the destination already exists.|-- ends option parsing; cmp -s checks copied content; arithmetic expansion increments the count.',
        'The script handles spaces and refuses known existing destinations. This check-then-copy pattern is a teaching example, not an atomic concurrent file-transfer protocol.',
        'Add a filename with two spaces and confirm that it remains a single file.',
        'Copied: first note.txt\nCopied: second note.txt\nVerified copies: 2')
    project('Read & inspect','Produce a compact text-file inspection report','Compare beginning, ending and numbered views of the same input.', '''
printf '%s\\n' 'alpha' 'beta' '' 'gamma' 'delta' > notes.txt
printf 'First two lines:\\n'
head -n 2 notes.txt
printf '\\nLast two lines:\\n'
tail -n 2 notes.txt
printf '\\nNumber every line:\\n'
awk '{ printf "%d: %s\\n", NR, $0 }' notes.txt
printf '\\nTotal lines: '
wc -l < notes.txt
printf 'Nonempty lines: '
grep -c . notes.txt
printf 'Blank lines: '
grep -c '^$' notes.txt
''','head -n 2 and tail -n 2 request two lines from the beginning and end.|awk NR is the input record number and $0 is the entire line.|wc -l counts newline characters, including the newline on a blank line.|grep -c prints a matching-line count. Dot matches a character; ^$ matches an empty line.',
        'A blank line is still a line. grep -c returns status 1 when its match count is zero, which matters in scripts using set -e.',
        'Remove the blank line and handle grep’s no-match status explicitly without hiding genuine errors.',
        'First two lines:\nalpha\nbeta\n\nLast two lines:\ngamma\ndelta\n\nNumber every line:\n1: alpha\n2: beta\n3: \n4: gamma\n5: delta\n\nTotal lines: 5\nNonempty lines: 4\nBlank lines: 1')
    project('Search & transform','Summarize a fictional request log','Filter failed requests and count service/status pairs.', '''
cat > requests.txt <<'DATA'
catalog 200 15
catalog 500 90
checkout 200 25
catalog 500 70
checkout 503 100
DATA
printf 'Failed requests (service status latency_ms):\\n'
awk '$2 >= 500 {print $0}' requests.txt
printf '\\nCounts by service and status:\\n'
awk '{print $1, $2}' requests.txt | sort | uniq -c |
    awk '{printf "%s %s: %d\\n", $2, $3, $1}'
printf '\\nAverage latency: '
awk '{total += $3; n++} END {if (n) printf "%.1f ms\\n", total/n}' requests.txt
''','The here-document supplies five fictional rows with three whitespace-separated fields.|awk $2 >= 500 keeps status values at least 500; $0 prints the whole selected row.|sort places identical service/status pairs together; uniq -c counts adjacent equal lines.|The final awk accumulates the third field and divides by its record count only when nonzero.',
        'This teaching format is deliberately simple; it is not a parser for arbitrary web-server logs. Fields have no embedded whitespace.',
        'Add another checkout 503 row and calculate its effect on the count and average latency.',
        'Failed requests (service status latency_ms):\ncatalog 500 90\ncatalog 500 70\ncheckout 503 100\n\nCounts by service and status:\ncatalog 200: 1\ncatalog 500: 2\ncheckout 200: 1\ncheckout 503: 1\n\nAverage latency: 60.0 ms')
    project('Shell building blocks','Separate normal output, errors and exit status','Use redirection and conditionals to report a command failure without confusing it with ordinary output.', '''
validate_number() {
    case "$1" in
        ''|*[!0-9]*)
            printf 'Not a nonnegative integer: %s\\n' "$1" >&2
            return 2
            ;;
        *) printf 'Accepted: %s\\n' "$1" ;;
    esac
}
validate_number 12 > accepted.txt
if validate_number bad > rejected.txt 2> errors.txt; then
    status=0
else
    status=$?
fi
cat accepted.txt
printf 'Failure status: %s\\n' "$status"
printf 'Captured error: '
cat errors.txt
printf 'Rejected stdout bytes: '
wc -c < rejected.txt
''','A case pattern rejects an empty argument or any character outside 0–9.|>&2 sends the error to standard error; return 2 reports failure to the caller.|> captures standard output while 2> captures standard error separately.|The if statement handles the failure intentionally, so set -e does not stop this expected branch.',
        'The invalid input produces an error message and status 2 but no standard output. Exit status is separate from printed text.',
        'Try 0, -3 and 3.5 and explain which inputs the stated nonnegative-integer rule accepts.',
        'Accepted: 12\nFailure status: 2\nCaptured error: Not a nonnegative integer: bad\nRejected stdout bytes: 0')
    project('Permissions & identity','Inspect explicit permissions on private practice files','Set file and directory permissions and verify the numeric modes.', '''
mkdir private
printf '%s\\n' 'fictional practice note' > private/note.txt
chmod 700 private
chmod 600 private/note.txt
printf 'Initial directory mode: '
stat -c '%a' private
printf 'Initial file mode: '
stat -c '%a' private/note.txt
chmod u+x private/note.txt
printf 'After adding owner execute: '
stat -c '%a' private/note.txt
chmod u-x private/note.txt
if [ -r private/note.txt ]; then
    printf 'The current process can read the practice file\\n'
fi
printf 'Restored file mode: '
stat -c '%a' private/note.txt
''','700 gives directory access only to the owner; directory execute means traversal.|600 gives owner read/write and no group or other permissions.|chmod u+x adds owner execute and u-x removes it. This does not make ordinary text a useful executable.|GNU stat -c supplies an output format; %a prints the octal permission mode. -r tests access for the current process.',
        'Numeric modes illustrate basic Unix permissions. ACLs, privileged users and mounted filesystem behavior can affect actual access; the example uses no administrative command.',
        'Change the file mode to 640 and explain what group permission was added.',
        'Initial directory mode: 700\nInitial file mode: 600\nAfter adding owner execute: 700\nThe current process can read the practice file\nRestored file mode: 600')
    project('Processes & system','Start background work and wait for its result','Understand process IDs, completion and exit status using your own child processes.', '''
(
    printf '%s\\n' 'background result' > result.txt
) &
worker=$!
if wait "$worker"; then
    printf 'Worker completed successfully\\n'
else
    printf 'Worker failed\\n' >&2
    exit 1
fi
cat result.txt
(exit 7) &
failed_worker=$!
if wait "$failed_worker"; then
    status=0
else
    status=$?
fi
printf 'Second worker exit status: %s\\n' "$status"
''','Parentheses run a command group in a subshell; & starts it asynchronously.|$! captures the most recently started background process ID.|wait waits for the specified child and returns its status.|The failing worker exits with 7; the conditional captures this expected failure without ending the script.',
        'The first result is read only after its producer finishes. Actual process IDs differ between runs and are intentionally not printed.',
        'Launch two workers writing different files and wait for both before reading either file.',
        'Worker completed successfully\nbackground result\nSecond worker exit status: 7')
    project('Archives & transfer','Build, inspect and verify a compressed archive','Create an archive from known files and extract it into a separate empty directory.', '''
mkdir source restored
printf '%s\\n' 'alpha' > source/a.txt
printf '%s\\n' 'beta' > source/b.txt
tar -czf bundle.tar.gz -C source a.txt b.txt
printf 'Archive members:\\n'
tar -tzf bundle.tar.gz
tar -xzf bundle.tar.gz -C restored
for name in a.txt b.txt; do
    if cmp -s "source/$name" "restored/$name"; then
        printf 'Verified: %s\\n' "$name"
    else
        printf 'Mismatch: %s\\n' "$name" >&2
        exit 1
    fi
done
printf 'All restored contents match\\n'
''','tar -c creates, -t lists, and -x extracts; choose one of these operations per invocation.|-z uses gzip compression; -f takes the archive filename as its next argument.|-C changes the base directory used for the following file operands or extraction.|cmp -s verifies file contents without depending on timestamps or archive bytes.',
        'The restored contents match the source. Only this known archive is extracted; unfamiliar archives require inspection and isolation before extraction.',
        'Add a third file to the creation command and verification loop, then inspect the listed members.',
        'Archive members:\na.txt\nb.txt\nVerified: a.txt\nVerified: b.txt\nAll restored contents match')
    project('Shell scripting','Write a reusable total-calculation function','Validate arguments, loop through them and return a meaningful failure status.', '''
sum_numbers() {
    total=0
    for value in "$@"; do
        case "$value" in
            ''|*[!0-9]*) printf 'Invalid integer: %s\\n' "$value" >&2; return 2 ;;
        esac
        # 10# makes leading-zero inputs decimal in Bash arithmetic.
        total=$((total + 10#$value))
    done
    printf '%s\\n' "$total"
}
printf 'First total: '
sum_numbers 10 20 03
printf 'Empty total: '
sum_numbers
if sum_numbers 4 bad > ignored.txt 2> error.txt; then
    printf 'Unexpected acceptance\\n'
    exit 1
else
    printf 'Validation status: %s\\n' "$?"
    cat error.txt
fi
''','"$@" expands to separate quoted arguments, preserving spaces inside each argument.|The case pattern restricts values to nonnegative digit strings.|Bash 10# interprets the following digits in base ten, avoiding accidental octal interpretation.|The function returns 2 when validation fails; the caller handles that result explicitly.',
        'The accepted numbers total 33, including 03 interpreted as three. Bash arithmetic uses fixed-size integers; this is not an arbitrary-precision calculator.',
        'Add a maximum accepted value and reject inputs outside it before arithmetic.',
        'First total: 33\nEmpty total: 0\nValidation status: 2\nInvalid integer: bad')
    project('Paths & text utilities','Join two sorted lookup tables','Combine fictional identifiers with labels while preserving unmatched rows.', '''
printf '%s\\n' 'A Alice' 'B Ben' 'C Casey' > names.txt
printf '%s\\n' 'A 8' 'C 10' 'D 7' > scores.txt
sort -k1,1 names.txt > names.sorted
sort -k1,1 scores.txt > scores.sorted
printf 'Matched records:\\n'
join names.sorted scores.sorted
printf '\\nNames without a score:\\n'
join -v 1 names.sorted scores.sorted
printf '\\nScores without a name:\\n'
join -v 2 names.sorted scores.sorted
printf '\\nUnique identifiers:\\n'
cut -d ' ' -f1 names.txt scores.txt | sort -u
''','sort -k1,1 sorts by the first field, matching join’s default key.|join combines records whose first fields match; inputs must be sorted consistently.|-v 1 and -v 2 print only unmatched rows from the first and second file respectively.|cut -d sets the delimiter and -f1 selects the first field; sort -u sorts and deduplicates.',
        'A and C match, B has no score and D has no name. This simple space-delimited fixture assumes names contain no spaces.',
        'Add a duplicate key to one table and inspect how many joined rows it creates.',
        'Matched records:\nA Alice 8\nC Casey 10\n\nNames without a score:\nB Ben\n\nScores without a name:\nD 7\n\nUnique identifiers:\nA\nB\nC\nD')
    project('Process monitoring','Analyze a fictional process snapshot','Filter a stable sample of process data and rank it numerically.', '''
cat > processes.txt <<'DATA'
PID CPU MEMORY_MB COMMAND
101 5 40 reader
102 70 300 worker
103 20 120 report
104 85 200 indexer
DATA
printf 'Processes at or above 50%% CPU:\\n'
awk 'NR > 1 && $2 >= 50 {print $1, $2, $4}' processes.txt
printf '\\nTop two by memory (MB):\\n'
tail -n +2 processes.txt | sort -k3,3nr | head -n 2 |
    awk '{printf "%s: %s MB\\n", $4, $3}'
printf '\\nTotal listed memory: '
awk 'NR > 1 {total += $3} END {printf "%d MB\\n", total}' processes.txt
''','The snapshot is fictional and is not a live ps output; this keeps the example reproducible.|awk NR > 1 skips the header before comparing numeric CPU values.|tail -n +2 starts at line two; sort -k3,3nr sorts only the third field, numerically in reverse order.|head -n 2 selects two rows, and the last awk totals the supplied memory values.',
        'CPU and memory definitions differ between monitoring tools. Summing these fictional memory values is an arithmetic exercise, not a reliable accounting of physical RAM across real processes.',
        'Add another process with equal memory usage and decide how ties should be ordered.',
        'Processes at or above 50% CPU:\n102 70 worker\n104 85 indexer\n\nTop two by memory (MB):\nworker: 300 MB\nindexer: 200 MB\n\nTotal listed memory: 660 MB')
    project('Shell productivity','Make a reusable file-summary command','Combine a function, arguments, quoting and command discovery into a repeatable workflow.', '''
summarize() {
    for file in "$@"; do
        if [ ! -f "$file" ]; then
            printf 'Missing: %s\\n' "$file"
            continue
        fi
        lines=$(wc -l < "$file")
        bytes=$(wc -c < "$file")
        printf '%s: %s lines, %s bytes\\n' "$file" "$lines" "$bytes"
    done
}
if ! command -v wc >/dev/null 2>&1; then
    printf 'wc is required\\n' >&2
    exit 1
fi
printf 'one\\ntwo\\n' > 'first note.txt'
printf 'abc\\n' > second.txt
summarize 'first note.txt' second.txt missing.txt
''','A function packages commands so they can be reused with different arguments.|command -v checks whether wc can be found; >/dev/null 2>&1 discards both output streams for this existence check.|! reverses a status in the condition; -f tests for a regular file.|Command substitution captures counts while quoted expansions preserve path names with spaces.',
        'Counts are based on newline characters and bytes. Multibyte text can have more bytes than visible characters.',
        'Create a file whose last line has no newline and compare wc -l with the number of visible text lines.',
        'first note.txt: 2 lines, 8 bytes\nsecond.txt: 1 lines, 4 bytes\nMissing: missing.txt')
    project('Network & services','Inspect a fictional HTTP response locally','Read a status line and response headers without contacting a network service.', '''
printf 'HTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\nContent-Length: 5\\r\\n\\r\\nhello' > response.txt
printf 'Normalized response headers:\\n'
tr -d '\\r' < response.txt | sed -n '1,/^$/p'
printf 'Status code: '
awk 'NR == 1 {print $2}' response.txt
printf 'Declared content length: '
tr -d '\\r' < response.txt |
    awk 'tolower($1) == "content-length:" {print $2}'
printf 'Body:\\n'
tr -d '\\r' < response.txt | sed '1,/^$/d'
printf '\\n'
''','The fixture uses CRLF line endings, represented by \\r\\n; it is not fetched from an external server.|tr -d removes carriage returns for this text demonstration.|sed -n suppresses default printing and 1,/^$/p prints through the first blank line.|The status code is the second field of the first line; the final sed deletes the header block.',
        'This teaches a simple HTTP/1.1 text response only. It does not implement chunking, binary-body handling, redirects, TLS or HTTP/2. Use an HTTP client for real requests.',
        'Change the status line to 404 and the body to a different five-byte string.',
        'Normalized response headers:\nHTTP/1.1 200 OK\nContent-Type: text/plain\nContent-Length: 5\n\nStatus code: 200\nDeclared content length: 5\nBody:\nhello')
    project('Industry Practice','Build a daily job-result report from fictional records','Validate structured rows before counting successes, failures and durations.', '''
cat > jobs.txt <<'DATA'
load OK 10
report FAIL 4
load OK 15
export OK 6
broken UNKNOWN -2
DATA
awk '
NF != 3 || ($2 != "OK" && $2 != "FAIL") || $3 !~ /^[0-9]+$/ {
    printf "Rejected row %d\\n", NR
    rejected++
    next
}
{
    count[$2]++
    seconds += $3
    accepted++
}
END {
    printf "Accepted: %d; rejected: %d\\n", accepted, rejected
    printf "OK: %d; FAIL: %d\\n", count["OK"], count["FAIL"]
    printf "Total recorded seconds: %d\\n", seconds
    if (accepted) printf "Mean recorded seconds: %.2f\\n", seconds/accepted
}' jobs.txt
''','NF is the number of fields; invalid status names and nondigit durations are rejected.|The anchored regular expression requires an entire nonnegative digit string.|next skips aggregation for a rejected record.|END runs once after input and prints counts plus an average guarded against an empty accepted set.',
        'The four accepted durations total 35 seconds. This is entirely fictional teaching data; elapsed overlap and parallel execution mean summed durations are not necessarily wall-clock time.',
        'Make every row invalid and verify that the script does not divide by zero.',
        'Rejected row 5\nAccepted: 4; rejected: 1\nOK: 3; FAIL: 1\nTotal recorded seconds: 35\nMean recorded seconds: 8.75')
    project('Unix Architecture','Trace shell variables, child processes and streams','Observe what a child shell inherits and where each output stream goes.', '''
parent_only='visible in the parent'
export SHARED_VALUE='passed to child'
bash -c '
    printf "Environment: %s\\n" "$SHARED_VALUE"
    printf "Unexported: %s\\n" "${parent_only-unset}"
    printf "Child diagnostic\\n" >&2
' > child-output.txt 2> child-error.txt
printf 'Child standard output:\\n'
cat child-output.txt
printf 'Child standard error:\\n'
cat child-error.txt
printf 'Pipeline transformation:\\n'
printf '%s\\n' alpha beta | tr '[:lower:]' '[:upper:]'
''','An ordinary assignment stays in the shell unless exported or otherwise passed.|export places SHARED_VALUE in the environment inherited by the new bash process.|bash -c executes a command string. Single quotes defer variable expansion until the child runs; ${name-unset} supplies a fallback only when unset.|The parent redirects descriptors 1 and 2 to different files; a pipe connects the first program’s standard output to the next program’s standard input.',
        'The child receives the exported value but not the unexported variable. The shell sets up processes and file descriptors; the kernel provides the underlying process, pipe and file operations.',
        'Export parent_only and predict the one output line that changes.',
        'Child standard output:\nEnvironment: passed to child\nUnexported: unset\nChild standard error:\nChild diagnostic\nPipeline transformation:\nALPHA\nBETA')
