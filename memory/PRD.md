# Central Inventory — PRD

## Original Problem Statement
Build intelligent UI freeze implementation for the Central Inventory project. Sprint A: Foundation Intelligence (Read-Only Screens).

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, Craco, shadcn/ui
- **Backend**: FastAPI proxy → preprod.mygenie.online POS API
- **Database**: MongoDB (session storage)

## What's Been Implemented

### June 1, 2026 — Sprint A (In Progress)
**Completed:**
- **Operations Hub** — Full intelligence rewrite: greeting, NBA banners (stale approvals, ready to dispatch), 4 KPI cards, Stock Health bar, Store Health Grid (Central), Quick Actions (role-gated), Today's Activity feed, Latest Request card (Outlet/Master)
- **useStockIntelligence hook** — Shared intelligence computations: low stock, stale approvals, ready-to-dispatch, today's activity
- **StockIntelligenceBar** — Reusable 6-metric stock health strip
- **StatusTimeline** — Enhanced with relative timestamps, duration between steps, total lifecycle, stale detection

**Remaining Sprint A:**
- StockInventorySummary — Add Expiry Risk, Pending In/Out, Days of Cover columns + Export CSV
- StockDetailPanel — Add FEFO dispatch-first badge, consumption context, reorder suggestion
- HistoryLedger — Add movement type badges (already partial), PO ref column, Export CSV

### Test Results (14/14 PASS)
- Hub greeting, NBA banners, KPI cards, stock health bar, quick actions all working
- Stock Inventory loads 4 items with real data
- Stock Detail shows FEFO batches with expiry badges
- History shows 20 transfers with status badges
- Timeline shows relative timestamps + lifecycle duration + stale detection
- Login, navigation all functional

## Test Credentials
- Central: abhishek@kalabahia.com / Qplazm@10
- Master: owner@democentral1.com / Qplazm@10
- Outlet: owner@demofranchise1.com / Qplazm@10

## Next Steps
1. Complete remaining 3 Sprint A screens (StockInventorySummary, StockDetailPanel, HistoryLedger)
2. Sprint B: Transfer flow intelligence (5-6 days)
3. Sprint C: Operations + config intelligence (4-5 days)

## Backlog
- P0: G-013 PO number generation (backend team)
- P1: G-012 Catalog category, G-014 Invoice OCR
- P2: G-015 Excel parsing, G-016 Invoice storage
