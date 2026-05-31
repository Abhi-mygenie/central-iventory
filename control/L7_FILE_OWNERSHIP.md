# L7 — File Ownership (Frozen vs Active)

> **Rule:** Updated when file categories change or new conflict zones are identified.

---

## Frozen Files (DO NOT MODIFY without owner approval)

| File / Folder | Reason |
|---------------|--------|
| `memory/central_inventory/CENTRAL_INVENTORY_BUSINESS_RULE_AND_UX_FIELD_FREEZE.md` | Frozen business rules |
| `memory/central_inventory/SYSTEM_HANDOVER_DOCUMENT.md` | Architecture bible |
| `memory/central_inventory/OWNER_ANSWERS_COMPLETE.md` | 104 owner decisions |
| `memory/central_inventory/CENTRAL_INVENTORY_LOGIN_CONTEXT_AND_SCREEN_VISIBILITY_MATRIX.md` | Role-screen matrix |
| `frontend/src/lib/terminology.js` | Terminology inversion mapping — changes break everything |
| `frontend/src/lib/screenVisibility.js` | Role-based nav + access gates |
| `backend/.env` | Protected env vars (MONGO_URL, DB_NAME) |
| `frontend/.env` | Protected env vars (REACT_APP_BACKEND_URL) |
| `control/registry.json` | Single source of truth — edit carefully |

## Active Files (Hot — frequently modified)

| File | Owner | Purpose |
|------|-------|---------|
| `frontend/src/services/api.js` | Shared | 86 API methods — all proxy calls |
| `frontend/src/App.js` | Shared | Route registrations |
| `frontend/src/components/central-inventory/*.jsx` | Per-CR | Feature components |
| `backend/server.py` | Backend | Proxy layer (177 lines) |

## Conflict Zones (Multiple CRs Touch These)

| File | Risk | CRs That Touch It |
|------|------|--------------------|
| `api.js` | HIGH — every CR adds methods | All CRs |
| `App.js` | MEDIUM — route additions | Most CRs |
| `OperationsHub.jsx` | MEDIUM — shortcut links | Many CRs |
| `screenVisibility.js` | LOW — nav item additions | CRs adding new screens |

## Key Dependencies

| Component | Depends On |
|-----------|-----------|
| All frontend components | `api.js`, `terminology.js`, `useLoginContext.js` |
| Transfer write forms | `useWriteAction.js`, `transferActions.js` |
| Catalogue screens | `useCatalogueCrud.js` |
| All screens | `screenVisibility.js` (nav gating) |
