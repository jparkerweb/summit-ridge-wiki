---
name: publish
description: Build a static HTML site at docs/ from the wiki/ directory, styled per DESIGN.md. Wipes and regenerates docs/ on every run. Use when the user asks to publish, build the site, regenerate HTML, or update docs/.
---

# publish

You publish the HOA wiki as a static HTML site under `docs/`, regenerated from scratch on every run. The site mirrors `wiki/`'s layout, with `wiki/<path>.md` becoming `docs/<path>.html`. All styling is derived from `DESIGN.md` (VoiceBox) — never hand-author CSS in a page; always go through the generator.

## Layout

```
DESIGN.md                # design tokens (read)
wiki/                    # markdown source (read)
docs/                    # generated output (wiped and recreated each run)
  index.html
  assets/site.css        # generated from DESIGN.md tokens
  pages/<slug>.html
scripts/publish.mjs      # the generator
package.json             # marked dependency
```

## Procedure

1. **Verify prerequisites.** Confirm `wiki/index.md`, `DESIGN.md`, `scripts/publish.mjs`, and `package.json` exist. If any is missing, stop and report.

2. **Install dependencies if needed.** If `node_modules/marked` is missing, run `npm install` from the repo root. On Windows use PowerShell; the working directory is already the project root.

3. **Run the generator.** Execute `node scripts/publish.mjs` from the repo root. The script will:
   - Delete `docs/` completely and recreate it.
   - Parse color/typography tokens out of `DESIGN.md` and write `docs/assets/site.css`.
   - Parse `wiki/index.md` to build the shared sidebar navigation (categories + page links).
   - Walk every `*.md` under `wiki/` (excluding `wiki/log.md`, which is an internal change log and is not published), render it through `marked`, rewrite `.md` links to `.html`, decorate `(Source: …)` citations, and wrap in the VoiceBox header + sidebar + article layout.
   - Generate `docs/index.html` from `wiki/index.md` with category cards.
   - The masthead nav does not link to the log — only to the index.

4. **Report results.** Report the file count printed by the script plus the path to `docs/index.html`. If the user wants to preview locally, suggest opening `docs/index.html` directly in a browser, or running a one-liner static server (e.g. `npx --yes serve docs`) — do not start a server unless asked.

## Rules

- **Never edit files inside `docs/` by hand.** Everything in `docs/` is regenerated. Manual edits will be lost on the next run.
- **All styling must come from `DESIGN.md`.** If the visual design needs to change, update `DESIGN.md` (tokens) or `scripts/publish.mjs` (layout/component HTML and CSS), then rerun the skill. Do not add inline styles to generated pages.
- **Never modify `wiki/` from this skill.** The publish step is one-way: `wiki/` → `docs/`. If wiki content is stale, that is a `/wiki-sync` job.
- **Never modify `source/`.**
- **Do not commit `node_modules/`.** It is gitignored. `docs/` is committed (this repo uses it as the published output).
- If `marked` is missing and `npm install` is not available in the environment, stop and ask the user how to proceed rather than substituting a different renderer.
