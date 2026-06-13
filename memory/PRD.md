# Central Inventory — PRD

## Project Identity
Central Inventory — multi-store hierarchy stock management module for MyGenie POS. Backend is proxy-only FastAPI. Frontend is React 19 + CRACO + Tailwind + Radix UI (shadcn).

## Current State (June 14, 2026)

### Active Work: CR-030/031/032 — Screen Audit + UX Redesign

**CR-030 (Inward Screens) — PLANNING COMPLETE, FROZEN**

| Phase | Screen | Effort | UX Freeze |
|:-----:|--------|:------:|:---------:|
| 0 | api.js (getVendorItemList + getStockInventory params + 10 PO methods) | 1h | — |
| 1 | Vendor Management → master-detail rewrite | 6h | ✅ FROZEN |
| 2 | Raw Material Master → expandable rows + intelligence | 8h | ✅ FROZEN |
| 3 | Purchase Order Module → 3 new screens (List, Create, Detail+Receive) | 14h | ✅ FROZEN |
| | **Total** | **~28h** | |

New: Purchase Order module replaces direct add-stock for hierarchy stores.
- 9 screens: PO List, Create By Vendor, Create By Item Need, Multi-PO Review, PO Detail, Receive with Invoice Matching, Post-Receive, GRN History, Add-Stock Gate
- 10 new PO API methods, all validated (32/32 checks)
- G-021 CLOSED, G-017 CLOSED

**CR-031 (Production Screens) — PLANNING COMPLETE**
| Phase | Screen | Effort |
|:-----:|--------|:------:|
| 0 | api.js (deleteSubRecipe) | 30min |
| 1 | Sub-Recipe Master → master-detail + BOM editor | 7h |
| 2 | Run Production → confirmation step | 3h |
| 3 | Production History → expandable rows + date filter | 7h |
| | **Total** | **~17.5h** |

**CR-032 (Outward Screens) — PLANNING COMPLETE**
| Phase | Screen | Effort |
|:-----:|--------|:------:|
| 0 | Bug fixes (O-13, O-14, O-15, O-9, O-10, O-11) | 3h |
| 1 | Store Management → single unified view (Summary tab killed) | 7h |
| 2 | Product Catalog → 5 tabs with Recipe BOM editor | 8h |
| 3 | Stock Inventory → expandable rows | 6h |
| | **Total** | **~24h** |

### Execution Order
CR-030 → CR-031 → CR-032 (sequential)

### UX Freeze Documents
- `CR030_VENDOR_MANAGEMENT_UX_FREEZE.md` ✅
- `CR030_RAW_MATERIAL_MASTER_UX_FREEZE.md` ✅
- `CR030_PURCHASE_ORDER_UX_FREEZE.md` ✅ (NEW — 9 screens)
- `CR031_SUB_RECIPE_MASTER_UX_FREEZE.md` ✅
- `CR031_RUN_PRODUCTION_UX_FREEZE.md` ✅
- `CR031_PRODUCTION_HISTORY_UX_FREEZE.md` ✅
- `CR032_STORE_MANAGEMENT_UX_FREEZE.md` ✅
- `CR032_PRODUCT_CATALOG_UX_FREEZE.md` ✅
- `CR032_STOCK_INVENTORY_UX_FREEZE.md` ✅
- `CR032_PENDING_QUEUES_UX_FREEZE.md` ✅
- `CR032_HISTORY_LEDGER_UX_FREEZE.md` ✅

### Mock Previews
- `P35_purchase_order_FINAL_FREEZE.html` — 9 PO screens (FINAL)
- `P35_purchase_order_mock_v2.html` — Create flow with intelligence
- `P35_receive_flow_mock.html` — Receive flow with intelligence

### API Probing Results
- `vendor-item-list` ✅ — 70 records, 3 vendors
- `stock-inventory?include_segments&include_consumption` ✅ — G-022 NOT NEEDED
- All 10 PO endpoints ✅ — 32/32 validated
- `deleteSubRecipe` — needs probing (CR-031 Phase 0)

### Gaps Closed This Session
- G-017 (vendor history) → CLOSED
- G-021 (Purchase Order Module) → CLOSED (all APIs validated)
- G-022 (aggregated stock) → NOT NEEDED (API supports params)

### Gaps Still Open
| ID | Gap | Priority |
|----|-----|:--------:|
| G-014 | Invoice OCR endpoint | P1 |
| G-020 | Custom unit conversion | P1 |
