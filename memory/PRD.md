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
- **Files**: `RecipeCatalogue.jsx` (line 317), `SubRecipeMaster.jsx` (line 363)
- **Status**: QA PASS (4/4) — Owner signoff PENDING

### 2026-06-14 — CR-035 (Store Creation 2-Step + Outlet Visibility)
- **Part A**: Replaced single-step store create with 2-step wizard (Details → Review catalog counts → Create & Push)
- **Part B**: Fixed outlet visibility from Central Store — merged outlets from hierarchy-detail API into displayChildren
- **File**: `StoreManagement.jsx`
- **Status**: QA PASS (8/8) — Owner signoff PENDING

## Prioritized Backlog

| Priority | Item | Status | Est. |
|----------|------|--------|------|
| P1 | CR-025 sub-task: wire reference_code as PO number | Planning done | ~30 min |
| P2 | CR-015: FEFO Batch Stock Detail Panel | Code ~80% built | TBD |

## Next Tasks
1. Owner signoff on BUG-017 and CR-035
2. Implement CR-025 sub-task (wire reference_code as PO number)
