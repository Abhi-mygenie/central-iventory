# Central Inventory — PRD

## Project Identity
Multi-store hierarchy stock management module for MyGenie POS platform. FastAPI proxy backend + React 19 frontend.

## Architecture
- **Backend:** FastAPI proxy on port 8001 → `preprod.mygenie.online` (zero business logic)
- **Frontend:** React 19 + CRACO + Tailwind + Radix UI (shadcn) on port 3000
- **Database:** MongoDB (token sessions only)
- **Terminology:** Backend `master` = Central Store (TOP), `central` = Master Store (MID), `franchise` = Outlet (BOTTOM)

## Core Requirements
- Multi-store hierarchy management (3 fixed levels)
- Inventory transfers with approval lifecycle
- Stock management with FEFO segment tracking
- Vendor management and procurement
- Purchase order lifecycle
- Production run management
- Reports (consumption, wastage)

## What's Been Implemented (2026-06-14)

### CR-030: Inward Screens (IMPLEMENTED)
- **Phase 0:** api.js — `getVendorItemList()`, `getStockInventory()` with segment/consumption params, 10 PO lifecycle methods
- **Phase 1:** VendorManagement.jsx — master-detail layout, purchase intelligence (KPIs, bar chart, recent purchases)
- **Phase 2:** IngredientCatalogue.jsx — expandable rows, inline edit, intelligence panel (avg rate, consumption, days-of-stock, vendor price comparison)
- **Phase 3:** Purchase Order module — PurchaseOrderList, PurchaseOrderCreate, PurchaseOrderDetail (status tabs, create flow, receive with variance detection)

### Previously Implemented (by prior agents)
- CR-001 to CR-029: Full app including login, operations hub, transfers, stock management, production, reports, settings

## Prioritized Backlog

### P0 (Next)
- CR-030: AddStockPurchaseForm gate redirect for `DIRECT_PURCHASE_REQUIRES_PO`
- CR-030: PO Create "By Item Need" mode
- CR-031: Production Screens (Sub-Recipe Master, Run Production, Production History)

### P1
- CR-032: Outward Screens (Store Management, Product Catalog, Stock Inventory, Pending Queues fixes, History fixes)

### P2 (Future)
- CR-033: Reports Enhancement
- G-014: Invoice OCR integration
- G-020: Unit conversion support
- PO Create Multi-PO Review mode

## Test Accounts
See `/app/memory/test_credentials.md`

## Key Files
- `frontend/src/services/api.js` — 1132 lines, 96+ API methods
- `frontend/src/lib/terminology.js` — FROZEN terminology mapping
- `frontend/src/lib/screenVisibility.js` — FROZEN role-based access
- `control/registry.json` — governance SSOT
