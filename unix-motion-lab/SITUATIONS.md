# Situational scripts for every command lesson

All 80 command/shell lesson IDs have a distinct situation-based program. This is separate from the 15 broader section programs. Find **Situation: …** after a command's shorter examples, then expand **Complete script, flags and output**.

Each situation includes:

- A concrete task using fictional input or a clearly described read-only system inspection.
- A complete Bash script with dependency checks and a disposable working directory.
- Sample output, explicitly marked as fixed-fixture or illustrative/machine-dependent.
- Four explanatory steps, command-specific flags, shared setup explanations and a practice variation.
- A link to the command's existing public manual reference.

The scripts target Bash and GNU utilities. Optional utilities and Linux-only tools are listed per scenario. SSH is a configuration/command preview, not a remote upload. The curl example uses a local file URL. DNS runs only if the reader chooses to execute that example. Service and journal inspection do not start, stop or delete anything. No private chats, employer infrastructure, credentials or production log data are included.

## Validation

All 80 scripts passed Bash syntax checks with the Bash executable bundled in the Git runtime on the Windows authoring machine. Among 57 fixed-fixture scripts, **37 executed with exact matching output**, while **20 could not execute because required GNU/Unix utilities were unavailable**. The other **23 scripts have interactive or machine-dependent results** and were not executed by the validation runner. Native Linux was not separately tested.

Execution checks use only the bundled GNU tool directory on PATH to avoid confusing Windows commands such as `timeout` with GNU utilities. Each run has a newly allocated temporary root, and TMPDIR confines nested practice directories to that root. The runner does not execute interactive, live-system or external-network cases. Code hashes prevent a changed script from inheriting an old verification label.

The browser test visits all 80 lessons at desktop and mobile widths, checking script/output text, flag and explanation display, verification labels, copy behavior and changing lessons.

## Maintenance

Authored sources:

- `scripts/unix_situations.py`
- `scripts/unix_situations_more.py`
- `scripts/unix_situations_tools.py`

Build with `python scripts/build-unix-situations.py`. Validate with `python scripts/check-unix-situations.py --shell PATH_TO_BASH --execute`, then rebuild to incorporate the hash-matched results. Browser validation uses `node scripts/test-unix-situations.cjs` with the existing Playwright environment setting.

Generated files are `assets/situations-data.js`, `scripts/unix-situations.json` and the validation report `scripts/unix-situations-checks.json`. Rendering is implemented in `assets/situations-ui.js`; it follows the selected lesson without adding navigation tabs.
