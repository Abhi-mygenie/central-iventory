# Central Inventory — PRD

## Project Identity
Multi-store hierarchy stock management module for MyGenie POS platform. FastAPI proxy backend + React 19 frontend.

## Architecture
- **Backend:** FastAPI proxy on port 8001 → `preprod.mygenie.online` (zero business logic)
- **Frontend:** React 19 + CRACO + Tailwind + Radix UI (shadcn) on port 3000
- **Database:** MongoDB (token sessions only)

## CR-030: Inward Screens — COMPLETE (All Spec Gaps Closed)

### Phase 0: API Layer
- `getVendorItemList()` with TTL.LONG cache
- `getStockInventory()` extended with `includeSegments`, `segmentLimit`, `includeConsumption`
- 10 PO lifecycle methods with proper cache invalidation

### Phase 1: Vendor Management (master-detail)
- Left 35%: vendor list, search, Active/Inactive from real purchase dates
- Right 65%: inline form + purchase intelligence (3 KPIs, monthly bar chart, recent purchases)

### Phase 2: Raw Material Master (expandable rows)
- Inline edit + intelligence: Avg Rate, Consumption, Days of Stock, Vendor Price Comparison bars
- Category/Status dropdown filters, inline add form, "Pushed to X stores"

### Phase 3: Purchase Order Module (full lifecycle)
- **PO List:** Status tabs + 4 KPI cards + Expected column
- **By Vendor:** Vendor cards with Active/Inactive, Orders/30d, Avg, Items·Spend, "Cheapest for X items" badge. Items table with Last Rate, Avg Rate, Cheapest Vendor comparison, DoC, urgency sort, reorder-point auto-suggest (30d target). TIP banner for items cheaper elsewhere.
- **By Item Need:** KPI cards, urgency sort, per-item vendor picker, Other Vendors column, stock sub-labels, reorder-point qty, auto-group multi-PO preview with savings calculation.
- **PO Detail:** Status timeline, order lines with Your Stock/Days/After Receive context columns, GRN history.
- **Receive Form:** Card-per-line layout with Vendor Invoice # field, Rate Variance panel, Stock Impact panel, per-line Invoice Total, summary with matched/skipped/flags/FEFO note.
- **Add-Stock Gate:** Proactive `require_po_for_purchase` detection + reactive API error handling.

## Prioritized Backlog
- **P0:** CR-031 Production Screens, CR-032 Outward Screens
- **P1:** CR-033 Reports Enhancement
- **P2:** G-014 Invoice OCR, G-020 Unit conversion
