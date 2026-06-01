# L9 — Open Gaps Register

> **Updated:** 2026-06-01 (Session closing)

---

## Backend Dependencies (Cannot Be Fixed in Frontend)

| # | Gap | Blocked Feature | Priority | Status |
|---|-----|-----------------|:--------:|--------|
| G-001 | No stock adjustment history API | Traceability | P2 | OPEN |
| G-002 | No before/after qty in transfer API | Ledger display | P2 | OPEN |
| G-003 | No user name resolution API | Actor display | P3 | OPEN |
| G-004 | History API missing restaurant_type | Store badges | P3 | OPEN |
| G-005 | Dedicated stock ledger API | N+1 calls | P2 | OPEN |
| G-006 | Stock return flow API | Return feature | P1 | OPEN |
| G-009 | Partial dispatch | Dispatch subset | P1 | OPEN |
| G-010 | Soft stock reservation on approval | Reservation | P1 | OPEN |
| G-011 | WebSocket infrastructure | Real-time events | P2 | OPEN |
| G-012 | request-catalog missing category | Category grouping | P1 | OPEN |
| **G-013** | **No PO number in transfer API** | **All screens** | **P0** | **OPEN — Frontend workaround: formatPO(id)** |
| **G-014** | **Invoice OCR/AI extraction** | **Procurement Upload Invoice tab** | **P1** | **OPEN — UI ready, shows "Coming Soon"** |
| **G-015** | **Excel/CSV parsing** | **Procurement Excel import** | **P2** | **OPEN — Upload zone ready, pending backend** |
| G-016 | Invoice number storage | Duplicate detection | P2 | OPEN |

## Implementation Gaps — ALL CLOSED

| # | Item | Status |
|---|------|:------:|
| IG-001 | Catalogue vendor column | DONE |
| IG-002 | Consumption days-of-cover | DONE |
| IG-003 | Hierarchy push status | DONE |
| IG-004 | Request low-stock suggestions | DONE |
| IG-005 | Dispatch destination health | DONE |
| IG-006 | Procurement 3-mode UI | DONE (AI/Excel blocked on G-014/G-015) |
| IG-007 | Product Has Recipe column | DONE |
| IG-008 | Recipe Cost Mapped column | DONE |
| IG-009 | Addon-Recipe Cost Mapped | DONE |
| IG-010 | Hierarchy Summary health | DONE |
| IG-011 | Store Detail health strip | DONE |

## Bugs Fixed

| # | Issue | Status |
|---|-------|:------:|
| BUG-016 | display_qty string arithmetic TypeError | FIXED |
