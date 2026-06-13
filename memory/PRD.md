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
3. Backend is proxy-only: FastAPI forwards all calls to `preprod.mygenie.online` — zero local business logic
4. Stock source of truth: Segment ledger (`inventory_stock_segments`), not aggregate
5. Auth model: Vendor employee login via POS API. Token-bound to one restaurant.
6. Transfer lifecycle: requested → approved → dispatched → received / partially_received / rejected / cancelled / on_hold

## What's Been Implemented (Timeline)
- **S0 (Pre-Governance)**: CR-001 to CR-014 — all 24 screens built
- **S1**: CR-019 — Intelligent UI Freeze (24/24 screens approved)
- **S2**: CR-021 (Intelligence layer), CR-022 (Code quality fixes)
- **S3**: CR-023 (API Reality Check, 17 bug fixes) — CLOSED
- **S3**: CR-024 (API Response Cache, 72% reduction) — CLOSED
- **S3**: CR-025 (Intelligent PO + reference_code wire) — CLOSED
- **S3**: CR-015 (FEFO Batch Stock Detail Panel) — CLOSED
- **S3**: CR-026 (P28 Production Unit Module) — **QA PASS** ✅
- **S3**: CR-027 (Navigation Restructure) — **QA PASS** ✅
- **S3**: CR-029 (Stock Inventory FG/Raw Split) — **QA PASS** ✅

## Current Sprint: S3

| CR | Title | Status |
|----|-------|:------:|
| CR-023 | API Reality Check — 17 bug fixes | CLOSED |
| CR-024 | API Response Cache (71→20 calls) | CLOSED |
| CR-025 | Intelligent PO + reference_code wire | CLOSED |
| CR-015 | FEFO Batch Stock Detail Panel | CLOSED |
| CR-026 | P28 Production Unit Module | **QA** — pending owner signoff |
| CR-027 | Navigation Restructure (6 sections, 15 items) | **QA** — pending owner signoff |
| CR-029 | Stock Inventory FG/Raw Split (3 tabs) | **QA** — pending owner signoff |

## QA Results (2026-06-13)
- **Test Report**: `/app/test_reports/iteration_43.json`
- **Result**: 14/14 features verified, 100% pass rate
- **CR-027**: 6 sidebar sections, 15 nav items, collapse/expand, route redirects, StoreManagement tabs, SubRecipeMaster page
- **CR-029**: All (47) / FG (4) / Raw (43) tabs with correct filtering and KPIs
- **CR-026**: Production Run Form (4 recipes), History (10 runs), role-based visibility (Outlet hidden)

## Prioritized Backlog

| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| P0 | CR-028 | Product Catalog Overhaul (Excel-like bulk editor) | PROPOSED |
| P1 | CR-016 | Hierarchy Toggle | IN_PROGRESS (re-QA) |
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

## Governance
- All CRs require 7-artifact closure model
- Registry: `control/registry.json` → `node control/gen_dashboard_data.js`
- Frozen files: terminology.js, screenVisibility.js, backend/.env, frontend/.env, Phase 7 Freeze doc, 6 L0 baseline docs

## Session Log
- **2026-06-13**: Pulled branch `13-june-1`. Completed mandatory reading (10 files). Created .env files. QA smoke tested CR-026/027/029 — all PASS (14/14). Updated governance (registry.json, L1, L6). Pending: owner signoff.

## Next Tasks
1. Owner signoff on CR-026, CR-027, CR-029
2. CR-028: Product Catalog Overhaul implementation
3. CR-016 re-QA (hierarchy toggle hook fix)
4. CR-018: Wastage Report Enhancements
