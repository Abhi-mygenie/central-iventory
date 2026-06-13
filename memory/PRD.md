# Central Inventory — PRD

## Project Identity
Multi-store hierarchy stock management module for MyGenie POS platform. FastAPI proxy backend + React 19 frontend.

## Architecture
- **Backend:** FastAPI proxy on port 8001 → `preprod.mygenie.online` (zero business logic)
- **Frontend:** React 19 + CRACO + Tailwind + Radix UI (shadcn) on port 3000
- **Database:** MongoDB (token sessions only)

## What's Been Implemented (2026-06-14)

### CR-030: Inward Screens — COMPLETE (Gap Analysis Pass Done)
- **api.js:** `getVendorItemList()`, `getStockInventory()` extended params, 10 PO lifecycle methods
- **VendorManagement:** master-detail with purchase intelligence (KPIs, bar chart, recent purchases)
- **IngredientCatalogue:** expandable rows, inline edit, vendor price comparison, category/status filters
- **PurchaseOrderList:** Status tabs + 4 KPI cards (Total/Awaiting/Partial/Month Value) + Expected column
- **PurchaseOrderCreate — By Vendor:** Vendor cards with intel, items sorted by urgency, Last Rate/Avg Rate/Cheapest/DoC columns, reorder-point suggested qty (30d target), auto-check low stock
- **PurchaseOrderCreate — By Item Need:** KPI cards, urgency sort, per-item vendor picker (cheapest pre-selected), Other Vendors column, stock status sub-labels, reorder-point suggested qty, auto-group multi-PO preview with subtotals
- **PurchaseOrderDetail:** Status timeline, order lines with Your Stock/Days/After Receive context columns, GRN history, full action lifecycle
- **Receive Form:** Inline variance detection with per-line intelligence
- **AddStockPurchaseForm PO gate:** Proactive settings check + reactive API error handling

### Gap Analysis Fixes Applied (2026-06-14)
1. PO List: Added 4 KPI cards + Expected column
2. By Vendor: Added Last Rate, Avg Rate, Cheapest, DoC columns + urgency sorting + calculated suggested qty
3. By Item Need: Added Other Vendors column, stock sub-labels, reorder-point qty
4. PO Detail: Added Your Stock, Days, After Receive columns with stock map

## Prioritized Backlog
- **P0:** CR-031 Production Screens, CR-032 Outward Screens
- **P1:** CR-033 Reports Enhancement
- **P2:** G-014 Invoice OCR, G-020 Unit conversion
