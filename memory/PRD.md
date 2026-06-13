# Central Inventory — PRD

## Project Identity
Multi-store hierarchy stock management module for MyGenie POS platform. FastAPI proxy backend + React 19 frontend.

## Architecture
- **Backend:** FastAPI proxy on port 8001 → `preprod.mygenie.online` (zero business logic)
- **Frontend:** React 19 + CRACO + Tailwind + Radix UI (shadcn) on port 3000
- **Database:** MongoDB (token sessions only)
- **Terminology:** Backend `master` = Central Store (TOP), `central` = Master Store (MID), `franchise` = Outlet (BOTTOM)

## What's Been Implemented (2026-06-14)

### CR-030: Inward Screens — COMPLETE
- **Phase 0:** api.js — `getVendorItemList()`, `getStockInventory()` extended params, 10 PO lifecycle methods
- **Phase 1:** VendorManagement.jsx — master-detail with purchase intelligence (KPIs, bar chart, recent purchases)
- **Phase 2:** IngredientCatalogue.jsx — expandable rows, inline edit, vendor price comparison, category/status filters
- **Phase 3:** Purchase Order module — PurchaseOrderList, PurchaseOrderCreate (By Vendor + By Item Need + multi-PO auto-grouping), PurchaseOrderDetail (status timeline, receive with variance detection, GRN history)
- **AddStockPurchaseForm PO gate** — redirects to PO flow when `require_po_for_purchase: true`
- **By Item Need mode** — urgency-sorted items, per-item vendor picker (cheapest pre-selected), auto-groups by vendor into multiple POs with preview

## Prioritized Backlog

### P0 (Next)
- CR-031: Production Screens (Sub-Recipe Master, Run Production, Production History)
- CR-032: Outward Screens (Store Management, Product Catalog, Stock Inventory, Pending Queues/History fixes)

### P1
- CR-033: Reports Enhancement

### P2 (Future)
- G-014: Invoice OCR integration
- G-020: Unit conversion support

## Test Accounts
See `/app/memory/test_credentials.md`
