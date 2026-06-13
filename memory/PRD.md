# Central Inventory PRD

## Original Problem Statement
Multi-store hierarchy stock management module for the MyGenie POS platform. Proxy-only FastAPI backend forwarding to `preprod.mygenie.online`. React 19 frontend with intelligence layer.

## Repo
- **Source**: `Abhi-mygenie/central-iventory`
- **Branch**: `13-june-1` (pulled 2026-06-13)

## Architecture / Tech Stack
- **Frontend**: React 19, CRACO, Tailwind CSS 3, Radix UI (shadcn), Recharts, React Router v7, Axios, Zod, react-hook-form
- **Backend**: FastAPI (Python), Motor (async MongoDB), httpx (proxy calls), bcrypt, PyJWT, python-jose, litellm, openai, google-genai, stripe, boto3
- **Database**: MongoDB (local via Motor/pymongo) — used only for token sessions + status checks
- **External APIs**: MyGenie POS preprod API v1/v2 — all business logic lives in POS backend
- **Build tooling**: CRACO, PostCSS, Tailwind CSS, ESLint
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
- **S3**: CR-023 (API Reality Check, 17 bug fixes), CR-024 (API Cache, 72% reduction), CR-025 (Intelligent PO + reference_code wire)
- **S3**: CR-015 FEFO Batch Stock Detail Panel — CLOSED
- **S3**: CR-016 Stock Inventory Hierarchy Toggle — Re-QA needed
- **S3**: CR-026 P28 Production Unit Module — All phases done
- **S3**: CR-027 Navigation Restructure — Implemented
- **S3**: CR-029 Stock Inventory FG/Raw Split — Implemented

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

## Governance
- All CRs require 7-artifact closure (Session-Start, Intake, Impact Analysis, Impl Plan, Code-Gate, QA Report, Owner Signoff)
- Frozen files: terminology.js, screenVisibility.js, backend/.env, frontend/.env, registry.json, Phase 7 Freeze doc, 6 L0 baseline documents
- Dashboard regeneration: `node control/gen_dashboard_data.js` after registry.json edits

## Session Log
- **2026-06-13**: Pulled branch `13-june-1` from GitHub. Completed mandatory reading (10 files). Created test_credentials.md. Onboarding complete.

## Next Tasks
1. Await owner instruction for next CR/BUG to work on
2. QA smoke test CR-027 (navigation) + CR-029 (stock split) + CR-026 (production)
3. CR-028: Product Catalog Overhaul implementation
4. CR-017 audit: segregate done vs remaining
5. CR-018: Wastage Report Enhancements planning
