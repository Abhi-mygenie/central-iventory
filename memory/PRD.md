# Central Inventory — PRD

## Original Problem Statement
Implement Sprint A (Foundation Intelligence) of the Intelligent UI for Central Inventory — 5 read-only screens + PO number display.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, Craco, shadcn/ui
- **Backend**: FastAPI proxy → preprod.mygenie.online POS API
- **Database**: MongoDB (session storage)

## Sprint A — COMPLETE (June 1, 2026)

### Files Created (2)
| File | Purpose |
|------|---------|
| `hooks/useStockIntelligence.js` | Shared intelligence: low stock, stale approvals, ready-to-dispatch, today's activity |
| `components/common/StockIntelligenceBar.jsx` | Reusable 6-metric stock health strip |

### Files Modified (6)
| File | Changes |
|------|---------|
| `lib/formatters.js` | Added `formatPO()` — converts transfer ID to PO-XXXX format |
| `OperationsHub.jsx` | Full rewrite: greeting, NBA banners, KPI cards, stock health bar, store health grid, quick actions, activity feed, latest request card |
| `StockInventorySummary.jsx` | Added Expiry Risk, Pending, Days of Cover columns + Export CSV button |
| `StockDetailPanel.jsx` | Added % of Total column, Action column (wastage/dispatch), FEFO "Dispatch first" badge, reorder suggestion in consumption section |
| `HistoryLedger.jsx` | PO/Ref column (PO-0129 format), Export CSV button, ledger references use PO format |
| `StatusTimeline.jsx` | Relative timestamps, duration between steps, total lifecycle, stale detection badge |

### Test Results: 21/21 PASS (iteration_27)
- Hub: greeting, NBA banners, KPIs, stock health, quick actions all working
- Inventory: new columns (Expiry Risk, Pending, Days of Cover), Export CSV
- Detail: batch % of Total, Action column, FEFO label, reorder suggestion
- History: PO format, Export CSV, ledger PO refs
- Timeline: relative timestamps, durations, lifecycle, stale detection
- Login + navigation all functional

## Test Credentials
- Central: abhishek@kalabahia.com / Qplazm@10
- Master: owner@democentral1.com / Qplazm@10
- Outlet: owner@demofranchise1.com / Qplazm@10

## Next Steps
1. **Sprint B**: Transfer flow intelligence (5-6 days) — Request Stock, Pending Queues, Transfer Detail, Direct Dispatch, Source Selector, Receive/Approve/Dispute modals
2. **Sprint C**: Operations + config intelligence (4-5 days) — Stock Adjustment, Wastage, Procurement, Settings, Vendors, Catalogues
3. Backend team: G-013 PO number, G-012 catalog category

## Backlog
- P0: G-013 PO number generation (backend)
- P1: G-012 Catalog category, G-014 Invoice OCR
- P2: G-015 Excel parsing, G-016 Invoice storage
- Future: CR-020 Daily Intelligence Digest, CR-015 FEFO Batch Detail
