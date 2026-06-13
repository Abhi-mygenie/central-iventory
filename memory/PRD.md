# Central Inventory PRD

## Original Problem Statement
Multi-store hierarchy stock management module for the MyGenie POS platform. Proxy-only FastAPI backend forwarding to `preprod.mygenie.online`. React 19 frontend with intelligence layer.

## Architecture
- **Frontend**: React 19, CRACO, Tailwind CSS, Radix UI (shadcn), Recharts, React Router v7
- **Backend**: FastAPI proxy-only (~181 lines), Motor (async MongoDB), httpx
- **Database**: MongoDB (local, `central_inventory` DB) — used only for token sessions + status checks
- **External APIs**: MyGenie POS preprod API v1/v2 — all business logic lives in POS backend
- **Cache**: In-memory response cache in `api.js` (LONG 60s / MEDIUM 45s / SHORT 30s TTL)

## Repo
- **Source**: `Abhi-mygenie/central-iventory`
- **Branch**: `Implementation`
- **Deploy URL**: `https://43894dcf-1c17-4bc1-8cf4-77568885cca0.preview.emergentagent.com`

## What's Been Implemented (Timeline)
- **S0 (Pre-Governance)**: CR-001 to CR-014 — all 24 screens built
- **S1**: CR-019 — Intelligent UI Freeze (24/24 screens approved)
- **S2**: CR-021 (Intelligence layer), CR-022 (Code quality fixes)
- **S3**: CR-023 (API Reality Check, 17 bug fixes), CR-024 (API Cache, 72% reduction), CR-025 (Intelligent PO + reference_code wire)
- **2026-06-13**: CR-015 FEFO Batch Stock Detail Panel — CLOSED
- **2026-06-13**: CR-016 Stock Inventory Hierarchy Toggle — Re-QA needed (hook fix)
- **2026-06-13**: CR-026 P28 Production Unit Module — All phases DONE (1a/1b/2a/2b/2c/3)
- **2026-06-13**: CR-027 Navigation Restructure — IMPLEMENTED (grouped sidebar, route migration, new pages)
- **2026-06-13**: CR-029 Stock Inventory FG/Raw Split — IMPLEMENTED (tab bar)

## Current Sprint: S3
| CR | Title | Status |
|----|-------|:------:|
| CR-023 | API Reality Check — 17 bug fixes | CLOSED |
| CR-024 | API Response Cache (71→20 calls) | CLOSED |
| CR-025 | Intelligent PO + reference_code wire | CLOSED |
| CR-015 | FEFO Batch Stock Detail Panel | CLOSED |
| CR-016 | Hierarchy Toggle | IN_PROGRESS (re-QA) |
| CR-026 | P28 Production Unit Module | IN_PROGRESS (all phases done, QA pending) |
| CR-027 | Navigation Restructure | IN_PROGRESS |
| CR-029 | Stock Inventory FG/Raw Split | IN_PROGRESS |

## CR-027 Navigation Structure (FROZEN)
```
DASHBOARD: Operations Hub
INWARD: Vendor Management, Raw Material Master, Purchase
PRODUCTION: Sub-Recipe Master, Run Production, Production History
OUTWARD: Store Management, Product Catalog, Stock Inventory, Pending Queues, History & Ledger
REPORTS: Consumption Report, Wastage Report
SETTINGS: Settings
```

## Prioritized Backlog
| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| P0 | CR-028 | Product Catalog Overhaul (Excel-like bulk editor) | PROPOSED |
| P1 | CR-018 | Wastage Report Enhancements | PLANNED |
| P2 | CR-017 | Smart Dispatch Assistance (~95% done via CR-025) | PROPOSED |
| Future | CR-020 | Daily Intelligence Digest | PROPOSED |

## Open Backend Gaps
| Gap | Blocked Feature | Priority |
|-----|-----------------|:--------:|
| G-014 | Invoice OCR/AI extraction | P1 |
| G-015 | Excel/CSV parsing | P2 |
| G-016 | Invoice number storage | P2 |
| G-017 | Vendor purchase history | P2 |
| ~~G-018~~ | ~~Production run list/history API~~ | **CLOSED** |
| ~~G-019~~ | ~~Segment unit_cost~~ | **CLOSED** |

## Key Architecture Rules
1. **Terminology inversion**: UI "Central Store" = API `master`, UI "Master Store" = API `central`, UI "Outlet" = API `franchise`
2. **Backend is proxy-only**: Zero business logic in `server.py`
3. **Stock source of truth**: Segment ledger (`inventory_stock_segments`), not aggregate
4. **`display_qty` is STRING**: Always `Number()` wrap before arithmetic
5. **Frozen files**: `terminology.js`, Phase 7 Freeze doc, all L0 baseline docs

## Next Tasks
1. QA smoke test CR-027 (navigation) + CR-029 (stock split) + CR-026 (production)
2. CR-028: Product Catalog Overhaul implementation
3. CR-017 audit: segregate done vs remaining
4. CR-018: Wastage Report Enhancements planning
