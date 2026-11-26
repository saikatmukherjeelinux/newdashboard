/* Independently authored scenarios. Each begins with a fresh practice fixture. */
(function(root){
  'use strict';
  const additions={};
  function add(lesson,title,scenario,code,output,steps,flags,pitfall,question,answer,variable=false){
    (additions[lesson] ||= []).push({title,scenario,code,output,steps,flags:flags.map(([flag,meaning])=>({flag,meaning})),pitfall,challenge:{question,answer},variable,collection:'deep',explanation:steps.join(' ')});
  }
  add('grep','Read the lines around a failure','You found an error message, but the line before or after it may explain what happened.',
    "grep -n -C 1 '^ERROR disk$' logs.txt",'1-INFO start\n2:ERROR disk\n3-WARN memory',[
      'The quoted pattern starts with ^ and ends with $. It matches the entire line ERROR disk, rather than any message containing those words.',
      '-C 1 includes one line before and one after the match. -n adds original line numbers. Here the requested window covers lines 1 through 3.',
      'The colon after 2 identifies the actual matching line. The hyphens after 1 and 3 identify neighboring context. The file itself is not modified.'
    ],[['-n','Show source line numbers.'],['-C 1','Include one surrounding line on each side.'],['^...$','Match a complete line in the regular expression.']],
    'Context lines did not necessarily match your search. Do not count every displayed line as a separate error.',
    'What changes if you use -A 1 instead of -C 1?', 'Only line 2 and the following line 3 appear. -A includes following context, not the preceding line.');
  add('grep','Count lines versus individual matches','A line can contain a word twice. Learn what you are actually counting before reporting a total.',
    "printf 'ERROR ERROR\\nINFO\\nERROR\\n' > events.txt\ngrep -c 'ERROR' events.txt\ngrep -o 'ERROR' events.txt | wc -l",'2\n3',[
      'The first command creates three records. ERROR occurs twice on the first line and once on the third line.',
      'grep -c counts matching lines, so its answer is 2. It counts the first line once even though the word occurs twice there.',
      'grep -o prints each nonempty match separately. That produces three newline-terminated matches, which wc -l counts as 3.'
    ],[['-c','Count selected lines.'],['-o','Print matching text only, once per nonempty match.'],['wc -l','Count newline characters in the incoming stream.']],
    'grep -o can count a substring inside a longer word. Exact word matching is a separate choice, for example -w where supported.',
    'If the first input line had three ERROR occurrences, what would the two counts be?', 'The line count would still be 2. The occurrence count would become 4.');
  add('find','Choose several filename extensions','Select text and log files while leaving other file types out of the result.',
    "mkdir scan\ntouch scan/a.txt scan/b.log scan/c.csv\nfind scan -type f \\( -name '*.txt' -o -name '*.log' \\) -print | sort",'scan/a.txt\nscan/b.log',[
      'The setup creates three empty files in a fresh scan folder. Their extensions are part of their names, not a guarantee of their content types.',
      '-type f requires a regular file. The escaped parentheses group two name tests, and -o means either test may match.',
      'The shell receives escaped parentheses and quoted patterns as arguments rather than expanding them. sort makes the display order deterministic; find traversal order alone is not promised.'
    ],[['-type f','Regular files only.'],['-name','Match the basename using a shell-style filename pattern.'],['-o','OR: either grouped condition may match.'],['\\( ... \\)','Pass grouping parentheses to find without the shell treating them as syntax.']],
    'Without the grouping, -type f would not necessarily constrain both sides of the OR expression.',
    'How would you add CSV files to this selection?', "Add -o -name '*.csv' inside the grouped parentheses. The displayed list then includes scan/c.csv.");
  add('find','Pass filenames containing spaces intact','Search files and count their bytes without accidentally splitting a filename into several arguments.',
    "mkdir batch\nprintf 'abc' > 'batch/first note.txt'\nprintf 'xy' > 'batch/second note.txt'\nfind batch -type f -exec wc -c {} \\; | sort",'2 batch/second note.txt\n3 batch/first note.txt',[
      'printf creates files with three and two bytes. Neither printf format requests a newline, so there is no extra byte to count.',
      '-exec launches wc for each found file. {} becomes one complete pathname argument, preserving the embedded space.',
      'The escaped semicolon ends the find action. Each wc call prints a byte count and path; sort arranges these two lines for predictable presentation.'
    ],[['-exec','Run the specified command on matches.'],['{}','Placeholder for the current matching path.'],['\\;','End the action and run once for each matching entry.'],['wc -c','Count bytes, not words or text characters.']],
    'Do not replace this with a loop over unquoted $(find ...); whitespace splitting can corrupt the filenames.',
    'What would change if both printf commands added a newline?', 'Their byte counts would become 4 and 3 respectively. A newline is a stored byte in these ASCII examples.');
  add('awk','Build a small age report','Turn a simple table into a selected, readable report and a total.',
    "awk -F, 'NR > 1 && $2 >= 50 {printf \"%s: %d years\\n\", $1, $2; count++} END {print \"People selected:\", count+0}' people.csv",'Linus: 54 years\nGrace: 85 years\nPeople selected: 2',[
      '-F, defines comma-separated fields. NR > 1 skips the header before the numeric comparison is applied.',
      'The condition accepts ages 50 or above. For each accepted row, printf inserts the name with %s and the integer age with %d. count++ adds one to the running count.',
      'END runs after the file has been read. count+0 forces a numeric zero if no rows were selected. For this fixture, exactly two rows meet the condition.'
    ],[['-F,','Split each record on commas.'],['NR / $1 / $2','Record number / first field / second field.'],['count++','Increase a variable by one.'],['END','Run once after processing all input.']],
    'This parsing assumes simple CSV without quoted commas. General CSV needs a parser that understands quoting.',
    'What would the last line say if the minimum age were 100?', 'People selected: 0. No person in the fixture is at least 100.');
  add('awk','Count messages by severity','Produce a frequency table from the first word of each log line.',
    "awk '{counts[$1]++} END {for (level in counts) print level, counts[level]}' logs.txt | sort",'ERROR 2\nINFO 2\nWARN 1',[
      'With the default whitespace separator, $1 is the first word: INFO, ERROR or WARN in these records.',
      'counts[$1] stores a separate counter under each word. An unseen counter starts at numeric zero before being incremented.',
      'END visits the collected keys and prints each count. awk does not promise this loop order, so the final sort produces the displayed alphabetical order.'
    ],[['$1','First whitespace-separated field.'],['counts[key]','An array entry addressed by a text key.'],['for (key in array)','Visit all stored keys; iteration order is not portable.']],
    'This groups by the first word, not by a universal log format. Logs with timestamps first require a different field selection.',
    'What changes if an additional WARN disk line is appended?', 'The WARN count becomes 2. ERROR and INFO remain 2.');
  add('sed','Compare first replacement with every replacement','See why adding g matters when the same word occurs several times on one line.',
    "printf 'cat cat\\ncat dog\\n' > pets.txt\nsed 's/cat/fox/' pets.txt\nprintf '%s\\n' '---'\nsed 's/cat/fox/g' pets.txt",'fox cat\nfox dog\n---\nfox fox\nfox dog',[
      'The first line of pets.txt contains two occurrences of cat. The second contains one.',
      'Without g, substitution changes only the first match on each line. That leaves the second cat on the first line untouched.',
      'With g, substitution changes every nonoverlapping match per line. Both sed commands read the same original file because neither uses in-place editing.'
    ],[['s/old/new/','Replace the first match per selected line.'],['g','Substitution flag: replace all matches on that line.'],['printf separator','The middle command prints a divider to distinguish the two demonstrations.']],
    'The g applies within each line; it is not needed to process all lines. sed already reads every line by default.',
    'Does pets.txt contain fox after these commands?', 'No. Both sed results go to the screen. The input still contains cat.');
  add('sed','Extract a block between two markers','Print just a section of a text file, including its boundary markers.',
    "printf 'header\\nBEGIN\\napple\\npear\\nEND\\nfooter\\n' > block.txt\nsed -n '/^BEGIN$/,/^END$/p' block.txt",'BEGIN\napple\npear\nEND',[
      'The setup places a BEGIN marker before two data lines and an END marker afterward.',
      'The two slash-delimited patterns define an inclusive address range. ^ and $ make each marker an exact whole-line match.',
      '-n suppresses normal automatic printing, while p prints the selected range. header and footer fall outside it, so they are not displayed.'
    ],[['-n','Print only when a script action explicitly requests it.'],['/start/,/end/','Select an inclusive range between matching records.'],['p','Print the selected record.']],
    'If BEGIN is found but no later END is found, this range continues to the end of the file.',
    'Are the BEGIN and END markers included in the output?', 'Yes. sed address ranges include both boundary records.');
  add('sort','Sort scores and break ties by name','Order a leaderboard numerically, using names to make equal-score order predictable.',
    "printf 'Ada,90\\nLinus,100\\nGrace,90\\n' > scores.csv\nsort -t, -k2,2nr -k1,1 scores.csv",'Linus,100\nAda,90\nGrace,90',[
      '-t, makes commas separate fields. The first key, -k2,2nr, uses only field two, compares numbers, and places larger values first.',
      'Linus has the highest score, so that row comes first. Ada and Grace tie at 90.',
      'The second key compares field one as text. Under the C locale, Ada precedes Grace. No rows are removed.'
    ],[['-t,','Comma delimiter.'],['-k2,2nr','Field two only; numeric comparison; reverse order.'],['-k1,1','Use field one as the next comparison key.']],
    'Do not leave a text header mixed into numeric sorting unless you intentionally handle where it will go.',
    'How would you put the smallest score first?', 'Remove r from the first key: -k2,2n. Keep the name key if you still want alphabetical tie breaking.');
  add('sort','Compare text order with number order','Understand why 10 can appear before 2 when a tool compares text.',
    "printf '2\\n10\\n1\\n' > numbers.txt\nsort numbers.txt\nprintf '%s\\n' '---'\nsort -n numbers.txt",'1\n10\n2\n---\n1\n2\n10',[
      'Each line is stored as text. Ordinary sort compares characters, so a line beginning with 1 comes before a line beginning with 2.',
      'That gives the first order: 1, then 10, then 2. The divider is printed only to separate the two results.',
      'sort -n interprets numeric values for comparison. Now 10 is correctly placed after 2 for a numeric report.'
    ],[['sort without -n','Use the default textual comparison.'],['-n','Compare numeric values.']],
    'A filename such as item10 is not simply a number. Choose a key or a different sorting mode when numbers are embedded in other text.',
    'Would the two orderings differ for the values 1, 2 and 3?', 'No. Single-digit positive integers happen to have the same text and numeric order.');
  add('uniq','Make a frequency table','Count how many times each name appears, including duplicates that were separated in the input.',
    "sort names.txt | uniq -c | awk '{print $2 \": \" $1}'",'Ada: 2\nGrace: 1\nLinus: 1',[
      'sort brings both Ada records together. That is necessary because uniq compares adjacent records.',
      'uniq -c emits one record per group, with a count followed by the original text. Its count is normally padded with leading spaces.',
      'awk reads the count as field one and the single-word name as field two. It prints an unpadded name: count report.'
    ],[['uniq -c','Prefix each adjacent group with its count.'],['awk $1 / $2','Count / name in this intermediate stream.'],['|','Pass output text into the next tool.']],
    'The formatting assumes names contain no spaces. Multi-word names require a formatter that preserves the rest of the record.',
    'Why not run uniq -c names.txt directly?', 'The two Ada records are separated by Linus, so they would be counted as separate groups.');
  add('uniq','Compare repeated-only and single-only records','Separate names seen more than once from names seen exactly once.',
    "sort names.txt > ordered.txt\nuniq -d ordered.txt\nprintf '%s\\n' '---'\nuniq -u ordered.txt",'Ada\n---\nGrace\nLinus',[
      'The sorted intermediate file groups every occurrence of the same name together.',
      '-d keeps groups that contain duplicates, printing one copy of each repeated value. Ada is the only such value.',
      '-u keeps groups with just one input record. Grace and Linus each appear once, so those names follow the divider.'
    ],[['-d','Output repeated groups once each.'],['-u','Output groups that contain exactly one record.'],['> ordered.txt','Save a reusable sorted input file.']],
    'uniq -u does not mean “deduplicate everything.” It removes all groups that contain repeated records.',
    'Which command would keep one copy of every name, including Ada?', 'Use plain uniq ordered.txt or sort -u names.txt.');
  add('pipes','Follow a complete log summary','Combine three small tools to answer how many distinct severity labels exist.',
    "awk '{print $1}' logs.txt | sort -u | tee levels.txt | wc -l\ncat levels.txt",'3\nERROR\nINFO\nWARN',[
      'awk extracts the first word from each log line, producing INFO, ERROR, WARN, ERROR, INFO.',
      'sort -u sorts those words and keeps one copy of each. tee saves that three-line stream in levels.txt while also passing it onward.',
      'wc -l prints the count 3. The later cat is a separate command and displays the saved three labels. tee did not save the number 3; it saved the earlier stream.'
    ],[['sort -u','Sort and keep one line for each equal full-line value here.'],['tee levels.txt','Write the current stream to a file and to the next pipe stage.'],['wc -l','Count the records supplied by the previous stage.']],
    'Moving tee to a different position changes what is saved. Place it where the data you need actually exists.',
    'What would levels.txt contain if tee were placed after wc -l?', 'It would contain the single line 3 rather than the severity labels.');
  add('pipes','See why pipefail changes failure reporting','A later successful pipeline stage can hide an earlier failure unless you choose different status behavior.',
    "(set +o pipefail; false | cat; printf 'default=%s\\n' \"$?\")\n(set -o pipefail; false | cat; printf 'pipefail=%s\\n' \"$?\")",'default=0\npipefail=1',[
      'false deliberately returns status 1 and prints nothing. cat receives an empty stream and successfully finishes with status 0.',
      'Without pipefail, the last stage supplies the pipeline status, so the first message reports 0.',
      'With Bash pipefail, the rightmost failing stage supplies the status. Here that is false, so the second message reports 1. Parentheses keep each setting isolated.'
    ],[['set +o pipefail','Disable Bash pipefail in this subshell.'],['set -o pipefail','Enable failure reporting from earlier stages.'],['$?','Read the status before another command replaces it.']],
    'Some early-closing consumers intentionally cause upstream SIGPIPE. pipefail is useful, but a nonzero pipeline still needs interpretation.',
    'Does pipefail combine stdout and stderr?', 'No. It changes the reported status, not where either output stream goes.');
  add('redirect','Save normal messages and errors separately','Keep useful results in one file and diagnostic messages in another.',
    "{ printf 'result=42\\n'; printf 'warning: sample\\n' >&2; } > results.txt 2> errors.txt\nprintf '%s\\n' 'RESULTS'\ncat results.txt\nprintf '%s\\n' 'ERRORS'\ncat errors.txt",'RESULTS\nresult=42\nERRORS\nwarning: sample',[
      'The braces group two commands so they share the redirections written after the closing brace.',
      'The first printf writes to stdout. >&2 sends the second printf to stderr. > and 2> capture those streams into separate files.',
      'The final commands display each saved file with a label. Nothing was printed by the redirected group itself to the terminal.'
    ],[['{ ...; }','Group commands in the current shell.'],['> results.txt','Create or replace the stdout destination.'],['2> errors.txt','Create or replace the stderr destination.'],['>&2','Send this command’s stdout to the current stderr destination.']],
    'Both > and 2> replace existing file content. Use append operators deliberately if previous results must remain.',
    'How do you append only the error stream instead?', 'Use 2>> errors.txt. The stdout redirection can remain > results.txt.');
  add('redirect','Use a here-document to create readable input','Write several literal lines to a file without a separate printf for each line.',
    "cat > message.txt <<'END_TEXT'\nHello $USER\nTwo words stay together.\nEND_TEXT\ncat message.txt",'Hello $USER\nTwo words stay together.',[
      "<<'END_TEXT' starts a here-document. The following lines become cat’s input until a line exactly equal to END_TEXT appears.",
      'Quoting the delimiter disables variable and command expansion inside the body, so $USER stays literal text.',
      '> message.txt saves cat’s output into a file. The second cat displays what was saved, including the dollar sign and variable name.'
    ],[["<<'MARKER'",'Supply a multiline literal input body.'],['MARKER line','End the body; keep the marker alone without extra spaces.'],['>','Save output to the named file.']],
    'An unquoted delimiter allows expansions inside the body. Choose deliberately when a body contains dollar signs or command substitutions.',
    'What changes if the delimiter is written as <<END_TEXT without quotes?', 'The shell expands $USER in the body, so the saved greeting includes its value rather than the literal text $USER.');
  add('quoting','See word splitting happen','Inspect how one variable value can become multiple arguments when it is not quoted.',
    "value='two words'\nprintf '<%s>\\n' $value\nprintf '%s\\n' '---'\nprintf '<%s>\\n' \"$value\"",'<two>\n<words>\n---\n<two words>',[
      'The assignment stores one value containing a space. Assignments do not split that quoted value into separate variables.',
      'The first use is unquoted. With ordinary shell settings, expansion is split at whitespace, giving printf two arguments. It repeats its format for each.',
      'The second use is double-quoted. printf receives one argument containing the space and prints a single bracketed value.'
    ],[['$value','Unquoted expansion can undergo word splitting and filename expansion.'],['"$value"','Keep the expanded value as one argument.'],['<%s>','Make argument boundaries visible in the printed output.']],
    'An unquoted value containing * can also expand to filenames. Quoting prevents both surprises when passing a path or arbitrary text.',
    'Which form should you normally use when passing a variable as one filename?', 'Use "$value" so spaces and wildcard characters in the filename remain part of one argument.');
  add('quoting','Choose a default without changing a variable','Provide a fallback when a value is missing, then compare it with an assignment-style fallback.',
    "unset label\nprintf '%s\\n' \"${label:-guest}\"\nprintf '%s\\n' \"${label-unset}\"\nprintf '%s\\n' \"${label:=member}\"\nprintf '%s\\n' \"$label\"",'guest\nunset\nmember\nmember',[
      'unset removes label. The :- expansion supplies guest for this one use, but does not assign guest to label.',
      'The next expansion uses a default only if the variable is unset. It prints unset, confirming that the earlier fallback did not assign a value.',
      ':= both supplies member and stores it in label. The final ordinary expansion therefore also prints member.'
    ],[['${name:-word}','Use word when name is unset or empty; do not assign it.'],['${name-word}','Use word only when name is unset, not merely empty.'],['${name:=word}','Assign and use word when name is unset or empty.']],
    'Unset and empty are different states. The colon in these operators determines whether an empty value triggers the fallback.',
    'If label is set to an empty string, what does ${label-word} produce?', 'An empty string. Without the colon, an existing empty value does not trigger the default.');
  add('chmod','Remove one permission without rewriting all others','Change only group write access while preserving the remaining mode bits.',
    "touch mode.txt\nchmod 664 mode.txt\nchmod g-w mode.txt\nstat -c '%a' mode.txt",'644',[
      'The initial mode 664 gives owner and group read/write access and gives others read access.',
      'g-w means remove only the group write bit. It does not remove group read access or alter the owner’s bits.',
      'The group digit changes from 6 to 4, so GNU stat displays 644. This makes symbolic permissions useful for a small targeted adjustment.'
    ],[['664','Owner rw, group rw, others r.'],['g-w','Remove group write permission.'],["stat -c '%a'",'Show the resulting numeric mode on GNU/Linux.']],
    'Permissions depend on the filesystem. Use Linux practice storage rather than assuming every Windows-mounted drive implements these bits the same way.',
    'Starting from 644, what would chmod o-r mode.txt produce?', '640: the other-users read bit is removed, while owner and group permissions remain.');
  add('chmod','Distinguish a folder’s mode from a file’s mode','Set an accessible folder and a non-executable document inside it.',
    "mkdir reports\nprintf 'ready\\n' > reports/status.txt\nchmod 750 reports\nchmod 640 reports/status.txt\nstat -c '%a %n' reports reports/status.txt",'750 reports\n640 reports/status.txt',[
      'The directory contains one ordinary text file. Each has its own permissions, so we set their modes separately.',
      '750 lets the owner read, write and traverse the directory, while the group can read and traverse it. Others have no bits set.',
      '640 gives the document read/write for the owner and read for the group, with no execute bit. A directory’s execute bit means traversal; it is not equivalent to executing a text file.'
    ],[['750','Directory mode: owner rwx, group r-x, others none.'],['640','File mode: owner rw-, group r--, others none.'],['%a %n','GNU stat: numeric mode followed by filename.']],
    'A blanket chmod -R 644 would remove directory traversal bits and can make the tree unusable. Choose file and directory modes separately.',
    'Why does a directory usually need x for a user who will open a named file inside it?', 'The x bit allows traversing the directory to reach entries. Listing names with r alone is not enough for ordinary access to those entries.');
  add('cp','Keep the previous destination as a backup','Replace a practice file while retaining its earlier content using GNU backup mode.',
    "printf 'old\\n' > copy.txt\ncp --backup=numbered docs/guide.txt copy.txt\ncat copy.txt\ncat copy.txt.~1~",'Read the manual.\nold',[
      'The setup gives copy.txt old content. docs/guide.txt contains the replacement content from the shared fixture.',
      '--backup=numbered asks GNU cp to preserve the existing destination under a numbered backup name before replacing it.',
      'The first cat shows the new destination. The second reads the saved original, proving that replacement and preservation are separate actions.'
    ],[['--backup=numbered','GNU: keep numbered backups of overwritten destinations.'],['source destination','Copy content from the first path to the second.']],
    'This exact backup flag is GNU-specific. A numbered backup in the same folder is not a substitute for an independent long-term backup.',
    'What backup suffix is normally used for a second replacement when .~1~ already exists?', 'GNU numbered backup mode normally creates the next available numbered suffix, such as .~2~.');
  add('cp','Copy a file without losing its chosen mode','Use metadata-preserving copy and inspect the result explicitly.',
    "chmod 640 names.txt\ncp -p names.txt preserved.txt\nstat -c '%a %n' names.txt preserved.txt\ncmp -s names.txt preserved.txt && printf 'same bytes\\n'",'640 names.txt\n640 preserved.txt\nsame bytes',[
      'First we set a known mode on the source so the comparison does not depend on the default mask.',
      '-p requests preservation of mode, ownership where allowed, and timestamps. Here the copied file remains owned by the same user, so normal Linux permissions permit this simple case.',
      'stat verifies the two modes. cmp -s then compares content without printing a report; && prints same bytes only after a successful comparison.'
    ],[['-p','Preserve selected metadata where permitted.'],['cmp -s','Quiet byte-for-byte comparison.'],['&&','Run the success message only when the comparison succeeds.']],
    'Copying metadata between different filesystems or accounts can have limits. Inspect the result rather than assuming every attribute was preserved.',
    'Does a matching permission mode prove the file contents match?', 'No. Mode bits describe access, not content. The independent cmp check verifies the bytes.');
  add('tar','Choose clean member paths for an archive','Create an archive whose members do not contain an unnecessary enclosing directory.',
    "tar -cf guide.tar -C docs guide.txt\ntar -tf guide.tar\nmkdir restored\ntar -xf guide.tar -C restored\ncat restored/guide.txt",'guide.txt\nRead the manual.',[
      'The first -C docs tells tar to process the following guide.txt relative to docs. The stored member name is therefore just guide.txt.',
      '-t lists the archive and confirms that clean member path before extraction.',
      'The second -C chooses restored as the extraction destination. The file appears directly there, and cat confirms its content.'
    ],[['-c / -t / -x','Create / list / extract.'],['-f FILE','Read or write the named archive.'],['-C DIR','Change the directory used for following path processing.']],
    'Argument order matters for -C. Place it before the paths that should be interpreted relative to that directory.',
    'Would this command produce restored/docs/guide.txt?', 'No. The archive stores guide.txt without the docs prefix, so extraction creates restored/guide.txt.');
  add('tar','Exclude temporary files from a bundle','Package a small project while intentionally leaving scratch files out.',
    "mkdir package\nprintf 'keep\\n' > package/readme.txt\nprintf 'scratch\\n' > package/cache.tmp\ntar --exclude='*.tmp' -cf bundle.tar -C package .\nmkdir restored\ntar -xf bundle.tar -C restored\ncat restored/readme.txt\ntest ! -e restored/cache.tmp && printf 'temporary file excluded\\n'",'keep\ntemporary file excluded',[
      'The setup creates one file to keep and one scratch file ending in .tmp.',
      'GNU tar applies the quoted exclusion pattern while creating the archive. -C package and dot select the contents of that directory.',
      'After extraction into a fresh folder, cat shows the retained text. The negated existence test confirms that cache.tmp was not restored.'
    ],[["--exclude='*.tmp'",'GNU tar: exclude names matching the pattern.'],['-C package .','Archive entries under package using relative member paths.'],['test ! -e','Succeed when the named path does not exist.']],
    'Always list or inspect important archives. An exclusion pattern can omit more files than you intended.',
    'Does this exclusion remove package/cache.tmp from the original folder?', 'No. It only controls which members are written into the archive.');
  add('curl','Separate an HTTP status from the response body','Check the server’s status code while saving the downloaded content for inspection.',
    "curl -sS -L --max-time 10 -o response.html -w 'HTTP %{http_code}\\n' https://example.com",'HTTP 200',[
      '-o saves body bytes to response.html instead of sending them to stdout. -w prints the chosen transfer information after the request.',
      '%{http_code} is expanded by curl, not by the shell. With -L, it describes the final HTTP response after followed redirects.',
      'HTTP 200 is an illustrative successful reply. Network failure, redirects to a failing endpoint, or server changes can produce a different code or an error.'
    ],[['-sS','Hide progress but retain error messages.'],['-L','Follow redirects.'],['-o FILE','Store the body separately.'],['-w FORMAT','Print selected transfer information.'],['--max-time 10','Bound total transfer duration to ten seconds.']],
    'Without -f, many HTTP error responses are still successful transfers from curl’s perspective. The HTTP code and shell exit status answer different questions.',
    'Does an HTTP 404 necessarily mean curl could not contact the server?', 'No. A server can be reached successfully and respond that the requested resource was not found.',true);
  add('curl','Make HTTP failures visible to a script','Use a bounded request and keep success/failure handling explicit.',
    "if curl -fLsS --max-time 10 -o page.html https://example.com; then\n  printf 'download succeeded\\n'\nelse\n  printf 'download failed\\n'\nfi",'download succeeded',[
      '-f makes many HTTP responses with status 400 or higher produce a failing curl status, rather than treating their error body as an ordinary download.',
      'The if statement checks curl’s exit status directly. It prints only the chosen success or failure message from the script.',
      'The shown result assumes a successful transfer. A real failure can also print a curl diagnostic to stderr, which is not included in this success sample.'
    ],[['-f','Fail for many HTTP error responses; some authentication cases require extra care.'],['-L / -sS','Follow redirects / suppress progress while showing diagnostics.'],['if command','Select a branch from the command status.']],
    'A created destination file is not proof of a complete successful download. Use the command status and, when needed, independent content validation.',
    'Why does this test curl directly instead of checking whether page.html exists?', 'An existing or partially written file can be present after failure. The command status is the relevant first check.',true);
  add('loops','Rename practice files while preserving spaces','Apply the same naming change to several matching files.',
    "mkdir drafts\ntouch 'drafts/first note.txt' 'drafts/second note.txt'\nfor file in drafts/*.txt; do\n  mv -- \"$file\" \"${file%.txt}.bak\"\ndone\nls -1 drafts",'first note.bak\nsecond note.bak',[
      'The glob expands to two complete path arguments. A space inside each filename stays inside that argument at this stage.',
      'Inside the loop, quoted "$file" preserves the path when it is passed to mv. ${file%.txt} removes a matching trailing .txt, and .bak adds the new ending.',
      'Each practice file is renamed once. The final ls confirms the new names; file contents are unchanged.'
    ],[['for file in pattern','Visit each matched path.'],['${file%.txt}','Remove a matching shortest suffix pattern .txt.'],['mv --','Stop option parsing before the source and destination operands.']],
    'This example creates guaranteed matches. For general scripts, handle a glob that matches nothing and consider existing destination names before renaming.',
    'Why is quoting still necessary inside the loop?', 'The variable expansion can split on spaces if unquoted, even though the earlier glob produced intact filenames.');
  add('loops','Handle a final line without a newline','Read every record from a text file, including an unfinished last line.',
    "printf 'first\\nlast' > partial.txt\nwhile IFS= read -r line || [ -n \"$line\" ]; do\n  printf '[%s]\\n' \"$line\"\ndone < partial.txt",'[first]\n[last]',[
      'The setup intentionally ends the file with last and no newline. That makes the final read reach EOF before finding its usual line terminator.',
      'read still places the final text into line, but returns a failing status at that EOF. The OR test permits the loop body when the captured value is nonempty.',
      'The next read has no remaining data, so both conditions fail and the loop ends. Both actual records were printed exactly once.'
    ],[['IFS= read -r','Preserve spaces and backslashes while reading.'],['||','Try the right-hand condition if read returns nonzero.'],['[ -n "$line" ]','Check for a nonempty captured value.']],
    'A plain while read loop can skip processing a non-newline-terminated final record. Whether that case matters depends on the input format.',
    'What does wc -l report for partial.txt?', '1. It counts newline characters, and this file contains only the newline after first.');
  add('read','Read a simple comma-separated record','Assign individual fields to variables and display a clearer sentence.',
    "printf 'Ada,36,London\\n' > record.csv\nIFS=, read -r name age city < record.csv\nprintf '%s is %s and lives in %s.\\n' \"$name\" \"$age\" \"$city\"",'Ada is 36 and lives in London.',[
      'IFS=, sets the separator to a comma for this read invocation. The three variables receive the fields in order.',
      '-r preserves literal backslashes rather than interpreting them as escapes.',
      'The final printf quotes each variable independently and places them into a fixed sentence format. The commas were separators, so they are not included in the variable values.'
    ],[['IFS=,','Split this read on commas.'],['read -r name age city','Assign fields to three variables.'],['< record.csv','Read from the file rather than waiting for keyboard input.']],
    'This is only simple delimiter-separated input. Quoted commas in general CSV are not understood by read.',
    'Can this reliably parse a city written as "Washington, DC" in general CSV?', 'No. A CSV-aware parser is required to recognize that quoted comma as part of one field.');
  add('read','Keep a counter outside a reading loop','Count records while demonstrating why input redirection is useful for shell variables.',
    "count=0\nwhile IFS= read -r line; do\n  count=$((count + 1))\ndone < names.txt\nprintf 'records=%s\\n' \"$count\"",'records=4',[
      'count starts at zero. Each successful read supplies one newline-terminated record from names.txt.',
      '$((count + 1)) performs integer arithmetic in the shell. The body runs four times for the fixture.',
      'Redirecting the file into the loop lets it run in the current shell here, so count remains 4 afterward. A loop placed on the right side of a pipe often runs in a subshell instead.'
    ],[['$((...))','Shell integer arithmetic expansion.'],['done < file','Supply the file directly to the whole loop.'],['IFS= read -r','Read each line without trimming or escape interpretation.']],
    'This simple version assumes newline-terminated records, as provided by the fixture. Use the EOF-handling pattern in the loops lesson for a partial final line.',
    'Why might cat names.txt | while ... lose the counter afterward?', 'In common Bash behavior the pipeline loop runs in a separate subshell, so its variable updates do not modify the parent shell.');
  add('xargs','Handle an empty input stream deliberately','Prevent a command from running when there are no input items.',
    "printf '' | xargs -r printf 'unexpected\\n'\nprintf 'finished\\n'",'finished',[
      'The first printf emits zero bytes, so xargs receives no items.',
      'GNU -r means do not run the requested command if the input is empty. The word unexpected is therefore never printed.',
      'The final printf is outside the pipeline and runs normally, producing the only output line.'
    ],[['-r','GNU xargs: skip command execution for empty input.'],["printf ''",'Produce an empty input stream.']],
    'Default behavior for empty input and support for -r differ across xargs implementations. Check the tool on your platform.',
    'What can happen with GNU xargs if you remove -r here?', 'It can invoke printf once with no input items, causing unexpected to be printed before finished.');
  add('xargs','Preserve names with spaces when passing arguments','Build a small argument list with unambiguous separators.',
    "printf 'Ada Lovelace\\0Grace Hopper\\0' | xargs -0 -n1 printf 'Person: %s\\n'",'Person: Ada Lovelace\nPerson: Grace Hopper',[
      'The producer emits two names, each followed by a NUL byte. A NUL separator is different from a newline or a space.',
      '-0 tells xargs to split only at those NUL boundaries. The spaces inside the names therefore remain ordinary characters.',
      '-n1 runs the requested printf with one incoming name at a time. Each invocation writes one complete labeled name.'
    ],[['\\0','printf format escape producing a NUL separator.'],['-0','Read NUL-delimited input items.'],['-n1','Use at most one input item per invocation.']],
    'Using ordinary whitespace-separated input would divide each two-word name into separate arguments.',
    'Would the output change if you removed -n1 for this specific printf command?', 'It would still show both labeled names because printf reuses its format for extra arguments, but xargs could now pass both names in one invocation.');
  add('status','Avoid the false if/else shortcut','See why success followed by failure still triggers the command after OR.',
    "true && false || printf 'fallback ran\\n'\nif true; then\n  false\n  printf 'inside then\\n'\nelse\n  printf 'inside else\\n'\nfi",'fallback ran\ninside then',[
      'In the first line, true succeeds, so false runs. false then fails, which activates the command after ||.',
      'The explicit if chooses its branch based only on the condition true. It enters the then body.',
      'With ordinary Bash settings and no set -e, false inside that body does not switch to else. The next printf still runs inside then.'
    ],[['&&','Run the next command after success.'],['||','Run the next command after failure.'],['if / then / else / fi','Make the branch decision explicit.']],
    'A && B || C is not a reliable substitute for if A; then B; else C; fi when B can fail.',
    'In the first line, which command’s failure caused fallback to run?', 'false, the command after &&, failed. The original true condition had succeeded.');
  add('status','Capture a status before it is overwritten','Save the result of a command when you need to inspect it after printing another message.',
    "grep -q 'not-present' names.txt\nresult=$?\nprintf 'search finished\\n'\nprintf 'saved=%s current=%s\\n' \"$result\" \"$?\"",'search finished\nsaved=1 current=0',[
      'grep -q prints nothing and returns 1 because the pattern has no match in the practice file.',
      'The assignment immediately saves that status in result. The following printf succeeds and changes the current $? to zero.',
      'The last command expands both values before it runs: result still holds the earlier 1, while $? refers to the successful previous printf.'
    ],[['-q','Suppress grep output and use its status.'],['result=$?','Capture the previous status immediately.'],['"$result"','Use the saved value later without relying on the changing special variable.']],
    'Even a diagnostic echo or printf can overwrite $?. Save it before doing other work.',
    'Does grep status 1 mean the file could not be opened?', 'Not here. It means no matching lines were found. Read errors use a different nonzero status.');
  add('getopts','Parse options and keep the final filename','Separate script settings from a remaining positional operand.',
    "set -- -v -n Ada report.txt\nOPTIND=1\nverbose=no\nname=guest\nwhile getopts ':vn:' option; do\n  case \"$option\" in\n    v) verbose=yes ;;\n    n) name=$OPTARG ;;\n    :) printf 'missing value\\n'; exit 2 ;;\n    \\?) printf 'unknown option\\n'; exit 2 ;;\n  esac\ndone\nshift \"$((OPTIND - 1))\"\nprintf 'verbose=%s name=%s file=%s\\n' \"$verbose\" \"$name\" \"$1\"",'verbose=yes name=Ada file=report.txt',[
      'set -- creates a controlled argument list. In the option string, v is a switch and n: requires a value. The leading colon requests explicit error handling.',
      'The case branches update the appropriate variables. The error branches would stop with status 2, but this example supplies valid options.',
      'OPTIND tracks consumed arguments. Shifting OPTIND minus one leaves report.txt as the first positional operand, separate from the parsed settings.'
    ],[[':vn:','Silent error mode; boolean v; n requiring an argument.'],['OPTARG','Value supplied with the current option.'],['OPTIND','Index of the next argument to process.'],['shift N','Discard N positional arguments from the front.']],
    'A real script should also validate how many remaining operands exist before reading $1, especially if set -u is enabled.',
    'Which variable receives Ada while getopts processes -n?', 'OPTARG receives Ada. The n case then copies it into name.');
  add('getopts','Report a missing option value clearly','Handle an incomplete command line without relying on a cryptic automatic diagnostic.',
    "set -- -n\nOPTIND=1\nwhile getopts ':n:' option; do\n  case \"$option\" in\n    n) printf 'name=%s\\n' \"$OPTARG\" ;;\n    :) printf 'Option -%s needs a value\\n' \"$OPTARG\" ;;\n    \\?) printf 'Unknown option -%s\\n' \"$OPTARG\" ;;\n  esac\ndone",'Option -n needs a value',[
      'The argument list contains -n with nothing after it. The option string says n requires a value.',
      'Because the option string begins with a colon, getopts reports this case by putting : into option and the offending letter n into OPTARG.',
      'The colon case prints a message that explains what the user must supply. This demonstration reports the issue without deliberately exiting the shell.'
    ],[['Leading :','Suppress the builtin diagnostic and expose errors through the variables.'],['option = :','Missing required option value in silent error mode.'],['OPTARG','The offending option letter for this error.']],
    'A production script should return a failing exit status after invalid input. Printing an error message alone does not make the script fail.',
    'What would getopts report for -z with this option string?', 'The unknown-option case uses ? in option, with z in OPTARG, so the custom Unknown option message can identify it.');
  add('rsync','Exclude scratch data while copying a folder','Copy useful project files without including a temporary file.',
    "mkdir work backup\nprintf 'keep\\n' > work/readme.txt\nprintf 'scratch\\n' > work/cache.tmp\nrsync -a --exclude='*.tmp' work/ backup/\ncat backup/readme.txt\ntest ! -e backup/cache.tmp && printf 'cache not copied\\n'",'keep\ncache not copied',[
      'The source folder contains a retained text file and a temporary file. The destination is new and empty.',
      '-a requests recursive archive-style copying. The source trailing slash copies the contents, and --exclude skips names matching the temporary-file pattern.',
      'cat shows the retained content at its new location. The existence test confirms no cache.tmp was created in the destination.'
    ],[['-a','Recursive copy plus selected metadata.'],["--exclude='*.tmp'",'Skip matching names during this transfer.'],['work/','Copy the source contents directly into the destination.']],
    'Excluding a file does not automatically remove an old copy already present at the destination. This example deliberately starts with an empty backup folder.',
    'Does the source cache.tmp still exist after the copy?', 'Yes. rsync copied selected data and did not remove the original files.');
  add('rsync','Preview a missing file before actually copying it','Distinguish a dry run from a real transfer by checking the destination after each.',
    "mkdir backup\nrsync -an docs/ backup/\ntest ! -e backup/guide.txt && printf 'preview: absent\\n'\nrsync -a docs/ backup/\ncat backup/guide.txt",'preview: absent\nRead the manual.',[
      '-n performs a dry run. Without verbose or itemized flags it may show no plan text, but it still makes no file changes.',
      'The test confirms guide.txt has not appeared in backup. This is a direct check of the dry-run behavior.',
      'Removing -n performs the actual copy. The final cat succeeds and prints the file content from the destination.'
    ],[['-n','Plan without transferring or changing files.'],['-a','Use the same archive-style selection for preview and transfer.'],['test ! -e','Confirm that a destination path remains absent.']],
    'A preview is only a snapshot. Source data or destination state can change before the real transfer begins.',
    'How could you display the planned changes during the dry run?', 'Add -i for itemized changes or -v for verbose reporting, for example rsync -ani docs/ backup/.');
  add('mv','See what happens to the old filename','Rename a disposable copy and check both the old path and the new contents.',
    "cp docs/guide.txt draft.txt\nmv -- draft.txt final.txt\ntest ! -e draft.txt && printf 'old name is gone\\n'\ncat final.txt",'old name is gone\nRead the manual.',[
      'cp creates an independent practice copy. The original guide file remains available throughout the example.',
      'mv changes draft.txt to final.txt. -- ends option parsing so the following values are treated as path operands.',
      'The test confirms that the old name no longer exists. cat reads the new name and shows that the file content was preserved.'
    ],[['mv SOURCE DESTINATION','Move or rename from the first path to the second.'],['--','Stop parsing command options.'],['test ! -e','Check that the old path is absent.']],
    'mv can replace an existing destination. These examples use a fresh practice directory; check destination names in real work.',
    'Would cp draft.txt final.txt remove the old name?', 'No. cp creates a second copy, while mv changes the name or location.');
  add('mv','Move several files into a single folder','Use the final operand as the destination directory for multiple source files.',
    "mkdir inbox\nprintf 'one\\n' > first.txt\nprintf 'two\\n' > second.txt\nmv -- first.txt second.txt inbox/\nls -1 inbox\ncat inbox/first.txt inbox/second.txt",'first.txt\nsecond.txt\none\ntwo',[
      'The setup creates two small files and an empty destination directory.',
      'When mv receives multiple source operands, the final operand must be a suitable directory. Both original basenames are retained inside inbox.',
      'ls shows the moved names in the directory. cat then reads the files in the explicit operand order, so one appears before two.'
    ],[['first.txt second.txt','Two separate source arguments.'],['inbox/','Existing destination directory, placed last.'],['cat FILE1 FILE2','Concatenate contents in the listed order.']],
    'Do not assume multiple source files can be moved into one regular file. The destination must be a directory for this form.',
    'Which original paths disappear after the move?', 'first.txt and second.txt disappear from the original directory; the files now live under inbox/.');
  function attach(lessons){
    for(const [id,examples] of Object.entries(additions)){
      const lesson=lessons.find(l=>l.id===id);if(!lesson)throw new Error(`Unknown lesson: ${id}`);
      if(!lesson.examples.some(e=>e.collection==='deep'))lesson.examples.push(...examples);
    }
    return lessons;
  }
  if(typeof module!=='undefined')module.exports={additions,attach};else attach(root.UNIX_LESSONS);
})(typeof window==='undefined'?globalThis:window);
