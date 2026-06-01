# L1 — Control Dashboard (Project Status)

> **Updated:** 2026-05-31 (Phase 7 Final Freeze complete)

---

## Current State

| Field | Value |
|-------|-------|
| **Branch** | `31_5_26` |
| **Active Sprint** | S1 — Governance + Intelligent UI Freeze |
| **UI Freeze Status** | **PHASE 7 FROZEN — Implementation Ready** |
| **Dev Dashboard** | `/__dev/index.html` |
| **UI Previews** | `/__dev/previews/*.html` (9 files) |
| **Final Freeze Doc** | `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` |

## Intelligent UI Freeze — Phase Completion

| Phase | Status | Output |
|-------|:------:|--------|
| Phase 0+1 Audit | COMPLETE | `INTELLIGENT_UI_FREEZE_PHASE_0_1.md` |
| Phase 2 Brainstorming | COMPLETE | `INTELLIGENT_UI_FREEZE_PHASE_2_FLOW_B.md` + inline for C/D/E/A |
| Phase 3 API Feasibility | COMPLETE | `INTELLIGENT_UI_FREEZE_PHASE_3_FLOW_B.md` + inline for C/D/E/A |
| Phase 4 Previews | COMPLETE | 9 HTML previews, all approved |
| Phase 5 Slice Gate | COMPLETE | Inline — screen-by-screen approval per flow |
| Phase 6 E2E QA | COMPLETE | `INTELLIGENT_UI_FREEZE_PHASE_6_QA_REVIEW.md` — 8 gaps found, all fixed |
| **Phase 7 Final Freeze** | **FROZEN** | `INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` |

## Screen Approval Record — 24/24

| Flow | Screens | Status |
|------|:-------:|:------:|
| A — Operations Hub | 1 | APPROVED |
| B — Transfer Lifecycle | 7 | APPROVED |
| C — Stock Operations | 4 | APPROVED |
| D — Stock Visibility | 4 | APPROVED |
| E — Configuration | 8 | APPROVED |

## Backend Gaps (from UI Freeze)

| ID | Gap | Priority |
|----|-----|:--------:|
| G-012 | request-catalog missing category | P1 |
| G-013 | No PO number in transfer API | P0 |
| G-014 | Invoice OCR/AI extraction endpoint | P1 |
| G-015 | Excel/CSV parsing endpoint | P2 |
| G-016 | Invoice number storage | P2 |

## Implementation Plan (from Phase 7 Freeze)

| Sprint | Scope | Effort |
|--------|-------|--------|
| Sprint A | Read-only intelligence (Hub, Inventory, Detail, History, Timeline) | 3-4 days |
| Sprint B | Transfer flow (Request, Queues, Detail, Dispatch, Modals) | 5-6 days |
| Sprint C | Operations + Config (Procurement, Adjustment, Wastage, Config screens) | 4-5 days |

## Registry

| Type | Count |
|------|:-----:|
| CRs | 20 (14 closed, 1 in review, 4 planned, 1 proposed) |
| BUGs | 15 (11 accepted, 2 deferred, 1 resolved, 1 open) |

## Quick Links

| Layer | Path |
|-------|------|
| L0 Baseline | `control/L0_BASELINE_INDEX.md` |
| L6 Sprint | `control/L6_SPRINT_STATUS.md` |
| L9 Gaps | `control/L9_OPEN_GAPS_REGISTER.md` |
| Registry | `control/registry.json` |
| Final Freeze | `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` |
| Master Progress | `control/sessions/INTELLIGENT_UI_FREEZE_MASTER_PROGRESS.md` |
| Previews | `/__dev/previews/` |
| Dashboard | `/__dev/index.html` |
