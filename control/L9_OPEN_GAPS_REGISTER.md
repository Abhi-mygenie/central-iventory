# L9 — Open Gaps Register

> **Updated:** 2026-06-01 (Sprint A+B+C implementation complete)
> **Note:** CR/BUG items tracked in `registry.json`. This file tracks systemic gaps.

---

## Backend Dependencies (Cannot Be Fixed in Frontend)

| # | Gap | Blocked Feature | Backend Work Needed | Priority | Status |
|---|-----|-----------------|--------------------|---------:|--------|
| G-001 | No stock adjustment history API | BUG-007 traceability | Adjustment history endpoint | P2 | OPEN |
| G-002 | No before/after quantity in transfer API | BUG-004 ledger display | Add before_qty/after_qty fields | P2 | OPEN |
| G-003 | No user name resolution API | BUG-005 actor display | User profile lookup endpoint | P3 | OPEN |
| G-004 | History API missing restaurant_type | BUG-002 store badges | Include type in history response | P3 | OPEN |
| G-005 | Dedicated stock ledger API | BUG-003 N+1 calls | Single-call ledger endpoint | P2 | OPEN |
| G-006 | Stock return flow API | OI-005 return feature | Dedicated return endpoint | P1 | OPEN |
| G-007 | Reconciliation request workflow | OI-006 from Handover | Full workflow endpoints | P2 | OPEN |
| G-008 | Physical stocktake API | System Handover #9 | Stocktake endpoints | P2 | OPEN |
| G-009 | Partial dispatch | System Handover #1 | Dispatch subset of approved lines | P1 | OPEN |
| G-010 | Soft stock reservation on approval | System Handover #2 | Reservation mechanism | P1 | OPEN |
| G-011 | WebSocket infrastructure | OI-002 notifications | Real-time events | P2 | OPEN |
| G-012 | `request-catalog` missing category fields | B1 manual request mode has no category grouping/filter | Add `category_id`, `category_name` to response | P1 | OPEN |
| G-013 | No PO number in transfer API | All screens show PO-XXXX (frontend placeholder) | Generate `po_number` on creation, return in all responses | **P0** | **OPEN — Frontend workaround: formatPO(id) using last 4 digits** |
| G-014 | Invoice OCR/AI extraction endpoint | C3 Upload Invoice tab | New endpoint: file upload + OCR/AI extraction | P1 | OPEN |
| G-015 | Excel/CSV parsing endpoint | C3 Manual Entry Excel upload | New endpoint or frontend-only parsing | P2 | OPEN |
| G-016 | Invoice number storage for duplicate detection | C3 duplicate invoice check | Store processed invoice numbers in DB | P2 | OPEN |

## Implementation Gaps (Frontend Polish — Deferred)

| # | Item | Screen | Sprint | Priority |
|---|------|--------|:------:|:--------:|
| IG-001 | Catalogue "Used in X recipes" cross-ref columns | IngredientCatalogue, ProductCatalogue, RecipeCatalogue, AddonRecipeCatalogue | C | LOW |
| IG-002 | Consumption Report days-of-cover column | DailyConsumptionReport | C | LOW |
| IG-003 | Hierarchy Management push status (Synced/Stale) | HierarchyManagement | C | LOW |
| IG-004 | RequestStockForm Intelligent PO auto-detect tab | RequestStockForm | B | MEDIUM |
| IG-005 | DirectDispatchForm destination needs auto-detect | DirectDispatchForm | B | MEDIUM |

## Bugs Fixed During Sprint Implementation

| # | Issue | File | Sprint | Status |
|---|-------|------|:------:|--------|
| BUG-016 | display_qty string not converted to Number() for arithmetic — caused toFixed() TypeError | StockAdjustmentForm.jsx, WastageEntryForm.jsx | C | **FIXED** |

## Documentation Debt (DC Items)

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| DC-1 | P23 planning header says "no code changes" | LOW | OPEN |
| DC-2 | P22 planning header says "no code changes" | LOW | OPEN |
| DC-3 | Phase2 plan headers say "PLANNING ONLY" | LOW | OPEN |
| DC-4 | P21 catalogue header says "PLANNING + API VALIDATION" | LOW | OPEN |
| DC-5 | P23 addendum push permission outdated | MEDIUM | OPEN |
| DC-6 | test_credentials.md missing/incomplete | MEDIUM | **RESOLVED** (L8 created + memory/test_credentials.md) |
| DC-7 | scr-20-reports still defined but replaced | LOW | OPEN |
| DC-8 | smart_dispatch_concept.png referenced but missing | LOW | OPEN |
| DC-9 | Legacy api_implementation_status.md still referenced | LOW | OPEN |
| DC-10 | Test entities 787/788/789 in live POS | INFO | OPEN (BUG-014) |

## Open Items Carried Forward

| OI-ID | Item | Status |
|-------|------|--------|
| OI-001 | Edit Transfer | **RESOLVED** — done in CR-006 (P17) |
| OI-002 | WebSocket Notifications | Deferred (G-011) |
| OI-003 | Stock Adjustment | **RESOLVED** — done in CR-005 (Slice 5) |
| OI-004 | Wastage | **RESOLVED** — done in CR-005 (Slice 5) |
| OI-005 | Stock Return Flow | Open (G-006) |
| OI-006 | Reports Screen | Partially addressed by CR-013 (P22 Consumption) |
| OI-007 | CSV/PDF Export | **PARTIALLY RESOLVED** — CSV export added to History, Inventory, Wastage Report (Sprint A+C) |
| OI-008 | KPI Dashboard | **PARTIALLY RESOLVED** — Operations Hub now serves as KPI dashboard (Sprint A) |
| OI-009 | Cost/Value Reporting | Still open |
| OI-010 | Recipe/Sales Integration | Future |
| OI-011 | Ledger N+1 Optimization | Still open (G-005) |
| OI-012 | Audit Log Admin View | Future |
| OI-013 | Batch/Expiry/FEFO Management | **PARTIALLY RESOLVED** — FEFO enhancements in StockDetailPanel (Sprint A) |
| OI-014 | Low-Stock/Reorder Screen | **PARTIALLY RESOLVED** — Reorder suggestion in StockDetailPanel consumption section (Sprint A) |
| OI-015 | Advanced Permissions | Phase 2 |
| OI-016 | Lateral Master-to-Master | Partially addressed by CR-007 (Settings) |
