# Central Inventory PRD

## Original Problem Statement
Multi-store hierarchy stock management module for the MyGenie POS platform. Proxy-only FastAPI backend forwarding to `preprod.mygenie.online`. React 19 frontend with intelligence layer.

## Repo
- **Source**: `Abhi-mygenie/central-iventory`
- **Branch**: `13-june-1` (pulled on 2026-06-13)

## Architecture / Tech Stack
- **Frontend**: React 19, CRACO, Tailwind CSS 3, Radix UI (shadcn), Recharts, React Router v7, Axios, Zod, react-hook-form
- **Backend**: FastAPI (Python), Motor (async MongoDB), httpx (proxy calls), bcrypt, PyJWT, python-jose, litellm, openai, google-genai, stripe, boto3
- **Database**: MongoDB (local via Motor/pymongo)
- **External APIs**: MyGenie POS preprod API v1/v2 — all business logic lives in POS backend
- **Build tooling**: CRACO (Create React App Configuration Override), PostCSS, Tailwind CSS, ESLint
- **Key Libraries (Frontend)**: lucide-react, sonner (toasts), cmdk (command palette), embla-carousel, react-resizable-panels, vaul (drawer), date-fns, recharts
- **Key Libraries (Backend)**: emergentintegrations, litellm, pandas, numpy, pillow, stripe, boto3, google-genai, openai

## What's Been Implemented
Refer to control/ directory for full CR registry and sprint status.

## Key Architecture Rules
1. **Terminology inversion**: UI "Central Store" = API `master`, UI "Master Store" = API `central`, UI "Outlet" = API `franchise`
2. **Backend is proxy-only**: Zero business logic in `server.py`
3. **Stock source of truth**: Segment ledger (`inventory_stock_segments`), not aggregate
4. **`display_qty` is STRING**: Always `Number()` wrap before arithmetic
5. **Frozen files**: `terminology.js`, Phase 7 Freeze doc, all L0 baseline docs

## Session Log
- **2026-06-13**: Pulled branch `13-june-1` from GitHub repo. No run/deploy/test requested.
