# Central Inventory - PRD

## Overview
Central Inventory management system — multi-store hierarchy stock management module for MyGenie POS platform.

## Tech Stack
- **Backend**: Python FastAPI + Motor (async MongoDB) + httpx (proxy to POS APIs)
- **Frontend**: React 19 + CRACO + Tailwind CSS + Radix UI/Shadcn + React Router + Recharts
- **Database**: MongoDB (local)
- **External APIs**: Proxies to `preprod.mygenie.online` POS API (V1 auth, V2 vendor/inventory)

## Architecture
- Backend is proxy-only (~180 lines, zero business logic), forwards all calls to preprod.mygenie.online
- Auth via MyGenie vendor login (proxied through `/api/proxy/auth/login`)
- All V2 inventory/transfer/recipe/production endpoints proxied via `/api/proxy/v2/*`
- Frontend uses axios client with caching layer, token management, response normalization

## What's Been Implemented

### 2026-06-14 — Session Setup
- Cloned repo from GitHub branch `14-june-1`
- Created `.env` files, installed all dependencies, services running

### 2026-06-14 — BUG-017 Fix (Duplicate Ingredient Filter)
- **Problem**: Ingredient dropdown in Recipe and Sub-Recipe BOM editors allowed selecting same item multiple times
- **Fix**: Added `.filter()` to exclude already-selected ingredient IDs from dropdown options
- **Files changed**: `RecipeCatalogue.jsx` (line 317), `SubRecipeMaster.jsx` (line 363)
- **Status**: QA PASS (4/4 tests passed) — awaiting owner signoff
- **Artifacts**: All 7 artifacts complete (0-5 DONE, 6 PENDING owner signoff)

## Prioritized Backlog

| Priority | Item | Status | Est. |
|----------|------|--------|------|
| P0 | CR-035: Store Creation 2-Step + Outlet Visibility | PLANNED (Artifacts 0-3 done) | ~65 min |
| P1 | CR-025 sub-task: wire reference_code as PO number | Planning done | ~30 min |
| P2 | CR-015: FEFO Batch Stock Detail Panel | Code ~80% built | TBD |

## Next Tasks
1. Get owner signoff on BUG-017
2. Implement CR-035 (Store Creation 2-Step + Outlet Visibility) if owner approves
