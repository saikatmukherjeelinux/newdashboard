"""Build 80 accessible, compact Unix teaching diagrams using only the standard library."""
from pathlib import Path
import json
from html import escape

ROOT = Path(__file__).resolve().parents[1]
# Chapter | title | three labeled stages or parts | beginner explanation
CONTENT = '''overview|A request for a file|Application asks|Kernel checks|File data returns|An editor asks to read a file. The kernel checks access and supplies the bytes. The application decides how to display them.
overview|Two protected spaces|User programs|System call boundary|Kernel services|Normal applications run in user space. A system call is a controlled way to ask the kernel to do protected work.
overview|The computer's layers|Applications|Operating system|Hardware|Applications do useful work. The operating system manages shared resources. Hardware performs the physical computation and storage.
overview|Three different jobs|Terminal: displays|Shell: interprets|Kernel: manages|The terminal shows text, the shell understands command syntax, and the kernel manages resources. These are separate jobs.
overview|Programs share resources|Editor needs CPU|Browser needs CPU|Scheduler shares CPU|Many programs can make progress because the scheduler gives runnable threads opportunities to use processors.
overview|Unix-like systems|Linux|BSD|macOS|These systems share many Unix concepts, but their kernels, commands and startup tools differ. An option available on one may be absent on another.
terminal-shell|Typing a command|Type a command|Shell parses it|Program runs|After Enter, the shell reads the words and operators. It then runs a built-in command or starts a program.
terminal-shell|Finding an executable|Enter tool name|Search PATH folders|Run first match|For an external command without a slash, the shell uses PATH to find an executable. Shell functions and built-ins may take precedence.
terminal-shell|Why cd is built in|Shell is in /home|cd changes shell|Next command uses it|The working directory belongs to a process. A separate child program cannot change its parent's directory, so cd runs inside the shell.
terminal-shell|Quotes keep words together|"my notes.txt"|One argument|One filename|Quotes keep the space inside one argument. Without quoting, a shell normally treats these as two separate words.
terminal-shell|Expanding a wildcard|Type *.txt|Shell finds matches|Program gets names|In a typical shell, the shell expands the pattern before the program starts. Behavior when nothing matches depends on the shell and its settings.
terminal-shell|Variables become text|name=Sam|echo "$name"|Output: Sam|The shell replaces the variable reference with its value. Double quotes preserve that value as one argument, even when it contains spaces.
kernel|Sharing one processor|Thread A runs|Scheduler switches|Thread B runs|On one CPU core, only one thread executes at a time. Switching between runnable threads lets several programs make progress.
kernel|A protected memory request|Program requests|Kernel maps pages|Program uses memory|The kernel manages virtual memory mappings. A program cannot simply read another process's private memory through an ordinary pointer.
kernel|A device request|Program writes|Kernel uses driver|Device acts|A driver contains device-specific logic. The kernel uses drivers so applications do not have to operate hardware directly.
kernel|Waiting for input|Read requested|Thread waits|Data wakes thread|A blocking read can put a thread to sleep until input arrives. The CPU can run other ready work during the wait.
kernel|An interrupt arrives|Device signals|Kernel handles event|Work can continue|Hardware can notify the processor that an event needs attention. Interrupt handling lets the kernel respond without repeatedly asking every device.
kernel|Checking a file request|Process identity|Access rules|Allow or deny|The kernel checks the process's credentials and relevant access controls. Permission errors are a result of these checks, not just a shell message.
system-calls|Opening a file|open(path)|Access checked|Descriptor returned|On success, open returns a small integer called a file descriptor. A program uses that number for later operations on the open file.
system-calls|Reading bytes|read(fd, buffer, n)|Bytes copied|Count returned|read requests up to n bytes. Its return value tells the program how many were read; zero indicates end of file for a regular file.
system-calls|Writing bytes|write(fd, data, n)|Bytes accepted|Count returned|A write can accept fewer bytes than requested. Careful programs check the result and continue until the remaining bytes are written or an error occurs.
system-calls|Closing a descriptor|Open descriptor|close(fd)|Number released|Closing releases this process's descriptor. Other descriptors or processes can still hold references to the same open file.
system-calls|Handling an error|System call fails|Return value: -1|Inspect errno|Many C system-call interfaces report failure as -1 and set errno. The program uses that error number to explain what went wrong.
system-calls|Library versus kernel|strlen(text)|Count in user space|Length returned|Not every library function needs a system call. Counting characters already in memory can happen entirely inside the program.
command-journey|Reading a file with cat|cat notes.txt|Read file bytes|Write to output|cat copies file contents to standard output. It does not execute commands that happen to be written inside the file.
command-journey|The shell separates words|cat notes.txt|Program: cat|Argument: notes.txt|The shell identifies the command name and its argument. The filename tells cat which file to open.
command-journey|Starting an external tool|Shell starts child|Child loads program|Tool begins|A common Unix model uses fork followed by exec. Shells can use other mechanisms too; the important idea is a separate process running the tool.
command-journey|A missing input file|cat missing.txt|Open fails|Error on stderr|When the file does not exist, cat reports an error on standard error and returns a nonzero exit status.
command-journey|Redirecting cat's output|cat notes.txt|stdout redirected|copy.txt receives|With cat notes.txt > copy.txt, the shell opens the output file before cat runs. Existing contents of copy.txt are normally replaced.
command-journey|Returning to the prompt|Tool finishes|Shell gets status|Prompt appears|For a foreground command, the shell normally waits. When the command finishes, the shell can display the next prompt.
processes|Parent and child IDs|Parent PID 100|Starts child|Child PID 101|Each process has a process ID. A parent-child relationship records who started whom; these numbers are only an illustration.
processes|A process becomes ready|Waiting for data|Data arrives|Ready for CPU|Ready means able to run, not currently executing. The scheduler chooses when a ready thread receives CPU time.
processes|Executing a new program|Existing process|exec new program|Same process ID|Successful exec replaces the program image of a process. It does not create a new process or assign a new process ID.
processes|Threads share a process|Thread A|Shared address space|Thread B|Threads in a process share memory and many resources. Each thread still needs its own execution state, including a stack.
processes|Collecting an exit status|Child exits|Parent calls wait|Status collected|A terminated child can remain as a zombie entry until its exit status is collected. A zombie is not still running code.
processes|Requesting a clean stop|Send SIGTERM|Program handles it|Clean up and exit|SIGTERM asks a program to terminate. A program can handle or ignore it; SIGKILL cannot be caught and does not allow application cleanup.
memory|Virtual to physical memory|Virtual address|Address translation|RAM location|A process uses virtual addresses. Hardware and the kernel cooperate to translate mapped addresses to physical memory.
memory|Code, heap and stack|Code: instructions|Heap: dynamic data|Stack: call frames|These are useful conceptual regions. The stack tracks function calls, while the heap supports data with lifetimes controlled by the program or runtime.
memory|A page fault|Page accessed|Mapping checked|Resolve or fault|A page fault is not always a crash. The kernel may load or allocate a valid page; an invalid access can instead cause a signal.
memory|The file cache|Read file|Keep bytes in RAM|Later read is faster|The operating system can cache file data in memory. This reduces storage reads, so memory used for cache can be helpful.
memory|Swap is slower storage|Less active pages|Move to swap|Load back if needed|Systems with swap may move some memory pages to storage. Accessing swapped-out data can be much slower than accessing RAM.
memory|Copy-on-write idea|Parent and child|Share read-only pages|Copy on modification|After fork, systems often avoid copying all memory immediately. A write to a shared private page causes a separate copy to be made.
filesystem|One directory tree|Root: /|Directory: /home|File: /home/a.txt|An absolute path starts at the root directory. Slashes separate directory names along the route to a file.
filesystem|Resolving a relative path|Current: /home/sam|Path: notes.txt|/home/sam/notes.txt|A relative path is interpreted from the current working directory. The same relative name can refer to different files in different directories.
filesystem|Name and file identity|Directory entry|Inode identity|File data blocks|In an inode-based filesystem, a directory entry associates a name with an inode. The inode describes the file and where its data is stored.
filesystem|Two names for one file|Name: first.txt|Same inode|Name: second.txt|A hard link is another directory entry for the same file. Removing one name does not remove the data while other links or open references remain.
filesystem|A symbolic link|shortcut.txt|Stores target path|target.txt|A symbolic link stores a path to another location. If the target disappears, the link can remain but resolving it fails.
filesystem|Attaching a filesystem|Existing tree|Mount at /mnt|New contents appear|Mounting makes a filesystem accessible at a directory in the existing tree. Previous contents at that location are hidden while the mount is active.
permissions|Three sets of permissions|Owner: rw-|Group: r--|Others: ---|For this example, the owner can read and write, the group can read, and others have no permission. Ordinary mode checks select the applicable class.
permissions|Permission numbers|Read = 4|Write = 2|Execute = 1|Add the values for each class. Read plus write is 6; read plus execute is 5. Thus 640 means rw-r-----.
permissions|Directory access|Read: list names|Write: change entries|Execute: traverse|Directory permissions differ from file permissions. Creating or removing entries normally needs both write and execute permission on the directory.
permissions|Permission to run a file|Executable bit|Usable program format|Execution allowed|The execute bit alone does not guarantee a runnable program. The file must have a usable format or interpreter, and other access restrictions may apply.
permissions|Default permission mask|Requested mode|umask removes bits|Final initial mode|A umask removes permission bits from the mode requested when creating a file. It does not add execute permission to an ordinary new text file.
permissions|Identity affects access|User identity|Group memberships|Access decision|The same file can be readable by one process and denied to another because they run with different credentials. Extra controls such as ACLs can also matter.
streams|Three standard streams|0: standard input|1: standard output|2: standard error|Programs commonly inherit these descriptors. Keeping normal results separate from error messages makes redirection and pipelines useful.
streams|A simple pipeline|printf sends text|Pipe holds bytes|wc counts lines|A pipe connects one program's standard output to another's standard input. It carries bytes, not filenames or structured objects.
streams|Redirect input from a file|input.txt|Standard input|Program reads|The operator < tells the shell to connect a file to standard input. The program can read it without knowing that a terminal was replaced.
streams|Append versus replace|> replaces contents|>> appends contents|Destination file|Both operators redirect standard output. Choose append when you want to keep existing text and add more at the end.
streams|Separate result and error|stdout to result.txt|stderr to error.txt|Two output files|The command tool > result.txt 2> error.txt sends normal output and error output to different files. The 2 selects standard error.
streams|When a pipe fills up|Writer produces|Buffer becomes full|Writer waits|A pipe has limited capacity. A blocking writer waits when it cannot fit more data, so a slow reader can slow the writer.
devices-network|Device files as interfaces|Program opens /dev|Kernel finds driver|Driver handles request|A device file provides an interface to a device or kernel facility. Reading it does not necessarily mean reading stored file contents.
devices-network|Discarding unwanted output|Program output|Redirect to /dev/null|Bytes discarded|/dev/null accepts and discards writes. Reading from it immediately returns end of file. It is useful when output is intentionally unnecessary.
devices-network|Resolving a hostname|example.com|Name lookup|IP address|Name resolution turns a name into an address. A local hosts file or cache may answer before a DNS server is contacted.
devices-network|Address and port|IP: which host|Port: which endpoint|Server socket|An IP address identifies a network destination. A transport port helps distinguish endpoints on that destination, such as a web server listener.
devices-network|TCP and encryption|TCP transports bytes|TLS protects data|Application uses data|TCP supplies an ordered byte stream; it does not itself encrypt that stream. HTTPS commonly adds TLS to protect the exchange.
boot|The startup chain|Firmware|Bootloader|Kernel|A typical startup begins with firmware, which starts a bootloader or boot path that loads the kernel. Exact steps vary by machine and operating system.
boot|Early kernel startup|Initialize hardware|Prepare root files|Start user space|The kernel prepares essential resources and starts user-space initialization. Some systems use a temporary early filesystem before the final root is available.
boot|The first user process|Kernel starts init|PID 1 runs|Services start|The initial user-space process has a special startup role. Linux commonly uses systemd, but other Unix-like systems use different initialization systems.
boot|Opening a login session|Ask for identity|Authenticate user|Start session|Successful authentication allows a user session to begin. A text login commonly starts a shell; a graphical login starts a desktop session.
boot|An orderly shutdown|Stop services|Finish filesystem work|Power off|An orderly shutdown allows services to stop and pending writes to be handled. Suddenly cutting power can lose recent data.
environment-services|Passing an environment|Parent exports value|Child starts|Child inherits value|An exported shell variable becomes part of the environment of future child processes. Changing the child environment does not change the parent's environment.
environment-services|Local versus exported|color=blue|export color|Child can read it|A shell variable can be local to that shell. Export marks it for inclusion in the environment passed to subsequently started programs.
environment-services|Background work|Run command &|Shell returns prompt|Command continues|The ampersand starts a job asynchronously. This alone does not turn it into a robust service or guarantee it survives logout.
environment-services|A managed service|Manager starts it|Service does work|Manager tracks it|A service manager can track a service and apply restart policies. Configuration syntax and available behavior differ across operating systems.
environment-services|Service working directory|Service starts|Uses its own folder|Resolves relative path|A service may start in a different directory from your terminal. Use an intentional working directory or suitable absolute paths for required files.
review|Investigate missing commands|Check spelling|Check PATH|Check installation|If a command is not found, first check its name, then the search path, then whether it is installed. This is a lookup problem before the program runs.
review|Investigate denied access|Check identity|Check path permissions|Check extra controls|Inspect the user and groups plus permissions on the file and parent directories. Do not assume making everything writable is the right fix.
review|Investigate slow programs|CPU work?|Waiting for storage?|Waiting for network?|Slow completion has different causes. Identify which resource or wait dominates before deciding what to change.
review|Investigate a failed connection|Resolve hostname|Reach destination|Check listener|A network request can fail at several stages. Separating name lookup, connectivity and server listening helps narrow the problem.
review|Connect the whole story|Shell starts tool|Kernel manages I/O|Output reaches user|A command combines many ideas: parsing, process creation, access checks, file or network operations, and output. Follow those stages to explain its behavior.'''

