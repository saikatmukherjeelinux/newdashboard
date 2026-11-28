/* Correct the introductory GIL lesson without regenerating the imported lesson bank. */
(()=>{const lesson=window.LESSONS?.find(l=>l.id===1);if(!lesson)return;lesson.body=`## Start with the build you are using

In a GIL-enabled CPython build, the Global Interpreter Lock limits simultaneous execution of Python bytecode by threads within an interpreter. Threads can still help with waiting for input/output, and some native extensions release the GIL during work.

## Free-threaded Python

CPython has offered optional free-threaded builds since Python 3.13. In those builds, threads can execute Python code in parallel when the GIL is disabled. Extension compatibility matters: an unsupported extension can cause the GIL to be enabled. Check the actual build and runtime rather than assuming all Python installations behave the same way.

## Shared state still needs care

Neither a GIL nor internal container locks make a multi-step application operation automatically safe. Use an appropriate synchronization primitive or communication design for shared mutable state. Processes are another option for parallel work, with separate memory and communication costs.

## Remember

Concurrency means tasks can make overlapping progress; parallelism means work executes at the same time. Their performance depends on the workload, implementation and runtime.

Further reading: [Python free-threading guide](https://docs.python.org/3/howto/free-threading-python.html) and [threading documentation](https://docs.python.org/3/library/threading.html).
`;})();
