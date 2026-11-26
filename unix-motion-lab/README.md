# Unix Motion Lab

A third learning project alongside Python Motion Lab and DSA Motion Lab. Open `index.html` directly, or serve the entire parent dashboard directory using `python -m http.server 4173` and visit `http://localhost:4173/unix-motion-lab/`.

No build, backend, external font, CDN or package installation is needed to use the app. The parent dashboard links to all three projects, and Unix links back to the dashboard and its sibling labs. Deploy the parent directory together to preserve these relative links.

## Learning material

- **80 lessons**, each with syntax, common flags and operands, conceptual explanation, pitfalls, a short takeaway and a manual reference.
- **280 worked examples** with commands, expected or explicitly illustrative output, and an explanation of why that output appears.
- **40 new in-depth scenarios across 20 lessons**, bringing those lessons to five examples each. Every addition includes a concrete task, three reasoning steps, an example-specific option/symbol glossary, a common mistake, and a practice question with a revealable answer. Choose **40 new in-depth examples** in the catalog collection filter or use the lesson’s jump link to reach examples 4 and 5.
- **80 authored quiz questions**, one per lesson, with four shuffled choices, first-answer locking, explanations, topic and session-length selection, saved sessions, results and retry of missed/unanswered questions.
- Plain-language introductions and “when would I use it?” guidance for **all 80 lessons**, plus **240 authored walkthrough steps** explaining each lesson’s first worked example. Every example retains its output explanation; relevant practice-file contents can be expanded beside the example.
- A **20-term beginner glossary** covering files, folders, paths, flags, arguments, streams, pipes, processes, permissions and other foundational vocabulary.
- A simple command catalog with search, topic and collection filters, five optional guided learning paths, and a Continue learning button. Previous/next follows the selected path or filters; Next unfinished skips completed work.
- A quieter lesson screen with optional deeper detail, a closed-by-default command index, larger-text and code-wrap preferences, quick lesson-section buttons, and a compact mobile section selector. The mobile command drawer supports Escape, a close button, a backdrop and keyboard focus containment.
- Search across lesson content, category/status filters, bookmarks, completion, deep links, copy buttons, collapsible index, dark/light themes and browser-local progress.

Topics cover shell anatomy/help; navigation and files; reading text; grep/regex/find; sort/uniq/cut/tr/sed/awk/xargs/diff; quoting, expansions, redirections, pipes and statuses; environment variables; permissions/identity; processes and signals; system/disk/network inspection; archives; curl/SSH; loops, conditions, functions, debugging, traps and temporary files.

This is a substantial practical course, **not an exhaustive specification of every Unix utility or every version-specific flag**. Each lesson links to the relevant manual for full option coverage. Bash and GNU/Linux are the baseline. GNU-only syntax, interactive behavior, Linux-only networking tools and common macOS/BSD differences are identified.

## Industry practice: 300 coding questions

Open **Industry practice** from the Unix navigation, mobile section selector, or catalog link. Direct link: `index.html#industry`. Questions use stable links from `#industry/ops-001` to `#industry/ops-300`.

Each question contains a task and starting conditions, copyable setup and solution, expected or illustrative output, three detailed explanation steps covering the commands and relevant flags, a specific summary, and a documentation reference. Answers are folded initially so learners can attempt the task first. Search covers the question, commands, flags and explanations; results show 20 questions per page. Topic and completion/saved filters, previous/next navigation and browser-local progress keep the section manageable.

The 15 topics each contain 20 independently scoped questions:

| Topics 1–5 | Topics 6–10 | Topics 11–15 |
|---|---|---|
| Log analysis | Permissions and access | Services |
| Delimited reports | Shell logic | Archives and backups |
| Text cleanup | Reliable scripts | Data comparison |
| File discovery | Processes | Release workflows |
| File lifecycle | Networking | Incident triage |

These are authored industry-style exercises, not questions attributed to real company interviews. Foundational tasks build toward production concerns such as failure propagation, NUL-safe filenames, restoration checks, release switching and incident evidence. The 300 questions are separate from the existing 280 lesson examples and 80 multiple-choice quizzes.

**Output conventions:** 237 exercises have fixed outputs from supplied disposable fixtures. The other 63 use illustrative host or identity outputs, clearly labeled in the UI. Host responses can be abbreviated and differ by user, privileges, clock, process state and network. Shell commands are never executed by the page. Practice requires Bash on Linux with GNU tools; PowerShell does not interpret these examples. Start a new temporary directory for each fixture question. Some operational commands require procps, iproute2, systemd, DNS tools, psmisc or lsof. The examples do not constitute complete production deployment or backup procedures.

Source: `assets/industry-data.js` holds the 300 question records, `assets/industry.js` handles the isolated practice UI, and `assets/industry.css` supplies its responsive layout. Progress uses the separate `unix-industry-practice-v1` browser-storage key.

Validation from the repository root:

```sh
node unix-motion-lab/tests/industry.cjs
node unix-motion-lab/tests/industry-browser.cjs
# On Linux with Node, Bash, GNU utilities, awk and diffutils:
python3 unix-motion-lab/tests/industry-examples.py
```

