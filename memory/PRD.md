# Central Inventory — PRD

## Original Problem Statement
Implement Intelligent UI for Central Inventory. Sprint A (read-only) + Sprint B (transfer flow) complete.

## Sprint A — COMPLETE (June 1, 2026) — 21/21 tests PASS
- Operations Hub intelligence, Stock Inventory new columns, Stock Detail FEFO enhancements, History PO format + Export CSV, StatusTimeline relative timestamps + stale detection
- New: useStockIntelligence hook, StockIntelligenceBar, formatPO utility

## Sprint B — COMPLETE (June 1, 2026) — 18/18 tests PASS
### Files Created (3)
- `components/common/PostSubmitConfirmation.jsx` — Success card for write actions
- `components/common/StoreHealthStrip.jsx` — Compact store health display
- `components/common/FulfillmentVerdict.jsx` — Can fulfill / Partial / Can't fulfill badge

### Files Modified (6)
- `PendingQueues.jsx` — **Full rewrite**: table → card-based approval inbox with item-level visibility, PO format, age badges, fulfillment verdicts, sort control, After Approval projections
- `TransferDetail.jsx` — PO format title (PO-0113), "Created X days ago" relative time
- `ReceiveDialog.jsx` — PO format title, dispatch time context ("Dispatched: 2 hours ago")
- `ApproveWaveDialog.jsx` — PO format title
- `DisputeResolutionDialog.jsx` — PO format title
- `SourceSelector.jsx` — FEFO badges on segments, expired segments disabled with [EXPIRED] label

### Key Features
- Card-based approval inbox with 4-column item table (Requested, Qty, Your Stock, After Approval)
- Age badges: red (>72h stale), amber (24-72h aging), gray (fresh)
- Fulfillment verdict: "Can fulfill" / "Partial — 2 of 3 items" / "Can't fulfill"
- PO-XXXX format everywhere (queues, detail, history, all dialogs)

## Test Credentials
- Central: abhishek@kalabahia.com / Qplazm@10
- Master: owner@democentral1.com / Qplazm@10
- Outlet: owner@demofranchise1.com / Qplazm@10

## Next Steps
1. **Sprint C** (4-5 days): Operations + config intelligence — Stock Adjustment, Wastage, Procurement, Settings, Vendors, Catalogues, Consumption Report, Hierarchy Management
2. Backend team: G-013 PO number, G-012 catalog category

## Backlog
- P0: G-013 PO number (backend), P1: G-012/G-014, P2: G-015/G-016
- Future: CR-020 Daily Digest, CR-015 FEFO Detail, CR-016 Hierarchy Toggle
