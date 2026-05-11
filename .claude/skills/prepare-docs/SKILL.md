---
name: prepare-docs
description: Convert every PDF in source/ into an AI-readable markdown file alongside it, then delete the original PDF. Run once after dropping new PDFs into source/ so that wiki-sync can ingest them.
---

# prepare-docs

You are preparing raw PDF documents in `source/` for downstream consumption by `wiki-sync` and `/ask`. PDFs are not directly readable by the wiki pipeline — this skill converts each PDF into a clean, faithful markdown rendering and removes the PDF once the markdown is in place.

This skill is the **only** legitimate way to write into `source/`. After this skill runs, `source/` returns to read-only ground truth.

## Procedure

1. **Discover PDFs.** List every PDF in `source/` (non-recursive), matching the `.pdf` extension **case-insensitively** (so `.pdf`, `.PDF`, `.Pdf`, etc. are all included). The Glob tool's `*.pdf` pattern is case-sensitive on some platforms — prefer a case-insensitive listing such as `Bash` with `ls source/ | grep -iE '\.pdf$'` or PowerShell `Get-ChildItem source/ -Filter *.pdf` (which is case-insensitive on Windows). If none, tell the user "No PDFs to prepare." and stop.

2. **Report the plan.** Print the list of PDFs that will be converted and the target markdown filenames. For each PDF `source/<name>.<ext>` (where `<ext>` is any case of `pdf`), the target is `source/<name>.md` — same base name, lowercase `.md` extension, regardless of the source extension's case. Wait for user confirmation before proceeding unless the user already said "go" / "do it" / "yes" when invoking the skill.

3. **Pre-flight check.** For each PDF:
   - If `source/<name>.md` already exists, **do not overwrite silently**. Ask the user: keep existing, overwrite, or skip this PDF.
   - If the base name collides with another PDF after normalization (including case-only differences in the extension), ask the user how to disambiguate.

4. **Convert each PDF to markdown.** Read the PDF with the Read tool (use the `pages` parameter for PDFs longer than 10 pages, in chunks of up to 20 pages). For each PDF, write `source/<name>.md` following the **Markdown Output Format** below.

5. **Verify the markdown.** Before deleting the PDF:
   - Confirm the `.md` file exists, is non-empty, and ends with a `## Provenance` footer.
   - Spot-check that section numbers, dollar amounts, dates, and signatory names from the PDF appear verbatim in the markdown.
   - If anything looks truncated or malformed, stop and report — **do not delete the PDF**.

6. **Delete the PDF.** Only after the markdown is written and verified, delete the original PDF using its **exact** filename (preserving the original extension case — e.g., `.PDF` if that's how it was on disk). PowerShell: `Remove-Item "source/<exact-filename>"`.

7. **Report results.** List each conversion: PDF → MD, page count, anything skipped or flagged. Remind the user to run `/wiki-sync` next so the new markdown is ingested into the wiki.

## Markdown Output Format

The output must be optimized for LLM ingestion — faithful, structured, and verbatim where it matters. Treat the PDF as authoritative; do not summarize or paraphrase legal/financial content.

### Header (top of file)

```
# <Document Title — taken from the PDF cover or first heading>

> Converted from `<original-pdf-filename>.pdf` on <ISO-8601 date>.
> Source of truth: the PDF was the original; this markdown is a verbatim transcription.
```

### Body

- **Preserve the document's own structure.** Use `##`, `###`, `####` to mirror the PDF's headings, articles, sections, exhibits, schedules, etc.
- **Quote verbatim.** Legal and financial documents must be transcribed word-for-word. Do not normalize, modernize, or "clean up" language. Preserve original capitalization, defined-term casing (e.g., `Owner`, `Lot`, `Common Properties`), and punctuation.
- **Preserve section numbers and labels exactly** (e.g., `Article IV § 4`, `Section 8.B(3)`, `Exhibit A`).
- **Tables → markdown tables.** Convert every table to a GitHub-flavored markdown table. Keep column headers and row labels verbatim. If a table is too wide or complex, fall back to a definition list or nested bullets and add a `<!-- table:original -->` HTML comment noting the original layout. Always include monetary values, percentages, and dates exactly as printed.
- **Lists → markdown lists.** Numbered lists become `1.`/`2.`/... ordered lists; bulleted lists become `-` unordered lists.
- **Signature blocks.** Render as a `### Signatures` subsection with each signatory's name, title, and date on its own line.
- **Recording stamps / notarizations.** Render as a `### Recording` or `### Notarization` subsection, verbatim including recording number, county, and date.
- **Dollar amounts, percentages, dates, deadlines, vote thresholds.** Always preserve the exact figure and unit from the PDF. Never round, convert, or restate.

### What to strip

- Repeated page headers and footers (e.g., "Page 3 of 27", running document titles on every page).
- Bates numbers or scan artifacts that aren't part of the document content.
- Blank lines from PDF pagination.

### What to preserve even if it looks like noise

- Original page-anchored footnotes (move them inline as `> Footnote: ...` blockquotes near the referencing text).
- Stamped exhibits, attachments, and addenda — each as its own `## Exhibit X` or `## Attachment X` section, in the order they appear.
- Handwritten annotations or stamps that carry legal weight (initials by a clause, "VOID" stamps, recording stamps). Render as `> [Handwritten/Stamped: ...]`.

### Footer (bottom of file)

```
## Provenance

- Original file: `<original-pdf-filename>.pdf`
- Pages: <N>
- Converted: <ISO-8601 timestamp>
- Converter: prepare-docs skill
```

## Rules

- **Never modify the PDF.** Read-only until the conversion is verified, then delete.
- **Do not delete a PDF unless its markdown counterpart exists and passes the verification spot-check.** If in doubt, leave the PDF in place and report the issue.
- **Never summarize or paraphrase.** This skill produces transcriptions, not summaries. If the PDF contains a 12-page schedule of fees, the markdown contains all 12 pages of fees.
- **Never invent content** to fill OCR gaps. If a page is unreadable or scanned poorly, render the readable parts and insert `> [Unreadable in source — see original PDF, page N]` where text is missing. In that case, **do not delete the PDF** even if other pages converted cleanly — leave it next to the markdown and report so the user can decide.
- Markdown only. No HTML except the table-fallback comment noted above. No emojis.
- Do not rename PDFs. Use the existing base filename (with `.md` instead of `.pdf`) so the user can match converted files to their originals.
- The output of this skill changes what `wiki-sync` sees. Remind the user to run `/wiki-sync` after `prepare-docs` finishes so the new markdown is hashed and ingested.
