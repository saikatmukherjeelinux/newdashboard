# Complete section programs

Each topic group has one complete, runnable program shared by lessons in that group. This is section-level coverage, not a claim that every individual lesson has a distinct new program. The existing shorter topic examples remain available.

| Lab | Section programs |
| --- | ---: |
| Python | 6 |
| DSA | 34 |
| Unix | 15: 13 command groups, Industry Practice and Unix Architecture |
| ML | 10 |
| Statistics | 12 |
| Total | 77 |

Open **Browse → Complete section programs**, or expand **Complete section program** below a lesson. The standalone reader has one selector for changing sections or returning to the lab. Every program includes run instructions, full code, output, explained steps, interpretation and a practice variation.

## Source and validation

All examples use fictional data and local fixtures. The DSA projects extend existing public teaching implementations with named scenarios and checks. No employer infrastructure, private conversations, production logs or credentials are used.

The 62 Python programs use the standard library. `python scripts/build-section-projects.py` executes them in separate temporary directories with `python -I`, checks their assertions, and captures their actual output. The run fails when an assertion or program fails; generated output is not substituted for the independent assertions.

The 15 Bash programs target Bash with GNU utilities. Their output is authored and **has not been shell-executed on the Windows authoring host**. They work in newly created temporary directories and remove those directories at exit. Shell differences on macOS/BSD can change options or behavior.

`node scripts/test-section-projects.cjs` checks all 77 displayed programs and outputs, mobile overflow, copy buttons, menu access and inline coverage of all topic groups. It uses the configured Playwright package and Microsoft Edge, as the other local browser checks do.

## Maintenance

Edit `scripts/section_projects.py`, `scripts/dsa_section_projects.py` or `scripts/unix_section_projects.py`, then rebuild with `python scripts/build-section-projects.py`. The resulting JSON and JavaScript banks are generated files. The browser renderer is `section-projects-ui.js`. The installer adds the data scripts and the Browse entry without replacing existing lesson engines.

Statistics and ML examples demonstrate mechanics with small datasets; the accompanying assumptions and limitations matter. Assertions verify selected calculations and scenarios, not universal algorithm correctness or the validity of an analysis on arbitrary real data.
