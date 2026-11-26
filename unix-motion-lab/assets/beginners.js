/* Plain-language introductions and authored walkthroughs for every first example.
   Kept separate from command references so both can be maintained clearly. */
(function(root){
  'use strict';
  const rows = [
    ['shell','A shell is a program that reads what you type and decides what to run. The terminal is the window where you type and read the answer.','Start here before trying any other command.',[
      'printf is the name of the command. It writes text to the screen.',
      "The quoted text '%s\\n' tells printf how to display the next value: %s means text, and \\n means start a new line.",
      'hello is the value to print. The result is hello on its own line. The quotes are instructions for the shell; they are not printed.'
    ]],
    ['help','You do not need to memorize every command. Help pages are instructions you can look up whenever you need them.','Use this when you do not recognize a command or want to check an option.',[
      'command -v asks the shell how it would find a name. It does not run that command.',
      'cd is the name we ask about. The reply cd tells us the shell knows this command internally.',
      'For something installed as a separate program, the answer is often a full path such as /usr/bin/sort.'
    ]],
    ['pwd','Your shell always works from one folder at a time. pwd tells you which folder that is.','Use it when you feel lost or before running a command that changes files.',[
      'Type pwd and press Enter. There are no options or filenames in this example.',
      'Read the answer from left to right: each slash separates a folder name.',
      'The leading slash means the path starts at the top of the filesystem. Your own answer will depend on where you are.'
    ]],
    ['cd','cd moves your shell into a different folder. It does not move the folder or its files.','Use it before working with files in another folder.',[
      'cd docs moves into the docs folder inside your current folder.',
      'ls -1 lists the names there, one per line. That is why guide.txt appears.',
      'cd .. returns to the parent folder, meaning the folder one level above. A successful cd normally prints nothing.'
    ]],
    ['ls','ls shows the names inside a folder. Think of it as asking “what is here?”','Use it to find filenames before you open, copy or inspect them.',[
      'ls is the listing command. docs is the folder to inspect.',
      'The option -1 is the digit one. It asks for one name on each output line.',
      'The example folder contains guide.txt, so that is the only name printed. The file content is not shown.'
    ]],
    ['mkdir','A directory is the Unix word for a folder. mkdir creates folders; rmdir removes empty folders.','Use this to organize new work into its own folder.',[
      'work/notes describes a notes folder inside a work folder.',
      'mkdir -p creates missing folders along that path. If work already exists as a folder, that is fine.',
      'ls -1 work then checks what was created. It prints notes, because notes is now inside work.'
    ]],
    ['touch','touch can create a blank file. If the file already exists, it updates time information without clearing the contents.','Use it to make an empty practice file or update a file’s timestamps.',[
      'touch fresh.txt creates a new, empty file with that name.',
      'wc -c counts bytes, which are units used to store file data.',
      '< fresh.txt gives the file to wc as input. The answer 0 means the file has no data bytes yet.'
    ]],
    ['cp','cp makes another copy of a file. You keep the original as well as the new copy.','Use it when you want a backup or a separate version to edit.',[
      'The first path, docs/guide.txt, is the source: the file to copy from.',
      'The second path, copy.txt, is the destination: the new file to create.',
      'cp normally prints nothing when it succeeds. cat copy.txt reads the new file so you can see the copied text.'
    ]],
    ['mv','mv changes a file’s name or location. Unlike cp, it does not leave a second copy at the old location.','Use it to rename a file or move it into another folder.',[
      'cp first creates old.txt as a practice copy, leaving names.txt untouched.',
      'mv old.txt new.txt changes the practice copy’s name from old.txt to new.txt.',
      'cat new.txt shows that renaming did not change the text stored inside.'
    ]],
    ['rm','rm removes a file’s name from the filesystem. It normally does not put the file into a trash bin.','Use it only for files you have identified and are ready to remove.',[
      'touch creates a disposable file just for this example.',
      'rm removes that exact file. It does not remove other files in the folder.',
      'test ! -e checks that the path does not exist. && runs the final printf only when that check succeeds.'
    ]],
    ['ln','A link gives you another way to reach a file. A symbolic link stores a path to a target, rather than a separate copy of its contents.','Use a symbolic link when you want a convenient name that points to another location.',[
      '-s asks ln to make a symbolic link.',
      'docs/guide.txt is the target and guide-link is the new link name. The order matters.',
      'readlink guide-link prints the path stored in the link. It shows where the link points, not what the target file contains.'
    ]],
    ['cat','cat reads file data and writes it to the screen. It can also put several files together in order.','Use it to read a short text file quickly.',[
      'names.txt is the file we want to read. It already exists in the practice setup.',
      'cat reads it from beginning to end and prints the four lines in the same order.',
      'Nothing is sorted, removed or saved to a new file by this command. The repeated Ada line stays repeated.'
    ]],
    ['less','less lets you move through a file a screen at a time, instead of letting all the text rush past.','Use it when a file is too long to read comfortably with cat.',[
      'less names.txt opens the file in a scrollable text viewer.',
      'Use Space to move forward, b to move back, or / followed by a word to search.',
      'The screen marker (END) means you reached the end. Press q to close the viewer and return to your shell.'
    ]],
    ['head-tail','head shows the beginning of a file. tail shows the end. Neither changes the file.','Use them to check a few records without printing a large file.',[
      'head is the command for the beginning of a file.',
      '-n 2 means “show two lines.” The 2 belongs to the -n option; it is not a filename.',
      'names.txt supplies the data. Its first two lines are Ada and Linus, so only those are printed.'
    ]],
    ['wc','wc counts things in text, such as lines, words or bytes. It gives you numbers instead of the file’s contents.','Use it when you want to know how many records or words a file contains.',[
      '-l is a lowercase L and asks wc to count newline characters.',
      '< names.txt sends the file into the command. Because the input is redirected, the filename is not included in the answer.',
      'The practice file has four newline-terminated lines, so the result is 4.'
    ]],
    ['file-stat','file guesses what kind of data is inside a file. stat reports details such as its byte size, permissions and timestamps.','Use these when a filename alone does not tell you enough about a file.',[
      'file looks at names.txt to identify the type of data.',
      '-b means brief: leave the filename prefix out of the printed description.',
      'ASCII text means this example contains ordinary text characters. The precise description can vary with the installed file program.'
    ]],
    ['grep','grep keeps the lines that contain the text or pattern you ask for. It leaves the original file alone.','Use it to find a name in a list or an error in a log file.',[
      'ERROR is the search pattern. Quotes keep the shell from interpreting the pattern first.',
      'logs.txt is the file to search. -n asks grep to add the original line number to each result.',
      '2:ERROR disk means the matching text came from line 2. The second result came from line 4. Other lines are left out.'
    ]],
    ['regex','A regular expression is a small language for describing a text pattern, such as “starts with ERROR.”','Use it when searching for a pattern rather than one exact piece of text.',[
      'grep -E enables extended regular-expression syntax.',
      'In the quoted pattern ^ERROR, the ^ symbol means the beginning of a line.',
      'Both error lines start with ERROR. A line with ERROR only in the middle would not match this particular pattern.'
    ]],
    ['find','find walks through folders and tests the names or properties of the files it discovers.','Use it when you know something about a file but do not know its exact location.',[
      'docs is where the search starts. find may also visit folders inside it.',
      '-type f means regular files only. -name asks for a filename pattern.',
      "'*.txt' means names ending in .txt. Keep it quoted so find, rather than the shell, handles the pattern. The output is the matching path."
    ]],
    ['sort','sort rearranges lines into an order. By default it compares text; options let it compare numbers instead.','Use it before removing separated duplicates or when you want an ordered report.',[
      'sort reads the lines from names.txt.',
      'The practice setup uses the C locale, which makes ordering predictable for these simple names.',
      'Ada comes first and both copies remain. Sorting alone does not remove duplicates.'
    ]],
    ['uniq','uniq notices repeated lines only when they are next to each other.','Use sort followed by uniq when you want one copy of each distinct text line.',[
      'uniq reads names.txt in its existing order.',
      'The first Ada is followed by Linus, not by another Ada. The second Ada is a separate group.',
      'No neighboring lines are identical, so every line is printed. This explains why sorting first can be necessary.'
    ]],
    ['cut','cut keeps selected columns or positions from each line. A delimiter is the character that separates fields, such as a comma.','Use it for simple rows with a consistent separator.',[
      '-d, tells cut that commas separate fields.',
      '-f1 means keep the first field on every line. Field counting starts at 1.',
      'The header is also a line, so name appears before Ada, Linus and Grace. cut does not automatically know which row is a header.'
    ]],
    ['tr','tr changes or removes individual characters as text passes through it.','Use it for simple character changes such as converting letters to uppercase.',[
      'printf produces the input text Unix lab and a newline.',
      'The pipe symbol | passes that text into tr instead of showing it immediately.',
      "tr maps the lowercase character class to the uppercase class. Spaces and the ending newline remain unchanged."
    ]],
    ['sed','sed edits a stream of text according to a short instruction. By default, the result is displayed and the original file stays unchanged.','Use it to replace text or select lines without opening an editor.',[
      'The instruction s/Ada/ADA/ means substitute Ada with ADA.',
      'The / characters separate the old text and the new text; they are not part of either name.',
      'sed applies the replacement to the first match on each line. Both Ada lines become ADA in the output, but names.txt is not rewritten.'
    ]],
    ['awk','awk reads rows, splits them into fields, and can test values or calculate totals.','Use it when a task needs both selecting rows and working with their columns.',[
      '-F, says fields are separated by commas. $1 is the first field and $2 the second.',
      'NR > 1 skips the header. && means both conditions must hold, so $2 must also be greater than 50.',
      '{print $1} prints only the name from matching rows. Linus and Grace meet the condition.'
    ]],
    ['xargs','xargs turns incoming text into arguments for another command. Arguments are the separate values supplied after a command name.','Use it when a program expects a list of arguments rather than file contents on its input.',[
      'printf sends four space-separated values into xargs.',
      '-n 2 tells xargs to use at most two input values for each command invocation.',
      "The chosen command is printf '%s:%s\\n'. It runs once with a and b, then again with c and d."
    ]],
    ['diff','diff tells you how two text files differ. cmp compares their bytes.','Use them to check whether a copy changed or to inspect an edit.',[
      'cp makes same.txt contain the same bytes as names.txt.',
      'diff compares the two files. Since they match, it prints no difference report.',
      '$? holds the previous command’s status. printf displays 0, which here means the files are equal.'
    ]],
    ['printf','printf prints text using a format: a small template describing where values should go.','Use it for predictable messages and formatted output in scripts.',[
      "The quoted format contains ordinary text plus %s, %d and \\n instructions.",
      '%s is replaced by Ada, and %d is replaced by the integer 36.',
      'The final newline ends the output line. The format itself is not printed literally.'
    ]],
    ['quoting','A variable is a named value in the shell. Quotes control whether spaces and special characters are treated as data or instructions.','Use quotes whenever a value or path might contain spaces or special characters.',[
      'name=Ada stores Ada in a variable named name. There are no spaces around the equals sign.',
      "Single quotes around '$name' keep those characters literal, so the first output line is $name.",
      'Double quotes allow the variable to expand while keeping its value together. The second line is Ada.'
    ]],
    ['globs','A glob is a filename pattern. The shell can replace a pattern with the names of matching files before running your command.','Use it to work with several similarly named files, after checking the matches.',[
      'docs/*.txt describes names inside docs that end with .txt.',
      'Because the pattern is unquoted, the shell replaces it with docs/guide.txt in this fixture.',
      'printf receives the expanded filename and displays it. It does not read the file contents.'
    ]],
    ['redirect','Redirection changes where a command reads input or sends output. The > symbol sends output into a file.','Use it to save a result instead of only viewing it on screen.',[
      "The first printf writes first followed by a newline. > output.txt creates the file or clears an existing one before writing.",
      'The second command uses >>, meaning append. It adds second after the existing line.',
      'cat reads the saved file, so you finally see both lines on the screen.'
    ]],
    ['pipes','A pipe passes one command’s output directly into another command’s input. You can solve a task by connecting small tools.','Use it when the result of one command is the data needed by the next.',[
      'sort reads names.txt and puts equal names next to each other.',
      'The | symbol passes those sorted lines to uniq.',
      'uniq keeps one line from each neighboring group. The final screen output therefore has one copy of each name.'
    ]],
    ['status','Commands return a status number as well as any text they print. Zero usually means success; nonzero means another outcome.','Use statuses to decide whether a later command should run.',[
      'test -f names.txt asks whether this path is a regular file.',
      'The test prints no text. Its status tells the shell whether the condition is true.',
      '&& means run the next command only after success, so printf displays file found.'
    ]],
    ['env','An environment variable is a named setting passed to a program when it starts. export lets child programs inherit a shell variable.','Use it to supply settings such as language, paths or a program’s configuration.',[
      'export LAB_NAME=Unix creates a value and marks it for child programs.',
      'sh -c starts another shell and gives it the quoted command to run.',
      'That child shell reads its inherited LAB_NAME value and prints Unix. Its parent did not need to type the value into the child command directly.'
    ]],
    ['chmod','Permissions decide who may read, change or execute a file. chmod changes those permissions.','Use it when you need to deliberately allow or restrict file access.',[
      'chmod 600 names.txt sets permissions using three digits: owner, group and everyone else.',
      '6 means read plus write. The two zeroes mean no permission bits for group or others.',
      "stat -c '%a' then prints the numeric mode so you can check the result. This stat syntax is for GNU/Linux."
    ]],
    ['identity','Unix processes act as users and belong to groups. That identity helps determine which files and operations are allowed.','Use identity commands when you need to understand an access or ownership issue.',[
      'whoami needs no filename or options for this example.',
      'It prints the effective username used by the running command.',
      'learner is only a sample username. Your own output may be completely different.'
    ]],
    ['umask','umask controls which permission bits are removed when a program creates a new file or folder.','Use it to choose more private defaults for newly created work.',[
      'Parentheses run this group in a separate shell environment, so the changed mask does not affect the surrounding shell.',
      'umask 077 removes group and other permissions from typical creation defaults. touch then creates the new file.',
      'stat shows 600: owner read and write only. Existing files would not be changed by umask.'
    ]],
    ['ps','A process is a running program. ps lists information about processes at the moment you ask.','Use it to identify a program’s process ID before investigating it further.',[
      '$$ is expanded by the shell to its own process ID, often shortened to PID.',
      '-p selects that PID. -o chooses which columns to print: pid and comm, the command name.',
      'The numbers shown are samples. Your shell will have its own PID, and it may have a different command name.'
    ]],
    ['jobs','A job is work managed by your current interactive shell. You can let work run in the background and wait for it later.','Use job control when you need your prompt while a command continues running.',[
      'sleep 0.1 waits briefly. The trailing & starts it in the background.',
      '$! supplies the background child’s PID, which we save in pid.',
      'wait waits for that child to finish. Only afterward does printf print finished. An interactive shell can also show job notifications.'
    ]],
    ['kill','kill sends a signal to a process. A signal is a request or notification, such as asking it to stop.','Use it for a process you own and have identified, starting with graceful requests when possible.',[
      'sleep 60 starts a temporary background process, and $! captures that exact child’s PID.',
      'kill -s TERM sends a termination request to that child, not to an arbitrary sample PID.',
      'wait collects the child’s completion. printf then confirms that the example reached its final step; the shell may also show a termination notice.'
    ]],
    ['system','These commands tell you about the operating-system kernel, the current clock and how long the system has been running.','Use them to understand the environment where you are working.',[
      'uname asks for system-identification information.',
      '-s selects the kernel name rather than every available field.',
      'Linux is the sample result on a Linux machine. macOS normally reports Darwin instead.'
    ]],
    ['disk','df describes storage capacity for a filesystem. du measures space used by files and folders it visits.','Use df to check capacity and du to investigate which folders use space.',[
      'The dot means the current directory. df finds the filesystem containing it.',
      '-h displays rounded, easier-to-read units such as G instead of large raw numbers.',
      'Read the size, used and available columns together. The example numbers are illustrative, not measurements of your machine.'
    ]],
    ['tar','An archive bundles several files into one file. tar makes and opens this kind of bundle. Compression is optional.','Use it to package a folder tree while retaining its relative paths.',[
      '-c asks tar to create an archive. -f says the next argument, docs.tar, is the archive filename.',
      'docs/guide.txt is the file to place inside that archive.',
      'tar -tf lists the stored names. The t means list, so this second command inspects rather than extracts the archive.'
    ]],
    ['gzip','Compression stores data in a smaller representation that can be restored later. gzip compresses a file or stream.','Use it to reduce storage or transfer size for suitable data.',[
      '-c makes gzip write compressed bytes to its output without removing names.txt.',
      '> names.txt.gz saves those bytes to a new file. They are binary data, so do not print the compressed file with cat.',
      'gzip -dc reverses the compression and writes the restored text to the screen. The original four lines return.'
    ]],
    ['curl','A URL is an address for a resource, such as a web page. curl requests data from URLs without opening a graphical browser.','Use it to inspect a web response or download a resource.',[
      '-I requests HTTP headers with a HEAD request, rather than downloading the usual page body.',
      '--max-time 10 limits the overall transfer duration to ten seconds.',
      'The URL is the destination. The sample status and headers describe a possible reply; the real network response can differ.'
    ]],
    ['ssh','SSH lets you connect securely to a different computer where you have permission and an account.','Use it to run commands remotely; use scp to copy files to or from an authorized host.',[
      'learner@server.example means username learner on the remote host server.example. Replace it with your authorized account.',
      'The quoted uname -s is the command to run on that remote computer.',
      'The printed result comes from the remote machine. The example will not connect until you supply a real reachable host and valid authentication.'
    ]],
    ['network','Network interfaces connect a computer to networks. Sockets are endpoints through which programs communicate.','Use these inspection commands to see addresses, listening services and basic reachability.',[
      'ip is a Linux networking tool. address asks it for interface addresses.',
      '-brief makes the listing shorter and easier to scan.',
      'lo is usually loopback, used to communicate with the same computer. Other names and addresses depend on your system.'
    ]],
    ['loops','A loop repeats a group of commands. You can repeat once for each item, or while a condition remains true.','Use it to avoid typing almost the same command many times.',[
      'for name in Ada Linus Grace supplies three items in a list.',
      'Between do and done, the body runs once for each item. name temporarily holds the current item.',
      'printf uses that value in the greeting. Three items therefore produce three greeting lines.'
    ]],
    ['conditions','A condition lets a script choose what to do based on whether a command succeeds.','Use if for decisions and case for choosing between text patterns.',[
      '[ -f names.txt ] checks whether names.txt is a regular file. The spaces around the brackets matter.',
      'If the check succeeds, the commands after then run. Otherwise, the commands after else run.',
      'The fixture contains the file, so ready is printed. fi marks the end of the decision.'
    ]],
    ['functions','A function gives a name to a reusable group of shell commands. It can accept values called arguments.','Use it when a script needs the same small task more than once.',[
      'greet() defines a function named greet. The commands inside braces form its body.',
      '$1 means the function’s first argument. printf uses it as the greeting name.',
      "greet 'Ada Lovelace' calls the function. Quotes keep the two-word name as one argument."
    ]],
    ['scripts','A script is a text file containing commands to run in order. Debugging means checking why those commands do not behave as intended.','Use scripts for work you want to repeat reliably.',[
      'The first printf writes a tiny script into hello.sh. Its first line names the interpreter and its next line prints hello.',
      'bash -n checks whether Bash can parse that file. It does not run the commands inside.',
      '&& prints syntax OK only after the syntax check succeeds. A valid syntax check does not prove every runtime action will work.'
    ]],
    ['temp','A temporary file holds intermediate work that you do not intend to keep permanently. mktemp safely creates a uniquely named one.','Use it when a script needs scratch space without colliding with another file.',[
      '$(mktemp) runs mktemp and captures the generated path into tmp.',
      'The path is quoted each time it is used, so any special characters remain part of one argument.',
      'printf writes to the temporary file, cat reads it, and rm removes that exact file when the example is done.'
    ]],
    ['basename','basename takes a path and keeps only the last name in it. It does not open the file.','Use it to turn a long path into a short filename label.',[
      'The path /home/learner/report.txt is supplied as plain path text.',
      'basename removes the directory part /home/learner/.',
      'The answer is report.txt. The path does not need to refer to a real file for this operation.'
    ]],
    ['dirname','dirname takes a path and keeps the parent-directory part instead of the final name.','Use it when a script needs to work with the folder containing a named file.',[
      'The final component in /home/learner/report.txt is report.txt.',
      'dirname removes that final component and prints /home/learner.',
      'It has only processed text. It has not moved your shell into that directory.'
    ]],
    ['realpath','realpath shows where a path leads after resolving shortcuts such as dot components and symbolic links.','Use it to make a path easier to understand before using it elsewhere.',[
      'docs/../names.txt enters docs and then refers back to its parent with ...',
      '--relative-to=. asks for the result relative to the current folder instead of starting at the filesystem root.',
      'After simplifying the path, the result is just names.txt.'
    ]],
    ['nl','nl prints text with line numbers added beside it. The original text file remains unchanged.','Use it when discussing particular lines or creating a numbered text listing.',[
      '-w1 requests a number field only one character wide, avoiding extra left padding for these small numbers.',
      "-s': ' uses a colon and a space between the number and the text.",
      'names.txt provides the four lines. nl displays them with numbers 1 through 4.'
    ]],
    ['tac','tac reads the lines in reverse order: last line first. It does not reverse the letters inside each name.','Use it to inspect the end of an ordered text record first.',[
      'names.txt is read as a sequence of newline-separated records.',
      'The last record, Grace, is printed first; the earlier records follow in reverse order.',
      'This does not sort the names alphabetically. It simply reverses their existing positions.'
    ]],
    ['paste','paste puts lines side by side, matching the first line with the first line, the second with the second, and so on.','Use it when two lists are already lined up in the same order.',[
      '-d, chooses a comma between the values rather than the usual tab.',
      'The same file is passed twice, so the left and right columns contain the same names.',
      'The first pair is Ada,Ada. Later pairs follow their original line positions.'
    ]],
    ['join','join combines rows from two files when a chosen key, such as an ID number, matches.','Use it to connect two simple tables using a shared identifier.',[
      'The two printf commands create separate tables: an ID with a name, and an ID with a city.',
      'Both tables are already sorted by the first field, which is the default join key.',
      'join matches ID 1 with ID 1 and ID 2 with ID 2. Each result contains the ID, the name and the city.'
    ]],
    ['comm','comm compares two sorted lists and can show what appears in one list, the other, or both.','Use it to compare sets of names or records.',[
      'The two printf commands create sorted lists. Grace appears in both.',
      '-12 combines -1 and -2, which hide the lines unique to either list.',
      'Only the common lines remain. That is why the result contains Grace alone.'
    ]],
    ['expand','A tab moves text to the next tab stop. expand replaces tab characters with the spaces needed to reach those stops.','Use it to make indentation or column spacing more predictable in plain text.',[
      'printf creates the letter a, a tab, the letter b and a newline.',
      '-t4 places tab stops every four columns.',
      'After a occupies one column, three spaces reach the next stop. The output therefore has three spaces between a and b.'
    ]],
    ['fold','fold breaks long lines into shorter output lines. It can make text easier to read in a narrow window.','Use it for display text where adding line breaks is acceptable.',[
      'printf creates a single ten-character line.',
      '-w4 asks fold to use a width of four columns.',
      'The first two output lines contain four characters each. The remaining two characters form the final line.'
    ]],
    ['split','split divides one input file into several smaller files. You choose how large each part should be.','Use it when a large file needs to be handled in smaller pieces.',[
      '-l2 requests at most two lines per output file.',
      'names.txt is the input; part- is the prefix for the generated filenames.',
      'The first output is part-aa, holding Ada and Linus. cat reads that part so you can inspect it.'
    ]],
    ['seq','seq prints numbers in a sequence. You can choose the first number, step size and ending number.','Use it for short number lists or simple repeated-work examples.',[
      'With one argument, seq starts at 1 and increases by 1.',
      'The argument 3 is the inclusive ending value.',
      'The result is 1, 2 and 3, each on a separate line.'
    ]],
    ['shuf','shuf changes record order randomly or chooses a random sample. Different runs can produce different answers.','Use it for randomized practice or choosing records from a list.',[
      '-n1 asks for at most one output record.',
      'names.txt supplies the available records. Each occurrence is an eligible record.',
      'Grace is one possible answer. Ada appears twice in the input, so it has two chances to be selected.'
    ]],
    ['timeout','timeout runs a command with a deadline. If it takes too long, timeout sends a signal asking it to stop.','Use it to keep a potentially slow operation from waiting indefinitely.',[
      '2s is a two-second deadline.',
      'printf is the program being run, with its message supplied afterward.',
      'This small print operation normally finishes before the deadline, so ready is displayed and no timeout action is needed.'
    ]],
    ['watch','watch repeatedly runs a command and refreshes its output in the terminal.','Use it to keep an eye on a changing system value without repeatedly typing the command.',[
      '-n 5 asks for an update roughly every five seconds.',
      'The command being repeated is df -h ., which reports disk space for the current filesystem.',
      'The screen is updated rather than becoming a saved history. Press Ctrl+C when you have finished watching.'
    ]],
    ['history','history shows commands your interactive shell recorded earlier. It helps you find something you already typed.','Use it to recall a tested command instead of reconstructing it from memory.',[
      'The number 3 asks to show the last three recorded entries.',
      'The numbers beside the commands are history entry numbers, not process IDs.',
      'Your entries and numbers will differ. Always read an old command before choosing to run it again.'
    ]],
    ['alias','An alias is a short name that expands to a longer command in the shell.','Use it for a simple personal shortcut; use a function when the shortcut needs argument handling.',[
      "alias ll='ls -l' defines ll as an abbreviation for ls -l. Quotes keep the replacement together.",
      'alias ll asks to display the stored definition.',
      'Seeing the definition does not run ls. It only confirms what the abbreviation means in this shell.'
    ]],
    ['type','type tells you what the shell means by a command name: for example, a builtin command, a function, or a program on disk.','Use it when a familiar command behaves differently than you expected.',[
      '-t asks for one short type word instead of a longer description.',
      'cd is the command name we are checking.',
      'builtin means Bash implements it inside the shell rather than finding a separate executable file.'
    ]],
    ['read','read takes a line of input and puts it into one or more shell variables.','Use it for input prompts or for processing text records in a script.',[
      '< docs/guide.txt supplies input from a file rather than the keyboard.',
      'IFS= keeps spaces intact, and -r keeps backslashes literal. name is the variable to fill.',
      'printf then prints the value inside angle brackets so you can clearly see the start and end of the captured line.'
    ]],
    ['getopts','getopts helps a script understand short options such as -n Ada without manually taking the argument list apart.','Use it when writing a script that accepts a few short flags or option values.',[
      'set -- -n Ada creates sample arguments, as if a script had been called with those values. OPTIND=1 starts parsing from the beginning.',
      "In 'n:', the colon says -n needs a value. getopts stores n in opt and Ada in OPTARG.",
      'The while loop runs once for this option and printf displays n=Ada.'
    ]],
    ['rsync','rsync copies files and can avoid retransferring unchanged data. It is often used to keep a second location up to date.','Use it for deliberate local copies or transfers to an authorized remote computer.',[
      'mkdir backup creates a destination folder for the example.',
      '-a requests recursive copying plus selected metadata. docs/ means the contents of docs, not another enclosing docs folder.',
      'cat backup/guide.txt confirms where the copied file landed. A separate rsync installation may be needed.'
    ]],
    ['zip','A ZIP archive stores several files inside one package, usually with compression. unzip reads or extracts that package.','Use it to share a group of files in a commonly supported archive format.',[
      'zip -q creates notes.zip from names.txt. -q reduces normal progress messages.',
      'unzip -p reads the named member inside the archive and writes its content to the screen.',
      'The four original lines appear. The -p operation does not create a separate extracted file.'
    ]],
    ['dig','DNS is the naming system that lets computers look up records for names such as example.com. dig asks DNS a question.','Use it to investigate name resolution, while remembering that a DNS answer is not a service-health check.',[
      'example.com is the name being queried. A requests IPv4 address records.',
      '+short asks for a concise display instead of the full diagnostic reply.',
      'The shown address is illustrative. Live records can change, and an empty result needs further investigation rather than guesswork.'
    ]],
    ['lsof','Programs keep files and network connections open while using them. lsof shows those open resources where your permissions allow.','Use it to investigate a busy port or a file that remains in use.',[
      '$$ expands to the current shell’s PID.',
      '-p selects that process so you do not have to inspect every visible program.',
      'The sample cwd entry represents the process working directory. Other rows can show input, output, files or sockets.'
    ]],
    ['free','RAM is the working memory used by running programs. free summarizes Linux memory and swap usage.','Use it for a first look at memory availability before investigating pressure in more detail.',[
      '-h displays rounded sizes with readable units such as GiB.',
      'The Mem row describes RAM. The Swap row describes separate swap space.',
      'Do not judge by the free column alone. Some cached memory can be reused, so available is often a better starting point.'
    ]],
    ['top','top is a live overview of running processes and resource use. The screen changes as the computer works.','Use it to notice busy processes, then inspect the relevant program and logs.',[
      'Type top to enter its interactive view.',
      'The upper area summarizes the system and the lower area lists processes. PID identifies each process.',
      'Values change over time and the sample is only a layout guide. Press q to exit the view.'
    ]],
    ['systemctl','A service is a program managed to perform ongoing work. On many Linux systems, systemd manages services and systemctl inspects them.','Use it to check service state on a machine that actually runs systemd.',[
      'status asks for the service’s current state and recent information.',
      'systemd-journald.service is the unit name being inspected. --no-pager prints directly instead of opening a scrolling viewer.',
      'active (running) is one possible state. Service availability, access and the actual state depend on the machine.'
    ]],
    ['journalctl','A log records messages about what a program did. journalctl searches the structured logs stored by systemd.','Use it to read recent messages from a service when investigating a problem.',[
      '-u selects one unit, here systemd-journald.service.',
      '-n 5 asks for up to five recent matching entries. --no-pager prints the result directly.',
      'The example message is illustrative. Your machine may have different entries, fewer accessible entries, or no matching entries.'
    ]]
  ];
  const guides=Object.fromEntries(rows.map(([id,plain,when,steps])=>[id,{plain,when,steps}]));
  const glossary=[
    ['Command','An instruction you type, usually starting with a program or builtin name such as ls.'],
    ['Option / flag','A setting that changes a command’s behavior. For example, -n 2 tells head to show two lines. Options are specific to each command.'],
    ['Argument / operand','A separate value given to a command, such as a filename. Quotes can keep a value containing spaces together.'],
    ['File / directory','A file stores data. A directory is a folder that contains names of files and other directories.'],
    ['Path','A location written with / between directory names. /home/learner begins at the root; docs/guide.txt starts from your current folder.'],
    ['. and ..','A dot means the current directory. Two dots mean its parent directory.'],
    ['Output','Text or other data produced by a command. A command can succeed without printing anything.'],
    ['Standard input (stdin)','The input stream a command reads, often the keyboard, a redirected file, or a pipe.'],
    ['Standard output (stdout)','The usual result stream. It normally goes to the terminal but can be saved or piped onward.'],
    ['Standard error (stderr)','A separate stream often used for error messages. A plain pipe carries stdout, not stderr.'],
    ['Pipe |','Connects the output of the command on the left to the input of the command on the right.'],
    ['> and >>','> saves output by creating or replacing a file. >> adds output to the end instead.'],
    ['Process / PID','A process is a running program. A PID is the number identifying a process at that time.'],
    ['Exit status','A number returned by a command. Zero usually means success; other numbers can mean failure or another documented outcome.'],
    ['GNU / Linux / Bash','Linux is a kernel, GNU provides many common command-line tools, and Bash is a shell. The examples use that common combination.'],
    ['Permission','A rule controlling who may read, change or execute a file, or list/traverse/change a directory.'],
    ['Variable','A named value. name=Ada assigns a value; "$name" uses it while preserving spaces.'],
    ['Newline','The character marking a line ending. In printf format strings, \\n asks to print a newline.'],
    ['Locale','Settings that affect language, sorting and character handling. The practice setup uses LC_ALL=C for predictable simple examples.'],
    ['Sample / illustrative output','An example of what a result may look like. Real timestamps, account names, process IDs and network replies will differ.']
  ];
  if(typeof module!=='undefined')module.exports={guides,glossary};
  else {root.UNIX_BEGINNERS=guides;root.UNIX_GLOSSARY=glossary;}
})(typeof window==='undefined'?globalThis:window);
