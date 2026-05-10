# 20 Summit Ridge Wiki

An LLM-maintained knowledge base for the Summit Ridge townhome HOA. Authoritative governing documents live in `source/`; an AI assistant synthesizes them into a structured wiki under `wiki/` that you can query in plain English.

Inspired by [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — instead of doing one-shot RAG over raw documents on every question, the LLM incrementally builds and maintains a persistent, cross-linked markdown wiki. Knowledge compounds; contradictions get flagged once, not rediscovered every query.

---

## Why this exists

HOA governing documents are long, overlapping, and full of cross-references (CC&Rs reference Bylaws, Rules reference CC&Rs, etc.). When you have a specific question — *"Can I install a satellite dish?"*, *"What's the late fee on assessments?"*, *"Do I need board approval to repaint?"* — you don't want to skim 200 pages. You want a direct answer with the exact section cited.

This project gives you:

1. A **wiki** the LLM writes and maintains for you, organized by topic.
2. An **ask** command that answers questions using the wiki as authoritative context, with citations back to the original source sections.
3. A **sync** command that incrementally rebuilds the wiki when source documents change — no redundant work, only files whose SHA-256 hash changed get re-ingested.

---

## Project layout

```
20-Summit-Ridge-Wiki/
├── README.md                  ← you are here
├── source/                    ← immutable governing documents (read-only ground truth)
│   ├── 2025-10-11 Bylaws.md
│   ├── 2025-10-11 CC&Rs.md
│   └── 2025-10-11 Rules and Regulations.md
├── wiki/                      ← LLM-generated knowledge base (created on first sync)
│   ├── index.md               ← categorized catalog of every wiki page
│   ├── log.md                 ← append-only chronological record of sync runs
│   ├── .manifest.json         ← SHA-256 hashes of source files at last sync
│   └── pages/                 ← one markdown file per topic (pets, parking, fees, …)
└── .claude/
    └── skills/
        ├── wiki-sync/         ← skill that builds & updates the wiki
        │   └── SKILL.md
        └── ask/               ← skill that answers questions from the wiki
            └── SKILL.md
```

### The three layers

| Layer        | What it is                              | Who writes it                   |
| ------------ | --------------------------------------- | ------------------------------- |
| **Sources**  | Bylaws, CC&Rs, Rules — verbatim         | The HOA (you only curate)       |
| **Wiki**     | Synthesized topic pages, index, log     | The LLM, via `/wiki-sync`       |
| **Skills**   | Instructions telling the LLM how to act | You (already set up)            |

---

## How to use it

### First-time setup

The skills are already in place. Just run the initial build:

```
/wiki-sync
```

This reads every file in `source/`, creates `wiki/` with `index.md`, `log.md`, `.manifest.json`, and a `pages/` directory containing one markdown file per HOA topic. Expect pages like `pets.md`, `parking.md`, `architectural-modifications.md`, `assessments-and-fees.md`, `enforcement.md`, etc.

> **Note:** Skills are discovered at session start. If `/wiki-sync` and `/ask` don't appear, run `/clear` or restart Claude Code.

### Asking questions

```
/ask
```

With no arguments, it prompts you for a question. With arguments, it answers immediately:

```
/ask Can I keep three cats?
/ask What's the deadline to pay assessments before a late fee kicks in?
/ask Do I need board approval to install solar panels?
```

Answers cite both the wiki page and the original source section, e.g.:

> Yes, up to two domestic pets total. *(wiki/pages/pets.md → CC&Rs § 4.7)*

If the wiki doesn't cover the topic, `ask` says so explicitly rather than guessing.

### Updating the wiki when source documents change

Edit, add, or remove files in `source/`, then run:

```
/wiki-sync
```

The skill computes a SHA-256 hash of every source file and compares against `wiki/.manifest.json`. Files whose hash matches are **skipped** — no re-ingestion, no token waste. Only new or changed files get re-read, and the relevant wiki pages get updated. Removed source files are flagged in the log for you to handle (the skill won't auto-delete pages, since you may still want the historical content).

Each sync appends a timestamped entry to `wiki/log.md` listing what was ingested, skipped, created, updated, and any conflicts surfaced.

---

## Design choices

### Why hashes instead of mtimes?

Modification times change whenever a file is copied, synced via OneDrive/Dropbox, or pulled from git — even when content is identical. SHA-256 of the file bytes is the only reliable way to know whether the *content* actually changed. The manifest lives at `wiki/.manifest.json` and is rewritten atomically on each sync.

### Why a wiki instead of plain RAG?

RAG retrieves chunks. A wiki *synthesizes*. When the CC&Rs and the Rules and Regulations both mention pets but with different specificity, the wiki's `pets.md` consolidates them and flags any conflict under a `## Conflicts` heading. You get one coherent answer instead of two retrieved fragments you have to reconcile yourself.

### Why cite both wiki page and source section?

The wiki page is what the LLM read to answer you; the source section is what's *legally authoritative* if you need to quote it to a board member, a neighbor, or a lawyer. Both citations let you trust-but-verify quickly.

### Why is `source/` read-only?

The governing documents are the ground truth. The wiki is a derived, regenerable view. If the wiki is wrong, you fix the wiki (or the skill prompt). If the source is wrong, that's an HOA amendment — not something the LLM should ever touch.

---

## Customizing the skills

The skills are local to this project, in plain markdown at `.claude/skills/wiki-sync/SKILL.md` and `.claude/skills/ask/SKILL.md`. Edit them directly to change behavior — e.g. tighten the citation format, add a `lint` mode, change how pages are categorized in `index.md`, or have `ask` log valuable Q&A back into the wiki as new pages.

---

## Files & folders cheat sheet

| Path                          | Purpose                                       | Edit by hand?                       |
| ----------------------------- | --------------------------------------------- | ----------------------------------- |
| `source/*.md`                 | Authoritative governing documents             | Yes — this is your input            |
| `wiki/index.md`               | Catalog of topic pages                        | No — regenerated each sync          |
| `wiki/log.md`                 | Sync history                                  | No — append-only by skill           |
| `wiki/.manifest.json`         | Source file hashes                            | No — managed by skill               |
| `wiki/pages/*.md`             | Topic pages with citations                    | Possible, but will be overwritten   |
| `.claude/skills/*/SKILL.md`   | Skill prompts                                 | Yes — to tune behavior              |
| `README.md`                   | This file                                     | Yes                                 |

---

## Typical workflow

1. Drop a new or amended HOA document into `source/`.
2. Run `/wiki-sync`. New file gets ingested; unchanged files get skipped.
3. Run `/ask <your question>` whenever you need an answer.
4. Periodically read `wiki/log.md` to see flagged conflicts or removed-source warnings the skill surfaced for you.
