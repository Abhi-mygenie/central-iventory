# Central Inventory - PRD

## Problem Statement
Clone and run https://github.com/parth-mygenie/central_inventory.git (branch: 13-6-26) as-is on the Emergent platform.

## Tech Stack
- **Backend**: FastAPI (Python) + Motor (async MongoDB) + httpx (proxy calls to preprod.mygenie.online)
- **Frontend**: React 19 + Craco + Tailwind CSS + Radix UI (shadcn) + Recharts + React Router
- **Database**: MongoDB (local)
- **External APIs**: Proxied calls to preprod.mygenie.online (MyGenie POS API)

## What's Been Implemented
- [2026-06-13] Cloned repo from GitHub (branch 13-6-26), installed all dependencies, configured platform .env files, and started both services successfully.

## Current Status
- Backend: RUNNING (FastAPI on port 8001)
- Frontend: RUNNING (React/Craco on port 3000, compiled with 1 minor lint warning)
- App loads login page: "Central Inventory — Sign in with MyGenie vendor account"

## Backlog
- No modifications requested — running as-is per user instruction.
