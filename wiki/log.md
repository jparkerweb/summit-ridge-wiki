# Wiki Sync Log

## 2026-05-09T00:00:00Z — initial sync (bootstrap)

- **Bootstrapped**: created `wiki/`, `wiki/pages/`, `wiki/index.md`, `wiki/log.md`, `wiki/.manifest.json`.
- **Ingested (new)**:
  - `source/2025-10-11 Bylaws.md` — sha256 0F60959315…BA75D
  - `source/2025-10-11 CC&Rs.md` — sha256 D556BF5B73…392D8
  - `source/2025-10-11 Rules and Regulations.md` — sha256 752488FD97…CC52B
- **Skipped (unchanged)**: none
- **Removed**: none
- **Pages created (28)**:
  - Governance: governing-documents.md, definitions.md, membership-and-voting.md, member-meetings.md, elections-and-board.md, transfer-of-control.md
  - Financial: assessments-and-fees.md, collections-and-delinquency.md, insurance.md, financial-records.md, mortgagee-rights.md
  - Property Use: use-restrictions.md, pets.md, parking.md, noise.md, rentals.md, trash-and-recycling.md, signage.md, neighbor-disputes.md
  - Architectural/Maintenance: architectural-review.md, exterior-modifications.md, maintenance-responsibility.md, landscaping.md
  - Common Areas: common-areas.md, private-open-space-and-wetlands.md
  - Enforcement: enforcement-and-fines.md
  - History: building-envelope-history.md
- **Pages updated**: none (initial sync)
- **Conflicts surfaced** (documented under `## Conflicts` headings on relevant pages):
  - **definitions.md / transfer-of-control.md** — Class B → Class A conversion sunset date: CC&Rs Article II § 2.B says **December 31, 2001**; Bylaws Article III § 2.B says **December 31, 2002**. Bylaws were adopted May 22, 2002, after the CC&R date had passed. Per Bylaws Article XXI, the Declaration controls; the Turnover Meeting has long since occurred regardless.
  - **pets.md** — CC&Rs Article V § 1.B limits pets to **one (1) per Lot**; Rules and Regulations § Pets only says "no unreasonable numbers." CC&Rs control per Bylaws Article XXI.
  - **exterior-modifications.md** — Satellite dish maximum diameter: CC&Rs Article VII § 2.G says **18 inches**; Rules and Regulations § Architecture says **24 inches**. CC&Rs control per Bylaws Article XXI. The CC&R source text contains a parenthetical note about uncertainty in the printed character of the original PDF.
- **Lint**: All 28 pages indexed in `index.md`; no orphaned pages. Cross-links between pages use relative paths (`pages/x.md` from index, `x.md` between pages). No structural issues detected.

## 2026-05-09T00:00:00Z — conflict resolutions (user decisions)

User reviewed the three surfaced conflicts and decided:

- **Satellite dish size**: Go with 18" (CC&Rs). Updated `exterior-modifications.md` to present 18" as the governing maximum without framing it as a conflict; removed the dish item from the page's "Conflicts" section (section now empty and removed).
- **Pet limit**: User confirmed the 1-pet CC&R cap functions as a soft limit in practice — multiple-dog households exist in the community without enforcement. Updated `pets.md` to describe the actual community practice while noting the Declaration text still controls in any formal enforcement action.
- **Class B sunset date (2001 vs 2002)**: Left as-is per user direction. Conflict remains documented in `definitions.md` and `transfer-of-control.md` for historical accuracy; moot in practice.

No source files changed; no manifest update needed.
