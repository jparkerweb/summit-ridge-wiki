# Architecture
> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

## Three Layers

| Layer       | What it is                                       | Who writes it                  |
| ----------- | ------------------------------------------------ | ------------------------------ |
| **Sources** | Bylaws, CC&Rs, Rules — verbatim                  | The HOA (user only curates)    |
| **Wiki**    | Synthesized topic pages, index, log, manifest    | The LLM, via `/wiki-sync`      |
| **Skills**  | Slash-command prompts                            | User (already set up)          |

Data flow is one-way: `source/` → `wiki/`. Answers (`/ask`) read from `wiki/` and cite back to `source/`. No process ever writes to `source/`.

## Directory Layout

```
20-Summit-Ridge-Wiki/
├── README.md                  ← project intro (human-facing)
├── AGENTS.md                  ← this guide's index
├── .agents-docs/              ← AGENTS.md detail files
├── source/                    ← immutable governing documents
│   ├── 2025-10-11 Bylaws.md
│   ├── 2025-10-11 CC&Rs.md
│   └── 2025-10-11 Rules and Regulations.md
├── wiki/                      ← LLM-generated, citation-bearing
│   ├── index.md               ← categorized catalog (regenerated each sync)
│   ├── log.md                 ← append-only chronological record
│   ├── .manifest.json         ← { "<source filename>": { "sha256": "...", "synced_at": "ISO-8601" } }
│   └── pages/                 ← one markdown file per HOA topic
└── .claude/
    └── skills/
        ├── wiki-sync/SKILL.md
        └── ask/SKILL.md
```

## Why Hashes (not mtimes)

`wiki/.manifest.json` stores SHA-256 of each source file's bytes at last sync. Modification times change on file copy, OneDrive/Dropbox sync, or git checkout even when content is identical — hashes do not. The manifest is rewritten atomically on every sync (full-file rewrite is fine; it's small).

## Why a Wiki (not raw RAG)

RAG retrieves chunks; the wiki *synthesizes*. When CC&Rs and Rules and Regulations both cover the same topic with different specificity, the corresponding wiki page consolidates them under one section and flags any disagreement under `## Conflicts`. This produces one coherent answer instead of two retrieved fragments the user has to reconcile.

## Why Cite Both Layers

Every fact in the wiki cites the source section (legally authoritative) inline, and the page footer lists the source file path consulted. The wiki page is what the LLM read to answer; the source section is what's authoritative if the user needs to quote it to a board member, neighbor, or attorney.
