---
name: ask
description: Answer a question about the HOA / townhome using the wiki/ directory as authoritative context. If the user invoked /ask with no arguments, ask them what they want to know first. Always cite the wiki page and original source section.
---

# ask

The user is asking a question about their HOA (Summit Ridge townhomes). Treat `wiki/` as the source of truth. Do **not** read `source/` unless the wiki is missing or the wiki explicitly points to a source quote you need to verify.

## Procedure

1. **Get the question.** If the skill was invoked with arguments, use them as the question. If invoked with no arguments, ask the user: *"What would you like to know about the HOA?"* and wait for their answer.

2. **Check wiki exists.** If `wiki/index.md` does not exist, tell the user to run `/wiki-sync` first and stop.

3. **Read `wiki/index.md`** to find relevant pages. Then read those page files in full. Pull in cross-linked pages if the question spans topics.

4. **Answer directly and concisely.** Lead with the answer, then supporting detail. Quote exact figures, deadlines, and section numbers verbatim.

5. **Cite every factual claim.** Format: `(wiki/pages/pets.md → CC&Rs § 4.2)`. Both the wiki page and the original source section. If the wiki page doesn't include a source section reference, say so — that's a wiki gap to fix later.

6. **If the wiki doesn't cover it**, say so plainly: *"The wiki has no entry on X."* Then offer: (a) check `source/` directly to see if it's there but unindexed, or (b) note that the source documents may be silent on the topic. Do not guess.

7. **If the wiki shows a conflict** between sources on this topic, surface it. Don't pick a winner silently.

## Rules

- The wiki is the answer surface. Read source files only as a fallback when the wiki is incomplete or when the user asks to verify a quote.
- Never speculate about HOA rules. If it's not in the wiki or source, say so.
- Keep answers tight. Bullet lists for multi-part rules; prose for single-fact answers.
- Don't dump entire wiki pages back at the user — extract what's relevant to their question.
