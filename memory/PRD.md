# Central Inventory - PRD

## Original Problem Statement
Wipe current /app, pull https://github.com/Abhi-mygenie/central-iventory.git (branch 14-june-1), detect tech stack, set up and run. No code audit, no test needed.

## Architecture
- **Backend**: Python FastAPI + Motor (async MongoDB) + httpx (proxy to MyGenie POS API)
- **Frontend**: React 19 + CRACO + Tailwind CSS + Radix UI / shadcn components
- **Database**: MongoDB (local)
- **External API**: MyGenie POS preprod API (https://preprod.mygenie.online)

## What's Been Implemented
- [2025-06-14] Cloned repo from GitHub (branch `14-june-1`)
- [2025-06-14] Installed all backend & frontend dependencies
- [2025-06-14] Configured environment variables (.env files)
- [2025-06-14] Both services running and verified via screenshot

## Key Components
- **Backend (server.py)**: FastAPI proxy server routing auth and V2 API calls to MyGenie POS preprod API
- **Frontend**: Central Inventory management app with login, inventory, recipes, production, purchase orders, vendor management, stock tracking, and more
- **Authentication**: Proxied through MyGenie vendor employee login

## Status
- App is fully running and accessible
- Login page loads correctly
- Backend API responds at /api/
