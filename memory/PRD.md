# Central Inventory — PRD

## Project Identity
Central Inventory — multi-store hierarchy stock management module for MyGenie POS. Backend is proxy-only FastAPI. Frontend is React 19 + CRACO + Tailwind + Radix UI (shadcn).

## Architecture
- **Backend**: FastAPI proxy on port 8001 — ZERO business logic
- **Frontend**: React 19 + CRACO on port 3000
- **Database**: MongoDB (local state only)
- **POS API**: `preprod.mygenie.online/api/v2/vendoremployee`
- **Branch**: `13-june-2`

## Current State (June 14, 2026)

### Active Work: Screen Audit CRs — Implementation Planning Complete

| CR | Screens | Plan Status | Implementation | Effort |
|----|---------|:-----------:|:--------------:|:------:|
| CR-030 | Vendor Mgmt, Raw Material Master, Purchase | ✅ Plan done (unified) | ❌ Not started | ~16.5h |
| CR-031 | Sub-Recipe Master, Run Production, Production History | ✅ Plan done (unified) | ❌ Not started | ~17.5h |
| CR-032 | Store Mgmt, Product Catalog, Stock Inventory, Queues, History | ✅ Plan done (unified) | ❌ Not started | ~24h |

### API Probing Results (2026-06-14)
- `vendor-item-list` ✅ — 70 records, 3 vendors, 21 ingredients
- `stock-inventory?include_segments=true&include_consumption=true` ✅ — G-022 NOT NEEDED
- `deleteSubRecipe` — needs probing (destructive, defer to CR-031 Phase 0)

### Key Decisions
- CR-032: Summary tab KILLED — single unified Store Management view
- CR-032: Product Catalog expanded to 5 tabs (+ Recipes BOM editor, + Addon Recipes)
- Previous bug-fix-only plans superseded by unified UX redesign plans

## Execution Order
1. CR-030 (Inward) → 2. CR-031 (Production) → 3. CR-032 (Outward)

## Closed in S3
CR-023, CR-024, CR-025, CR-015, CR-016, CR-026, CR-027, CR-029

## Open Backend Gaps
| ID | Gap | Priority | Status |
|----|-----|:--------:|--------|
| G-014 | Invoice OCR endpoint | P1 | OPEN |
| G-020 | Custom unit conversion | P1 | OPEN |
| G-021 | Purchase Order Module | P0 | OPEN |
| G-022 | Aggregated stock endpoint | P1 | **NOT NEEDED** — API already supports params |
