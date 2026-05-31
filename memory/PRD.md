# Central Inventory - PRD

## Original Problem Statement
Wipe current /app, pull https://github.com/parth-mygenie/central_inventory.git (branch: 31_5_26), don't test, no need to focus on specific part, get tech stack from repo. Main motive: pull and run as-is.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI components, Recharts, React Router DOM 7, craco build system
- **Backend**: FastAPI (Python), Motor (async MongoDB driver), bcrypt, PyJWT, httpx
- **Database**: MongoDB (local)
- **External APIs**: Proxies to preprod.mygenie.online (v1/v2 APIs)
- **Build Tools**: craco, postcss, tailwindcss-animate

## What's Been Implemented (May 31, 2026)
- Cloned repo from GitHub (branch: 31_5_26) successfully
- Installed all backend Python dependencies (requirements.txt)
- Installed all frontend Node.js dependencies (yarn install)
- Backend running on port 8001 (FastAPI/uvicorn)
- Frontend running on port 3000 (craco/React)
- App loads successfully - Central Inventory login page visible
- Backend API responding at /api/ endpoint

## Core App Features (from repo)
- Central Inventory management system (MyGenie)
- Vendor login/auth system
- Hierarchy management
- Stock inventory & stock detail
- Catalogue CRUD
- Consumption & wastage reports
- Request stock flows
- Transfer actions
- Real-time inventory updates

## Prioritized Backlog
- N/A (user requested pull-and-run only)

## Next Tasks
- Per user direction: no testing required, app running as-is
