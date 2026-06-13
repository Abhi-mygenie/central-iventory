# Central Inventory PRD

## Original Problem Statement
Multi-store hierarchy stock management module for the MyGenie POS platform. Proxy-only FastAPI backend forwarding to `preprod.mygenie.online`. React 19 frontend with intelligence layer.

## Repo
- **Source**: `Abhi-mygenie/central-iventory`
- **Branch**: `13-june-1` (pulled 2026-06-13)

## Architecture / Tech Stack
- **Frontend**: React 19, CRACO, Tailwind CSS 3, Radix UI (shadcn), Recharts, React Router v7, Axios, Zod, react-hook-form
- **Backend**: FastAPI (Python), Motor (async MongoDB), httpx (proxy calls), bcrypt, PyJWT
- **Database**: MongoDB (local via Motor/pymongo) — used only for token sessions + status checks
- **External APIs**: MyGenie POS preprod API v1/v2 — all business logic lives in POS backend
- **Cache**: In-memory response cache in `api.js` (LONG 60s / MEDIUM 45s / SHORT 30s TTL)

## Architecture Contracts (FROZEN — from L0 Baseline)
1. Hierarchy: 3 fixed levels — Central (top) → Master (mid) → Outlet (bottom)
2. Terminology inversion: Backend `master` = Business Central, `central` = Business Master, `franchise` = Business Outlet
3. Backend is proxy-only — zero local business logic
4. Stock source of truth: Segment ledger (`inventory_stock_segments`), not aggregate
5. Auth model: Vendor employee login via POS API. Token-bound to one restaurant.
6. Transfer lifecycle: requested → approved → dispatched → received / partially_received / rejected / cancelled / on_hold

## What's Been Implemented
- **S0**: CR-001 to CR-014 — all 24 screens built
- **S1**: CR-019 — Intelligent UI Freeze (24/24 screens)
- **S2**: CR-021 (Intelligence layer), CR-022 (Code quality)
- **S3**: CR-023 (17 bug fixes), CR-024 (API Cache), CR-025 (Intelligent PO) — all CLOSED
- **S3**: CR-015 (FEFO Batch Stock Detail) — CLOSED
- **S3**: CR-016 (Hierarchy Toggle) — **QA PASS** ✅ (iteration_44, 7/7)
- **S3**: CR-026 (Production Unit Module) — **QA PASS** ✅ (iteration_43, 14/14)
- **S3**: CR-027 (Navigation Restructure) — **QA PASS** ✅ (iteration_43, 14/14)
- **S3**: CR-029 (Stock Inventory FG/Raw Split) — **QA PASS** ✅ (iteration_43, 14/14)

## QA Results Summary (2026-06-13)

| CR | Test Report | Result |
|----|-------------|--------|
| CR-016 | iteration_44.json | 7/7 PASS — toggle, heatmap, role gating, terminology |
| CR-026 | iteration_43.json | 14/14 PASS — production form, history, role gating |
| CR-027 | iteration_43.json | 14/14 PASS — 6 sections, 15 nav items, redirects |
| CR-029 | iteration_43.json | 14/14 PASS — FG/Raw/All tabs, filtering, KPIs |

## Prioritized Backlog

| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| P0 | CR-028 | Product Catalog Overhaul | PROPOSED |
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

## Session Log
- **2026-06-13**: Pulled branch `13-june-1`. Completed mandatory reading. QA: CR-026/027/029 all PASS (14/14). CR-016 re-QA PASS (7/7). Governance updated. All 4 CRs pending owner signoff.

## Next Tasks
1. Owner signoff on CR-016, CR-026, CR-027, CR-029
2. CR-028: Product Catalog Overhaul
3. CR-018: Wastage Report Enhancements
