window.UNIX_ARCHITECTURE_VISUALS = {
  "overview": [
    {
      "title": "A request for a file",
      "image": "details/01-overview.svg",
      "explanation": "An editor asks to read a file. The kernel checks access and supplies the bytes. The application decides how to display them.",
      "alt": "A request for a file: Application asks; Kernel checks; File data returns."
    },
    {
      "title": "Two protected spaces",
      "image": "details/02-overview.svg",
      "explanation": "Normal applications run in user space. A system call is a controlled way to ask the kernel to do protected work.",
      "alt": "Two protected spaces: User programs; System call boundary; Kernel services."
    },
    {
      "title": "The computer's layers",
      "image": "details/03-overview.svg",
      "explanation": "Applications do useful work. The operating system manages shared resources. Hardware performs the physical computation and storage.",
      "alt": "The computer's layers: Applications; Operating system; Hardware."
    },
    {
      "title": "Three different jobs",
      "image": "details/04-overview.svg",
      "explanation": "The terminal shows text, the shell understands command syntax, and the kernel manages resources. These are separate jobs.",
      "alt": "Three different jobs: Terminal: displays; Shell: interprets; Kernel: manages."
    },
    {
      "title": "Programs share resources",
      "image": "details/05-overview.svg",
      "explanation": "Many programs can make progress because the scheduler gives runnable threads opportunities to use processors.",
      "alt": "Programs share resources: Editor needs CPU; Browser needs CPU; Scheduler shares CPU."
    },
    {
      "title": "Unix-like systems",
      "image": "details/06-overview.svg",
      "explanation": "These systems share many Unix concepts, but their kernels, commands and startup tools differ. An option available on one may be absent on another.",
      "alt": "Unix-like systems: Linux; BSD; macOS."
    }
  ],
  "terminal-shell": [
    {
      "title": "Typing a command",
      "image": "details/07-terminal-shell.svg",
      "explanation": "After Enter, the shell reads the words and operators. It then runs a built-in command or starts a program.",
      "alt": "Typing a command: Type a command; Shell parses it; Program runs."
    },
    {
      "title": "Finding an executable",
      "image": "details/08-terminal-shell.svg",
      "explanation": "For an external command without a slash, the shell uses PATH to find an executable. Shell functions and built-ins may take precedence.",
      "alt": "Finding an executable: Enter tool name; Search PATH folders; Run first match."
    },
    {
      "title": "Why cd is built in",
      "image": "details/09-terminal-shell.svg",
      "explanation": "The working directory belongs to a process. A separate child program cannot change its parent's directory, so cd runs inside the shell.",
      "alt": "Why cd is built in: Shell is in /home; cd changes shell; Next command uses it."
    },
    {
      "title": "Quotes keep words together",
      "image": "details/10-terminal-shell.svg",
      "explanation": "Quotes keep the space inside one argument. Without quoting, a shell normally treats these as two separate words.",
      "alt": "Quotes keep words together: \"my notes.txt\"; One argument; One filename."
    },
    {
      "title": "Expanding a wildcard",
      "image": "details/11-terminal-shell.svg",
      "explanation": "In a typical shell, the shell expands the pattern before the program starts. Behavior when nothing matches depends on the shell and its settings.",
      "alt": "Expanding a wildcard: Type *.txt; Shell finds matches; Program gets names."
    },
    {
      "title": "Variables become text",
      "image": "details/12-terminal-shell.svg",
      "explanation": "The shell replaces the variable reference with its value. Double quotes preserve that value as one argument, even when it contains spaces.",
      "alt": "Variables become text: name=Sam; echo \"$name\"; Output: Sam."
    }
  ],
  "kernel": [
    {
      "title": "Sharing one processor",
      "image": "details/13-kernel.svg",
      "explanation": "On one CPU core, only one thread executes at a time. Switching between runnable threads lets several programs make progress.",
      "alt": "Sharing one processor: Thread A runs; Scheduler switches; Thread B runs."
    },
    {
      "title": "A protected memory request",
      "image": "details/14-kernel.svg",
      "explanation": "The kernel manages virtual memory mappings. A program cannot simply read another process's private memory through an ordinary pointer.",
      "alt": "A protected memory request: Program requests; Kernel maps pages; Program uses memory."
    },
    {
      "title": "A device request",
      "image": "details/15-kernel.svg",
      "explanation": "A driver contains device-specific logic. The kernel uses drivers so applications do not have to operate hardware directly.",
      "alt": "A device request: Program writes; Kernel uses driver; Device acts."
    },
    {
      "title": "Waiting for input",
      "image": "details/16-kernel.svg",
      "explanation": "A blocking read can put a thread to sleep until input arrives. The CPU can run other ready work during the wait.",
      "alt": "Waiting for input: Read requested; Thread waits; Data wakes thread."
    },
    {
      "title": "An interrupt arrives",
      "image": "details/17-kernel.svg",
      "explanation": "Hardware can notify the processor that an event needs attention. Interrupt handling lets the kernel respond without repeatedly asking every device.",
      "alt": "An interrupt arrives: Device signals; Kernel handles event; Work can continue."
    },
    {
      "title": "Checking a file request",
      "image": "details/18-kernel.svg",
      "explanation": "The kernel checks the process's credentials and relevant access controls. Permission errors are a result of these checks, not just a shell message.",
      "alt": "Checking a file request: Process identity; Access rules; Allow or deny."
    }
  ],
  "system-calls": [
    {
      "title": "Opening a file",
      "image": "details/19-system-calls.svg",
      "explanation": "On success, open returns a small integer called a file descriptor. A program uses that number for later operations on the open file.",
      "alt": "Opening a file: open(path); Access checked; Descriptor returned."
    },
    {
      "title": "Reading bytes",
      "image": "details/20-system-calls.svg",
      "explanation": "read requests up to n bytes. Its return value tells the program how many were read; zero indicates end of file for a regular file.",
      "alt": "Reading bytes: read(fd, buffer, n); Bytes copied; Count returned."
    },
    {
      "title": "Writing bytes",
      "image": "details/21-system-calls.svg",
      "explanation": "A write can accept fewer bytes than requested. Careful programs check the result and continue until the remaining bytes are written or an error occurs.",
      "alt": "Writing bytes: write(fd, data, n); Bytes accepted; Count returned."
    },
    {
      "title": "Closing a descriptor",
      "image": "details/22-system-calls.svg",
      "explanation": "Closing releases this process's descriptor. Other descriptors or processes can still hold references to the same open file.",
      "alt": "Closing a descriptor: Open descriptor; close(fd); Number released."
    },
    {
      "title": "Handling an error",
      "image": "details/23-system-calls.svg",
      "explanation": "Many C system-call interfaces report failure as -1 and set errno. The program uses that error number to explain what went wrong.",
      "alt": "Handling an error: System call fails; Return value: -1; Inspect errno."
    },
    {
      "title": "Library versus kernel",
      "image": "details/24-system-calls.svg",
      "explanation": "Not every library function needs a system call. Counting characters already in memory can happen entirely inside the program.",
      "alt": "Library versus kernel: strlen(text); Count in user space; Length returned."
    }
  ],
  "command-journey": [
    {
      "title": "Reading a file with cat",
      "image": "details/25-command-journey.svg",
      "explanation": "cat copies file contents to standard output. It does not execute commands that happen to be written inside the file.",
      "alt": "Reading a file with cat: cat notes.txt; Read file bytes; Write to output."
    },
    {
      "title": "The shell separates words",
      "image": "details/26-command-journey.svg",
      "explanation": "The shell identifies the command name and its argument. The filename tells cat which file to open.",
      "alt": "The shell separates words: cat notes.txt; Program: cat; Argument: notes.txt."
    },
    {
      "title": "Starting an external tool",
      "image": "details/27-command-journey.svg",
      "explanation": "A common Unix model uses fork followed by exec. Shells can use other mechanisms too; the important idea is a separate process running the tool.",
      "alt": "Starting an external tool: Shell starts child; Child loads program; Tool begins."
    },
    {
      "title": "A missing input file",
      "image": "details/28-command-journey.svg",
      "explanation": "When the file does not exist, cat reports an error on standard error and returns a nonzero exit status.",
      "alt": "A missing input file: cat missing.txt; Open fails; Error on stderr."
    },
    {
      "title": "Redirecting cat's output",
      "image": "details/29-command-journey.svg",
      "explanation": "With cat notes.txt > copy.txt, the shell opens the output file before cat runs. Existing contents of copy.txt are normally replaced.",
      "alt": "Redirecting cat's output: cat notes.txt; stdout redirected; copy.txt receives."
    },
    {
      "title": "Returning to the prompt",
      "image": "details/30-command-journey.svg",
      "explanation": "For a foreground command, the shell normally waits. When the command finishes, the shell can display the next prompt.",
      "alt": "Returning to the prompt: Tool finishes; Shell gets status; Prompt appears."
    }
  ],
  "processes": [
    {
      "title": "Parent and child IDs",
      "image": "details/31-processes.svg",
      "explanation": "Each process has a process ID. A parent-child relationship records who started whom; these numbers are only an illustration.",
      "alt": "Parent and child IDs: Parent PID 100; Starts child; Child PID 101."
    },
    {
      "title": "A process becomes ready",
      "image": "details/32-processes.svg",
      "explanation": "Ready means able to run, not currently executing. The scheduler chooses when a ready thread receives CPU time.",
      "alt": "A process becomes ready: Waiting for data; Data arrives; Ready for CPU."
    },
    {
      "title": "Executing a new program",
      "image": "details/33-processes.svg",
      "explanation": "Successful exec replaces the program image of a process. It does not create a new process or assign a new process ID.",
      "alt": "Executing a new program: Existing process; exec new program; Same process ID."
    },
    {
      "title": "Threads share a process",
      "image": "details/34-processes.svg",
      "explanation": "Threads in a process share memory and many resources. Each thread still needs its own execution state, including a stack.",
      "alt": "Threads share a process: Thread A; Shared address space; Thread B."
    },
    {
      "title": "Collecting an exit status",
      "image": "details/35-processes.svg",
      "explanation": "A terminated child can remain as a zombie entry until its exit status is collected. A zombie is not still running code.",
      "alt": "Collecting an exit status: Child exits; Parent calls wait; Status collected."
    },
    {
      "title": "Requesting a clean stop",
      "image": "details/36-processes.svg",
      "explanation": "SIGTERM asks a program to terminate. A program can handle or ignore it; SIGKILL cannot be caught and does not allow application cleanup.",
      "alt": "Requesting a clean stop: Send SIGTERM; Program handles it; Clean up and exit."
    }
  ],
  "memory": [
    {
      "title": "Virtual to physical memory",
      "image": "details/37-memory.svg",
      "explanation": "A process uses virtual addresses. Hardware and the kernel cooperate to translate mapped addresses to physical memory.",
      "alt": "Virtual to physical memory: Virtual address; Address translation; RAM location."
    },
    {
      "title": "Code, heap and stack",
      "image": "details/38-memory.svg",
      "explanation": "These are useful conceptual regions. The stack tracks function calls, while the heap supports data with lifetimes controlled by the program or runtime.",
      "alt": "Code, heap and stack: Code: instructions; Heap: dynamic data; Stack: call frames."
    },
    {
      "title": "A page fault",
      "image": "details/39-memory.svg",
      "explanation": "A page fault is not always a crash. The kernel may load or allocate a valid page; an invalid access can instead cause a signal.",
      "alt": "A page fault: Page accessed; Mapping checked; Resolve or fault."
    },
    {
      "title": "The file cache",
      "image": "details/40-memory.svg",
      "explanation": "The operating system can cache file data in memory. This reduces storage reads, so memory used for cache can be helpful.",
      "alt": "The file cache: Read file; Keep bytes in RAM; Later read is faster."
    },
    {
      "title": "Swap is slower storage",
      "image": "details/41-memory.svg",
      "explanation": "Systems with swap may move some memory pages to storage. Accessing swapped-out data can be much slower than accessing RAM.",
      "alt": "Swap is slower storage: Less active pages; Move to swap; Load back if needed."
    },
    {
      "title": "Copy-on-write idea",
      "image": "details/42-memory.svg",
      "explanation": "After fork, systems often avoid copying all memory immediately. A write to a shared private page causes a separate copy to be made.",
      "alt": "Copy-on-write idea: Parent and child; Share read-only pages; Copy on modification."
    }
  ],
  "filesystem": [
    {
      "title": "One directory tree",
      "image": "details/43-filesystem.svg",
      "explanation": "An absolute path starts at the root directory. Slashes separate directory names along the route to a file.",
      "alt": "One directory tree: Root: /; Directory: /home; File: /home/a.txt."
    },
    {
      "title": "Resolving a relative path",
      "image": "details/44-filesystem.svg",
      "explanation": "A relative path is interpreted from the current working directory. The same relative name can refer to different files in different directories.",
      "alt": "Resolving a relative path: Current: /home/sam; Path: notes.txt; /home/sam/notes.txt."
    },
    {
      "title": "Name and file identity",
      "image": "details/45-filesystem.svg",
      "explanation": "In an inode-based filesystem, a directory entry associates a name with an inode. The inode describes the file and where its data is stored.",
      "alt": "Name and file identity: Directory entry; Inode identity; File data blocks."
    },
    {
      "title": "Two names for one file",
      "image": "details/46-filesystem.svg",
      "explanation": "A hard link is another directory entry for the same file. Removing one name does not remove the data while other links or open references remain.",
      "alt": "Two names for one file: Name: first.txt; Same inode; Name: second.txt."
    },
    {
      "title": "A symbolic link",
      "image": "details/47-filesystem.svg",
      "explanation": "A symbolic link stores a path to another location. If the target disappears, the link can remain but resolving it fails.",
      "alt": "A symbolic link: shortcut.txt; Stores target path; target.txt."
    },
    {
      "title": "Attaching a filesystem",
      "image": "details/48-filesystem.svg",
      "explanation": "Mounting makes a filesystem accessible at a directory in the existing tree. Previous contents at that location are hidden while the mount is active.",
      "alt": "Attaching a filesystem: Existing tree; Mount at /mnt; New contents appear."
    }
  ],
  "permissions": [
    {
      "title": "Three sets of permissions",
      "image": "details/49-permissions.svg",
      "explanation": "For this example, the owner can read and write, the group can read, and others have no permission. Ordinary mode checks select the applicable class.",
      "alt": "Three sets of permissions: Owner: rw-; Group: r--; Others: ---."
    },
    {
      "title": "Permission numbers",
      "image": "details/50-permissions.svg",
      "explanation": "Add the values for each class. Read plus write is 6; read plus execute is 5. Thus 640 means rw-r-----.",
      "alt": "Permission numbers: Read = 4; Write = 2; Execute = 1."
    },
    {
      "title": "Directory access",
      "image": "details/51-permissions.svg",
      "explanation": "Directory permissions differ from file permissions. Creating or removing entries normally needs both write and execute permission on the directory.",
      "alt": "Directory access: Read: list names; Write: change entries; Execute: traverse."
    },
    {
      "title": "Permission to run a file",
      "image": "details/52-permissions.svg",
      "explanation": "The execute bit alone does not guarantee a runnable program. The file must have a usable format or interpreter, and other access restrictions may apply.",
      "alt": "Permission to run a file: Executable bit; Usable program format; Execution allowed."
    },
    {
      "title": "Default permission mask",
      "image": "details/53-permissions.svg",
      "explanation": "A umask removes permission bits from the mode requested when creating a file. It does not add execute permission to an ordinary new text file.",
      "alt": "Default permission mask: Requested mode; umask removes bits; Final initial mode."
    },
    {
      "title": "Identity affects access",
      "image": "details/54-permissions.svg",
      "explanation": "The same file can be readable by one process and denied to another because they run with different credentials. Extra controls such as ACLs can also matter.",
      "alt": "Identity affects access: User identity; Group memberships; Access decision."
    }
  ],
  "streams": [
    {
      "title": "Three standard streams",
      "image": "details/55-streams.svg",
      "explanation": "Programs commonly inherit these descriptors. Keeping normal results separate from error messages makes redirection and pipelines useful.",
      "alt": "Three standard streams: 0: standard input; 1: standard output; 2: standard error."
    },
    {
      "title": "A simple pipeline",
      "image": "details/56-streams.svg",
      "explanation": "A pipe connects one program's standard output to another's standard input. It carries bytes, not filenames or structured objects.",
      "alt": "A simple pipeline: printf sends text; Pipe holds bytes; wc counts lines."
    },
    {
      "title": "Redirect input from a file",
      "image": "details/57-streams.svg",
      "explanation": "The operator < tells the shell to connect a file to standard input. The program can read it without knowing that a terminal was replaced.",
      "alt": "Redirect input from a file: input.txt; Standard input; Program reads."
    },
    {
      "title": "Append versus replace",
      "image": "details/58-streams.svg",
      "explanation": "Both operators redirect standard output. Choose append when you want to keep existing text and add more at the end.",
      "alt": "Append versus replace: > replaces contents; >> appends contents; Destination file."
    },
    {
      "title": "Separate result and error",
      "image": "details/59-streams.svg",
      "explanation": "The command tool > result.txt 2> error.txt sends normal output and error output to different files. The 2 selects standard error.",
      "alt": "Separate result and error: stdout to result.txt; stderr to error.txt; Two output files."
    },
    {
      "title": "When a pipe fills up",
      "image": "details/60-streams.svg",
      "explanation": "A pipe has limited capacity. A blocking writer waits when it cannot fit more data, so a slow reader can slow the writer.",
      "alt": "When a pipe fills up: Writer produces; Buffer becomes full; Writer waits."
    }
  ],
  "devices-network": [
    {
      "title": "Device files as interfaces",
      "image": "details/61-devices-network.svg",
      "explanation": "A device file provides an interface to a device or kernel facility. Reading it does not necessarily mean reading stored file contents.",
      "alt": "Device files as interfaces: Program opens /dev; Kernel finds driver; Driver handles request."
    },
    {
      "title": "Discarding unwanted output",
      "image": "details/62-devices-network.svg",
      "explanation": "/dev/null accepts and discards writes. Reading from it immediately returns end of file. It is useful when output is intentionally unnecessary.",
      "alt": "Discarding unwanted output: Program output; Redirect to /dev/null; Bytes discarded."
    },
    {
      "title": "Resolving a hostname",
      "image": "details/63-devices-network.svg",
      "explanation": "Name resolution turns a name into an address. A local hosts file or cache may answer before a DNS server is contacted.",
      "alt": "Resolving a hostname: example.com; Name lookup; IP address."
    },
    {
      "title": "Address and port",
      "image": "details/64-devices-network.svg",
      "explanation": "An IP address identifies a network destination. A transport port helps distinguish endpoints on that destination, such as a web server listener.",
      "alt": "Address and port: IP: which host; Port: which endpoint; Server socket."
    },
    {
      "title": "TCP and encryption",
      "image": "details/65-devices-network.svg",
      "explanation": "TCP supplies an ordered byte stream; it does not itself encrypt that stream. HTTPS commonly adds TLS to protect the exchange.",
      "alt": "TCP and encryption: TCP transports bytes; TLS protects data; Application uses data."
    }
  ],
  "boot": [
    {
      "title": "The startup chain",
      "image": "details/66-boot.svg",
      "explanation": "A typical startup begins with firmware, which starts a bootloader or boot path that loads the kernel. Exact steps vary by machine and operating system.",
      "alt": "The startup chain: Firmware; Bootloader; Kernel."
    },
    {
      "title": "Early kernel startup",
      "image": "details/67-boot.svg",
      "explanation": "The kernel prepares essential resources and starts user-space initialization. Some systems use a temporary early filesystem before the final root is available.",
      "alt": "Early kernel startup: Initialize hardware; Prepare root files; Start user space."
    },
    {
      "title": "The first user process",
      "image": "details/68-boot.svg",
      "explanation": "The initial user-space process has a special startup role. Linux commonly uses systemd, but other Unix-like systems use different initialization systems.",
      "alt": "The first user process: Kernel starts init; PID 1 runs; Services start."
    },
    {
      "title": "Opening a login session",
      "image": "details/69-boot.svg",
      "explanation": "Successful authentication allows a user session to begin. A text login commonly starts a shell; a graphical login starts a desktop session.",
      "alt": "Opening a login session: Ask for identity; Authenticate user; Start session."
    },
    {
      "title": "An orderly shutdown",
      "image": "details/70-boot.svg",
      "explanation": "An orderly shutdown allows services to stop and pending writes to be handled. Suddenly cutting power can lose recent data.",
      "alt": "An orderly shutdown: Stop services; Finish filesystem work; Power off."
    }
  ],
  "environment-services": [
    {
      "title": "Passing an environment",
      "image": "details/71-environment-services.svg",
      "explanation": "An exported shell variable becomes part of the environment of future child processes. Changing the child environment does not change the parent's environment.",
      "alt": "Passing an environment: Parent exports value; Child starts; Child inherits value."
    },
    {
      "title": "Local versus exported",
      "image": "details/72-environment-services.svg",
      "explanation": "A shell variable can be local to that shell. Export marks it for inclusion in the environment passed to subsequently started programs.",
      "alt": "Local versus exported: color=blue; export color; Child can read it."
    },
    {
      "title": "Background work",
      "image": "details/73-environment-services.svg",
      "explanation": "The ampersand starts a job asynchronously. This alone does not turn it into a robust service or guarantee it survives logout.",
      "alt": "Background work: Run command &; Shell returns prompt; Command continues."
    },
    {
      "title": "A managed service",
      "image": "details/74-environment-services.svg",
      "explanation": "A service manager can track a service and apply restart policies. Configuration syntax and available behavior differ across operating systems.",
      "alt": "A managed service: Manager starts it; Service does work; Manager tracks it."
    },
    {
      "title": "Service working directory",
      "image": "details/75-environment-services.svg",
      "explanation": "A service may start in a different directory from your terminal. Use an intentional working directory or suitable absolute paths for required files.",
      "alt": "Service working directory: Service starts; Uses its own folder; Resolves relative path."
    }
  ],
  "review": [
    {
      "title": "Investigate missing commands",
      "image": "details/76-review.svg",
      "explanation": "If a command is not found, first check its name, then the search path, then whether it is installed. This is a lookup problem before the program runs.",
      "alt": "Investigate missing commands: Check spelling; Check PATH; Check installation."
    },
    {
      "title": "Investigate denied access",
      "image": "details/77-review.svg",
      "explanation": "Inspect the user and groups plus permissions on the file and parent directories. Do not assume making everything writable is the right fix.",
      "alt": "Investigate denied access: Check identity; Check path permissions; Check extra controls."
    },
    {
      "title": "Investigate slow programs",
      "image": "details/78-review.svg",
      "explanation": "Slow completion has different causes. Identify which resource or wait dominates before deciding what to change.",
      "alt": "Investigate slow programs: CPU work?; Waiting for storage?; Waiting for network?."
    },
    {
      "title": "Investigate a failed connection",
      "image": "details/79-review.svg",
      "explanation": "A network request can fail at several stages. Separating name lookup, connectivity and server listening helps narrow the problem.",
      "alt": "Investigate a failed connection: Resolve hostname; Reach destination; Check listener."
    },
    {
      "title": "Connect the whole story",
      "image": "details/80-review.svg",
      "explanation": "A command combines many ideas: parsing, process creation, access checks, file or network operations, and output. Follow those stages to explain its behavior.",
      "alt": "Connect the whole story: Shell starts tool; Kernel manages I/O; Output reaches user."
    }
  ]
};
