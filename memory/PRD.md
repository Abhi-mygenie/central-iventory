# Central Inventory — PRD

## Problem Statement
Pull the `central-iventory` repo from GitHub (branch `13-june-2`) into `/app`, set up dependencies, and deploy (run) the application.

## Architecture
- **Backend**: FastAPI (Python 3.11) — proxy layer to MyGenie POS preprod APIs (`preprod.mygenie.online`)
  - MongoDB (Motor async) for local state (status_checks, token_sessions)
  - httpx for upstream HTTP calls
- **Frontend**: React 19 + CRACO + Tailwind CSS + Radix UI/shadcn components
  - Axios API service layer with caching + in-flight dedup
  - React Router for SPA routing
- **Database**: MongoDB (local, `test_database`)

## What's Been Implemented (June 13, 2026)
- Repo cloned from `13-june-2` branch
- Backend dependencies installed (requirements.txt)
- Frontend dependencies installed (yarn)
- Both services running via supervisor
- Backend API confirmed reachable
- Frontend login page rendering correctly

## Core Features (from repo)
- Auth proxy (login via MyGenie vendor API)
- Inventory transfer management (initiate, approve, dispatch, receive, cancel)
- Stock request 3-step flow (sources → catalog → request)
- Stock adjustments (increase/decrease)
- Wastage recording & reporting
- Catalogue management (categories, items, foods, addons, recipes, sub-recipes)
- Hierarchy/franchise management
- Production runs
- Daily consumption reports
- Operational settings

## Prioritized Backlog
- P0: Verify end-to-end login with real credentials
- P1: Test all proxy endpoints against preprod
- P2: Add error monitoring / logging dashboard
