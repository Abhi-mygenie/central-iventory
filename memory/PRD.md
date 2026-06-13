# Central Inventory PRD

## Original Problem Statement
Multi-store hierarchy stock management module for the MyGenie POS platform. Proxy-only FastAPI backend forwarding to `preprod.mygenie.online`. React 19 frontend with intelligence layer.

## Repo
- **Source**: `Abhi-mygenie/central-iventory`
- **Branch**: `13-june-1` (pulled 2026-06-13)

## Architecture / Tech Stack
- **Frontend**: React 19, CRACO, Tailwind CSS 3, Radix UI (shadcn), Recharts, React Router v7, Axios, Zod, react-hook-form
- **Backend**: FastAPI (Python), Motor (async MongoDB), httpx (proxy calls)
- **Database**: MongoDB (local via Motor/pymongo) — token sessions + status checks only
- **External APIs**: MyGenie POS preprod API v1/v2

## What's Been Implemented (This Session — 2026-06-13)

| CR | Title | Status | Test Report |
|----|-------|:------:|-------------|
| CR-016 | Hierarchy Toggle | QA ✅ (7/7) | iteration_44 |
| CR-026 | Production Unit Module | QA ✅ (14/14) | iteration_43 |
| CR-027 | Navigation Restructure | QA ✅ (14/14) | iteration_43 |
| CR-029 | Stock Inventory FG/Raw Split | QA ✅ (14/14) | iteration_43 |
| CR-030 | Inward Screens Audit | QA ✅ (8/8) | iteration_45 |

### CR-030 Implementation Details
- Phase 1: Replaced `alert()` with toast in VendorManagement, added error toast in IngredientCatalogue
- Phase 2: Added "Pushed to stores" column (5 stores badge) in Raw Material Master
- Phase 3: Purchase partial failure UX (per-item tracking), file inputs show G-014/G-015 toast
- Phase 4: "Empty" badge for 0-stock items (22 items)

## Prioritized Backlog

| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| READY | CR-018 | Wastage Report Enhancements | Code-Gate APPROVED, mock frozen |
| READY | CR-031 | Production Screens Audit | Code-Gate APPROVED |
| READY | CR-032 | Outward Screens Audit | Code-Gate APPROVED |
| PLANNED | CR-033 | Action Screens Audit | Needs Impact Analysis |
| PROPOSED | CR-028 | Product Catalog Overhaul | No artifacts |

## Session Log
- Pulled branch 13-june-1, completed mandatory reading
- QA: CR-016/026/027/029 — all PASS
- CR-030: Implemented + QA PASS (8/8)
- Pulled 24 planning files from 13-june-2 (CR-030-033, G-020/021)
- Registered CR-030-033 + G-020/021 in governance
- CR-018 planning complete (mock frozen, code-gate approved)
