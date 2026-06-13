# L7 — File Ownership (Frozen vs Active)

> **Updated:** 2026-06-02 (CR-024 + CR-025 complete)

---

## Frozen Files (DO NOT MODIFY without owner approval)

| File / Folder | Reason |
|---------------|--------|
| `memory/central_inventory/CENTRAL_INVENTORY_BUSINESS_RULE_AND_UX_FIELD_FREEZE.md` | Frozen business rules |
| `memory/central_inventory/SYSTEM_HANDOVER_DOCUMENT.md` | Architecture bible |
| `memory/central_inventory/OWNER_ANSWERS_COMPLETE.md` | 104 owner decisions |
| `memory/central_inventory/CENTRAL_INVENTORY_LOGIN_CONTEXT_AND_SCREEN_VISIBILITY_MATRIX.md` | Role-screen matrix |
| `frontend/src/lib/terminology.js` | Terminology inversion — changes break everything |
| `frontend/src/lib/screenVisibility.js` | Role-based nav + access gates |
| `backend/.env` | Protected env vars |
| `frontend/.env` | Protected env vars |
| `control/registry.json` | Single source of truth — edit carefully, regenerate dashboard |
| `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md` | Frozen implementation spec |

## Files Modified in S3

### CR-023: API Reality Check (16 files modified + 1 new)
| File | Change |
|------|--------|
| `hooks/useRestaurantMap.js` **(NEW)** | Shared restaurant ID→name resolver |
| `OperationsHub.jsx` | Progressive loading, store health grid fix |
| `PendingQueues.jsx` | Reject/Approve buttons, requester health mini-bar, insufficient warnings |
| `TransferDetail.jsx` | FROM/TO labels, Requester Store Snapshot, Approval Impact |
| `HistoryLedger.jsx` | Restaurant names via map |
| `HierarchySummary.jsx` | Health columns via hierarchy-detail |
| `ReceiveDialog.jsx` | Dispatched vs requested comparison |
| `ApproveWaveDialog.jsx` | FEFO badges, auto-select, "FEFO Recommended" |
| `DirectDispatchForm.jsx` | Destination health strip, duplicate warning |
| + 7 catalogue/dialog files | Various CR-023 batch 6 fixes |

### CR-024: API Response Cache (1 file)
| File | Change |
|------|--------|
| `frontend/src/services/api.js` | Added cache layer: `_cached()`, `_cacheGet/Set`, `_invalidateCache`, TTL config, in-flight dedup, mutation invalidation |

### CR-025: Intelligent PO (2 files — full rewrites)
| File | Change |
|------|--------|
| `RequestStockForm.jsx` | Full rewrite — coverage selector, consumption-based ordering, threshold fallback, category grouping, source cross-validation, order summary |
| `DirectDispatchForm.jsx` | Full rewrite — integrated dispatch table with inline Source Segment picker, "You'll retain X%", review warnings, coverage selector |

### CR-015: FEFO Batch Stock Detail Panel (1 file)
| File | Change |
|------|--------|
| `StockDetailPanel.jsx` | GAP-1: import `useRestaurantMap`, resolve source store names in batch table. GAP-2: wire `onClick` handlers for "Record Wastage" → `/wastage/new` and "Dispatch" → `/dispatch/new` |

### CR-016: Stock Inventory Hierarchy Toggle (3 files)
| File | Change |
|------|--------|
| `services/api.js` | `_getStockInventory` accepts `{ includeHierarchy }` param, appends `?include_hierarchy=true` |
| `hooks/useStockInventory.js` | Added `useLoginContext`, `canToggleHierarchy`, `showHierarchy` state, `hierarchySummary`/`hierarchyContext` state |
| `StockInventorySummary.jsx` | Toggle switch, 4th KPI "Stores in Scope", low-stock alert banner, `StoreHeatmapCard` component, store heatmap grid sorted worst-first |

### CR-025 Sub-task: Wire `reference_code` as PO Number (9 files)
| File | Change |
|------|--------|
| `lib/formatters.js` | Added `referenceCode` param to `formatPO` (backwards compatible) |
| `PendingQueues.jsx` | Pass `item.reference_code` at 2 call sites |
| `TransferDetail.jsx` | Pass `data?.reference_code` at page title |
| `HistoryLedger.jsx` | Pass `reference_code` at 3 display sites + propagate into 4 derived ledger entries |
| `OperationsHub.jsx` | Pass `reference_code` at 2 call sites |
| `ApproveWaveDialog.jsx` | Pass `transfer?.reference_code` at dialog title |
| `ReceiveDialog.jsx` | Pass `transfer?.reference_code` at dialog title |
| `DisputeResolutionDialog.jsx` | Pass `transfer?.reference_code` at dialog title |
| `StockInventorySummary.jsx` | Removed dead `formatPO` import |

### CR-026: P28 Production Unit Module — Phase 1a+1b (9 files: 3 new + 6 modified)
| File | Change |
|------|--------|
| `hooks/useProductionRun.js` **(NEW)** | Hook: loads sub-recipes, stock, operational settings |
| `components/central-inventory/ProductionRunForm.jsx` **(NEW)** | Production run form with pre-production preview and post-production confirmation |
| `components/central-inventory/ProductionHistory.jsx` **(NEW)** | Production history list (G-018 stub) + audit detail drill-down |
| `services/api.js` | Added: `runProduction()`, `getProductionRunDetail()`, `getProductionRunHistory()` (G-018 stub) |
| `lib/screenVisibility.js` | Added: `scr-production` screen, `run-production` action, 2 nav items |
| `App.js` | Added: 3 routes + 2 imports for production screens |
| `components/layout/Sidebar.jsx` | Added: `Factory`, `ClipboardList` icons |
| `components/central-inventory/OperationsHub.jsx` | Added: "Run Production" quick action card |

## Key Dependencies

| Component | Depends On |
|-----------|-----------|
| All frontend components | `api.js` (with cache), `terminology.js`, `useLoginContext.js` |
| Intelligence screens | `useStockIntelligence.js`, `StockIntelligenceBar.jsx`, `formatters.js` |
| Intelligent PO | `api.js` (getStockInventory, getDailyConsumptionReport, requestCatalog, getHierarchyDetail) |
| Transfer write forms | `useWriteAction.js`, `transferActions.js` |
| Approval inbox | `FulfillmentVerdict.jsx`, `StoreHealthStrip.jsx`, `useRestaurantMap.js` |
