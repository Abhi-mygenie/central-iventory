# Central Inventory — PRD

## Original Problem Statement
Wipe current /app, pull https://github.com/parth-mygenie/central_inventory.git (branch 13-6-26), get tech stack from repo, run as-is, no tests needed.

## Architecture
- **Frontend:** React 19 + Craco + Tailwind CSS + Radix UI (shadcn) + react-router-dom v7
- **Backend:** FastAPI + Motor (async MongoDB) + httpx (proxy to MyGenie POS API)
- **Database:** MongoDB (local)
- **External APIs:** MyGenie POS preprod API (v1 auth, v2 vendor employee endpoints)

## What's Been Implemented (Jan 2026)
- [x] Cloned repo from GitHub (branch 13-6-26)
- [x] Installed backend Python dependencies (requirements.txt)
- [x] Installed frontend Node dependencies (yarn)
- [x] Restored environment variables (MONGO_URL, REACT_APP_BACKEND_URL, etc.)
- [x] All services running (backend, frontend, MongoDB)
- [x] App loads — login page visible and functional

## Core Features (from repo)
- Login via MyGenie vendor account (proxy to preprod POS API)
- Operations Hub, Hierarchy Summary, Store Detail
- Pending Queues, Transfer Detail, History Ledger
- Direct Dispatch, Request Stock, Stock Adjustment
- Wastage Entry & Report
- Vendor Management, Procurement
- Stock Inventory Summary & Detail (FEFO batch view)
- Catalogue: Ingredients, Products, Recipes, Addon-Recipes
- Daily Consumption Report
- Hierarchy Management
- Operational Settings

## Backlog
- No modifications requested — running as-is from repo

## Next Tasks
- User to test login with their MyGenie vendor credentials
- Any further feature requests or bug fixes as needed
