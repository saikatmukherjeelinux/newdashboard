# Motion Lab dashboard

[Open the dashboard website](https://saikatmukherjeelinux.github.io/newdashboard/)

Three standalone learning projects share this static dashboard:

| Project | Learning experience |
|---|---|
| [Python Motion Lab](https://saikatmukherjeelinux.github.io/newdashboard/python-motion-lab/) | Python concepts, worked examples, visual experiments, quizzes and flashcards |
| [DSA Motion Lab](https://saikatmukherjeelinux.github.io/newdashboard/dsa-motion-lab/) | Algorithm animations, Python implementations, interview questions and quizzes |
| [Unix Motion Lab](https://saikatmukherjeelinux.github.io/newdashboard/unix-motion-lab/) | 80 command/shell lessons, 240 examples with outputs, flag explanations, pipeline simulation, 80 quiz questions and flashcards |

These website links use the `newdashboard` repository. The older `/dashboard_All/` URL opens a different deployment. On github.com, clicking an HTML source file shows its code; use the website links above to run the dashboard.

If the website is not published yet, open this repository's **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then **Save**. Wait for the Pages deployment to finish before opening the website. See [GitHub's publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Keep the root `index.html` and all three lab folders together.

Open `index.html` to choose a lab. No application build is required. To preview over HTTP, run `python -m http.server 4173` from this directory and open `http://localhost:4173/`.

The dashboard uses plain HTML, CSS and JavaScript; its character animations are separate scripts. Python and DSA each maintain their own lesson assets and browser state. Unix follows that architecture, with a separate content bank and storage key, and integrates through relative navigation links. The existing lesson engines and character scripts are unchanged.

See [Unix project documentation](unix-motion-lab/README.md) for scope, platform assumptions, practice-file setup and validation commands.

## Updating through Git

Work in a clone of `https://github.com/saikatmukherjeelinux/newdashboard.git`. Before starting new edits, run `git pull --ff-only origin main`. Add each new learning project as a folder beside the existing labs, then add its relative link to the root `index.html`.

For example, after creating `sql-motion-lab/` and updating the dashboard:

```sh
git status
git add sql-motion-lab/ index.html
git diff --cached --stat
git commit -m "Add SQL Motion Lab"
git push origin main
```

Replace the example folder with the project you actually added. When Pages is configured for `main` and `/(root)`, pushing updates triggers deployment. The root `.gitignore` prevents new generated test outputs, dependency folders and local environment files from being added accidentally; it does not untrack files already uploaded in earlier commits.
