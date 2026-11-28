"""Command-specific, fictional Bash practice scenarios; no production inputs."""
import textwrap, re
CASES=[]
PREFIX='''#!/usr/bin/env bash
set -eu
export LC_ALL=C
# Work only inside a new disposable directory.
work=$(mktemp -d)
trap 'rm -rf -- "$work"' EXIT
cd "$work"
'''
def a(id,title,body,output,steps,flags,variable=False,requires='Bash and GNU utilities',try_it='Change the sample input and predict the output before running again.'):
    CASES.append(dict(id=id,title=title,code=PREFIX+'\n'+textwrap.dedent(body).strip(),output=output,steps=re.split(r'(?<!\|)\|(?!\|)',steps),flags=re.split(r'(?<!\|)\|(?!\|)',flags),variable=variable,requires=requires,tryIt=try_it))

a('shell','Check a batch of filenames and report accepted work',r'''
mkdir incoming
printf '%s\n' 'ready' > 'incoming/day one.txt'
printf '%s\n' 'ready' > incoming/day-two.txt
processed=0
for file in incoming/*.txt; do
    [ -f "$file" ] || continue
    name=${file##*/}
    printf 'Checking <%s>\n' "$name"
    if [ -s "$file" ]; then
        printf 'Accepted\n'
        processed=$((processed + 1))
    else
        printf 'Empty file\n'
    fi
done
printf 'Processed: %s\n' "$processed"
''','Checking <day one.txt>\nAccepted\nChecking <day-two.txt>\nAccepted\nProcessed: 2',
'You received two text files and need to inspect each filename without splitting names containing spaces.|The shell expands incoming/*.txt before executing the loop; quotes preserve each path as one argument.|${file##*/} removes the longest prefix ending in a slash. Arithmetic expansion increments a counter.|The script reports two nonempty files; an empty file would be reported but not counted.',
'[ -f path ]: test for a regular file.|[ -s path ]: test for nonzero file size.|printf %s: format one string; \n adds a newline.|for / if: shell control structures, not options passed to another command.')
a('help','Check required tools before starting a report',r'''
missing=0
for tool in printf sort awk; do
    if command -v "$tool" >/dev/null 2>&1; then
        printf 'Available: %s\n' "$tool"
    else
        printf 'Missing: %s\n' "$tool"
        missing=$((missing + 1))
    fi
done
printf 'Bash help for read:\n'
help read > read-help.txt
head -n 2 read-help.txt
if [ "$missing" -ne 0 ]; then
    printf 'Install missing tools before continuing\n' >&2
    exit 1
fi
printf 'Prerequisite check passed\n'
''','Available: printf\nAvailable: sort\nAvailable: awk\nBash help for read:\nread: read [options] [name ...]\n    Read a line from the standard input ...\nPrerequisite check passed',
'Before a longer workflow, check that its commands can be found.|command -v searches shell command resolution, including built-ins and executable paths.|help reads Bash built-in documentation; man sort would open an external command manual when installed.|The displayed help syntax is a shortened illustration and varies by Bash version.',
'command -v: report how a name resolves; status indicates whether it was found.|>/dev/null 2>&1: discard normal output and errors for the availability check.|help read: show Bash documentation for the read built-in.|head -n 2: show two initial lines.|-ne: integer not-equal comparison in test.',True)
a('pwd','Confirm a script is running in its project root',r'''
mkdir -p project/reports
cd project
root=$(pwd -P)
printf 'Root directory name: %s\n' "${root##*/}"
cd reports
current=$(pwd -P)
printf 'Current directory name: %s\n' "${current##*/}"
if [ "$current" = "$root/reports" ]; then
    printf 'Location check passed\n'
else
    printf 'Unexpected working directory\n' >&2
    exit 1
fi
printf '%s\n' 'summary ready' > summary.txt
printf 'File under root: reports/summary.txt\n'
cat "$root/reports/summary.txt"
''','Root directory name: project\nCurrent directory name: reports\nLocation check passed\nFile under root: reports/summary.txt\nsummary ready',
'A report script must confirm its location before using relative paths.|pwd -P returns the physical absolute directory; it does not change directories.|The root variable retains that absolute path after cd changes the current directory.|Only the final path components are printed, so the random temporary-directory name does not affect this output.',
'pwd -P: resolve symbolic-link components in the working directory.|mkdir -p: create missing parent directories.|${path##*/}: keep the last path component.|[ a = b ]: compare two quoted strings.')
a('cd','Visit several folders without losing the starting directory',r'''
mkdir -p project/input project/output
cd project
starting=$(pwd -P)
for folder in input output missing; do
    if [ ! -d "$folder" ]; then
        printf 'Skip unavailable folder: %s\n' "$folder"
        continue
    fi
    (
        cd -- "$folder"
        printf 'Inside: %s\n' "${PWD##*/}"
        printf '%s\n' 'checked' > checked.txt
    )
done
[ "$(pwd -P)" = "$starting" ]
printf 'Back in project: yes\n'
find . -name checked.txt -type f | sort
''','Inside: input\nInside: output\nSkip unavailable folder: missing\nBack in project: yes\n./input/checked.txt\n./output/checked.txt',
'A batch task must visit input and output folders and return reliably.|Each parenthesized group runs in a subshell, so its cd cannot change the parent shell’s directory.|The -d test rejects a missing directory before entering it.|The final assertion proves the parent remains in the starting project directory.',
'cd -- path: change directory; -- ends option parsing.|[ -d path ]: directory test; ! negates it.|pwd -P: physical working directory.|find -name checked.txt -type f: select regular files with that name.')
a('ls','Prepare a visible inventory including hidden files',r'''
mkdir review
printf '%s\n' 'public' > review/report.txt
printf '%s\n' 'configuration' > review/.settings
mkdir review/archive
printf 'Visible entries:\n'
ls -1 -- review
printf '\nIncluding hidden entries:\n'
ls -1A -- review
printf '\nDirectory itself:\n'
ls -d -- review
printf '\nCheck required report:\n'
if [ -f review/report.txt ]; then
    printf 'report.txt exists\n'
else
    exit 1
fi
''','Visible entries:\narchive\nreport.txt\n\nIncluding hidden entries:\n.settings\narchive\nreport.txt\n\nDirectory itself:\nreview\n\nCheck required report:\nreport.txt exists',
'Before sharing a folder, inspect visible and hidden entries separately.|ls -1 prints one entry per line; -A also includes hidden names except . and ...|ls -d lists the directory operand rather than its contents.|Use file tests or find for program logic; do not parse arbitrary ls output because filenames can contain newlines.',
'ls -1: one entry per line.|ls -A: include dotfiles but omit . and ...|ls -d: list the directory itself.|--: stop option parsing.')
a('mkdir','Create a batch workspace and remove only empty folders',r'''
mkdir -p batch/incoming batch/processed batch/unused
printf '%s\n' 'sample' > batch/incoming/item.txt
mkdir -p batch/processed
printf 'Created folders:\n'
find batch -type d | sort
rmdir batch/unused
printf '\nRemoved empty unused folder\n'
if rmdir batch/incoming 2> reason.txt; then
    printf 'Unexpected removal\n'
    exit 1
else
    printf 'Kept incoming: it still contains a file\n'
fi
printf 'Remaining file:\n'
find batch -type f
''','Created folders:\nbatch\nbatch/incoming\nbatch/processed\nbatch/unused\n\nRemoved empty unused folder\nKept incoming: it still contains a file\nRemaining file:\nbatch/incoming/item.txt',
'Create a directory tree that a recurring batch job can reuse.|mkdir -p tolerates an existing directory and creates missing parents.|rmdir removes only an empty directory, so it fails on incoming while the sample file exists.|The failure is handled inside if rather than hidden; the file stays intact.',
'mkdir -p: create parents as necessary.|rmdir path: remove an empty directory; no recursive removal here.|find -type d / -type f: select directories or regular files.|2>: capture diagnostic output separately.')
a('touch','Use a timestamp marker to identify a newer result',r'''
printf '%s\n' 'old result' > old.txt
printf '%s\n' 'new result' > new.txt
touch -t 202401010000 old.txt
touch -t 202401020000 checkpoint
touch -t 202401030000 new.txt
printf 'Files newer than checkpoint:\n'
find . -type f -newer checkpoint -printf '%f\n' | sort
printf '\nMake an empty marker:\n'
touch complete.marker
[ -f complete.marker ]
[ ! -s complete.marker ]
printf 'complete.marker exists and is empty\n'
printf 'Existing content is preserved:\n'
touch old.txt
cat old.txt
''','Files newer than checkpoint:\nnew.txt\n\nMake an empty marker:\ncomplete.marker exists and is empty\nExisting content is preserved:\nold result',
'A workflow needs to distinguish results written after a checkpoint.|Fixed timestamps make the ordering reproducible; the fixture uses three consecutive local dates.|touch creates an absent file or updates timestamps on an existing one without clearing its content.|find -newer compares modification times; this is not a content-change detector.',
'touch -t YYYYMMDDhhmm: set an explicit timestamp.|find -newer file: select newer modification times.|GNU find -printf %f\\n: print the basename and newline.|-s test: true for a file with nonzero size.')
a('cp','Copy a delivery directory and verify each file',r'''
mkdir source delivery
printf '%s\n' 'one' > 'source/first note.txt'
printf '%s\n' 'two' > source/second.txt
cp -R -- source/. delivery/
count=0
for original in source/*; do
    name=${original##*/}
    if cmp -s -- "$original" "delivery/$name"; then
        printf 'Verified: %s\n' "$name"
        count=$((count + 1))
    else
        printf 'Copy mismatch\n' >&2
        exit 1
    fi
done
printf 'Verified files: %s\n' "$count"
''','Verified: first note.txt\nVerified: second.txt\nVerified files: 2',
'Prepare a separate delivery directory while leaving source files untouched.|cp -R recursively copies source/. contents into the destination.|Quoted paths preserve the space in first note.txt.|cmp -s checks exact bytes; the loop counts only successfully verified copies.',
'cp -R: recursively copy directories.|source/.: copy the contents represented by this directory.|--: treat later operands as paths, not options.|cmp -s: quiet byte comparison; zero means identical.')
a('mv','Move approved files while refusing duplicate names',r'''
mkdir incoming approved
printf '%s\n' 'draft A' > incoming/a.txt
printf '%s\n' 'draft B' > incoming/b.txt
printf '%s\n' 'existing B' > approved/b.txt
for source in incoming/*.txt; do
    name=${source##*/}
    if [ -e "approved/$name" ]; then
        printf 'Skipped existing destination: %s\n' "$name"
        continue
    fi
    mv -- "$source" "approved/$name"
    printf 'Moved: %s\n' "$name"
done
printf 'Remaining incoming files:\n'
find incoming -type f -printf '%f\n' | sort
printf 'Existing destination content: '
cat approved/b.txt
''','Moved: a.txt\nSkipped existing destination: b.txt\nRemaining incoming files:\nb.txt\nExisting destination content: existing B',
'Only files with unused destination names should be moved.|The -e test checks the destination before the move.|mv removes the old directory entry and creates the new one; across filesystems it may copy and remove instead.|This is an isolated teaching example. The separate check and move are not an atomic overwrite-protection protocol under concurrent writers.',
'mv -- source destination: move or rename; -- ends options.|[ -e path ]: path exists.|continue: skip the remaining loop body.|find -printf %f: print each matching basename.')
a('rm','Delete only the disposable files explicitly marked temporary',r'''
mkdir session
printf '%s\n' 'keep' > session/report.txt
printf '%s\n' 'scratch' > session/cache.tmp
printf '%s\n' 'scratch' > 'session/other cache.tmp'
printf 'Candidates:\n'
find session -maxdepth 1 -type f -name '*.tmp' -print
removed=0
for file in session/*.tmp; do
    [ -f "$file" ] || continue
    rm -- "$file"
    removed=$((removed + 1))
done
printf 'Removed: %s\n' "$removed"
[ -f session/report.txt ]
printf 'Kept report: '
cat session/report.txt
''','Candidates:\nsession/cache.tmp\nsession/other cache.tmp\nRemoved: 2\nKept report: keep',
'A cleanup task should target only scratch files, not the whole report directory.|The quoted find pattern is passed to find without shell expansion; candidate order may vary.|The loop quotes each expanded path and uses -- before removal.|rm normally does not use the desktop recycle bin. This script operates only in its newly created temporary workspace.',
'find -maxdepth 1: inspect only the starting directory and its direct entries.|-name *.tmp: match the filename pattern.|rm -- path: unlink the named entry, with no recursive option.|-f in [ -f path ] is a regular-file test, not rm -f.',True)
a('ln','Compare a hard link, a symbolic link and a copy',r'''
printf '%s\n' 'version one' > original.txt
ln original.txt hard.txt
ln -s original.txt shortcut.txt
cp original.txt copy.txt
printf '%s\n' 'version two' > original.txt
printf 'Hard link content: '; cat hard.txt
printf 'Symbolic link content: '; cat shortcut.txt
printf 'Copy content: '; cat copy.txt
printf 'Symbolic target: '; readlink shortcut.txt
rm -- original.txt
printf 'Hard link after original name removal: '; cat hard.txt
if [ -L shortcut.txt ] && [ ! -e shortcut.txt ]; then
    printf 'Symbolic link is now dangling\n'
fi
''','Hard link content: version two\nSymbolic link content: version two\nCopy content: version one\nSymbolic target: original.txt\nHard link after original name removal: version two\nSymbolic link is now dangling',
'A project wants to understand whether an alternate filename shares content or stores a separate copy.|A hard link names the same inode; a symbolic link stores a target path.|Overwriting the existing file changes what both links read, but not the copy.|After removing the original name, the hard link still references the inode while the symbolic target no longer resolves.',
'ln source link: create a hard link.|ln -s: create a symbolic link.|readlink path: print the stored symbolic target.|[ -L path ]: test the link itself; [ -e path ] follows it.')
a('cat','Assemble a daily report from separate sections',r'''
printf '%s\n' 'Daily report' > header.txt
printf '%s\n' 'Orders: 12' 'Returns: 1' > body.txt
printf '%s\n' 'End of report' > footer.txt
cat header.txt body.txt footer.txt > combined.txt
printf 'Combined report:\n'
cat combined.txt
printf '\nAdd a human note:\n'
printf '%s\n' 'Reviewed locally' >> combined.txt
cat -n combined.txt
lines=$(wc -l < combined.txt)
[ "$lines" -eq 5 ]
printf 'Checked line count: %s\n' "$lines"
''','Combined report:\nDaily report\nOrders: 12\nReturns: 1\nEnd of report\n\nAdd a human note:\n     1\tDaily report\n     2\tOrders: 12\n     3\tReturns: 1\n     4\tEnd of report\n     5\tReviewed locally\nChecked line count: 5',
'Several report fragments need to be joined in a deliberate order.|cat reads operands sequentially and writes their contents to standard output.|> creates the combined file; >> appends a note without replacing existing data.|cat -n adds display line numbers; it does not modify combined.txt.',
'cat -n: number all output lines.|>: replace output file content.|>>: append output.|wc -l: count newline characters.')
a('less','Review a generated report without opening an editor',r'''
command -v less >/dev/null 2>&1 || { printf 'Install less first\n'; exit 1; }
for number in $(seq 1 40); do
    printf 'Record %02d: sample item\n' "$number"
done > report.txt
printf '%s\n' 'Type /Record 20 then Enter to search.'
printf '%s\n' 'Use n for the next match, space for a page, q to quit.'
if [ -t 0 ] && [ -t 1 ]; then
    less -N -S report.txt
else
    printf 'No interactive terminal; showing first three rows instead.\n'
    head -n 3 report.txt
fi
printf 'Review finished; report remains unchanged.\n'
''','Type /Record 20 then Enter to search.\nUse n for the next match, space for a page, q to quit.\nNo interactive terminal; showing first three rows instead.\nRecord 01: sample item\nRecord 02: sample item\nRecord 03: sample item\nReview finished; report remains unchanged.',
'A larger file is easier to inspect in a pager than by printing it all at once.|The program generates forty numbered sample rows.|The interactive branch opens less; the displayed output here illustrates the noninteractive fallback.|Searching and scrolling change the view, not the input file.',
'less -N: show line numbers.|less -S: chop long lines rather than wrap them.|[ -t descriptor ]: test whether the descriptor is a terminal.|seq 1 40: generate consecutive numbers.|printf %02d: print a two-digit zero-padded integer.',True,'Bash, GNU utilities and less')
a('head-tail','Check the beginning and end of a batch export',r'''
printf '%s\n' 'id,value' > export.csv
for id in $(seq 1 6); do
    printf '%s,%s\n' "$id" "$((id * 10))" >> export.csv
done
printf 'Header and first two rows:\n'
head -n 3 export.csv
printf '\nLast two rows:\n'
tail -n 2 export.csv
printf '\nData without header:\n'
tail -n +2 export.csv > data.csv
cat data.csv
rows=$(wc -l < data.csv)
[ "$rows" -eq 6 ]
printf 'Data rows: %s\n' "$rows"
''','Header and first two rows:\nid,value\n1,10\n2,20\n\nLast two rows:\n5,50\n6,60\n\nData without header:\n1,10\n2,20\n3,30\n4,40\n5,50\n6,60\nData rows: 6',
'A batch export needs a quick header and completion check.|head -n 3 includes the header plus two records.|tail -n 2 returns the final two lines; tail -n +2 starts at line two instead.|The exported fixture is simple CSV without embedded newlines; general CSV record counts can differ from line counts.',
'head -n N: first N lines.|tail -n N: last N lines.|tail -n +N: start at line N.|wc -l: count newline characters.')
a('wc','Compare bytes, words and lines in submitted notes',r'''
printf 'one two\nthree\n' > complete.txt
printf 'one two\nthree' > no-final-newline.txt
for file in complete.txt no-final-newline.txt; do
    lines=$(wc -l < "$file")
    words=$(wc -w < "$file")
    bytes=$(wc -c < "$file")
    printf '%s: lines=%s words=%s bytes=%s\n' "$file" "$lines" "$words" "$bytes"
done
printf '\nCombined totals:\n'
cat complete.txt no-final-newline.txt > combined.txt
printf 'Lines: '; wc -l < combined.txt
printf 'Words: '; wc -w < combined.txt
printf 'Bytes: '; wc -c < combined.txt
[ "$(wc -c < complete.txt)" -eq 14 ]
''','complete.txt: lines=2 words=3 bytes=14\nno-final-newline.txt: lines=1 words=3 bytes=13\n\nCombined totals:\nLines: 3\nWords: 6\nBytes: 27',
'Two visually similar notes differ only in their final newline.|wc -l counts newline characters, not the number of visible text fragments.|wc -w counts whitespace-separated words; -c counts bytes.|Combining the files gives additive byte and newline counts for these inputs.',
'wc -l: newline count.|wc -w: word count.|wc -c: byte count; use -m for characters under the chosen locale.|< file: feed content through standard input so the filename is omitted.')
a('file-stat','Verify file type, size and permissions before processing',r'''
command -v file >/dev/null 2>&1 || { printf 'Install file first\n'; exit 1; }
printf 'hello\n' > note.txt
printf '\x00\x01\x02' > sample.bin
chmod 600 note.txt
for item in note.txt sample.bin; do
    printf 'Inspecting: %s\n' "$item"
    printf 'Type: '; file -b -- "$item"
    printf 'Bytes: '; stat -c '%s' -- "$item"
done
printf 'Text mode: '; stat -c '%a' note.txt
size=$(stat -c '%s' note.txt)
[ "$size" -eq 6 ]
printf 'Size check passed\n'
''','Inspecting: note.txt\nType: ASCII text\nBytes: 6\nInspecting: sample.bin\nType: data\nBytes: 3\nText mode: 600\nSize check passed',
'An extension alone is not enough to identify a file.|file examines content and reports a type; the exact wording depends on its database/version.|stat reads metadata such as byte size and permission mode.|The size assertion checks an exact fixture fact, independently of the descriptive type wording.',
'file -b: brief output without filename.|stat -c FORMAT: GNU output format.|%s: size in bytes; %a: octal mode.|chmod 600: owner read/write only.',True,'Bash, GNU stat and file')
a('grep','Find failed jobs and preserve their original line numbers',r'''
cat > jobs.log <<'DATA'
INFO job=load complete
ERROR job=export unavailable
INFO job=report complete
ERROR job=load invalid-input
DATA
printf 'Error records with line numbers:\n'
grep -n -F 'ERROR' jobs.log > errors.txt
cat errors.txt
printf '\nError count: '
grep -c -F 'ERROR' jobs.log
if grep -q -F 'FATAL' jobs.log; then
    printf 'Fatal condition found\n'
else
    status=$?
    [ "$status" -eq 1 ] || exit "$status"
    printf 'No fatal condition found\n'
fi
''','Error records with line numbers:\n2:ERROR job=export unavailable\n4:ERROR job=load invalid-input\n\nError count: 2\nNo fatal condition found',
'A fictional job log needs a readable failure extract and a quick severity check.|-F treats ERROR as literal text; -n keeps original line positions in the report.|-c counts matching lines, not occurrences inside one line.|The -q branch distinguishes no match (1) from an actual grep error (>1), instead of treating all failures as harmless.',
'grep -F: literal pattern.|-n: original line number.|-c: matching-line count.|-q: no normal output, use status.|Status 0=match, 1=no match, 2=error in GNU grep.')
a('regex','Separate well-formed ticket IDs from malformed text',r'''
printf '%s\n' 'JOB-001' 'JOB-42' 'job-003' 'JOB-004 extra' 'JOB-999' > tickets.txt
pattern='^JOB-[0-9]{3}$'
printf 'Accepted IDs:\n'
grep -E "$pattern" tickets.txt > accepted.txt
cat accepted.txt
printf '\nRejected rows:\n'
grep -E -v "$pattern" tickets.txt > rejected.txt
cat rejected.txt
printf '\nAccepted count: '
wc -l < accepted.txt
printf 'Rejected count: '
wc -l < rejected.txt
[ "$(wc -l < accepted.txt)" -eq 2 ]
''','Accepted IDs:\nJOB-001\nJOB-999\n\nRejected rows:\nJOB-42\njob-003\nJOB-004 extra\n\nAccepted count: 2\nRejected count: 3',
'A ticket ID must be uppercase JOB-, followed by exactly three decimal digits.|^ and $ anchor the expression to the whole line; the digit class and repetition enforce the shape.|The second grep uses the same expression with inverted selection.|Shape validation does not prove that an ID exists in a database or that leading zeros have business meaning.',
'grep -E: extended regular expressions.|grep -v: select nonmatching lines.|[0-9]{3}: exactly three ASCII digits.|^ / $: beginning/end of line.')
a('find','Discover text files beneath nested folders safely',r'''
mkdir -p documents/old documents/new
printf '%s\n' 'A' > documents/old/a.txt
printf '%s\n' 'B' > 'documents/new/b note.txt'
printf '%s\n' 'image' > documents/new/picture.bin
printf 'Matching relative paths:\n'
find documents -type f -name '*.txt' -print | sort
printf '\nRead every matched file safely:\n'
find documents -type f -name '*.txt' -print0 |
while IFS= read -r -d '' path; do
    printf '%s: ' "${path##*/}"
    cat -- "$path"
done
printf 'Search completed\n'
''','Matching relative paths:\ndocuments/new/b note.txt\ndocuments/old/a.txt\n\nRead every matched file safely:\na.txt: A\nb note.txt: B\nSearch completed',
'A nested document tree contains mixed file types and a filename with spaces.|find tests each visited entry; -type f and -name combine with logical AND by default.|-print0 separates paths with NUL, which cannot appear inside a Unix filename.|read -d empty-string consumes NUL-delimited records. Traversal order is not guaranteed; the reading section shown is illustrative.',
'find -type f: regular files.|-name pattern: filename pattern; quote it to prevent shell expansion.|-print0: NUL-delimited paths.|read -r: preserve backslashes; -d empty string: NUL delimiter.|IFS=: no whitespace trimming.',True)
a('sort','Rank numeric sales records with a predictable tie-breaker',r'''
cat > sales.txt <<'DATA'
pear 9
apple 12
plum 12
banana 2
DATA
printf 'Largest totals first, name breaks ties:\n'
sort -k2,2nr -k1,1 sales.txt > ranked.txt
cat ranked.txt
printf '\nTop two rows:\n'
head -n 2 ranked.txt
printf '\nUnique product names:\n'
cut -d ' ' -f1 sales.txt | sort -u
[ "$(head -n 1 ranked.txt)" = 'apple 12' ]
''','Largest totals first, name breaks ties:\napple 12\nplum 12\npear 9\nbanana 2\n\nTop two rows:\napple 12\nplum 12\n\nUnique product names:\napple\nbanana\npear\nplum',
'Text sorting would put 9 before 12; numeric ranking needs a numeric key.|The first key is field two, numeric and descending.|The second key is field one in ascending order so equal totals have a clear order.|The input fixture uses one-word names and space-separated integer totals.',
'sort -k2,2nr: field two only, numeric, reverse.|-k1,1: first-field secondary key.|sort -u: remove equal sorted lines.|head -n 2: select first two rows.')
a('uniq','Count repeated events across a whole file',r'''
printf '%s\n' 'login' 'logout' 'login' 'login' 'download' 'logout' > events.txt
printf 'Adjacent groups only:\n'
uniq -c events.txt | awk '{print $2 ": " $1}'
printf '\nWhole-file frequencies:\n'
sort events.txt | uniq -c | awk '{print $2 ": " $1}'
printf '\nRepeated event names:\n'
sort events.txt | uniq -d
printf '\nNames occurring once:\n'
sort events.txt | uniq -u
''','Adjacent groups only:\nlogin: 1\nlogout: 1\nlogin: 2\ndownload: 1\nlogout: 1\n\nWhole-file frequencies:\ndownload: 1\nlogin: 3\nlogout: 2\n\nRepeated event names:\nlogin\nlogout\n\nNames occurring once:\ndownload',
'The same event can occur at several unrelated positions.|uniq collapses adjacent equal lines only, which is why the first report has multiple login groups.|Sorting brings all equal names together before counting.|-d returns repeated groups; -u returns groups occurring once, not a deduplicated list of all names.',
'uniq -c: prefix each group with its count.|uniq -d: output repeated groups once.|uniq -u: output groups with one occurrence.|awk $1/$2: read the count and name in this simple fixture.')
a('cut','Extract selected columns from a simple delimited export',r'''
cat > people.csv <<'DATA'
id,name,team
1,Alice,blue
2,Ben,green
3,Casey,blue
DATA
printf 'Name and team columns:\n'
cut -d, -f2,3 people.csv > selected.csv
cat selected.csv
printf '\nTeams without header:\n'
tail -n +2 people.csv | cut -d, -f3 | sort -u
printf '\nExpected record count: '
tail -n +2 selected.csv | wc -l
[ "$(head -n 1 selected.csv)" = 'name,team' ]
''','Name and team columns:\nname,team\nAlice,blue\nBen,green\nCasey,blue\n\nTeams without header:\nblue\ngreen\n\nExpected record count: 3',
'Only two columns are needed for a team report.|cut numbers fields from one and uses a single-character delimiter.|The header is handled deliberately before collecting unique teams.|This fixture has no quoted commas or multiline values. cut is not a general CSV parser.',
'cut -d,: use comma as the delimiter.|-f2,3: output fields two and three.|-f3: output field three only.|tail -n +2: omit the first line.|sort -u: unique sorted teams.')
a('tr','Normalize a list of short labels',r'''
printf '  Red\r\nBLUE\r\nGreen\r\n\n' > raw.txt
printf 'Normalize case and remove carriage returns:\n'
tr -d '\r' < raw.txt | tr '[:upper:]' '[:lower:]' > lower.txt
cat lower.txt
printf 'Collapse repeated spaces:\n'
tr -s ' ' < lower.txt > compact.txt
cat compact.txt
printf 'Keep only letters and newlines:\n'
tr -cd '[:alpha:]\n' < compact.txt > labels.txt
cat labels.txt
printf 'Nonempty labels: '
grep -c . labels.txt
''','Normalize case and remove carriage returns:\n  red\nblue\ngreen\n\nCollapse repeated spaces:\n red\nblue\ngreen\n\nKeep only letters and newlines:\nred\nblue\ngreen\n\nNonempty labels: 3',
'Labels from a simple text source contain CRLF line endings, uppercase letters and repeated spaces.|tr operates on characters, not words or regex matches.|-s squeezes runs of the selected character; it does not trim all leading whitespace.|The final -cd removes the complement of letters and newlines. LC_ALL=C makes this an ASCII-oriented example.',
'tr -d: delete selected characters.|tr set1 set2: translate corresponding characters.|tr -s: squeeze repeated selected characters.|tr -c: complement the selected set; -cd deletes the complement.')
a('sed','Create a revised configuration without editing the original',r'''
cat > original.conf <<'DATA'
# training configuration
mode=dev
workers=2
path=/old/data
DATA
sed -e 's/^mode=dev$/mode=test/' -e 's|/old/|/practice/|g' original.conf > revised.conf
printf 'Revised configuration:\n'
cat revised.conf
printf '\nActive lines only:\n'
sed '/^#/d; /^$/d' revised.conf
printf '\nOriginal mode remains: '
grep '^mode=' original.conf
grep -q '^mode=test$' revised.conf
''','Revised configuration:\n# training configuration\nmode=test\nworkers=2\npath=/practice/data\n\nActive lines only:\nmode=test\nworkers=2\npath=/practice/data\n\nOriginal mode remains: mode=dev',
'A testing configuration should be derived from the original without overwriting it.|Two -e expressions change an exact mode line and a path fragment.|The alternate substitution delimiter avoids escaping the slashes in paths.|The second sed deletes comment and empty lines for display; no -i option is used.',
'sed -e script: add an editing expression.|s/pattern/replacement/: substitute the first match per line.|g suffix: replace every match on the line.|/pattern/d: delete matching lines.|^ and $: whole-line boundaries.')
a('awk','Summarize quantities and reject malformed records',r'''
cat > quantities.txt <<'DATA'
apple 3
pear 2
apple 4
broken unknown
DATA
awk '
NF != 2 || $2 !~ /^[0-9]+$/ { rejected++; next }
{ totals[$1] += $2; accepted++ }
END {
    printf "apple=%d\n", totals["apple"]
    printf "pear=%d\n", totals["pear"]
    printf "accepted=%d rejected=%d\n", accepted, rejected
}' quantities.txt > report.txt
cat report.txt
grep -q '^apple=7$' report.txt
''','apple=7\npear=2\naccepted=3 rejected=1',
'A small inventory feed can have repeated names and invalid quantities.|NF checks the field count; a digit-only regex validates quantity text.|Associative-array totals accumulate values by item name.|END prints after all input. The fixed display order avoids relying on awk array iteration order.',
'NF: field count; $1/$2: first/second field.|!~: does not match a regex.|next: skip remaining actions for this record.|END: run once after input.|printf %d: format an integer.')
