# Central Inventory — PRD

## Original Problem Statement
Pull code from GitHub repo `Abhi-mygenie/central-iventory.git` branch `01-june`, deploy, and continue development.

## Architecture
- **Frontend:** React 19 + Tailwind + Radix UI + craco (port 3000)
- **Backend:** FastAPI proxy to `preprod.mygenie.online` POS API (port 8001)
- **Database:** MongoDB (local, for token sessions only)
- **Auth:** POS API login with token-based sessions
- **Intelligence:** All computed frontend-side from POS API data

## User Personas
- **Central Store (TOP):** Full admin — approvals, dispatch, settings, hierarchy management
- **Master Store (MID):** Transfer management, stock visibility
- **Outlet (BOTTOM):** Request stock, receive, wastage

## Core Requirements (Static)
- 24 screens with intelligence upgrades per Phase 7 Frozen Spec
- Proxy-only backend (zero business logic)
- Frontend-computed intelligence from POS API data
- Role-based screen visibility (Central/Master/Outlet)

## What's Been Implemented
### 2026-06-01: Code deployed from GitHub
- All 24 screens present in codebase
- 13 screens fully upgraded with intelligence
- 7 screens partially upgraded
- 4 screens NOT upgraded (TransferDetail, HierarchySummary, IngredientCatalogue, DailyConsumptionReport)

### 2026-06-01: Audit & Data Seed (CR-023 Phase 0)
- Identified 18 API-mismatch bugs
- Control gate forensic analysis completed
- ChocolateHut data seeded (158 items, stock, batches, transfers)
- DELETE proxy bug fixed

## Active Work: CR-023
- Phase 0: Data Seed ✅
- Phase 1: Impact Analysis (PENDING)
- Phase 2: Implementation Plan (PENDING)
- Phase 3: Implementation (PENDING)
- Phase 4: QA (PENDING)

## Prioritized Backlog
### P0 (Critical)
- Fix 18 API-mismatch bugs (CR-023)
- TransferDetail store snapshot + impact summary
- OperationsHub store health grid fix

### P1 (High)
- Restaurant name resolution across all screens
- Consumption report intelligence (days-of-cover, trend)
- DirectDispatch auto-detect needs

### P2 (Medium)
- Receive/Approve/Dispute intelligence enhancements
- Catalogue cross-ref columns
- Vendor purchase history columns
- HierarchySummary health column

### Backend Gaps (External team)
- G-013: PO number generation
- G-014: Invoice OCR endpoint
- G-015: Excel parsing endpoint
