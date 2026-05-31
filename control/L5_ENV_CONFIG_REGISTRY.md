# L5 — Env & Config Registry

> **Rule:** Updated on any env change, feature flag change, or config rotation.

---

## Backend Environment (`/app/backend/.env`)

| Variable | Value | Purpose | Protected? |
|----------|-------|---------|:----------:|
| `MONGO_URL` | `mongodb://localhost:27017` | Local MongoDB connection | YES |
| `DB_NAME` | `test_database` | MongoDB database name | YES |
| `CORS_ORIGINS` | `*` | CORS allowed origins | NO |
| `PREPROD_API_BASE_V1` | `https://preprod.mygenie.online/api/v1` | POS API v1 base (default in code) | NO |
| `PREPROD_API_BASE_V2` | `https://preprod.mygenie.online/api/v2/vendoremployee` | POS API v2 base (default in code) | NO |

## Frontend Environment (`/app/frontend/.env`)

| Variable | Value | Purpose | Protected? |
|----------|-------|---------|:----------:|
| `REACT_APP_BACKEND_URL` | `https://run-as-is-16.preview.emergentagent.com` | Backend API URL (managed by platform) | YES |
| `WDS_SOCKET_PORT` | `443` | WebSocket dev server port | YES |
| `ENABLE_HEALTH_CHECK` | `false` | Health check plugin toggle | NO |

## Feature Flags

| Flag | Location | Current Value | Purpose |
|------|----------|:------------:|---------|
| `ENABLE_HEALTH_CHECK` | `frontend/.env` | `false` | Webpack health check plugin |

## Config History

| Date | Change | By | Reason |
|------|--------|----|----|
| 2026-05-31 | Initial registry created | Governance setup | Baseline documentation |
