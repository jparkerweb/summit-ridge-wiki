# AGENTS.md

This file provides guidance to AI coding agents like Claude Code (claude.ai/code), Cursor AI, Codex, Gemini CLI, GitHub Copilot, and other AI coding assistants when working with code in this repository.

## Project Overview

This is **not a code project**. It is an LLM-maintained knowledge base for the Summit Ridge townhome HOA, modeled on Karpathy's "LLM Wiki" pattern.

- `source/` holds verbatim governing documents (Bylaws, CC&Rs, Rules and Regulations) — **read-only ground truth**.
- `wiki/` holds an LLM-synthesized, cross-linked, citation-bearing knowledge base derived from `source/`.
- `.claude/skills/` holds the two slash-command skills that build the wiki (`/wiki-sync`) and answer questions from it (`/ask`).

There is no build, no test suite, no package manager, no CI, and (currently) no git history. Almost all "work" in this repo is editing markdown.

## How to Use This File

The sections below are short summaries linking to detail files in `.agents-docs/`. Read only what's relevant to the current task — do not pre-load every file. The Project Overview above and the Critical Rules section below are the only things every agent should always know.

## Critical Rules (always apply)

1. **Never modify `source/`.** It is the legal ground truth. If a source file is wrong, that's an HOA amendment — not an agent action.
2. **Never invent facts.** If the source is silent on a topic, the wiki must be silent on it. Always cite the source section inline (e.g., `(Source: CC&Rs § 4.2)`) and list source file paths in a `## Sources` footer on each page.
3. **Surface conflicts; do not silently pick one.** When sources disagree, document under a `## Conflicts` heading on the relevant page and flag in `wiki/log.md`. Per Bylaws Article XXI, the Declaration controls in any irreconcilable conflict — but the agent should not bury the discrepancy.
4. **Do not auto-delete pages** when a source file is removed. Flag in the log; ask the user.
5. **Use the skills, don't duplicate them.** When the user wants to refresh the wiki or ask a question, invoke `/wiki-sync` or `/ask` rather than reading source files directly.

## Development Commands

There are no build/lint/test commands. The two relevant commands are slash-command skills:

- `/wiki-sync` — incrementally rebuild `wiki/` from `source/` based on SHA-256 hash diffs against `wiki/.manifest.json`.
- `/ask <question>` — answer an HOA question using `wiki/` as authoritative context, citing both wiki page and source section.

To compute a source hash by hand (PowerShell): `Get-FileHash -Algorithm SHA256 "source/<file>"`.

## Architecture

Three layers — sources, wiki, skills — with a strict one-way data flow (source → wiki → answers). Hash-based change detection keeps sync incremental.

Details: [Architecture](./.agents-docs/AGENTS-architecture.md)

## Skills

Two project-local skills under `.claude/skills/`. `wiki-sync` builds and maintains the wiki; `ask` answers questions from it. Behavior is defined in their `SKILL.md` files — edit those to change agent behavior.

Details: [Skills](./.agents-docs/AGENTS-skills.md)

## Wiki Conventions

Markdown only. No HTML. No emojis unless the user explicitly asks. Inline citations after every fact; `## Sources` footer on every page; relative links between pages (e.g., `[parking](parking.md)`); `index.md` regenerated each sync; `log.md` append-only with ISO-8601 timestamps.

Details: [Wiki Conventions](./.agents-docs/AGENTS-wiki-conventions.md)
