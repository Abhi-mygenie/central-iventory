# L1 — Control Dashboard (Project Status)

> **Updated:** 2026-06-13 (CR-023, CR-024, CR-025 CLOSED)

---

## Current State

| Field | Value |
|-------|-------|
| **Branch** | `13-6-26` (deployed from GitHub) |
| **Deploy URL** | `https://8f1c59d2-807e-451f-8b10-133e9507c42c.preview.emergentagent.com` |
| **Active Sprint** | **S3 — API Reality Check + Intelligent PO + FEFO Detail** |
| **UI Freeze Status** | PHASE 7 FROZEN — Implementation **SUBSTANTIAL** (see below) |
| **Implementation Status** | 24/24 screens present, CR-023 fixes applied, Intelligent PO built |
| **Data** | ChocolateHut — 158 inventory items seeded via API |
| **Dev Dashboard** | `/__dev/index.html` |
| **UI Previews** | `/__dev/previews/*.html` (9 files) |

## Sprint S3 — Closed Items

### CR-023: API Reality Check & Intelligence Gap Fix — **CLOSED**
- 17 of 18 bugs fixed (B10 deferred — no vendor history API)
- Progressive loading on Operations Hub (no more skeleton blocking)
- PendingQueues: Reject/Approve All buttons, requester health mini-bar, insufficient warnings
- TransferDetail: FROM/TO labels, Requester Store Snapshot, Approval Impact
- All artifacts 0-6 DONE. Smoke tested 2026-06-13.

### CR-024: API Response Cache — **CLOSED**
- In-memory cache with TTL (30-60s) in `api.js` (single file change)
- 71 → 20 API calls across 4-navigation session (72% reduction)
- In-flight dedup + auto-invalidation on mutations
- All artifacts DONE. Smoke tested 2026-06-13.

### CR-025: Coverage-Based Intelligent PO — **CLOSED**
- Request Stock: Coverage selector (3/7/10/30d), consumption-based ordering with threshold fallback, category-grouped suggested items, source cross-validation. 173 → 4 items (smart filter)
- Direct Dispatch: Integrated dispatch table with inline Source Segment picker, "You'll retain X%" projection, review warnings, order summary
- All artifacts DONE. Smoke tested 2026-06-13.
- **Sub-task pending:** Wire `reference_code` as PO number (planning complete, implementation queued)

## Sprint S3 — Summary

| CR | Title | Status | Closed |
|----|-------|:------:|:------:|
| CR-023 | API Reality Check — 17 bug fixes | CLOSED | 2026-06-13 |
| CR-024 | API Response Cache (71→20 calls, 72%) | CLOSED | 2026-06-13 |
| CR-025 | Intelligent PO (Request Stock + Direct Dispatch) | CLOSED | 2026-06-13 |

## Registry: 25 CRs, 16 BUGs, 3 Sprints (S0-S2 closed, S3 active)

## Owner Signoff Pending

- **CR-021** — Sprint A+B+C Intelligence Implementation
- **CR-022** — Code Quality Review Fixes

## Backend Gaps

| ID | Gap | Priority | Status |
|----|-----|:--------:|--------|
| G-013 | PO number generation | P0 | **CLOSED** — `reference_code` in API, frontend wire planned |
| G-009 | Partial dispatch | P1 | **CLOSED** — works via approval_lines |
| G-010 | Soft stock reservation | P1 | **CLOSED** — `reserve_on_approve` available |
| G-012 | Catalog category fields | P1 | **CLOSED** — `category_id` + `category_name` in response |
| G-014 | Invoice OCR endpoint | P1 | OPEN — UI ready, shows "Coming Soon" |
| G-015 | Excel parsing endpoint | P2 | OPEN — Upload zone ready, pending backend |
| G-016 | Invoice storage | P2 | OPEN |
| G-017 | Vendor purchase history API | P2 | OPEN — No workaround |

## Next Work — Backlog Priority

| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| **P0** | CR-015 | P24 — FEFO Batch Stock Detail Panel | PLANNED |
| P1 | CR-016 | P20-Phase2 — Hierarchy Toggle | PLANNED |
| P1 | CR-018 | P25 — Wastage Report Enhancements | PLANNED |
| P2 | CR-017 | P21-Smart — Smart Dispatch Assistance | PROPOSED |
| Future | CR-020 | Daily Intelligence Digest | PROPOSED |

## Quick Links

| Layer | Path |
|-------|------|
| L0 Baseline | `control/L0_BASELINE_INDEX.md` |
| L2 Handover | `control/L2_HANDOVER_PROTOCOL.md` |
| L6 Sprint | `control/L6_SPRINT_STATUS.md` |
| L8 Credentials | `control/L8_ACCESS_REGISTRY.md` |
| L9 Gaps | `control/L9_OPEN_GAPS_REGISTER.md` |
| Registry | `control/registry.json` |
| Phase 7 Freeze | `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` |
