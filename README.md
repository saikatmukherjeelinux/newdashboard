# Motion Lab dashboard

https://saikatmukherjeelinux.github.io/dashboard_All/

Three standalone learning projects share this static dashboard:

| Project | Learning experience |
|---|---|
| [Python Motion Lab](python-motion-lab/index.html) | Python concepts, worked examples, visual experiments, quizzes and flashcards |
| [DSA Motion Lab](dsa-motion-lab/index.html) | Algorithm animations, Python implementations, interview questions and quizzes |
| [Unix Motion Lab](unix-motion-lab/index.html) | 80 command/shell lessons, 240 examples with outputs, flag explanations, pipeline simulation, 80 quiz questions and flashcards |

Open `index.html` to choose a lab. No application build is required. To preview over HTTP, run `python -m http.server 4173` from this directory and open `http://localhost:4173/`.

The dashboard uses plain HTML, CSS and JavaScript; its character animations are separate scripts. Python and DSA each maintain their own lesson assets and browser state. Unix follows that architecture, with a separate content bank and storage key, and integrates through relative navigation links. The existing lesson engines and character scripts are unchanged.

See [Unix project documentation](unix-motion-lab/README.md) for scope, platform assumptions, practice-file setup and validation commands.
