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
- **2026-06-13**: CR-016 Stock Inventory Hierarchy Toggle — QA complete
- **2026-06-13**: CR-026 P28 Production Unit Module — Phase 1a+1b IMPLEMENTED (form, preview, confirmation, routes, nav, settings gate, negative stock logic)

## Current Sprint: S3
| CR | Title | Status |
|----|-------|:------:|
| CR-023 | API Reality Check — 17 bug fixes | CLOSED |
| CR-024 | API Response Cache (71→20 calls) | CLOSED |
| CR-025 | Intelligent PO + reference_code wire | CLOSED |
| CR-015 | FEFO Batch Stock Detail Panel | CLOSED |
| CR-026 | P28 Production Unit Module | IN_PROGRESS |

## CR-026 Phase Status
| Phase | Scope | Status |
|-------|-------|:------:|
| 1a | Core Form + Nav + Routes + API + Hook | DONE |
| 1b | Settings Gate + Negative Stock Logic | DONE |
| 2a | Audit Detail (drill-down) | DONE |
| 2b | Production History List | DONE (G-018 wired — real API) |
| 2c | Pre-run Cost Estimation | DONE (G-019 closed, FEFO cost wired) |
| 3 | Intelligence UI (all 9 elements) | DONE |

## Prioritized Backlog
| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| P0 | CR-026 Phase 3 | Intelligence UI for Production | PENDING |
| P1 | CR-018 | Wastage Report Enhancements | PLANNED |
| P2 | CR-017 | Smart Dispatch Assistance | PROPOSED |
| Future | CR-020 | Daily Intelligence Digest | PROPOSED |

## Open Backend Gaps
| Gap | Blocked Feature | Priority |
|-----|-----------------|:--------:|
| G-014 | Invoice OCR/AI extraction | P1 |
| G-015 | Excel/CSV parsing | P2 |
| G-016 | Invoice number storage | P2 |
| G-017 | Vendor purchase history | P2 |
| ~~G-018~~ | ~~Production run list/history API~~ | ~~P0~~ | **CLOSED** |
| ~~G-019~~ | ~~Segment unit_cost~~ | ~~P1~~ | **CLOSED** |

## Key Architecture Rules
1. **Terminology inversion**: UI "Central Store" = API `master`, UI "Master Store" = API `central`, UI "Outlet" = API `franchise`
2. **Backend is proxy-only**: Zero business logic in `server.py`
3. **Stock source of truth**: Segment ledger (`inventory_stock_segments`), not aggregate
4. **`display_qty` is STRING**: Always `Number()` wrap before arithmetic
5. **Frozen files**: `terminology.js`, `screenVisibility.js`, Phase 7 Freeze doc, all L0 baseline docs

## Next Tasks
1. CR-026 Phase 3: Intelligence UI (OperationsHub KPI card, NBA banner, coverage estimates, staleness indicators)
2. CR-026 Phase 2c: Pre-run cost estimation (when G-019 delivered)
3. Wire G-018 production history list (when backend delivers)
4. CR-018: Wastage Report Enhancements
