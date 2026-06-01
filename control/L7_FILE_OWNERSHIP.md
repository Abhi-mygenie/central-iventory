# L7 — File Ownership (Frozen vs Active)

> **Updated:** 2026-06-01 (Sprint A+B+C implementation complete)

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
| `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` | Frozen implementation spec |

## Active Files (Hot — frequently modified)

| File | Owner | Purpose |
|------|-------|---------|
| `frontend/src/services/api.js` | Shared | 88 API methods — all proxy calls |
| `frontend/src/App.js` | Shared | Route registrations |
| `frontend/src/components/central-inventory/*.jsx` | Per-CR | Feature components |
| `backend/server.py` | Backend | Proxy layer (177 lines) |

## New Files Created (Sprint A+B+C)

| File | Sprint | Purpose |
|------|:------:|---------|
| `frontend/src/hooks/useStockIntelligence.js` | A | Shared intelligence computations |
| `frontend/src/components/common/StockIntelligenceBar.jsx` | A | 6-metric stock health strip |
| `frontend/src/components/common/PostSubmitConfirmation.jsx` | B | Reusable success card |
| `frontend/src/components/common/StoreHealthStrip.jsx` | B | Compact store health display |
| `frontend/src/components/common/FulfillmentVerdict.jsx` | B | Fulfillment verdict badge |

## Heavily Modified Files (Sprint A+B+C)

| File | Sprint | Change Type |
|------|:------:|-------------|
| `OperationsHub.jsx` | A | Full rewrite — intelligence command center |
| `PendingQueues.jsx` | B | Full rewrite — card-based approval inbox |
| `StockDetailPanel.jsx` | A | Major — FEFO enhancements, batch table upgrades |
| `HistoryLedger.jsx` | A | Major — PO column, Export CSV |
| `StatusTimeline.jsx` | A | Major — relative times, durations, stale detection |

## Conflict Zones (Multiple CRs Touch These)

| File | Risk | CRs That Touch It |
|------|------|--------------------|
| `api.js` | HIGH — every CR adds methods | All CRs |
| `App.js` | MEDIUM — route additions | Most CRs |
| `OperationsHub.jsx` | HIGH — intelligence hub, many data sources | Sprint A + many future CRs |
| `PendingQueues.jsx` | HIGH — card inbox, batch-fetches details | Sprint B + approval CRs |
| `formatters.js` | MEDIUM — new formatPO utility, shared | All screens using PO |
| `screenVisibility.js` | LOW — nav item additions | CRs adding new screens |

## Key Dependencies

| Component | Depends On |
|-----------|-----------|
| All frontend components | `api.js`, `terminology.js`, `useLoginContext.js` |
| Intelligence screens | `useStockIntelligence.js`, `StockIntelligenceBar.jsx`, `formatters.js` |
| Transfer write forms | `useWriteAction.js`, `transferActions.js` |
| Approval inbox | `FulfillmentVerdict.jsx`, `StoreHealthStrip.jsx` |
| Catalogue screens | `useCatalogueCrud.js` |
| All screens | `screenVisibility.js` (nav gating) |
