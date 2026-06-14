# Central Inventory - PRD

## Overview
Central Inventory management system cloned from `https://github.com/Abhi-mygenie/central-iventory.git` (branch `14-june-1`).

## Tech Stack
- **Backend**: Python FastAPI + Motor (async MongoDB) + httpx (proxy to POS APIs)
- **Frontend**: React 19 + CRACO + Tailwind CSS + Radix UI/Shadcn + React Router + Recharts
- **Database**: MongoDB (local)
- **External APIs**: Proxies to `preprod.mygenie.online` POS API (V1 auth, V2 vendor/inventory)

## Architecture
- Backend acts as a proxy layer between frontend and MyGenie POS APIs
- Auth via MyGenie vendor login (proxied through `/api/proxy/auth/login`)
- All V2 inventory/transfer/recipe/production endpoints proxied via `/api/proxy/v2/*`
- Frontend uses axios client with caching layer, token management, response normalization

## What's Been Implemented (2026-06-14)
- Cloned repo from GitHub branch `14-june-1`
- Created `.env` files for backend (MONGO_URL, DB_NAME, PREPROD API bases) and frontend (REACT_APP_BACKEND_URL)
- Installed all Python and Node.js dependencies
- Both backend (FastAPI on 8001) and frontend (React on 3000) running via supervisor
- App loads successfully with login page

## Key Modules
- Hierarchy Management (franchise stores)
- Stock Inventory & FEFO Stock Detail
- Transfer Management (request, approve, dispatch, receive)
- Ingredient & Product Catalogues
- Sub-recipe & Recipe Management
- Production Runs
- Vendor Management & Purchase Orders
- Wastage Tracking & Reporting
- Daily Consumption Reports
- Operational Settings

## Next Action Items
- None requested — setup complete per user instructions
