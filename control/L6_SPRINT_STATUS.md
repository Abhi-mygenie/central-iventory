# L6 — Sprint Status

> **Source of truth for items:** `control/registry.json`
> **Live view:** `/__dev/`

---

## Active Sprint

### S1 — Governance Setup
- **Start:** 2026-05-31
- **End:** TBD
- **Goal:** Establish governance layer, seed registries, build dev dashboard, clear doc debt.
- **Items:** Governance tooling (no CRs/BUGs — infrastructure only)

## Closed Sprints

### S0 — Pre-Governance (Retroactive)
- **Period:** 2026-01-01 → 2026-05-29
- **Goal:** All work before governance existed. Retroactively registered.
- **CRs:** CR-001 to CR-014 (14 CRs, all CLOSED)
- **BUGs:** BUG-001 to BUG-015 (15 BUGs, mixed status)
- **Closure Note:** Owner sign-off pending on all items. Artifact #6 is PENDING for CRs, WAIVED for accepted BUGs.

## Sprint Planning Rules

1. Sprint starts with: pick items from registry.json backlog → assign `sprint_key` → fill Artifact #0 (Session-Start)
2. Sprint ends with: QA → Owner review → update registry.json statuses → run generator → update this file
3. Closed sprint sections are never deleted — they are the historical record
4. Sprint length: TBD (recommend 1 or 2 weeks)

## Unassigned Items (Backlog)

| ID | Title | Status | Priority |
|----|-------|--------|----------|
| CR-015 | P24 — FEFO Batch Stock Detail | PLANNED | P0 |
| CR-016 | P20-Phase2 — Hierarchy Toggle | PLANNED | P1 |
| CR-017 | P21-Smart — Smart Dispatch Assistance | PROPOSED | P1 |
| CR-018 | P25 — Wastage Report Enhancements | PLANNED | P2 |

See `L9_OPEN_GAPS_REGISTER.md` for non-CR gaps (backend dependencies, doc debt, etc.)
