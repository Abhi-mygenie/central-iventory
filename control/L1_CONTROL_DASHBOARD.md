# L1 — Control Dashboard (Project Status)

> **Updated:** 2026-06-01 (Sprint A+B+C Implementation Complete)

---

## Current State

| Field | Value |
|-------|-------|
| **Branch** | `10-may` (deployed from GitHub) |
| **Active Sprint** | S2 — Intelligent UI Implementation (A+B+C COMPLETE) |
| **UI Freeze Status** | **PHASE 7 FROZEN — Implementation In Progress** |
| **Implementation Status** | **Sprint A+B+C COMPLETE — 50/50 tests PASS** |
| **Dev Dashboard** | `/__dev/index.html` |
| **UI Previews** | `/__dev/previews/*.html` (9 files) |
| **UI Review** | `control/sessions/ui_review/` (7 review documents) |
| **Final Freeze Doc** | `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` |

## Implementation Progress — Sprint A/B/C

| Sprint | Scope | Status | Tests |
|--------|-------|:------:|:-----:|
| **Sprint A** | Read-only intelligence (Hub, Inventory, Detail, History, Timeline) | **COMPLETE** | 21/21 PASS |
| **Sprint B** | Transfer flow (Queues card inbox, PO format, Age badges, Modals) | **COMPLETE** | 18/18 PASS |
| **Sprint C** | Operations + Config (Adjustment, Wastage, Settings, Vendors) | **COMPLETE** | 11/11 PASS |
| **Total** | 16 screens upgraded, 6 new files, 15 modified files | **COMPLETE** | **50/50 PASS** |

## Files Created (6)

| File | Purpose |
|------|---------|
| `hooks/useStockIntelligence.js` | Shared intelligence computations |
| `components/common/StockIntelligenceBar.jsx` | 6-metric stock health strip |
| `components/common/PostSubmitConfirmation.jsx` | Success card for write actions |
| `components/common/StoreHealthStrip.jsx` | Compact store health display |
| `components/common/FulfillmentVerdict.jsx` | Can/Partial/Can't fulfill badge |
| `lib/formatters.js` (formatPO added) | PO-XXXX format utility |

## Files Modified (15)

| File | Sprint | Change |
|------|:------:|--------|
| `OperationsHub.jsx` | A | Full rewrite — greeting, NBA, KPIs, stock health, store grid, activity feed |
| `StockInventorySummary.jsx` | A | +3 columns (Expiry Risk, Pending, Days of Cover), Export CSV |
| `StockDetailPanel.jsx` | A | +% of Total, Action column, FEFO badge, reorder suggestion |
| `HistoryLedger.jsx` | A | PO/Ref column, Export CSV |
| `StatusTimeline.jsx` | A | Relative timestamps, durations, lifecycle, stale detection |
| `PendingQueues.jsx` | B | Full rewrite — card-based inbox, item table, verdicts, age badges |
| `TransferDetail.jsx` | B | PO title, relative created time |
| `ReceiveDialog.jsx` | B | PO title, dispatch time context |
| `ApproveWaveDialog.jsx` | B | PO title |
| `DisputeResolutionDialog.jsx` | B | PO title |
| `SourceSelector.jsx` | B | FEFO badges, expired disabled |
| `StockAdjustmentForm.jsx` | C | Stock context bar, impact preview, undo guidance |
| `WastageEntryForm.jsx` | C | Stock context, undo guidance |
| `OperationalSettings.jsx` | C | Impact badges, "Affects all stores" |
| `VendorManagement.jsx` | C | Status column (Active/Inactive) |
| `WastageReport.jsx` | C | Export CSV |

## Remaining Polish (Not Blocking)

| Item | Screen | Priority |
|------|--------|:--------:|
| Catalogue "Used in X recipes" cross-ref | IngredientCatalogue, ProductCatalogue, RecipeCatalogue | LOW |
| Consumption Report days-of-cover column | DailyConsumptionReport | LOW |
| Hierarchy Management push status (Synced/Stale) | HierarchyManagement | LOW |
| RequestStockForm Intelligent PO tab | RequestStockForm | MEDIUM |
| DirectDispatchForm destination needs | DirectDispatchForm | MEDIUM |

## Backend Gaps (from UI Freeze — Unchanged)

| ID | Gap | Priority |
|----|-----|:--------:|
| G-012 | request-catalog missing category | P1 |
| G-013 | No PO number in transfer API | P0 |
| G-014 | Invoice OCR/AI extraction endpoint | P1 |
| G-015 | Excel/CSV parsing endpoint | P2 |
| G-016 | Invoice number storage | P2 |

## Bug Fixed During Implementation

| ID | Issue | File | Sprint |
|----|-------|------|:------:|
| BUG-016 | display_qty string not converted to Number for arithmetic | StockAdjustmentForm.jsx, WastageEntryForm.jsx | C |

## Registry

| Type | Count |
|------|:-----:|
| CRs | 20 (14 closed, 1 in progress, 4 planned, 1 proposed) |
| BUGs | 16 (11 accepted, 2 deferred, 1 resolved, 1 open, 1 fixed) |

## Quick Links

| Layer | Path |
|-------|------|
| L0 Baseline | `control/L0_BASELINE_INDEX.md` |
| L6 Sprint | `control/L6_SPRINT_STATUS.md` |
| L9 Gaps | `control/L9_OPEN_GAPS_REGISTER.md` |
| Registry | `control/registry.json` |
| Final Freeze | `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` |
| UI Review | `control/sessions/ui_review/UI_UX_FINAL_DESIGN_REVIEW_REPORT.md` |
| Test Reports | `test_reports/iteration_27.json` (A), `iteration_28.json` (B), `iteration_29.json` (C) |
| Previews | `/__dev/previews/` |
| Dashboard | `/__dev/index.html` |
