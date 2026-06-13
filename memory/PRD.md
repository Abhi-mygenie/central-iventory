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
- **Branch**: `planning-final`
- **Deploy URL**: `https://580d5a3e-cdeb-4dc3-a9fb-b657bfae5bf2.preview.emergentagent.com`

## What's Been Implemented (Timeline)
- **S0 (Pre-Governance)**: CR-001 to CR-014 — all 24 screens built
- **S1**: CR-019 — Intelligent UI Freeze (24/24 screens approved)
- **S2**: CR-021 (Intelligence layer), CR-022 (Code quality fixes)
- **S3**: CR-023 (API Reality Check), CR-024 (API Cache), CR-025 (Intelligent PO + reference_code wire)
- **2026-06-13**: CR-015 FEFO Batch Stock Detail (GAP fixes) — CLOSED, iteration_41
- **2026-06-13**: CR-016 Hierarchy Toggle (toggle, KPI, alert banner, store heatmap) — CLOSED, iteration_42

## Current Sprint: S3 — All Items CLOSED
| CR | Title | Status |
|----|-------|:------:|
| CR-023 | API Reality Check — 17 bug fixes | CLOSED |
| CR-024 | API Response Cache (71→20 calls) | CLOSED |
| CR-025 | Intelligent PO + reference_code wire | CLOSED |
| CR-015 | FEFO Batch Stock Detail Panel | CLOSED |
| CR-016 | Stock Inventory Hierarchy Toggle | CLOSED |

## Prioritized Backlog
| Priority | CR | Title | Status |
|----------|-----|-------|--------|
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

## Key Architecture Rules
1. **Terminology inversion**: UI "Central Store" = API `master`, UI "Master Store" = API `central`, UI "Outlet" = API `franchise`
2. **Backend is proxy-only**: Zero business logic in `server.py`
3. **Stock source of truth**: Segment ledger (`inventory_stock_segments`), not aggregate
4. **`display_qty` is STRING**: Always `Number()` wrap before arithmetic
5. **Frozen files**: `terminology.js`, `screenVisibility.js`, Phase 7 Freeze doc, all L0 baseline docs
