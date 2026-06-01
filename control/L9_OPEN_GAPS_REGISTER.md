# L9 — Open Gaps Register

> **Rule:** Updated every QA pass and sprint review.
> **Note:** CR/BUG items tracked in `registry.json`. This file tracks systemic gaps.

---

## Backend Dependencies (Cannot Be Fixed in Frontend)

| # | Gap | Blocked Feature | Backend Work Needed | Priority |
|---|-----|-----------------|--------------------|---------:|
| G-001 | No stock adjustment history API | BUG-007 traceability | Adjustment history endpoint | P2 |
| G-002 | No before/after quantity in transfer API | BUG-004 ledger display | Add before_qty/after_qty fields | P2 |
| G-003 | No user name resolution API | BUG-005 actor display | User profile lookup endpoint | P3 |
| G-004 | History API missing restaurant_type | BUG-002 store badges | Include type in history response | P3 |
| G-005 | Dedicated stock ledger API | BUG-003 N+1 calls | Single-call ledger endpoint | P2 |
| G-006 | Stock return flow API | OI-005 return feature | Dedicated return endpoint | P1 |
| G-007 | Reconciliation request workflow | OI-006 from Handover | Full workflow endpoints | P2 |
| G-008 | Physical stocktake API | System Handover #9 | Stocktake endpoints | P2 |
| G-009 | Partial dispatch | System Handover #1 | Dispatch subset of approved lines | P1 |
| G-010 | Soft stock reservation on approval | System Handover #2 | Reservation mechanism | P1 |
| G-011 | WebSocket infrastructure | OI-002 notifications | Real-time events | P2 |
| G-012 | `request-catalog` missing category fields | B1 manual request mode has no category grouping/filter | Add `category_id`, `category_name` to `/inventory-transfer/request-catalog` response | P1 |
| G-013 | No PO number in transfer API | All screens show internal DB ID instead of business PO number | Generate `po_number` on request creation or approval, return in all transfer responses. **For direct dispatch: auto-generate PO on behalf of destination store.** | P0 |

## Documentation Debt (DC Items from PROJECT_LEDGER)

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| DC-1 | P23 planning header says "no code changes" | LOW | OPEN |
| DC-2 | P22 planning header says "no code changes" | LOW | OPEN |
| DC-3 | Phase2 plan headers say "PLANNING ONLY" | LOW | OPEN |
| DC-4 | P21 catalogue header says "PLANNING + API VALIDATION" | LOW | OPEN |
| DC-5 | P23 addendum push permission outdated | MEDIUM | OPEN |
| DC-6 | test_credentials.md missing/incomplete | MEDIUM | RESOLVED (L8 created) |
| DC-7 | scr-20-reports still defined but replaced | LOW | OPEN |
| DC-8 | smart_dispatch_concept.png referenced but missing | LOW | OPEN |
| DC-9 | Legacy api_implementation_status.md still referenced | LOW | OPEN |
| DC-10 | Test entities 787/788/789 in live POS | INFO | OPEN (BUG-014) |

## Open Items Carried Forward (from Post-Slice-4 Register)

| OI-ID | Item | Original Status | Current Status |
|-------|------|----------------|----------------|
| OI-001 | Edit Transfer | Open | **RESOLVED** — done in CR-006 (P17) |
| OI-002 | WebSocket Notifications | Deferred (Phase 2) | Still deferred (G-011) |
| OI-003 | Stock Adjustment | Open | **RESOLVED** — done in CR-005 (Slice 5) |
| OI-004 | Wastage | Open | **RESOLVED** — done in CR-005 (Slice 5) |
| OI-005 | Stock Return Flow | Open | Still open (G-006) |
| OI-006 | Reports Screen | Deferred | Partially addressed by CR-013 (P22 Consumption) |
| OI-007 | CSV/PDF Export | Deferred | Still open |
| OI-008 | KPI Dashboard | Owner decision needed | Still open |
| OI-009 | Cost/Value Reporting | Deferred | Still open |
| OI-010 | Recipe/Sales Integration | Future | Still open |
| OI-011 | Ledger N+1 Optimization | Future | Still open (G-005) |
| OI-012 | Audit Log Admin View | Future | Still open |
| OI-013 | Batch/Expiry/FEFO Management | Future | Partially: CR-015 (P24) planned |
| OI-014 | Low-Stock/Reorder Screen | Future | Still open |
| OI-015 | Advanced Permissions | Phase 2 | Still open |
| OI-016 | Lateral Master-to-Master | Open | Partially addressed by CR-007 (Settings) |
| G-014 | Invoice OCR/AI extraction endpoint | C3 Upload Invoice tab needs AI extraction | New endpoint: file upload + OCR/AI extraction service (TBD) | P1 |
| G-015 | Excel/CSV parsing endpoint | C3 Manual Entry Excel upload needs server-side parsing | New endpoint or frontend-only parsing (SheetJS) | P2 |
| G-016 | Invoice number storage for duplicate detection | C3 duplicate invoice check | Store processed invoice numbers in DB | P2 |
