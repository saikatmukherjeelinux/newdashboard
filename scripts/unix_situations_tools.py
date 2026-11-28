from unix_situations import a

a('basename','Make display labels from full incoming paths',r'''
mkdir -p incoming/one incoming/two
printf 'A\n' > 'incoming/one/monthly report.txt'
printf 'B\n' > incoming/two/summary.txt
for path in 'incoming/one/monthly report.txt' incoming/two/summary.txt; do
    full_name=$(basename -- "$path")
    stem=$(basename -- "$path" .txt)
    printf 'Path: %s\n' "$path"
    printf 'Filename: %s\n' "$full_name"
    printf 'Label: %s\n' "$stem"
done
printf 'Suffix removal is exact: '
basename -- report.csv .txt
''','Path: incoming/one/monthly report.txt\nFilename: monthly report.txt\nLabel: monthly report\nPath: incoming/two/summary.txt\nFilename: summary.txt\nLabel: summary\nSuffix removal is exact: report.csv',
'A report needs short labels instead of directory paths.|basename removes the leading directory components.|A second operand strips the exact matching suffix; it does not remove an arbitrary extension.|Names from different directories can still collide, so these labels are not unique identifiers.',
'basename -- path: trailing filename component.|Optional suffix operand: remove it only when it matches the end.|--: terminate options.|Quoted command substitution preserves spaces in the result.')
a('dirname','Recreate parent folders before writing reports',r'''
paths=('reports/daily/summary.txt' 'reports/monthly/totals.txt')
for target in "${paths[@]}"; do
    parent=$(dirname -- "$target")
    mkdir -p -- "$parent"
    printf 'generated\n' > "$target"
    printf 'Created parent: %s\n' "$parent"
done
printf 'Generated paths:\n'
find reports -type f | sort
printf 'Parent of a bare filename: '
dirname notes.txt
[ -f reports/daily/summary.txt ]
''','Created parent: reports/daily\nCreated parent: reports/monthly\nGenerated paths:\nreports/daily/summary.txt\nreports/monthly/totals.txt\nParent of a bare filename: .',
'A target path cannot be written until its parent directory exists.|dirname calculates the directory component without creating or accessing it.|mkdir -p then creates that parent hierarchy.|A bare filename has dot as its parent, meaning the current directory.',
'dirname -- path: directory portion of a path string.|mkdir -p: create missing parent directories.|>: create or truncate each report.|find -type f: list generated regular files.')
a('realpath','Resolve an existing symbolic path before reading it',r'''
mkdir -p project/data
printf 'verified content\n' > project/data/note.txt
ln -s data project/current
physical=$(realpath -e -- project/current/../data/note.txt)
root=$(realpath -e -- project)
case "$physical" in
    "$root"/*) printf 'Resolved path remains inside project\n' ;;
    *) printf 'Unexpected destination\n' >&2; exit 1 ;;
esac
printf 'Final filename: %s\n' "${physical##*/}"
cat "$physical"
if realpath -e project/missing 2>/dev/null; then exit 1; fi
printf 'Missing path correctly rejected\n'
''','Resolved path remains inside project\nFinal filename: note.txt\nverified content\nMissing path correctly rejected',
'A symbolic path should be resolved before a basic location check.|realpath -e requires every component to exist and resolves links and dot components.|The prefix check uses a slash boundary, avoiding a false match with a similarly named neighboring folder.|This check is a teaching guard, not a race-free sandbox: filesystem links can change between checks and use.',
'realpath -e: canonicalize existing paths only.|--: end options.|case "$root"/*: require a path beneath that root.|2>/dev/null: suppress the expected missing-path diagnostic.')
a('nl','Create a numbered review copy while preserving blank lines',r'''
printf 'Introduction\n\nDetails\nConclusion\n' > draft.txt
printf 'Default: number nonempty lines\n'
nl -w 2 -s ': ' draft.txt > default.txt
cat default.txt
printf '\nNumber every line for review:\n'
nl -ba -w 2 -s ': ' draft.txt > review.txt
cat review.txt
printf '\nOriginal file still has: '
wc -l < draft.txt
[ "$(wc -l < review.txt)" -eq 4 ]
printf 'Review copy created\n'
''','Default: number nonempty lines\n 1: Introduction\n    \n 2: Details\n 3: Conclusion\n\nNumber every line for review:\n 1: Introduction\n 2: \n 3: Details\n 4: Conclusion\n\nOriginal file still has: 4\nReview copy created',
'Reviewers need stable line references, including empty lines.|By default nl numbers nonempty body lines; blank-line padding can differ with formatting options.|-ba numbers all body lines.|The numbered output is a new file; no line numbers are inserted into the original.',
'nl -ba: body style all lines.|-w 2: number field width.|-s string: separator after the number.|wc -l: verify the line count.',True)
a('tac','Review recent events in reverse chronological file order',r'''
cat > timeline.txt <<'DATA'
09:00 started
09:10 loaded
09:20 checked
09:30 finished
DATA
printf 'Newest recorded line first:\n'
tac timeline.txt > reverse.txt
cat reverse.txt
printf '\nMost recent two recorded lines:\n'
head -n 2 reverse.txt
tac reverse.txt > restored.txt
cmp -s timeline.txt restored.txt
printf 'Reversing twice restored the original\n'
''','Newest recorded line first:\n09:30 finished\n09:20 checked\n09:10 loaded\n09:00 started\n\nMost recent two recorded lines:\n09:30 finished\n09:20 checked\nReversing twice restored the original',
'An append-ordered text timeline should be viewed from the end.|tac reverses record order, not characters within a line.|Newest-first is valid only because this fixture was written chronologically.|Reversing twice and comparing bytes checks the operation on this newline-terminated input.',
'tac file: reverse newline-separated records.|head -n 2: show two lines.|cmp -s: quiet byte comparison.|tac differs from rev, which reverses characters.')
a('paste','Combine parallel columns after checking equal lengths',r'''
printf '%s\n' Alice Ben Casey > names.txt
printf '%s\n' blue green blue > teams.txt
names_count=$(wc -l < names.txt)
teams_count=$(wc -l < teams.txt)
if [ "$names_count" -ne "$teams_count" ]; then
    printf 'Column lengths differ\n' >&2
    exit 1
fi
printf 'Combined columns:\n'
paste -d, names.txt teams.txt > joined.csv
cat joined.csv
printf '\nNames on one line:\n'
paste -s -d ';' names.txt
[ "$(wc -l < joined.csv)" -eq 3 ]
''','Combined columns:\nAlice,blue\nBen,green\nCasey,blue\n\nNames on one line:\nAlice;Ben;Casey',
'Two files contain related values on corresponding lines.|paste joins by position, not by a matching key.|Equal line counts prevent accidental blank columns but do not prove records correspond correctly.|-s serializes one input file into a single delimiter-separated line.',
'paste -d,: comma separator.|paste -s: serial mode.|-d semicolon: choose a semicolon delimiter.|-ne: numeric inequality test.')
a('join','Find matched and unmatched records by identifier',r'''
printf '%s\n' 'B Ben' 'A Alice' 'C Casey' > names.txt
printf '%s\n' 'A 8' 'C 10' 'D 7' > marks.txt
sort -k1,1 names.txt > names.sorted
sort -k1,1 marks.txt > marks.sorted
printf 'Matched rows:\n'
join names.sorted marks.sorted
printf '\nNames without marks:\n'
join -v 1 names.sorted marks.sorted
printf '\nMarks without names:\n'
join -v 2 names.sorted marks.sorted
printf '\nAll left-side identifiers:\n'
join -a 1 names.sorted marks.sorted
''','Matched rows:\nA Alice 8\nC Casey 10\n\nNames without marks:\nB Ben\n\nMarks without names:\nD 7\n\nAll left-side identifiers:\nA Alice 8\nB Ben\nC Casey 10',
'Two exports must be matched by a stable identifier rather than row position.|Both inputs are sorted on the join field using the same locale.|The default join emits matching keys; -v isolates unmatched records.|-a 1 also includes unmatched records from the first input, approximating a simple left join.',
'sort -k1,1: sort the first field.|join: match field one by default.|join -v 1 / -v 2: unmatched rows only.|join -a 1: include unmatched first-file rows.')
a('comm','Compare yesterday’s and today’s identifier sets',r'''
printf '%s\n' A B C C > yesterday.txt
printf '%s\n' B C D > today.txt
sort -u yesterday.txt > old.set
sort -u today.txt > new.set
printf 'Removed:\n'
comm -23 old.set new.set
printf '\nAdded:\n'
comm -13 old.set new.set
printf '\nUnchanged:\n'
comm -12 old.set new.set
printf '\nDistinct old IDs: '
wc -l < old.set
''','Removed:\nA\n\nAdded:\nD\n\nUnchanged:\nB\nC\n\nDistinct old IDs: 3',
'Daily snapshots should be compared as sets, not raw repeated lines.|sort -u both deduplicates and satisfies comm’s sorted-input requirement.|comm has three columns: first-only, second-only and common.|Suppressing two columns gives a plain list for the remaining category.',
'comm -23: suppress second-only and common, retain first-only.|-13: retain second-only.|-12: retain common.|sort -u: unique lines in the same collation order.')
a('expand','Convert tab-indented text for consistent display',r'''
printf 'A\tB\n12\tC\n' > tabbed.txt
expand -t 4 tabbed.txt > spaced.txt
printf 'Spaces shown as dots:\n'
tr ' ' '.' < spaced.txt
unexpand -a -t 4 spaced.txt > retabbed.txt
printf '\nTabs shown as <TAB>:\n'
sed $'s/\t/<TAB>/g' retabbed.txt
expand -t 4 retabbed.txt > roundtrip.txt
cmp -s spaced.txt roundtrip.txt
printf 'Expanded display survived round trip\n'
''','Spaces shown as dots:\nA...B\n12..C\n\nTabs shown as <TAB>:\nA<TAB>B\n12<TAB>C\nExpanded display survived round trip',
'A report uses tabs whose apparent width differs between viewers.|expand moves to the next tab stop, so a tab does not always become the same number of spaces.|unexpand -a converts eligible spaces throughout a line, not only leading indentation.|The check compares expanded display positions; it is not a guarantee that arbitrary original whitespace bytes are preserved.',
'expand -t 4: tab stops every four columns.|unexpand -a: convert eligible spaces anywhere.|unexpand -t 4: matching tab-stop rule.|Bash $quoted string: interpret backslash escapes such as tab.')
a('fold','Wrap a simple text note to a fixed display width',r'''
printf 'alpha beta gamma delta\n' > note.txt
printf 'Original:\n'
cat note.txt
printf '\nWrap at ten columns:\n'
fold -w 10 note.txt > fixed.txt
cat fixed.txt
printf '\nPrefer word boundaries:\n'
fold -s -w 10 note.txt > words.txt
cat words.txt
printf '\nWrapped line count: '
wc -l < words.txt
[ -s words.txt ]
''','Original:\nalpha beta gamma delta\n\nWrap at ten columns:\nalpha beta\n gamma del\nta\n\nPrefer word boundaries:\nalpha \nbeta \ngamma \ndelta\n\nWrapped line count: 4',
'A plain-text note needs narrow terminal formatting.|-w limits display columns, while -s prefers a space as the break point.|Whitespace at wrap points can remain visible in the saved output.|This ASCII example does not demonstrate all terminal-width behavior for Unicode or escape sequences; the word-wrapped sample is illustrative.',
'fold -w N: wrap at N display columns.|fold -s: break at spaces when possible.|fold -b: an alternative byte-counting mode, not used here.|wc -l: count the resulting lines.',True)
a('split','Divide an export into chunks and reconstruct it',r'''
for id in $(seq 1 7); do
    printf 'row-%s\n' "$id"
done > export.txt
mkdir chunks
split -l 3 -d -a 2 export.txt chunks/part-
printf 'Chunk sizes:\n'
for path in chunks/part-*; do
    printf '%s: %s lines\n' "${path##*/}" "$(wc -l < "$path")"
done
cat chunks/part-* > restored.txt
cmp -s export.txt restored.txt
printf 'Reassembled export matches\n'
[ "$(wc -l < restored.txt)" -eq 7 ]
''','Chunk sizes:\npart-00: 3 lines\npart-01: 3 lines\npart-02: 1 lines\nReassembled export matches',
'An export must be divided into manageable batches.|split -l uses lines, not bytes, so each newline-delimited record stays together.|Numeric suffixes with fixed width preserve the intended order under the C locale.|Concatenating chunks and comparing bytes checks that no row was lost or reordered.',
'split -l 3: at most three lines per chunk.|-d: numeric suffixes.|-a 2: suffix width two.|Output prefix chunks/part-: controls names.|cmp -s: exact restoration check.')
a('seq','Generate numbered daily task folders',r'''
mkdir days
for day in $(seq -w 1 12); do
    mkdir "days/day-$day"
    printf 'day=%s\n' "$day" > "days/day-$day/status.txt"
done
printf 'First and last generated names:\n'
printf '%s\n' days/day-* | head -n 1
printf '%s\n' days/day-* | tail -n 1
printf 'A step sequence: '
seq -s ',' 2 2 10
printf '\nFolder count: '
find days -mindepth 1 -maxdepth 1 -type d | wc -l
''','First and last generated names:\ndays/day-01\ndays/day-12\nA step sequence: 2,4,6,8,10\n\nFolder count: 12',
'A predictable numeric range can drive repeated folder creation.|seq -w pads the sequence to a consistent width based on its endpoints.|The three-operand form supplies first, increment and last values.|Integer examples avoid the precision surprises of fractional sequence generation.',
'seq -w: equal-width, zero-padded numbers.|seq FIRST INCREMENT LAST: explicit step.|-s comma: separator between values.|find -mindepth 1 -maxdepth 1: direct children only.')
a('shuf','Select a small sample and verify membership',r'''
printf '%s\n' A B C D E > population.txt
shuf -n 3 population.txt > sample.txt
printf 'Random sample (one possible run):\n'
cat sample.txt
printf 'Sample size: '
wc -l < sample.txt
sort population.txt > population.sorted
sort sample.txt > sample.sorted
comm -23 sample.sorted population.sorted > outside.txt
[ ! -s outside.txt ]
[ "$(sort -u sample.txt | wc -l)" -eq 3 ]
printf 'All sampled labels belong to the population\n'
printf 'No duplicate input lines were sampled twice\n'
''','Random sample (one possible run):\nC\nA\nE\nSample size: 3\nAll sampled labels belong to the population\nNo duplicate input lines were sampled twice',
'Take three randomly ordered input lines from a five-line fixture.|Without -r, shuf samples input lines without replacement; duplicate text in the input could still appear twice.|The membership check verifies that no unexpected label was introduced.|The actual sample changes each run; this is not a fixed seed or a model of every sampling design.',
'shuf -n 3: output at most three lines.|shuf -r: sampling with replacement, intentionally not used.|comm -23: sample-only labels after sorting.|sort -u: deduplicate for the assertion.',True)
a('timeout','Bound a child command and distinguish timeout from success',r'''
printf 'Fast task:\n'
timeout 2s bash -c 'printf "finished quickly\n"'
printf 'Slow task:\n'
if timeout 0.2s sleep 5; then
    printf 'Unexpected early completion\n'
    exit 1
else
    status=$?
fi
case "$status" in
    124) printf 'Stopped after the deadline (status 124)\n' ;;
    *) printf 'Different failure: %s\n' "$status"; exit 1 ;;
esac
printf 'The parent script continued\n'
''','Fast task:\nfinished quickly\nSlow task:\nStopped after the deadline (status 124)\nThe parent script continued',
'A helper command should not be allowed to run indefinitely.|The fast task finishes before its deadline.|GNU timeout sends TERM when the slow task reaches its limit and normally reports 124.|A timeout is handled explicitly instead of being mistaken for successful work; more complex children may need a kill-after policy.',
'timeout DURATION COMMAND: run with a time bound.|s: seconds; fractional durations are accepted by GNU timeout.|124: timeout status unless options change preservation behavior.|--kill-after DURATION: optional later forced termination, not used here.')
a('watch','Observe a report counter for a few seconds',r'''
command -v watch >/dev/null 2>&1 || { printf 'watch is required\n'; exit 1; }
printf 'first\nsecond\n' > report.txt
printf 'Interactive display uses one-second refreshes.\n'
if [ -t 0 ] && [ -t 1 ]; then
    if timeout 3s watch -n 1 -t 'wc -l < report.txt'; then
        :
    else
        status=$?
        [ "$status" -eq 124 ] || exit "$status"
    fi
else
    printf 'No terminal: equivalent single observation: '
    wc -l < report.txt
fi
printf 'Monitoring finished\n'
''','Interactive display uses one-second refreshes.\nNo terminal: equivalent single observation: 2\nMonitoring finished',
'A small status command can be repeated on a terminal without writing a custom refresh loop.|watch owns the terminal display; -n sets the interval and -t removes its header.|An outer timeout limits the demonstration.|The shown transcript is the noninteractive fallback. Interactive screens refresh in place rather than producing this transcript.',
'watch -n 1: one-second interval.|watch -t: suppress title/header.|timeout 3s: bound the demonstration.|-t in [ -t 0 ] is a terminal test, unrelated to watch -t.',True,'Bash, GNU timeout and procps watch')
a('history','Practice history operations without using personal history',r'''
HISTFILE="$work/practice-history"
HISTSIZE=100
HISTFILESIZE=100
HISTTIMEFORMAT=
set +o history
history -c
history -s 'printf sample-one'
history -s 'printf sample-two'
history -w "$HISTFILE"
printf 'Practice entries written: '
wc -l < "$HISTFILE"
printf 'Stored commands (not executed):\n'
cat "$HISTFILE"
history -c
set +o history
printf 'Only disposable practice history was used\n'
''','Practice entries written: 2\nStored commands (not executed):\nprintf sample-one\nprintf sample-two\nOnly disposable practice history was used',
'History practice should not expose or rewrite a user’s real command history.|This separate script points HISTFILE to a disposable path and clears only its own shell history.|history -s adds text without executing it; -w writes the selected history file.|Noninteractive history recording is disabled while two entries are added explicitly; no commands from the real interactive session are read.',
'set -o history / +o history: enable/disable history recording.|history -c: clear this shell’s history list.|history -s text: add an entry.|history -w file: write entries.|HISTFILE: chosen history destination.',True)
a('alias','Create a temporary command shortcut inside a script',r'''
shopt -s expand_aliases
alias sayready='printf "Ready for practice\n"'
printf 'Alias definition:\n'
alias sayready
printf 'Calling alias:\n'
sayready
unalias sayready
if alias sayready >/dev/null 2>&1; then
    printf 'Alias was not removed\n' >&2
    exit 1
fi
printf 'Alias removed\n'
shopt -u expand_aliases
''','Alias definition:\nalias sayready=\'printf "Ready for practice\\n"\'\nCalling alias:\nReady for practice\nAlias removed',
'A repetitive fixed command can have a temporary short name.|Noninteractive Bash normally does not expand aliases, so this script enables that option.|Alias definitions must be parsed before their use; separate top-level lines matter.|Use a function instead when you need positional arguments or more complex logic. No shell startup file is modified.',
'shopt -s expand_aliases: enable script alias expansion.|alias name=value: define a textual command shortcut.|unalias name: remove it.|shopt -u: restore the usual disabled state.')
a('type','Identify whether a name is a function, builtin or executable',r'''
practice_action() { printf 'function result\n'; }
printf 'practice_action kind: '
type -t practice_action
printf 'cd kind: '
type -t cd
printf 'sort kind: '
type -t sort
printf 'Function call: '
practice_action
unset -f practice_action
if type practice_action >/dev/null 2>&1; then
    printf 'Unexpected remaining definition\n'
    exit 1
fi
printf 'Function definition removed\n'
''','practice_action kind: function\ncd kind: builtin\nsort kind: file\nFunction call: function result\nFunction definition removed',
'When commands behave unexpectedly, inspect how their names resolve.|type -t produces a short category rather than a full path or implementation.|The fixture defines a function and contrasts it with a shell builtin and external executable.|The sort result assumes no custom function or alias shadows it in this script environment.',
'type -t: report command kind.|type -a: optional listing of all resolutions, not used here.|unset -f: remove a function definition.|command resolution can differ between interactive and clean shells.')
a('read','Read full text lines without losing spaces or backslashes',r'''
printf '%s\n' '  first item  ' 'path\with\slashes' 'last item' > input.txt
count=0
while IFS= read -r line || [ -n "$line" ]; do
    count=$((count + 1))
    printf 'Line %s: <%s>\n' "$count" "$line"
done < input.txt
printf 'Read lines: %s\n' "$count"
printf 'name=Alice\nteam=blue\n' > pairs.txt
while IFS='=' read -r key value; do
    printf '%s -> %s\n' "$key" "$value"
done < pairs.txt
[ "$count" -eq 3 ]
''','Line 1: <  first item  >\nLine 2: <path\\with\\slashes>\nLine 3: <last item>\nRead lines: 3\nname -> Alice\nteam -> blue',
'Text may contain leading/trailing spaces or backslashes that must remain data.|IFS= avoids whitespace trimming and read -r avoids backslash interpretation.|The fallback condition also handles a final nonempty line lacking a newline.|A second loop deliberately chooses = as a field separator for simple key-value records.',
'read -r: literal backslashes.|IFS=: no field splitting for the whole line.|IFS= delimiter before read: choose the separator for that command.|read key value: assign fields to named variables.||| [ -n "$line" ]: process a nonempty final partial line.')
a('getopts','Give a report function named options and validate them',r'''
report() {
    local OPTIND=1 option name='sample' count=1
    while getopts ':n:c:' option; do
        case "$option" in
            n) name=$OPTARG ;;
            c) count=$OPTARG ;;
            :) printf 'Missing option value\n' >&2; return 2 ;;
            \?) printf 'Unknown option\n' >&2; return 2 ;;
        esac
    done
    shift "$((OPTIND - 1))"
    case "$count" in ''|*[!0-9]*) return 2 ;; esac
    [ "$count" -le 10 ] || return 2
    printf 'name=%s count=%s remaining=%s\n' "$name" "$count" "$#"
}
report -n 'daily report' -c 3 extra
report
if report -c bad; then exit 1; else printf 'Bad count rejected\n'; fi
''','name=daily report count=3 remaining=1\nname=sample count=1 remaining=0\nBad count rejected',
'A reusable script interface should support explicit options rather than guessing argument positions.|The option string marks n and c as requiring values; its leading colon requests silent diagnostic handling.|OPTIND is reset for each function call and then used to remove parsed arguments.|Option parsing does not validate business values; the count is checked separately.',
'getopts :n:c: option: parse two short options with arguments.|OPTARG: current option argument.|OPTIND: index of the next argument.|shift N: remove N positional parameters.|case escaped question-mark: invalid option; colon branch: missing argument.')
a('rsync','Preview and perform a local directory synchronization',r'''
command -v rsync >/dev/null 2>&1 || { printf 'rsync is required\n'; exit 1; }
mkdir source destination
printf 'new\n' > source/report.txt
printf 'old\n' > destination/report.txt
printf 'keep\n' > destination/extra.txt
printf 'Preview changed file:\n'
rsync -rcn --out-format='%n' source/ destination/
rsync -rc source/ destination/
cmp -s source/report.txt destination/report.txt
[ -f destination/extra.txt ]
printf 'Destination report: '
cat destination/report.txt
printf 'Unrelated destination file retained\n'
''','Preview changed file:\nreport.txt\nDestination report: new\nUnrelated destination file retained',
'A local copy should be previewed before it is changed.|-n performs a dry run. Removing -n performs the same basic synchronization.|-c compares checksums, avoiding a false match when same-size files have equal timestamps.|The trailing slash means source contents. No --delete option is used, so the extra destination file remains.',
'rsync -r: recurse through directories.|-c: checksum-based change detection.|-n: dry run.|--out-format=%n: print item names.|source/: transfer contents, not a wrapper directory.',False,'Bash, GNU utilities and rsync')
a('zip','Build and test an archive before extracting it',r'''
for tool in zip unzip; do
    command -v "$tool" >/dev/null 2>&1 || { printf 'Missing: %s\n' "$tool"; exit 1; }
done
mkdir source restored
printf 'one\n' > source/a.txt
printf 'two\n' > source/b.txt
(cd source; zip -q ../bundle.zip a.txt b.txt)
unzip -tqq bundle.zip
printf 'Archive integrity check passed\n'
unzip -q bundle.zip -d restored
for name in a.txt b.txt; do
    cmp -s "source/$name" "restored/$name"
    printf 'Verified: %s\n' "$name"
done
''','Archive integrity check passed\nVerified: a.txt\nVerified: b.txt',
'Two files must be packaged in a common archive format.|Creating the archive from inside source keeps member names relative.|unzip -t checks compressed data without extracting; quiet options suppress routine listings.|Only this locally created archive is extracted into a new directory; contents are then compared.',
'zip -q: quiet output.|unzip -t: test integrity.|-qq: quieter routine output.|unzip -d directory: extract into that directory.|cmp -s: verify byte equality.',False,'Bash, GNU utilities and Info-ZIP zip/unzip')
a('dig','Make a bounded DNS lookup for a public example domain',r'''
command -v dig >/dev/null 2>&1 || { printf 'dig is required\n'; exit 1; }
domain=example.com
printf 'Query: %s A\n' "$domain"
if dig +time=2 +tries=1 +noall +comments +answer "$domain" A > answer.txt; then
    printf 'DNS reply:\n'
    cat answer.txt
else
    printf 'Lookup command failed; check resolver/network access\n'
fi
printf '\nA-record answers only, if present:\n'
awk '$4 == "A" {print $1, $5}' answer.txt
printf 'No addresses are hard-coded as guaranteed results\n'
''','Query: example.com A\nDNS reply:\n<reply status, TTLs and addresses depend on DNS at runtime>\n\nA-record answers only, if present:\nexample.com. <returned IPv4 address>\nNo addresses are hard-coded as guaranteed results',
'A DNS diagnostic should name its query and limit retries.|dig asks the configured resolver; this script contacts DNS only when you choose to run it.|A successful command can still contain NXDOMAIN or another DNS status, so inspect the reply header.|Returned addresses and TTLs are not fixed teaching constants.',
'+time=2: response timeout seconds.|+tries=1: one attempt.|+noall: disable output sections; +comments and +answer re-enable selected sections.|A: IPv4 address record type.',True,'Bash, awk, BIND dig and permitted DNS access')
a('lsof','Inspect one file descriptor opened by this script',r'''
command -v lsof >/dev/null 2>&1 || { printf 'lsof is required\n'; exit 1; }
printf 'open descriptor example\n' > note.txt
exec 3< note.txt
printf 'Selected open descriptor (machine-dependent fields):\n'
if lsof -a -p "$$" -d 3 -F pfn; then
    printf 'Descriptor inspection succeeded\n'
else
    printf 'Inspection restricted or no matching descriptor\n'
fi
IFS= read -r line <&3
printf 'Read through descriptor 3: %s\n' "$line"
exec 3<&-
printf 'Descriptor 3 closed\n'
''','Selected open descriptor (machine-dependent fields):\np<shell PID>\nf3\nn<temporary directory>/note.txt\nDescriptor inspection succeeded\nRead through descriptor 3: open descriptor example\nDescriptor 3 closed',
'A file can be open through a descriptor without its contents being read yet.|exec 3< opens the practice file on descriptor three in this shell.|lsof is restricted to this PID and descriptor; permissions may still limit visibility.|The script reads through that descriptor and then closes it explicitly.',
'lsof -a: AND the selection criteria.|-p PID: process filter.|-d 3: descriptor filter.|-F pfn: field output for process, descriptor and filename.|exec 3<&-: close descriptor three.',True,'Linux/Unix with lsof and permission to inspect the current process')
a('free','Capture a read-only memory snapshot and identify the units',r'''
command -v free >/dev/null 2>&1 || { printf 'free is required\n'; exit 1; }
printf 'Human-readable memory report:\n'
free -h
printf '\nByte-based report:\n'
free -b > memory.txt
cat memory.txt
printf '\nReported total RAM bytes: '
awk '$1 == "Mem:" {print $2}' memory.txt
printf 'Reported free RAM bytes: '
awk '$1 == "Mem:" {print $4}' memory.txt
printf 'Free RAM is not the same as available RAM.\n'
''','Human-readable memory report:\n<current RAM/swap values>\n\nByte-based report:\n<current byte counts>\n\nReported total RAM bytes: <total>\nReported free RAM bytes: <free>\nFree RAM is not the same as available RAM.',
'A report should state whether memory numbers are bytes or scaled units.|free -h is readable for a person; -b is explicit about units.|Linux may reclaim some cache, so free and available represent different ideas.|Values change over time; do not infer a memory leak from one snapshot or sum overlapping categories blindly.',
'free -h: human-readable units.|free -b: bytes.|awk $1 == Mem:: choose the memory row.|Column layouts can vary across procps versions; inspect the header.',True,'Linux and procps free')
a('top','Capture one process-focused activity snapshot',r'''
command -v top >/dev/null 2>&1 || { printf 'top is required\n'; exit 1; }
printf 'Collecting one batch snapshot for this shell\n'
if top -b -n 1 -p "$$" > snapshot.txt 2> diagnostic.txt; then
    head -n 20 snapshot.txt
    printf '\nSnapshot saved in the temporary workspace\n'
else
    printf 'top could not collect the snapshot\n'
    cat diagnostic.txt
fi
printf 'Interpret CPU and memory using the displayed headings.\n'
''','Collecting one batch snapshot for this shell\n<top header and the selected shell process; values vary>\n\nSnapshot saved in the temporary workspace\nInterpret CPU and memory using the displayed headings.',
'An unattended diagnostic needs a bounded text snapshot rather than an interactive full-screen session.|-b selects batch mode and -n 1 limits the number of iterations.|-p restricts the process list to the current shell.|The first CPU sample and displayed fields depend on top version/configuration, so this is a sample view rather than a stable parsing format.',
'top -b: batch output.|-n 1: one iteration.|-p PID: selected process.|head -n 20: limit displayed lines from the saved snapshot.',True,'Linux and procps top')
a('systemctl','Inspect user-service state without starting or stopping services',r'''
command -v systemctl >/dev/null 2>&1 || { printf 'systemctl is required\n'; exit 1; }
printf 'Running user services:\n'
if systemctl --user --no-pager --type=service --state=running list-units > services.txt 2> error.txt; then
    cat services.txt
else
    printf 'User service manager unavailable or inaccessible\n'
    cat error.txt
fi
printf '\nInstalled user-service unit files:\n'
if systemctl --user --no-pager --type=service list-unit-files > units.txt 2> error.txt; then
    head -n 12 units.txt
else
    printf 'Could not enumerate user unit files\n'
fi
printf 'No service state was changed\n'
''','Running user services:\n<running user service units, or an unavailable-manager message>\n\nInstalled user-service unit files:\n<installed user unit files, or an unavailable-manager message>\nNo service state was changed',
'A service inspection should distinguish currently loaded/running units from installed unit files.|--user targets the current user’s service manager, not the system manager.|list-units and list-unit-files answer different questions.|No start, stop, restart, enable or disable operation is performed. Containers and minimal systems may have no accessible user manager.',
'--user: user service manager.|--no-pager: direct output.|--type=service: service units only.|--state=running: running substate filter.|list-units: loaded units; list-unit-files: unit-file installation state.',True,'Linux with systemd; an accessible user manager is optional for the failure branch')
a('journalctl','Read a short user-journal excerpt without altering logs',r'''
command -v journalctl >/dev/null 2>&1 || { printf 'journalctl is required\n'; exit 1; }
printf 'Five recent user-journal entries:\n'
if journalctl --user --no-pager -n 5 -o short-iso > recent.txt 2> error.txt; then
    cat recent.txt
else
    printf 'User journal unavailable or permission denied\n'
    cat error.txt
fi
printf '\nWarnings or worse from the last hour:\n'
if journalctl --user --no-pager --since '1 hour ago' -p warning -n 5 -o short-iso > warnings.txt 2> error.txt; then
    cat warnings.txt
else
    printf 'No accessible query result\n'
fi
printf 'No logs were deleted or modified\n'
''','Five recent user-journal entries:\n<local entries or an unavailable/empty-journal message>\n\nWarnings or worse from the last hour:\n<matching local entries or an empty-journal message>\nNo logs were deleted or modified',
'A troubleshooting excerpt should be bounded by count and time.|--user selects the user journal; access and journal availability vary.|-p warning includes warning and more severe priorities, not just exact warning severity.|Real local logs can contain sensitive information. The page includes no copied production logs, and running this script does not upload them.',
'-n 5: at most five recent entries.|-o short-iso: concise ISO-style timestamps.|--since: time filter.|-p warning: maximum numeric priority threshold (warning and more severe).|--no-pager: no interactive pager.',True,'Linux with systemd-journald and permission to read user-journal entries')
