---
name: wiki-sync
description: Build or incrementally update the HOA wiki from documents in source/. Detects changed source files via SHA-256 hashes and only re-ingests what changed. Run after adding, editing, or removing files in source/.
---

# wiki-sync

You are maintaining an LLM-authored wiki at `wiki/` derived from authoritative HOA documents in `source/`. The wiki is the persistent, compounding artifact users will query — `source/` is read-only ground truth.

## Layout

```
source/                  # immutable inputs (you READ only, never write)
wiki/
  index.md               # categorized catalog of all wiki pages
  log.md                 # append-only chronological record
  .manifest.json         # { "<source filename>": { "sha256": "...", "synced_at": "ISO-8601" } }
  pages/                 # one markdown file per topic/entity/concept
```

## Procedure

1. **Bootstrap if missing.** If `wiki/`, `wiki/pages/`, `wiki/index.md`, `wiki/log.md`, or `wiki/.manifest.json` don't exist, create them. Empty `.manifest.json` is `{}`.

2. **Hash every source file.** For each file in `source/`, compute SHA-256 of its bytes. In PowerShell: `Get-FileHash -Algorithm SHA256 "source/<file>"`. Compare against `wiki/.manifest.json`.

3. **Classify each source file:**
   - **unchanged** — hash matches manifest → skip
   - **new** — not in manifest → ingest fully
   - **changed** — hash differs → re-ingest (read full file, reconcile against existing pages)
   - **removed** — in manifest but file gone → flag in log; do NOT auto-delete pages (the user may still want the historical content). Note the removal in `log.md` and ask the user how to handle it.

4. **Ingest new/changed files.** Read the full source. Extract topics, entities, rules, definitions, dates, dollar amounts, responsible parties. Then either create new pages under `wiki/pages/` or update existing ones. Page guidelines:
   - One page per coherent topic (e.g. `pets.md`, `parking.md`, `architectural-modifications.md`, `assessments-and-fees.md`, `board-elections.md`, `enforcement-and-fines.md`).
   - Each page begins with a one-paragraph summary, then organized sections.
   - **Always cite the source section.** Format: `(Source: CC&Rs § 4.2)` or `(Source: Rules and Regulations § III.B)` inline after each fact, plus a `## Sources` footer listing source file paths consulted.
   - When sources conflict, surface the contradiction explicitly under a `## Conflicts` heading rather than silently picking one.
   - Cross-link pages with relative markdown links: `[parking](parking.md)`.

5. **Update `index.md`.** Group pages by category (Governance, Financial, Property Use, Architectural, Enforcement, Common Areas, etc.). Keep it terse — title + one-line description per page. Regenerate the whole file each sync to reflect current state.

6. **Append to `log.md`.** One entry per sync run with ISO-8601 timestamp:
   ```
   ## 2026-05-09T14:32:00Z — sync
   - Ingested: <file> (new|changed)
   - Skipped (unchanged): <file>
   - Pages created: pets.md, parking.md
   - Pages updated: assessments.md
   - Conflicts surfaced: <page>: <brief>
   ```

7. **Update `.manifest.json`** with new hashes and `synced_at` timestamps for every file processed. Write atomically (full rewrite is fine — file is small).

8. **Lint pass** (only if any file changed this run): scan all pages for stale cross-links, orphaned pages (not referenced by index), and obvious contradictions. Report findings in the log entry; don't auto-fix substantive contradictions — flag them.

9. **Report** to the user: counts of new/changed/skipped/removed, list of pages touched, any conflicts or lint findings needing human attention.

## Rules

- Never modify `source/`.
- Never invent facts. If the source is silent on something, the wiki must be silent on it.
- Quote exact dollar amounts, deadlines, and section numbers verbatim from source.
- Prefer updating existing pages over creating near-duplicates. Search `wiki/pages/` before creating a new page.
- Markdown only. No HTML. No emojis unless the user asked for them.
