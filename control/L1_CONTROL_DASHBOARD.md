# L1 — Control Dashboard (Project Status)

> **Updated:** 2026-06-01 (All implementation complete — session closing)

---

## Current State

| Field | Value |
|-------|-------|
| **Branch** | `10-may` (deployed from GitHub) |
| **Deploy URL** | `https://deploy-workflow-14.preview.emergentagent.com` |
| **Active Sprint** | None — S2 closed |
| **UI Freeze Status** | **PHASE 7 FROZEN — Implementation COMPLETE** |
| **Implementation Status** | **ALL 22+ screens upgraded — 55/55 tests PASS** |
| **Dev Dashboard** | `/__dev/index.html` |
| **UI Previews** | `/__dev/previews/*.html` (9 files) |
| **UI Review** | `control/sessions/ui_review/` (7 review documents) |

## Implementation Summary

| Sprint | Scope | Tests | Status |
|--------|-------|:-----:|:------:|
| Sprint A | Hub, Inventory, Detail, History, Timeline | 21/21 | COMPLETE |
| Sprint B | Queues card inbox, PO format, Modals, SourceSelector | 18/18 | COMPLETE |
| Sprint C | Adjustment, Wastage, Settings, Vendors, WastageReport | 11/11 | COMPLETE |
| Polish IG-001–005 | Catalogues, Consumption, Hierarchy, Request, Dispatch | 5/5 | COMPLETE |
| Final fixes | Products, Recipes, Addon-Recipes, HierarchySummary, StoreDetail, Procurement 3-mode | visual | COMPLETE |
| Code Review | Security, React patterns, empty catches, index keys | n/a | COMPLETE |

## Files Created: 6
`useStockIntelligence.js`, `StockIntelligenceBar.jsx`, `PostSubmitConfirmation.jsx`, `StoreHealthStrip.jsx`, `FulfillmentVerdict.jsx`, `formatPO()` in `formatters.js`

## Files Modified: 26
OperationsHub, StockInventorySummary, StockDetailPanel, HistoryLedger, StatusTimeline, PendingQueues, TransferDetail, ReceiveDialog, ApproveWaveDialog, DisputeResolutionDialog, SourceSelector, StockAdjustmentForm, WastageEntryForm, OperationalSettings, VendorManagement, WastageReport, IngredientCatalogue, DailyConsumptionReport, HierarchyManagement, DirectDispatchForm, RequestStockForm, AddStockPurchaseForm, ProductCatalogue, RecipeCatalogue, AddonRecipeCatalogue, HierarchySummary, StoreDetail

## Governance Registration

| ID | Title | Status | Artifacts |
|----|-------|:------:|:---------:|
| CR-019 | Intelligent UI Freeze (Planning) | CLOSED | 7/7 DONE |
| CR-021 | Intelligence Implementation (all screens) | CLOSED | 6/7 DONE, Owner Signoff PENDING |
| CR-022 | Code Quality Review Fixes | CLOSED | 4/7 DONE, 3 WAIVED, Owner Signoff PENDING |
| BUG-016 | display_qty String TypeError | RESOLVED | 3/7 DONE, 4 WAIVED |

## Remaining (All Backend-Blocked)

| ID | Gap | Priority | Status |
|----|-----|:--------:|--------|
| G-013 | PO number generation | P0 | Frontend workaround (formatPO last-4-digits) |
| G-014 | Invoice OCR endpoint | P1 | Upload tab shows "Coming Soon" |
| G-015 | Excel parsing endpoint | P2 | Excel zone shows pending notice |
| G-012 | Catalog category fields | P1 | Open |
| G-016 | Invoice storage | P2 | Open |

## Registry: 22 CRs, 16 BUGs, 3 Sprints (S0 closed, S1 closed, S2 closed)

## Quick Links

| Layer | Path |
|-------|------|
| L0 Baseline | `control/L0_BASELINE_INDEX.md` |
| L2 Handover | `control/L2_HANDOVER_PROTOCOL.md` |
| L6 Sprint | `control/L6_SPRINT_STATUS.md` |
| L8 Credentials | `control/L8_ACCESS_REGISTRY.md` |
| L9 Gaps | `control/L9_OPEN_GAPS_REGISTER.md` |
| Registry | `control/registry.json` |
| Final Freeze | `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` |
| UI Review | `control/sessions/ui_review/UI_UX_FINAL_DESIGN_REVIEW_REPORT.md` |
| CR-021 Session | `control/sessions/CR021_SESSION_START.md` |
| Test Reports | `test_reports/iteration_27-30.json` |