def build():
    rows = [line.split('|') for line in CONTENT.splitlines()]
    assert len(rows) == 80
    target = ROOT / 'unix-motion-lab/assets/architecture/details'
    target.mkdir(parents=True, exist_ok=True)
    chapters = {}
    for i, (chapter, title, a, b, c, explanation) in enumerate(rows, 1):
        name = f'{i:02d}-{chapter}.svg'
        # Vertical sequence stays readable at phone width; arrows mean reading order.
        svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(explanation)}</desc><rect width="480" height="300" rx="12" fill="#f6f8f5"/><text x="240" y="30" text-anchor="middle" font-family="sans-serif" font-size="17" font-weight="bold" fill="#163c32">{escape(title)}</text>']
        for n, label in enumerate([a,b,c]):
            y = 48 + n * 78
            svg.append(f'<rect x="35" y="{y}" width="410" height="56" rx="8" fill="{["#deeee5","#e4eaf6","#f4e9cf"][n]}" stroke="#9daea6"/><text x="240" y="{y+34}" text-anchor="middle" font-family="sans-serif" font-size="19" fill="#1d302b">{escape(label)}</text>')
            comparisons = {'Three different jobs', 'Unix-like systems', 'Code, heap and stack', 'Three sets of permissions', 'Permission numbers', 'Directory access', 'Three standard streams', 'Append versus replace', 'Separate result and error', 'Investigate slow programs', 'Threads share a process', 'Two names for one file', 'Address and port'}
            if n < 2 and title not in comparisons:
                svg.append(f'<path d="M240 {y+59} v13 m-5 -5 l5 5 5 -5" fill="none" stroke="#62786e" stroke-width="2"/>')
        svg.append('<text x="240" y="285" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#53665f">Read from top to bottom · simplified learning diagram</text></svg>')
        (target / name).write_text(''.join(svg), encoding='utf8')
        chapters.setdefault(chapter, []).append(dict(title=title, image=f'details/{name}', explanation=explanation, alt=f'{title}: {a}; {b}; {c}.'))
    (target.parent.parent / 'architecture-visuals.js').write_text('window.UNIX_ARCHITECTURE_VISUALS = ' + json.dumps(chapters, indent=2) + ';\n', encoding='utf8')
    print(f'Built {len(rows)} diagrams across {len(chapters)} chapters.')

if __name__ == '__main__':
    build()
