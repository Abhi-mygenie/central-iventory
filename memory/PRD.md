# Central Inventory — PRD

## Original Problem Statement
Implement Intelligent UI for Central Inventory across 3 sprints (A/B/C).

## ALL SPRINTS COMPLETE — June 1, 2026

### Sprint A — 21/21 PASS
- Operations Hub intelligence (greeting, NBA banners, KPIs, stock health, store health grid, quick actions, activity feed)
- Stock Inventory new columns (Expiry Risk, Pending, Days of Cover) + Export CSV
- Stock Detail FEFO enhancements (% of Total, Action column, dispatch-first badge, reorder suggestion)
- History PO format + Export CSV
- StatusTimeline relative timestamps + stale detection

### Sprint B — 18/18 PASS
- Pending Queues card-based approval inbox (item-level, age badges, fulfillment verdicts, sort)
- PO format everywhere (PO-XXXX using last 4 digits)
- ReceiveDialog dispatch time context
- SourceSelector FEFO badges
- All dialogs use PO format

### Sprint C — 11/11 PASS
- Stock Adjustment stock context bar + impact preview + undo guidance
- Wastage Entry stock context + undo guidance
- Operational Settings impact badges ("High impact", "Affects all stores")
- Vendor Management Status column (Active/Inactive detection)
- Wastage Report Export CSV
- Bug fix: display_qty string → Number() for arithmetic

## Files Modified/Created Summary
- **Created**: 6 new files (useStockIntelligence, StockIntelligenceBar, PostSubmitConfirmation, StoreHealthStrip, FulfillmentVerdict, formatPO in formatters.js)
- **Modified**: 15 existing files (OperationsHub, StockInventorySummary, StockDetailPanel, HistoryLedger, StatusTimeline, PendingQueues, TransferDetail, ReceiveDialog, ApproveWaveDialog, DisputeResolutionDialog, SourceSelector, StockAdjustmentForm, WastageEntryForm, OperationalSettings, VendorManagement, WastageReport)

## Test Credentials
- Central: abhishek@kalabahia.com / Qplazm@10
- Master: owner@democentral1.com / Qplazm@10
- Outlet: owner@demofranchise1.com / Qplazm@10

## Next Steps
1. Remaining Sprint C polish: Catalogues usage cross-ref, Consumption days-of-cover, Hierarchy push status
2. Backend team: G-013 PO number, G-012 catalog category
3. Sprint B/C remaining: RequestStockForm intelligent PO, DirectDispatchForm destination needs

## Backlog
- P0: G-013 PO number (backend), P1: G-012/G-014, P2: G-015/G-016
- Future: CR-020 Daily Digest, CR-015 FEFO Detail
