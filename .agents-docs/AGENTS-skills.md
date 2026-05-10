# Skills
> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

Two project-local skills live under `.claude/skills/`. Their full behavior is in their `SKILL.md` files; this page summarizes what an agent needs to know to use or modify them.

## `/wiki-sync`

**Purpose:** Build or incrementally update the wiki from `source/`.

**Procedure (high level):**
1. Bootstrap missing structure (`wiki/`, `wiki/pages/`, `index.md`, `log.md`, `.manifest.json`).
2. SHA-256 every file in `source/` and compare to manifest. Classify as **unchanged**, **new**, **changed**, or **removed**.
3. Skip unchanged. Read full content of new and changed files. For removed files, **flag in log; do not auto-delete pages** — ask the user.
4. Extract topics, entities, rules, dates, dollar amounts, parties. Create or update pages under `wiki/pages/`. One page per coherent topic; cite source sections inline; cross-link with relative markdown links.
5. Regenerate `index.md` (grouped by category — Governance, Financial, Property Use, Architectural, Enforcement, Common Areas, History).
6. Append a timestamped entry to `log.md` listing ingested / skipped / created / updated / conflicts.
7. Rewrite `.manifest.json` with new hashes and `synced_at` timestamps.
8. Lint pass: stale cross-links, orphaned pages, contradictions. Report; don't auto-fix substantive contradictions.
9. Report counts and any items needing human attention.

## `/ask`

**Purpose:** Answer HOA questions using `wiki/` as authoritative context, with citations.

**Behavior:**
- If invoked with no arguments, prompts the user for a question.
- Reads from `wiki/` only; cites the wiki page AND the original source section.
- If the wiki doesn't cover the topic, says so explicitly rather than guessing.

## Editing Skills

The skills are plain-markdown prompts. To change agent behavior, edit `.claude/skills/wiki-sync/SKILL.md` or `.claude/skills/ask/SKILL.md` directly. Examples of customization:
- Tighten the citation format
- Add a `lint` mode
- Change index categorization
- Have `/ask` log valuable Q&A back into the wiki as new pages

After editing, restart Claude Code or run `/clear` for skill changes to take effect.