The browser test requires Playwright and a supported browser (Edge on Windows). It checks all 300 displayed solutions, outputs, explanations and summaries, plus filters, pagination, copying, persistence and mobile layout. The Linux verifier runs only the 237 fixed-output exercises, each in a fresh temporary directory, comparing stdout, stderr and status. It never runs the 63 host/identity examples or network requests. The verifier is included for Linux validation; authoring on Windows does not constitute executing these Bash examples.

## Example conventions

Expand **Start here: practice files & output conventions** in Learn commands. The setup creates a fresh temporary directory, sets `LC_ALL=C`, and creates the exact files used in the examples. Each example starts independently after that setup. Commands with fixed content show expected output; dates, PIDs, usernames, filesystem allocation, network replies and interactive displays show illustrative output or excerpts.

The page never executes shell commands. Use Bash on Linux or WSL to practice. PowerShell is not a compatible interpreter. File-changing examples are limited to practice files; ownership and remote examples explicitly require an appropriate account/environment. Browser storage is separate from the Python/DSA apps; changing origin or clearing browser data resets local progress.

## Source files

| File | Purpose |
|---|---|
| `index.html` | Accessible application shell and practice conventions |
| `assets/lessons.js` | Authored lessons, flags and examples |
| `assets/quizzes.js` | Authored quiz bank |
| `assets/lessons-more.js` | 28 additional lessons, 84 worked examples and 28 additional quizzes |
| `assets/beginners.js` | 80 plain-language guides, first-example walkthroughs and glossary |
| `assets/deep-examples.js` | 40 detailed scenarios attached to the existing lesson IDs |
| `assets/app.js` | Navigation, persistence, learning modes and simulation |
| `assets/style.css` | Responsive dark/light design |
| `tests/content.cjs` | Lesson/quiz consistency and local link checks |
| `tests/browser.cjs` | Full lesson/quiz navigation and interaction checks |
| `tests/examples.py` | Linux verifier for deterministic example stdout/status |

## Verification

```sh
node tests/content.cjs
node --check assets/app.js
node tests/browser.cjs
python3 tests/examples.py
```

The browser test requires Playwright and Chromium (or installed Microsoft Edge on Windows). Set `UML_PLAYWRIGHT_PATH` to an existing Playwright package path, or supply it through `NODE_PATH`. The app itself has no such dependency. Tests save preview screenshots under `test-results/`.

The example verifier requires Linux, Bash, Node.js and the standard GNU utilities used in the lessons. It creates a separate temporary fixture per deterministic example and excludes illustrative/network/interactive examples. It must not be represented as having passed unless actually run on a suitable system.

The expanded verifier also needs `rsync`, `zip` and `unzip` for those lessons. Run content and browser checks after changes to the original or expanded banks; both test suites load the complete collection through `tests/load-content.cjs`. Existing lesson IDs, bookmarks, completion and saved quiz sessions remain compatible.

On the Windows authoring environment, content checks and browser interactions were exercised in Edge. Unix command outputs remain authored expectations rather than locally executed results because Bash/WSL is unavailable. Machine-dependent output is explicitly labeled as a sample.

## References

Core concepts follow the [GNU Coreutils manual](https://www.gnu.org/software/coreutils/manual/coreutils.html), [Bash manual](https://www.gnu.org/software/bash/manual/bash.html), [Grep manual](https://www.gnu.org/software/grep/manual/grep.html), [Findutils manual](https://www.gnu.org/software/findutils/manual/html_mono/find.html), [Sed manual](https://www.gnu.org/software/sed/manual/sed.html), [Awk manual](https://www.gnu.org/software/gawk/manual/gawk.html), [Tar manual](https://www.gnu.org/software/tar/manual/tar.html), [curl manual](https://curl.se/docs/manpage.html), and [OpenBSD SSH manual](https://man.openbsd.org/ssh). Use your installed tool's local manual for exact version behavior.

## Unix Architecture

Open **Unix Architecture** in the section navigation or `index.html#architecture`.
There are 14 chapters and 11 original SVG diagrams: overview, terminal/shell,
kernel, system calls, the path of a command, processes, memory, filesystem,
permissions, streams, devices/networking, boot, sessions/services, and review.
Every chapter includes plain-language explanations, a takeaway, a glossary and
a public reference. Commands identify flags and distinguish illustrative results
from fixed sample output. Linux-specific details are labeled rather than presented
as universal Unix behavior.

The overview offers a layer explorer; the command chapter has an eight-step
walkthrough. Diagrams have text alternatives, captions and full-size links.
Navigation works by chapter links, a mobile selector and previous/next controls.
The standalone Pipeline Lab and Flashcards sections have been removed; the
lesson on pipes and the architectural explanation of streams remain.

Sources are `assets/architecture-data.js`, `assets/architecture.js` and
`assets/architecture.css`. Regenerate diagrams with
`python unix-motion-lab/scripts/build-architecture-diagrams.py` from the repository
root. Run `node unix-motion-lab/tests/architecture.cjs` for content validation and
`node unix-motion-lab/tests/architecture-browser.cjs` for browser checks.
