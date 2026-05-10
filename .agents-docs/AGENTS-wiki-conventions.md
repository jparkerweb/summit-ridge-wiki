# Wiki Conventions
> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

Conventions every wiki page must follow. The `/wiki-sync` skill enforces these when generating; manual edits should preserve them.

## Page Structure

1. **Title** — `# <Page Topic>` (kebab-case in filename, Title Case in heading).
2. **Opening summary** — one paragraph stating what the page covers.
3. **Body sections** — organized by sub-topic, with inline citations.
4. **`## Conflicts`** (if applicable) — surface any contradictions between source documents. Do **not** silently resolve.
5. **`## Sources`** — footer listing the source file paths consulted.

## Citations

- **Inline**: After every fact, cite the source section. Example: `(Source: CC&Rs Article IV § 8.D)` or `(Source: Bylaws Article V § 7.6)`.
- **Footer**: Every page ends with a `## Sources` section listing the `source/<file>.md` paths consulted, with the specific articles/sections referenced.
- **Quote verbatim** for dollar amounts, deadlines, percentages, and section numbers.

## Cross-Links

Use relative markdown links between pages: `[parking](parking.md)` from another page in `pages/`, or `[parking](pages/parking.md)` from `index.md`.

## Formatting

- **Markdown only.** No HTML.
- **No emojis** unless the user explicitly asks. The skill instructs the agent never to add emojis to files unless asked.
- **Tables** are appropriate for fee schedules, threshold matrices, Association-vs-Owner responsibility lists.
- **Bold** key terms and dollar amounts on first mention in a section.

## File Naming

- All page filenames are **kebab-case** under `wiki/pages/` (e.g., `assessments-and-fees.md`, `private-open-space-and-wetlands.md`).
- Search `wiki/pages/` before creating a new page — prefer updating an existing page over creating a near-duplicate.

## `index.md`

Regenerated wholesale each sync. Pages are grouped by category (Governance, Financial, Property Use, Architectural and Maintenance, Common Areas and Open Space, Enforcement, History). Each entry is `- [Title](pages/<slug>.md) — one-line description`.

## `log.md`

Append-only. Each sync entry begins with an ISO-8601 timestamp heading like `## 2026-05-09T14:32:00Z — sync` and lists ingested / skipped / created / updated / conflicts / lint findings.

## `.manifest.json`

```json
{
  "<source filename>": {
    "sha256": "<uppercase hex>",
    "synced_at": "<ISO-8601>"
  }
}
```

Rewritten atomically each sync. Empty manifest is `{}`.
