/* Explicit command/option inventory for each worked answer. This does not parse or run shell code. */
(function(root){
  'use strict';
  const commands={
    awk:['Read text one line at a time, split it into columns, and apply the small program inside the quotes.',{'-F,':'Use a comma to separate input columns. Without this option, awk normally splits on spaces and tabs.'}],
    sort:['Put lines in order. Without flags, it sorts text in the chosen language/locale order.',{'-u':'Keep only one copy of each equal line.','-k3,3nr':'Sort by column 3 only: k chooses the column, n compares numbers, and r puts larger values first.','-t,':'Use commas to separate columns instead of whitespace.','-c':'Check whether input is already sorted; do not print a sorted copy.','-V':'Compare number parts in version names, so v2 comes before v10.'}],
    cut:['Take selected columns or characters from each line.',{'-d':'Use the following character as the column separator. A quoted space and a comma are different separators.','-f1':'Keep only the first column.'}],
    wc:['Count text. The flag chooses what to count.',{'-l':'Count newline characters. In these files, each completed line ends with one newline.','-c':'Count bytes. The examples sometimes print one byte per match to count matching files.'}],
    head:['Read the beginning of a file or incoming text.',{'-n':'Show the specified number of lines from the beginning. For example, -n1 or -n 1 means one line.'}],
    tail:['Read the end of a file, or start at a chosen line.',{'-n':'Show the specified number of final lines. For example, -n2 means the last two.','-n +2':'Start at line 2 and continue to the end. The plus sign changes this from a last-lines count.'}],
    grep:['Find lines that match the text or pattern you provide.',{'-n':'Show the original line number beside each result.','-C1':'Include one line before and after each matching line.','-F':'Treat the search text literally, rather than as a regular-expression pattern.','-x':'Require the whole line to match.','-q':'Do not print matches; report success or failure through the exit status.','-E':'Use extended regular-expression syntax, including + for one or more matches.'}],
    printf:['Print text using a format string. For example, %s inserts text and \\n starts a new line.',{}],
    sed:['Apply text-editing rules to incoming lines. The rule is the quoted argument after sed.',{'-E':'Use extended regular expressions, including parentheses for capture groups.','-n':'Do not print every line automatically. A p action in the rule chooses what to print.'}],
    tr:['Replace, remove or squeeze characters. The quoted character sets say what to change.',{'-s':'Replace each run of repeated characters from the chosen set with one copy.'}],
    nl:['Add line numbers to text.',{'-w1':'Use a minimum width of one character for the line number.','-s':'Use the following text as the separator between a number and its line.'}],
    cat:['Read file contents and print them in the order given. With no filename, read incoming text.',{'-A':'Show normally hidden characters: tabs as ^I and line endings as $.','--':'End option parsing. Any following value is treated as a filename, even if it starts with a dash.'}],
    fold:['Wrap text onto shorter lines.',{'-w4':'Use four display columns per output line for this ASCII example.'}],
    paste:['Join lines or columns of text.',{'-s':'Join successive lines from one file into a single line.','-d,':'Put commas between the joined pieces.'}],
    tac:['Print lines in reverse order: the last line becomes the first.',{}],
    expand:['Replace tabs with spaces.',{'-t4':'Use tab stops every four columns. The number of inserted spaces depends on the current position.'}],
    find:['Search a folder and its subfolders. Tests choose matching entries; actions choose what to do with them.',{'-type f':'Match ordinary files.','-type d':'Match folders.','-type l':'Match symbolic links themselves.','-empty':'Match empty files or folders; combine with -type to choose which.','-print':'Print each matching path followed by a newline.','-name':'Match the filename against the following pattern. Quote patterns such as *.conf so find receives them unchanged.','-printf':'Print the following format for each match. %P is a path without the starting folder, %f is the name alone, and \\n ends the line.','-mindepth':'Skip entries shallower than the following depth. Depth 1 excludes the starting folder itself.','-maxdepth':'Do not search deeper than the following depth. Depth 1 means direct children only.','-path':'Match the whole path against the following pattern.','-prune':'Do not search inside this folder.','-o':'OR: try the test/action on the right when the expression on the left is false.','-size +4c':'Match files strictly larger than four bytes. + means greater than, and c requests byte units.','-print0':'Separate paths with a NUL byte, so spaces and newlines inside filenames are not mistaken for separators.','-xtype l':'With this non-following search, identify links whose targets cannot be resolved, such as the broken sample link.','-perm -0002':'Match files with the other-user write bit set. The minus prefix requires all specified bits.','-perm /111':'Match files with at least one execute bit set. The slash prefix means any of the specified bits.'}],
    readlink:['Print the destination stored in a symbolic link. A relative destination is relative to the folder containing the link.',{}],
    realpath:['Resolve a path, including its links, to the file it refers to.',{'--relative-to=tree':'Print the result relative to the tree folder instead of as a full absolute path.'}],
    xargs:['Read a list of values and pass them as arguments to another command, such as cat.',{'-0':'Read NUL-separated items, keeping spaces and newlines inside each filename intact.','-r':'GNU option: do not run the command when the input list is empty.'}],
    ln:['Give a file another name. Without -s, create a hard link: both names refer to the same underlying file.',{'-s':'Create a symbolic link instead: a small reference containing the target path.'}],
    stat:['Show file information such as size, permissions or owner.',{'-c':'Use the following output format: %n = name, %s = byte size, %a = permission number, %u = owner ID, %g = group ID.'}],
    mkdir:['Create a folder.',{'-p':'Create missing parent folders too, and accept folders that already exist.','-m':'Set the new folder permission mode to the following value, such as 750.'}],
    test:['Check a condition and return success (0) or failure (nonzero). It normally prints nothing.',{'-d':'Check whether the path leads to a folder.','-e':'Check whether the path exists; a broken symbolic link does not pass this check.','-r':'Check whether the current user can read the path.','-f':'Check whether the path leads to an ordinary file.','-s':'Check whether the file has a size greater than zero.','-x':'Check whether the current user has execute access to the path.','!':'Reverse the following test: true becomes false, and false becomes true.'}],
    cp:['Copy a file or folder. The source comes first and the destination comes last.',{'--backup=numbered':'Keep a numbered backup of an existing destination before replacing it.','-R':'Copy folders and their contents recursively.','-p':'Try to preserve file mode, ownership and timestamps where the account and filesystem allow it.'}],
    mv:['Move or rename a file or folder. The final argument is the destination.',{'--':'End the flag list so following values are treated as paths.','-f':'Do not ask before overwriting; this does not bypass filesystem permissions.','-T':'Treat the destination as one path entry, not as a folder to move the source into. Useful when replacing a link.'}],
    ls:['List names inside a folder.',{'-1':'Print one name per line. This is the digit one, not a lowercase L.'}],
    touch:['Update a file’s timestamps. Normally creates an empty file if it is missing.',{'-c':'Do not create the file if it is missing.'}],
    rm:['Remove the named file. These examples name only their own practice files.',{'--':'End the options so the following value is a filename.','-f':'Do not prompt, and do not report an error just because the named file is already absent.'}],
    rmdir:['Remove a folder only if it is empty. It refuses to remove a folder with contents.',{}],
    cmp:['Compare two files byte for byte. Status 0 means equal, 1 means different, and 2 means trouble reading or comparing.',{'-s':'Stay silent and communicate the result using the exit status.'}],
    mktemp:['Create a temporary file with a unique name and print its path.',{'-d':'Create a temporary folder instead of a file.'}],
    diff:['Compare two text files. Status 0 means equal, 1 means different, and values above 1 indicate errors.',{'-q':'Give only a brief difference report rather than all changed lines.','-u':'Show a unified diff: - marks removed lines and + marks added lines, with nearby context.','--label':'Use the following text as an output label instead of the default filename/timestamp header.'}],
    chmod:['Change access permissions. Numeric modes use read=4, write=2 and execute=1; add these within each owner/group/other digit. For example, 640 means owner read+write, group read, others none.',{'--reference=secure/reference':'Take the permission mode from secure/reference instead of typing a numeric or symbolic mode.'}],
    umask:['Set which permission bits to remove when creating new files and folders. With no value, print the current mask. It does not change existing files.',{}],
    id:['Show the identity of the account running the command.',{'-u':'Select the effective user ID.','-G':'Select all group IDs for the current account.','-n':'Show names instead of ID numbers; used with -u or -G here.'}],
    '[':['Another form of the test command. Put spaces around its arguments and close it with ].',{'-n':'True when the following string is not empty.','-ge':'Integer greater than or equal to.','-le':'Integer less than or equal to.','-eq':'Integer equal to.','=':'Compare two strings for exact equality.'}],
    unset:['Remove a shell variable so it no longer has a value.',{}],
    false:['Return failure status 1 without printing anything. Used here to demonstrate error handling.',{}],
    true:['Return success status 0 without printing anything.',{}],
    read:['Read a line of text and store it in the following variable names. When several names are given, the last receives the remaining words.',{'-r':'Keep backslashes as ordinary characters instead of treating them as escapes.','-d':'Use the following delimiter instead of newline. An empty delimiter in these Bash examples means NUL.'}],
    set:['Change shell behavior or set the script’s positional arguments.',{'--':'End shell options and replace positional arguments with the values that follow. Thus -n after -- is data, not a set option.','-o pipefail':'Make a pipeline fail when an earlier stage fails; use the rightmost nonzero status.','-u':'Treat many attempts to use unset variables as errors. Explicit defaults can still handle optional values.','-e':'Exit on certain unhandled failures. Checks inside if and other tested contexts are exceptions; it is not a substitute for error handling.'}],
    getopts:['Read command-line options from positional arguments. In :n:, the n: means -n takes a value, stored in OPTARG. The initial colon lets the script handle errors itself.',{}],
    trap:['Register commands to run on an event. EXIT runs the quoted cleanup when this shell exits.',{}],
    exit:['End this shell or child script with the following status number. Zero means success; a nonzero number signals failure.',{}],
    timeout:['Run another command with a time limit. Here 0.1s is one tenth of a second; status 124 normally means the deadline was reached.',{}],
    sleep:['Wait for the specified time. A plain 5 means five seconds.',{}],
    break:['Leave the current loop immediately.',{}],
    shopt:['Change Bash-specific settings.',{'-s nullglob':'Enable nullglob: an unmatched filename pattern disappears instead of remaining as literal text.'}],
    bash:['Start a Bash shell to interpret commands.',{'-c':'Run the following quoted command string.'}],
    command:['Control or inspect how a command name is resolved by the shell.',{'-v':'Check how the shell would find the following command name. A nonzero status means it was not found.'}],
    ps:['Show a snapshot of running processes.',{'-e':'Select all visible processes.','-o':'Choose the output columns listed next. For example, pid is the process number, ppid is its parent number and comm is its short name.','-p':'Select the process with the following PID.','-L':'Show individual threads within the selected process.','--ppid':'Select direct children of the following parent PID.','--sort=pid':'Sort rows by process ID from smallest to largest.','--sort=-pcpu':'Put the largest recorded CPU percentages first.','--sort=-rss':'Put the largest resident-memory values first.'}],
    pgrep:['Find running processes whose name or command matches a pattern.',{'-x':'Match the complete name rather than part of it.','-a':'Include the full command line next to each PID.','-f':'Search the full command line instead of only the short process name.'}],
    top:['Display CPU, memory and process activity.',{'-b':'Use plain batch output rather than an interactive screen.','-n':'Stop after the specified number of display updates; -n 1 means one update.'}],
    pstree:['Draw parent/child relationships between processes as a tree.',{'-p':'Show process numbers beside names.'}],
    lsof:['List resources a process has open, including files and sockets.',{'-p':'Restrict the report to the following process number.'}],
    free:['Summarize memory and swap use.',{'-m':'Show sizes in mebibytes (MiB), commonly called MB in casual usage.'}],
    vmstat:['Report CPU, memory, swap and I/O activity. The arguments 1 2 mean a one-second interval and two reports; the first report generally summarizes since boot.',{}],
    uptime:['Show time since startup and the recent system load averages.',{}],
    ip:['Inspect Linux network addresses, routes, links or neighbors. The words after ip select which information to show.',{'-brief':'Use a shorter one-line-per-interface address display.','-s':'Include traffic statistics such as bytes, packets and errors.'}],
    ss:['Show socket information. A socket is an endpoint used by a program to communicate.',{'-l':'Show listening sockets.','-t':'Select TCP sockets.','-u':'Select UDP sockets.','-n':'Keep addresses and ports numeric instead of looking up their names.','-p':'Include owning process details where permissions allow.','-s':'Show a summary instead of one row per socket.'}],
    getent:['Query the computer’s configured lookup sources. The hosts argument requests hostname/address records.',{}],
    dig:['Ask DNS for records. A means IPv4 addresses; MX means mail servers. @ADDRESS chooses which DNS server receives the question.',{'+short':'Show compact answer information.','+noall':'Turn off the usual output sections.','+answer':'Show the answer section; used after +noall in this example.'}],
    ping:['Send network echo requests to check whether a destination replies. A blocked ping does not prove a website is unavailable.',{'-c':'Stop after sending the specified number of requests.','-W':'On Linux iputils, set the response-wait timeout in seconds. It is not a total whole-command deadline.'}],
    curl:['Make a request to a URL and print or save the response.',{'-I':'Request HTTP headers using HEAD rather than download a normal GET response body.','--max-time':'Limit the total request time to the following number of seconds.','-s':'Hide the progress meter and normal error display.','-S':'Show errors even with -s. Together -sS stays quiet except for errors.','-o':'Write the response body to the following file; /dev/null discards it.','-w':'Print the following format after the request. %{http_code} is the HTTP code, %{time_connect} and %{time_total} are seconds, and %{url_effective} is the final URL.','--fail':'Return a failure status for many HTTP error responses instead of treating them as successful transfers.','--silent':'Long form of -s: hide the progress meter and normal errors.','--show-error':'Long form of -S: retain error messages when silent mode is enabled.','-L':'Follow HTTP redirects to another URL.','--max-redirs':'Limit the number of redirect hops to the following number.'}],
    systemctl:['Ask systemd, the Linux service manager, about services and their settings.',{'--no-pager':'Print directly instead of opening a scrolling viewer.','--full':'Do not shorten long status lines.','--failed':'List units currently marked as failed.','-p':'Show only the following named property. Repeat -p to request several properties.','--value':'Print the property value without its name and equals sign.'}],
    journalctl:['Read messages stored in the systemd journal, a system log store.',{'-u':'Select messages associated with the following service/unit name.','-n':'Show at most the specified number of recent messages.','--no-pager':'Print directly without opening a scrolling viewer.','-b':'Without a value, select messages from the current system boot.','-p':'Select the following priority and more serious priorities. Warning includes warning and more severe messages.','--since':'Start at the following time, which may be an exact timestamp or text such as 10 minutes ago.','--until':'Stop at the following time.','-o':'Choose an output format: cat keeps message text only; json prints structured fields.','--list-boots':'List boots for which journal messages are available.','--disk-usage':'Show how much disk space the journal files occupy.'}],
    tar:['Put files into an archive, or read files already stored inside one.',{'-c':'Create a new archive.','-f':'Use the following archive filename. A dash as the filename reads/writes the archive through standard input/output.','-t':'List the names stored in the archive.','-x':'Extract files from the archive.','-C':'Change to the following folder before processing the following paths.','-z':'Use gzip compression while writing or reading the archive.','-O':'Write extracted file contents to the screen/output stream instead of restoring files on disk.','--exclude=*.tmp':'Skip names matching *.tmp. Quotes in the command stop the shell expanding this pattern first.','-r':'Append files to an existing uncompressed archive.','-d':'Compare archived files with the corresponding files on disk.','-T':'Read paths to include from the following list file.','--null':'Read the -T list as NUL-separated literal filenames rather than line-separated entries.'}],
    gzip:['Compress files or read gzip-compressed data.',{'-c':'Write the result to the output stream and leave the input file in place.','-d':'Decompress rather than compress.','-t':'Check the compressed stream for integrity without writing the restored file.'}],
    sha256sum:['Calculate a SHA-256 checksum from file bytes. Save trusted checksums to detect later changes.',{'-c':'Read the following checksum list and check the current files against it.'}],
    comm:['Compare two lists that are already sorted the same way. Its three columns mean first-file-only, second-file-only and shared.',{'-1':'Hide names found only in the first file.','-2':'Hide names found only in the second file.','-3':'Hide names found in both files.'}],
    join:['Match rows from two sorted files using their first column, then combine matching rows.',{'-a 1':'Also keep unmatched rows from file 1.','-e UNKNOWN':'Print UNKNOWN for missing selected output fields.','-o 0,2.2':'Print the join key (0) followed by column 2 from file 2 (2.2).'}],
    uniq:['Process equal adjacent lines. Sort first when equal lines may be separated.',{'-d':'Print one copy of each repeated group.','-u':'Print only lines that appear exactly once in their group.','-c':'Print each group’s count alongside its line.'}],
    cd:['Change the shell’s working folder. Relative paths in later commands start from there.',{}],
    export:['Make a variable available to commands started by this shell. LC_ALL=C selects consistent language/sorting rules for these examples.',{}],
    'show()':['Define and call the example’s show function. It prints each passed argument surrounded by angle brackets.',{}],
    'valid()':['Define and call the example’s valid function. It tests whether its first argument equals ready and returns that test’s status.',{}],
    './secure/check.sh':['Run the sample script by its path. The ./ means start in the current folder; the script prints ok.',{}]
  };
  // | separates commands here, ~ separates options. These are teaching labels, not runnable shell.
  const plans=[
    // 001–020
    'awk','awk','awk|sort','cut[-d~-f1]|sort[-u]','wc[-l]','sort[-k3,3nr]|head[-n]','awk','awk','awk','awk','head[-n]|tail[-n]','awk','awk|sort','awk','awk|tail[-n]','awk','awk|sort','awk','grep[-n~-C1]','awk',
    // 021–040
    'tail[-n +2]','awk[-F,]','awk[-F,]|sort','awk[-F,]|sort','awk[-F,]','tail[-n +2]|sort[-t,~-k3,3nr]','awk[-F,]','tail[-n +2]|cut[-d~-f1]|sort[-u]|wc[-l]','awk[-F,]','awk[-F,]','awk[-F,]','awk[-F,]','awk[-F,]','awk[-F,]','tail[-n +2]|cut[-d~-f1]|sort|uniq[-d]','awk[-F,]','awk[-F,]','awk[-F,]','awk[-F,]|sort','head[-n]|grep[-F~-x]|printf',
    // 041–060
    'printf|sed','printf|sed','printf|sed','printf|sed','printf|tr','printf|tr[-s]','printf|tr','printf|sed[-E]','printf|sed','printf|nl[-w1~-s]','printf|cat[-A]','printf|fold[-w4]','printf|paste[-s~-d,]','printf|sed[-n]','printf|sed','printf|tr','printf|sed','printf|grep[-E]','printf|tac','printf|expand[-t4]',
    // 061–080
    'find[-type f~-print]|sort','find[-type f~-empty~-print]|sort','find[-type d~-empty~-print]','find[-type l~-print]','readlink','find[-type f~-name~-print]|sort','find[-type f~-name~-print]','find[-type f~-printf]|wc[-c]','find[-mindepth~-maxdepth~-type d~-print]|sort','find[-path~-prune~-o~-type f~-print]|sort','find[-type f~-size +4c~-print]|sort','find[-type f~-printf]|sort','find[-name~-print]','realpath[--relative-to=tree]','find[-type f~-name~-o~-print]|sort','find[-type f~-print0]|xargs[-0~-r]|cat','ln[-s]|find[-xtype l~-print]','stat[-c]','find[-mindepth~-type f~-print]|sort','find[-type d~-printf]|sort',
    // 081–100
    'mkdir[-p]|test[-d]|printf','cp|printf|cat','cp|mv|ls[-1]','printf|cp[--backup=numbered]|cat','printf|cat','printf|cat','touch|rm[--]|test[!~-e]|printf','mkdir|rmdir|test[!~-d]|printf','ln[-s]|cat','ln|printf|cat','touch|mv[--]|ls[-1]','cp|cmp[-s]|printf','touch|cat','printf|mkdir|mv|ls[-1]','mktemp|printf|cat|rm[--]','printf|mv[-f]|cat','mkdir|printf|cp[-R]|cat','touch[-c]|test[!~-e]|printf','printf|diff','chmod|cp[-p]|stat[-c]',
    // 101–120
    'chmod|stat[-c]','chmod|stat[-c]','chmod|stat[-c]','mkdir[-m]|stat[-c]','chmod|stat[-c]','chmod|stat[-c]','printf|chmod|./secure/check.sh','umask|touch|stat[-c]','umask|touch|stat[-c]','umask','chmod|umask|stat[-c]','chmod|find[-type f~-perm -0002~-printf]','chmod|find[-type f~-perm /111~-printf]','touch|chmod[--reference=secure/reference]|stat[-c]','mkdir|chmod|stat[-c]','stat[-c]','id[-u~-n]','id[-G~-n]','test[-r]|printf','chmod|cat',
    // 121–140
    '[[-n]|printf','unset|printf','printf','printf','printf','[[-ge]|printf','false|printf','test[-f]|printf','printf|test[-s]','printf','printf|read[-r]','printf|read[-r]','printf|read[-r]|[[-n]','printf','printf','printf','printf','show()|printf','valid()|[[=]|printf','set[--]|getopts|printf',
    // 141–160
    'set[-o pipefail]|false|cat|printf','false|true|printf','set[-u]|unset|printf','set[-e]|false|printf','mktemp|exit|trap|rm[-f~--]|printf','timeout|sleep|printf','[[-le~-eq]|printf|break','printf|find[-type f~-print0]|read[-r~-d]|cat[--]','shopt[-s nullglob]|printf','bash[-c]|printf|cat','bash[-c]|printf|cat','printf','printf|sort|mv[--]|cat','printf|read[-r]','printf','command[-v]|printf','printf|read[-r]|[[-ge]|break','bash[-c]|printf|exit','set[--]|printf','printf|read[-r]',
    // 161–180
    'ps[-e~-o~--sort=pid]|head[-n]','pgrep[-x]','pgrep[-a~-f]','ps[-p~-o]','ps[-e~-o~--sort=-pcpu]|head[-n]','ps[-e~-o~--sort=-rss]|head[-n]','ps[-L~-p~-o]','top[-b~-n]','ps[--ppid~-o]','pstree[-p]','readlink','readlink','lsof[-p]|head[-n]','cat','find[-mindepth~-maxdepth~-printf]|wc[-c]','ps[-e~-o]|awk','ps[-p~-o]','free[-m]','vmstat','uptime',
    // 181–200
    'ip[-brief]','ip','ip','ss[-l~-t~-n]','ss[-l~-t~-n~-p]','ss[-t~-n]','ss[-l~-u~-n]','getent','dig[+short]','dig[+short]','dig[+noall~+answer]','ping[-c~-W]','curl[-I~--max-time]','curl[-s~-S~-o~-w~--max-time]','curl[--fail~--silent~--show-error~--max-time]','curl[-s~-S~-o~--max-time~-w]','curl[-s~-S~-L~--max-redirs~--max-time~-o~-w]','ip[-s]','ip','ss[-s]',
    // 201–220
    'systemctl[--no-pager~--full]','systemctl','systemctl','systemctl[--no-pager~--failed]','systemctl','systemctl[-p]','systemctl[-p~--value]','systemctl[-p]','systemctl[-p]','systemctl[-p]','systemctl[--no-pager]','journalctl[-u~-n~--no-pager]','journalctl[-u~-b~--no-pager]','journalctl[-u~-p~-n~--no-pager]','journalctl[-u~--since~--no-pager]','journalctl[-u~--since~--until~--no-pager]','journalctl[-u~-n~-o~--no-pager]','journalctl[-u~-n~-o~--no-pager]','journalctl[--list-boots~--no-pager]','journalctl[--disk-usage]',
    // 221–240
    'tar[-c~-f~-t]','tar[-c~-f~-x~-C]|mkdir|cat','tar[-c~-z~-f~-t]','tar[-c~-f~-x~-C]|mkdir|find[-type f]','tar[-c~-f~-x~-O]','tar[-c~-f~-C~-t]','printf|tar[--exclude=*.tmp~-c~-f~-t]','tar[-c~-f~-r~-t]','tar[-c~-f~-d]|printf','gzip[-c~-d]|cat','gzip[-c~-t]|printf','sha256sum[-c]','tar[-c~-f~-x~-C]|mkdir|cmp[-s]|printf','tar[-c~-f~-x~-C]|mkdir|cat','tar[-c~-z~-f~-t]|set[-o pipefail]|gzip[-d~-c]','printf|tar[-c~-f~-T~-t]','printf|tar[-c~-f~--null~-T~-t]','umask|tar[-c~-f]|stat[-c]','tar[-c~-f~-x~-O]|grep[-F~-x]','tar[-c~-f~-t]|wc[-l]',
    // 241–260
    'comm[-1~-2]','comm[-2~-3]','comm[-1~-3]','sort[-u]','comm[-1~-2]|wc[-l]','cmp[-s]|printf','diff[-q]|printf','printf|sort[-u]|comm[-2~-3]','comm[-3]|sed','comm[-2~-3~-1]|sed','printf|join','printf|join[-a 1]','printf|join[-a 1~-e UNKNOWN~-o 0,2.2]','printf|sort|uniq[-d]','printf|sort|uniq[-u]','sort[-c]|printf','printf|tr|cmp[-s]','printf|diff[-q]|sort','printf|awk','comm[-2~-3~-1]|wc[-l]|printf',
    // 261–280
    'readlink','cat','grep[-F~-x]','ln[-s]|mv[-T~-f]|readlink','ln[-s]|mv[-T~-f]|cat','mkdir|test[-s]|printf','diff[--label~-u]|printf','cd|sha256sum[-c]','tar[-c~-f~-C~-t]','mkdir|cp[-R]|cat','test[-d]|printf','find[-mindepth~-maxdepth~-type d~-printf]|sort','printf','printf|sort[-V]','printf|chmod|test[-x]','printf|cat','readlink|cat','mkdir|printf','mkdir|cp|cmp[-s]|printf','grep[-F~-x~-q]|ln[-s]|mv[-T~-f]|cat',
    // 281–300
    'awk','awk','awk','awk|sort','awk|sort[-u]','awk|sort|uniq[-c]','awk','awk','awk','awk','awk','awk|wc[-l]','awk','awk','printf|sed[-E]','sha256sum[-c]','test[-s]|printf','awk|sort','awk','mkdir|cp|tar[-c~-f~-t]'
  ];
  function describe(plan){return plan.split('|').map(entry=>{
    // The test command is literally named "["; its option wrapper therefore starts with "[[".
    const at=entry.indexOf('[',entry.startsWith('[')?1:0), name=at<0?entry:entry.slice(0,at), keys=at<0?[]:entry.slice(at+1,-1).split('~');
    const definition=commands[name];if(!definition)throw Error(`Missing command explanation: ${entry}`);
    return {name,meaning:definition[0],flags:keys.map(flag=>{if(!definition[1][flag])throw Error(`Missing flag explanation: ${name} ${flag}`);return {flag,meaning:definition[1][flag]};})};
  });}
  function syntax(code){
    const entries=[];
    const add=(symbol,meaning)=>{if(!entries.some(e=>e.symbol===symbol))entries.push({symbol,meaning});};
    // Ignore quoted text when finding shell operators: awk's > is a comparison, not a file redirection.
    const outside=code.replace(/'[^']*'|"(?:\\.|[^"\\])*"/gs,' ');
    if(/(?<!\|)\|(?!\|)/.test(outside)&&!/^\s*case\b/m.test(outside))add('|','Pipe: send the output of the command on the left into the command on the right.');
    if(outside.includes('&&'))add('&&','Run the next command only if the previous command succeeded (exit status 0).');
    if(outside.includes('||'))add('||','Run the next command only if the previous command failed (a nonzero exit status).');
    if(outside.includes('>>'))add('>> file','Add output to the end of a file instead of replacing its existing contents.');
    if(/(?<![\d>])>(?![>&])/.test(outside))add('> file','Write normal output into a file. Create it if missing; replace its existing contents if present.');
    if(/(?<![<])<(?![<(])/.test(outside))add('< file','Read input from a file instead of from the keyboard.');
    if(/2>(?!&)/.test(code))add('2> file','Send error messages to the named file. Normal output is a different stream unless separately redirected.');
    if(code.includes('2>&1'))add('2>&1','Send error messages to the same destination as normal output at this point in the command. Redirection order matters.');
    if(code.includes('>&2'))add('>&2','Send this output to the error-message stream instead of the normal-output stream.');
    if(code.includes('/dev/null'))add('/dev/null','A special destination that discards data. Redirecting to it hides output without changing success/failure status.');
    if(code.includes('$?'))add('$?','The most recent command’s exit status: 0 means success; another number usually means a failure or special result. Save it before another command replaces it.');
    if(/\$\((?!\()/.test(code)&&!code.includes('$(printf hacked)'))add('$(command)','Run a command and use its printed output as a value. Trailing newline characters are removed.');
    if(code.includes('$(('))add('$((expression))','Calculate whole-number arithmetic, such as adding one to a counter.');
    if(outside.includes('<('))add('<(command)','Bash process substitution: let another command read this command’s output as though it were a file.');
    if(/\bif\b/.test(outside))add('if …; then …; else …; fi','Choose what to do based on a command’s success or failure. The else part is optional; fi ends the choice.');
    if(/\bwhile\b/.test(outside))add('while …; do …; done','Repeat the commands while the check at the start succeeds. Done marks the end of the loop.');
    if(/\bfor\b/.test(outside))add('for …; do …; done','Repeat the commands once for each value in the list. The loop variable holds the current value.');
    if(outside.includes(';'))add(';','End one shell instruction and start the next. Unlike &&, a semicolon does not require the first command to succeed.');
    if(/^[a-zA-Z_][\w]*=/m.test(code))add('name=value','Store a value in a shell variable, with no spaces around =. Later, $name reads that value.');
    if(/\bcase\b/.test(outside))add('case … in … esac','Choose a branch by matching a value against patterns. Here | separates alternative patterns, ;; ends a branch, and * matches any remaining value.');
    if(code.includes('IFS='))add('IFS=','For read here, an empty field-separator setting prevents trimming leading or trailing spaces.');
    if(code.includes('"$@"'))add('"$@"','Pass every positional argument separately, preserving spaces inside each argument.');
    if(code.includes('$#'))add('$#','The number of positional arguments passed to this shell or function.');
    if(code.includes('${'))add('${…}','Expand a variable with an extra rule. :- uses a default for missing or empty values; - uses a default only if missing; % removes a suffix; # or ## removes a prefix (shortest or longest match).');
    if(code.includes('[@]')||code.includes('[*]'))add('Bash array values','An array holds a list. Quoted ${name[@]} keeps separate items; ${name[*]} joins items into one word when double-quoted. ${#name[@]} counts items.');
    if(code.includes('PIPESTATUS'))add('PIPESTATUS','Bash’s list of exit statuses from the most recent pipeline, one per stage. Copy it immediately before another command changes it.');
    if(code.includes('OPTIND'))add('OPTIND and OPTARG','OPTIND tracks getopts progress; reset it to 1 for a fresh parse. OPTARG contains the value supplied for the current option.');
    if(code.includes('$\''))add("$'…'",'Bash quoting that interprets escapes. For example, \\n becomes a real newline inside the value.');
    if(/^\(/m.test(code))add('( commands )','Run this group in a subshell so settings such as umask or traps do not change the parent shell.');
    if(/\b(?:g\+r|o-rwx|g-w|u\+x)\b/.test(code))add('Symbolic chmod modes','u means owner, g means group, o means other users; + adds a bit and - removes it. r means read, w means write and x means execute (or enter a folder).');
    if(/\bchmod 1777\b/.test(code))add('1777','The leading 1 adds the sticky bit: it restricts who can remove or rename entries inside a shared folder. The remaining 777 gives read/write/execute bits to all three classes.');
    if(code.includes('\\('))add('\\( … \\)','Group find tests together. Backslashes keep the shell from interpreting the parentheses itself.');
    if(code.includes('printf')){
      if(code.includes('\\n'))add('\\n','In a printf format string, print a newline so following text starts on another line.');
      if(code.includes('%s'))add('%s','A printf placeholder for a string. The next value is inserted as text, not as a new command.');
      if(code.includes('%d'))add('%d','A printf placeholder for a whole number.');
      if(/%\.\df/.test(code))add('%.1f / %.2f','Printf formats a number with one or two digits after the decimal point. %% prints a literal percent sign.');
      if(code.includes('%-8s'))add('%-8s and %5d / %5s','Use minimum field widths to line up columns. A minus sign left-aligns; without it, the value is right-aligned.');
      if(code.includes('\\t'))add('\\t','A tab character used to separate or align text.');
      if(code.includes('\\r'))add('\\r','A carriage-return character. Windows-style text lines often end with \\r\\n rather than only \\n.');
      if(code.includes('\\0'))add('\\0','Printf writes a NUL byte. Here it separates filenames unambiguously, even when a filename contains a newline.');
    }
    const awkPrograms=[...code.matchAll(/\bawk(?:\s+-F,)?\s+'([^']*)'/g)].map(m=>m[1]).join('\n');
    if(awkPrograms){
      add('condition { action } (awk)','Test each input line, then run the action for matching lines. A condition with no action prints matching lines; an action with no condition runs for every line.');
      for(let n=0;n<=6;n++)if(new RegExp('\\$'+n+'(?![0-9])').test(awkPrograms))add('$'+n+' (awk)',n===0?'The entire current input line.':`Column ${n} of the current input line. Columns are split using awk’s input separator.`);
      const terms=[['NR','The number of input lines read so far, across all files.'],['FNR','The line number within the current file; it starts over for each new file.'],['NF','How many columns the current line contains.'],['OFS','The text awk places between values printed with commas.'],['BEGIN','Run this block before reading the first input line.'],['END','Run this block after reading all input lines; often used to print a total.'],['next','Skip the rest of the program for this input line and move to the next line.'],['print','Print the listed values; with no values, print the entire current line.'],['printf','Print with a chosen format; unlike print, it does not add a newline automatically.'],['exit','Stop reading input. Any END block still runs.'],['int','Drop the fractional part of a number, such as turning 503/100 into 5.'],['sub','Replace the first match in the given string; here it removes a trailing percent sign.']];
      for(const [term,meaning] of terms)if(new RegExp('\\b'+term+'\\b').test(awkPrograms))add(term+' (awk)',meaning);
      if(awkPrograms.includes('++'))add('++ (awk)','Add one to a counter, for example n++ for each matching line.');
      if(awkPrograms.includes('+='))add('+= (awk)','Add the value on the right to the saved total on the left.');
      if(/\w+\[[^\]]+\]/.test(awkPrograms))add('name[key] (awk)','Store or read a value under a label. For example, n["api"] can hold a count for api. ++ after it increases that label’s count.');
      if(awkPrograms.includes('for'))add('for (key in name) (awk)','Visit the saved labels one by one. Their order is not guaranteed; use sort afterward when a stable order matters.');
      if(/[<>=!]/.test(awkPrograms))add('Comparisons (awk)','== means equal, != means not equal, > and < compare values, and >= or <= include equality. A single = stores a value instead of comparing it.');
      if(awkPrograms.includes('&&')||awkPrograms.includes('||'))add('&& / || (awk)','Inside the quoted awk program, && requires both conditions; || accepts either condition. These are not shell command separators here.');
      if(awkPrograms.includes('~'))add('~ / !~ (awk)','Check whether text matches a regular-expression pattern. !~ means it does not match.');
      if(awkPrograms.includes('?'))add('condition ? yes : no (awk)','Choose the value after ? when the condition is true; otherwise choose the value after the colon.');
      if(awkPrograms.includes('key=$1 "/" $2'))add('key=$1 "/" $2','Join column 1, a slash and column 2 into a label such as api/200. Count each resulting label separately.');
    }
    const sedPrograms=[...code.matchAll(/\bsed(?:\s+-[En])?\s+'([^']*)'/g)].map(m=>m[1]).join('\n');
    if(sedPrograms){
      if(sedPrograms.includes('s/'))add('s/pattern/replacement/ (sed)','Replace the first matching text on a line. A final g repeats the replacement for every match on that line. An empty replacement removes the matched text.');
      if(/\/d(?:;|$)|(?:^|;)(?:\d+|\$)d(?:;|$)/.test(sedPrograms))add('d action (sed)','Delete a selected line from the output. It does not delete the source file.');
      if(sedPrograms.endsWith('p'))add('p action (sed)','Print the selected line. With -n, only explicitly printed lines appear.');
      if(sedPrograms.includes('1d;$d'))add('1d;$d (sed)','Delete the first line and the last line. The semicolon separates two editing instructions.');
      if(sedPrograms.includes('\\1'))add('\\1 (sed replacement)','Insert the text captured by the first parenthesized group in the pattern.');
    }
    if(code.includes('[:space:]'))add('[:space:]','A character class matching whitespace such as spaces and tabs.');
    if(code.includes('[:upper:]')||code.includes('[:lower:]'))add('[:upper:] / [:lower:]','Character classes for uppercase and lowercase letters. Tr maps one class to the other in these examples.');
    if(/\b(?:grep|sed)\b/.test(outside)&&/[\^$]/.test(code))add('^ and $ in a pattern','^ anchors a match to the start of a line; $ anchors it to the end. They help avoid matching text in the wrong position.');
    if(code.includes("'"))add('Single quotes','Usually keep the shell from interpreting the enclosed text. A tool such as awk, sed or printf then interprets that text according to its own rules.');
    if(code.includes('"$'))add('Double quotes around a variable','Keep a value together as one argument, including any spaces or wildcard characters inside it.');
    return entries;
  }
  const subcommands={
    181:['address show','List addresses assigned to network interfaces.'],182:['route show','List the current routes used to send network traffic.'],183:['route get ADDRESS','Ask which route and source address would be chosen for that destination.'],186:['state established / dport = :443','Keep established connections whose destination port is 443. The quoted parentheses group the socket filter.'],188:['hosts','Look up hostname/address records using the system’s configured name services.'],198:['link show dev eth0','Inspect the network link named eth0. Dev selects that device.'],199:['neigh show dev eth0','Show the neighbor-address table for the device named eth0.'],
    201:['status','Show the service’s current state and recent details.'],202:['is-active','Report whether the service is currently active.'],203:['is-enabled','Report whether startup enablement has been configured.'],205:['cat','Print the service’s unit file and any extra override files.'],206:['show','Print named service properties in a form suitable for scripts.'],207:['show','Read the MainPID property; a value of 0 may mean no main process exists.'],208:['show','Read the restart policy and automatic restart counter.'],209:['show','Read the configured working folder.'],210:['show','Read the configured user and group.'],211:['list-dependencies','List the service’s dependencies as a tree.']
  };
  function attach(questions){
    if(plans.length!==300)throw Error(`Expected 300 command plans, found ${plans.length}`);
    questions.forEach((q,i)=>{q.commands=describe(plans[i]);q.commandSyntax=syntax(q.code);
      if(subcommands[i+1]){const [symbol,meaning]=subcommands[i+1];q.commandSyntax.unshift({symbol,meaning});}
      q.setupCommands=q.variable&&!q.setup?[]:describe('mktemp[-d]|cd|export');
      if(q.setup){
        const setupPlans=[];
        if(/^cat /m.test(q.setup))setupPlans.push('cat');
        if(/^mkdir /m.test(q.setup))setupPlans.push(q.setup.includes('mkdir -p')?'mkdir[-p]':'mkdir');
        if(/^printf /m.test(q.setup))setupPlans.push('printf');
        if(/^touch /m.test(q.setup))setupPlans.push('touch');
        if(/^ln -s /m.test(q.setup))setupPlans.push('ln[-s]');
        if(setupPlans.length)q.setupCommands.push(...describe(setupPlans.join('|')));
      }
    });return questions;
  }
  root.UnixIndustryCommands={attach};
  if(typeof module!=='undefined')module.exports={attach,commands,plans};
})(typeof window==='undefined'?globalThis:window);
