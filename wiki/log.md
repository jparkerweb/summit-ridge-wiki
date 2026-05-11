# Wiki Sync Log

## 2026-05-10T00:00:00Z — sync (bootstrap, full rebuild)

- **Pre-state:** `wiki/` directory was absent (deleted at HEAD per `git status`); `.manifest.json` did not exist. Treated as full bootstrap.
- **Source files in `source/`:** 20 markdown files (no PDFs remain — all were previously converted by `prepare-docs`).
- **Removed since prior wiki existed:** The deleted `wiki/` tree at HEAD referenced the older filenames `2025-10-11 Bylaws.md`, `2025-10-11 CC&Rs.md`, and `2025-10-11 Rules and Regulations.md` (per the git deletion list). Those legacy source filenames are not present in current `source/`. The current set of source documents is what was actually ingested below.

### Ingested (new — full ingest, all 20 files)

- `2025.07.07_summitridge townhomes_amended and restated declaration.md`
- `2026-0304-SRTHHOA-Rules and Regulations.md`
- `590 1st Amend to Dec - Special Assessment Resolution.md`
- `590 2nd Amend to Dec - Collection.md`
- `590 2nd Amend to Dec - Rent Restrict.md`
- `590 Collection Resolution 10.20.2017.md`
- `590 HOA Parking Regulations 01.16.2020.md`
- `590 Maintenance Responsibility Resolution 11.01.2016.md`
- `590 Special Repair Assessment Resolution 05.24.18.md`
- `590 Summitridge #2.md` (2023 Budget)
- `590 Summitridge 2022.md`
- `590 Summitridge Bylaws.md`
- `590 Summitridge CCR's.md` (1999 original — kept as historical reference; superseded by 2025 Amended and Restated)
- `590 Summitridge- Budget.md` (2024 Budget)
- `590 Welcome Handbook and Resolutions.md`
- `Master association insurance certificate.md` (2021–2022 EOI)
- `PONO-RS1-SummitRidgeTH-240419-v2 Final.md` (Reserve Study)
- `Summitridge 2025 Budget.md`
- `Summitridge 2026 Budget.md`
- `Summitridge TH Evidence Of Property Insurance 23-24.md` (2023–2024 EOI)

### Skipped (unchanged)

- (none — full bootstrap.)

### Removed from source

- (none — all 20 source files exist; manifest is fresh.)

### Pages created

- `index.md`
- `pages/governing-documents.md`
- `pages/definitions.md`
- `pages/membership-and-voting.md`
- `pages/member-meetings.md`
- `pages/elections-and-board.md`
- `pages/transfer-of-control.md`
- `pages/mortgagee-rights.md`
- `pages/assessments-and-fees.md`
- `pages/collections-and-delinquency.md`
- `pages/financial-records.md`
- `pages/insurance.md`
- `pages/maintenance-responsibility.md`
- `pages/common-areas.md`
- `pages/private-open-space-and-wetlands.md`
- `pages/architectural-review.md`
- `pages/exterior-modifications.md`
- `pages/landscaping.md`
- `pages/signage.md`
- `pages/use-restrictions.md`
- `pages/pets.md`
- `pages/parking.md`
- `pages/rentals.md`
- `pages/trash-and-recycling.md`
- `pages/noise.md`
- `pages/neighbor-disputes.md`
- `pages/enforcement-and-fines.md`
- `pages/building-envelope-history.md`

### Conflicts surfaced and resolved (2026-05-10 review with user)

1. **Satellite dish size** — 2025 Declaration: 1 meter; Handbook: 24 in; 1999 CC&Rs: 18 in. **Resolved: Handbook's 24-in cap is operative** (Board has set the stricter community standard). Updated `pages/architectural-review.md` and `pages/exterior-modifications.md`; conflict no longer presented as ambiguous. Memory saved: `project_satellite_dish_24in.md`.
2. **Pet limit** — 2025 Declaration: 2/Lot; 1999: 1/Lot; Handbook: "unreasonable numbers"; community practice has accepted larger households. **Resolved: present both** — formal 2-per-Lot cap and the soft-limit practice; owners exceeding 2 should ask the Board. `pages/pets.md` unchanged. Existing memory `project_pet_limit_soft.md` updated to reflect the 2025 cap of 2 (was 1).
3. **Quiet hours** — HOA Handbook: 10 PM–8 AM; City Code § 34.10.537: 10 PM–7 AM. **Resolved: present both**; the stricter HOA rule applies within the community. `pages/noise.md` unchanged.
4. **Two Second Amendments** — 2A (Collection, 09/25/2017, No. 2017-114752) and 2B (Rental Restrictions, 11/06/2017, No. 2017-134175). **Resolved: wiki labels them 2A and 2B** to disambiguate. Updated `pages/governing-documents.md`, `pages/assessments-and-fees.md`, `pages/collections-and-delinquency.md`, `pages/rentals.md`, `pages/insurance.md`. Memory saved: `project_two_second_amendments.md`.
5. **Capitalization contribution** — 1999: flat $300; 2025: 2 months' assessments (≈$780.82 at 2026 rates). **Resolved: 2025 formula controls**, wiki state correct. `pages/assessments-and-fees.md` unchanged.
6. **"Family" → "household"** — 2025 restated Declaration replaced "single family" with "single household" and "family members" with "household members" throughout. **Resolved: 2025 wording controls**, dual presentation retained with 1999 wording noted as superseded. `pages/definitions.md` unchanged.

### Other observations

- **Trash 10-day window:** Declaration Article VII § 2.D and the Handbook's Trash enforcement section are self-consistent (no conflict).

### Lint findings

- All 28 pages are referenced from `index.md`. No orphaned pages.
- Cross-links among pages were authored by hand; spot-checked but a future incremental sync should re-verify after edits.
- The 1999 CC&Rs are retained as a historical source. Where its text diverges from the 2025 restated Declaration, the 2025 text controls and the 1999 text is cited only as historical context.

### Notes

- Wiki rebuilt from scratch because the prior `wiki/` directory had been deleted at HEAD. If the user reintroduces Obsidian (`.obsidian/`) or `.manifest.json` from another working tree, this run will not collide with that — only `wiki/` files created in this run are written.
