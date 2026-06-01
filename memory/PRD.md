# Central Inventory — PRD

## Original Problem Statement
Pull code from https://github.com/Abhi-mygenie/central-iventory.git (branch: 10-may), wipe local /app and deploy the app.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, Craco, shadcn/ui components
- **Backend**: FastAPI proxy → preprod.mygenie.online POS API (auth + V2 endpoints)
- **Database**: MongoDB (session storage for token_sessions, status_checks)
- **Auth**: Proxy to MyGenie POS vendor employee login

## What's Been Implemented (June 1, 2026)
- Cloned repo from GitHub (branch: 10-may) into /app
- Preserved platform essentials (.emergent, .git, frontend/.env, backend/.env)
- Installed all backend Python dependencies (FastAPI, motor, httpx, etc.)
- Installed all frontend JS dependencies (React 19, Radix UI, recharts, etc.)
- Added PREPROD_API_BASE_V1 and PREPROD_API_BASE_V2 to backend .env
- Both services running and verified

## Environment Variables
### Backend (.env)
- MONGO_URL — MongoDB connection
- DB_NAME — Database name
- CORS_ORIGINS — CORS config
- PREPROD_API_BASE_V1 — POS API V1 base URL
- PREPROD_API_BASE_V2 — POS API V2 base URL

### Frontend (.env)
- REACT_APP_BACKEND_URL — Backend API URL
- WDS_SOCKET_PORT — WebSocket port for dev server
- ENABLE_HEALTH_CHECK — Health check toggle

## App Structure
- 34 frontend components (central-inventory, layout, common, ui)
- 10 custom hooks
- 880-line API service layer with 88 methods
- Backend is a thin proxy to POS API (177 lines)

## Key Screens
- Login, Operations Hub, Hierarchy Summary, Store Detail
- Pending Queues, Transfer Detail, History Ledger
- Direct Dispatch, Request Stock, Stock Adjustment
- Wastage Entry/Report, Operational Settings, Vendor Management
- Stock Inventory Summary, Stock Detail Panel
- Ingredient/Product/Recipe/Addon-Recipe Catalogues
- Daily Consumption Report, Hierarchy Management

## Next Steps
- User testing with real MyGenie credentials
- Implementation Sprint A-C (UI freeze implementation)
- Backend gap resolution (G-012 to G-016)
