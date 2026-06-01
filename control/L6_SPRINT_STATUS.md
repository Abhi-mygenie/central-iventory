# L6 — Sprint Status

> **Updated:** 2026-05-31 (Phase 7 frozen)
> **Source of truth for items:** `control/registry.json`

---

## Active Sprint

### S1 — Governance Setup + Intelligent UI Freeze
- **Start:** 2026-05-31
- **End:** TBD (implementation sprints next)
- **Goal:** Establish governance layer, execute intelligent UI freeze, prepare for implementation.

**Completed in S1:**
- 10-layer control layer created (L0-L9)
- registry.json seeded: 20 CRs + 15 BUGs = 35 items
- Dev dashboard live at `/__dev/index.html`
- gen_dashboard_data.js generator + --check drift linter
- **UI Freeze Phase 0+1** — audit + screen inventory (22 screens, ~120 gaps)
- **UI Freeze Phase 2** — intelligence brainstorming for all 5 flows (100+ elements)
- **UI Freeze Phase 3** — API feasibility verified (40 frontend-only, 15 feasible, 0 blocked)
- **UI Freeze Phase 4** — 10 HTML previews created, all 24 screens approved screen-by-screen
- **UI Freeze Phase 5** — slice approval gate (inline per flow)
- **UI Freeze Phase 6** — E2E QA review, 8 gaps found and fixed
- **UI Freeze Phase 7** — Final Freeze document created. FROZEN.
- 5 backend gaps registered (G-012 to G-016)
- CR-019 (UI Freeze) in OWNER_REVIEW
- CR-020 (Daily Intelligence Digest) registered as PROPOSED for future

**Next after S1:**
- Implementation Sprint A: Read-only intelligence (3-4 days)
- Implementation Sprint B: Transfer flow intelligence (5-6 days)
- Implementation Sprint C: Operations + config intelligence (4-5 days)

## Closed Sprints

### S0 — Pre-Governance (Retroactive)
- **Period:** 2026-01-01 → 2026-05-29
- **CRs:** CR-001 to CR-014 (14 CRs, all CLOSED)
- **BUGs:** BUG-001 to BUG-015 (15 BUGs, mixed status)
- **Closure Note:** Owner sign-off pending on all items.

## Unassigned Items (Backlog)

| ID | Title | Status | Priority |
|----|-------|--------|----------|
| CR-015 | P24 — FEFO Batch Stock Detail | PLANNED | P0 |
| CR-016 | P20-Phase2 — Hierarchy Toggle | PLANNED | P1 |
| CR-017 | P21-Smart — Smart Dispatch Assistance | PROPOSED | P1 |
| CR-018 | P25 — Wastage Report Enhancements | PLANNED | P2 |
| CR-020 | Daily Intelligence Digest (SMS/WhatsApp/Email) | PROPOSED | Future |
