# Central Inventory PRD

## Original Problem Statement
Wipe /app and re-pull code from https://github.com/Abhi-mygenie/central-iventory.git (branch: planning-final). Run as-is, no tests needed.

## Architecture
- **Frontend**: React 19, CRACO, Tailwind CSS, Radix UI, Recharts, React Router v7
- **Backend**: FastAPI (Python), Motor (async MongoDB driver), httpx (HTTP proxy to MyGenie POS APIs)
- **Database**: MongoDB (local, `central_inventory` DB)
- **External APIs**: MyGenie POS preprod API (v1/v2) — proxied through backend

## What's Been Implemented
- [2026-06-13] Cloned repo (Abhi-mygenie/central-iventory, branch planning-final), installed all dependencies, configured .env files, started all services successfully

## User Personas
- MyGenie vendor employees managing central inventory operations

## Core Requirements
- Login via MyGenie vendor accounts (proxied auth)
- Operations Hub, Hierarchy Summary, Store Detail, Pending Queues
- Stock Inventory, Catalogues (Ingredients, Products, Recipes)
- Direct Dispatch, Request Stock, Stock Adjustment, Wastage Entry/Report
- Vendor Management, Operational Settings

## Prioritized Backlog
- No pending items — running as-is per user request

## Next Tasks
- Await user instructions for any modifications or feature work
