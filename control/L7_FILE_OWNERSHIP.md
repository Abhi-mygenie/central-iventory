# L7 — File Ownership (Frozen vs Active)

> **Updated:** 2026-06-01 (Session closing — all implementation complete)

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

## Files Created in S2 (6 new)

| File | Purpose | Depends On |
|------|---------|-----------|
| `hooks/useStockIntelligence.js` | Shared intelligence computations | api.js |
| `components/common/StockIntelligenceBar.jsx` | 6-metric stock health strip | — |
| `components/common/PostSubmitConfirmation.jsx` | Success card for write actions | formatters.js |
| `components/common/StoreHealthStrip.jsx` | Compact store health display | — |
| `components/common/FulfillmentVerdict.jsx` | Can/Partial/Can't fulfill badge | — |
| `lib/formatters.js` (formatPO added) | PO-XXXX format utility | — |

## Files Modified in S2 (26 existing)

| File | Change Summary |
|------|---------------|
| `OperationsHub.jsx` | Full rewrite — greeting, NBA, KPIs, stock health, store grid, activity |
| `PendingQueues.jsx` | Full rewrite — card-based inbox, item table, verdicts, age badges |
| `AddStockPurchaseForm.jsx` | Full rewrite — 3-mode tabbed (Upload Invoice + Manual Entry), stock context |
| `StockDetailPanel.jsx` | Major — % of Total, Action col, FEFO badge, reorder suggestion |
| `HistoryLedger.jsx` | Major — PO column, Export CSV |
| `StatusTimeline.jsx` | Major — relative times, durations, stale detection |
| `TransferDetail.jsx` | PO title, relative time |
| `ReceiveDialog.jsx` | PO title, dispatch time context |
| `ApproveWaveDialog.jsx` | PO title |
| `DisputeResolutionDialog.jsx` | PO title |
| `SourceSelector.jsx` | FEFO badges, expired disabled |
| `StockAdjustmentForm.jsx` | Stock context bar, impact preview, undo guidance |
| `WastageEntryForm.jsx` | Stock context, undo guidance |
| `OperationalSettings.jsx` | Impact badges, "Affects all stores" |
| `VendorManagement.jsx` | Status column (Active/Inactive) |
| `WastageReport.jsx` | Export CSV |
| `StockInventorySummary.jsx` | 3 new columns, Export CSV |
| `IngredientCatalogue.jsx` | Vendor column |
| `ProductCatalogue.jsx` | "Has Recipe" column |
| `RecipeCatalogue.jsx` | "Cost Mapped" column |
| `AddonRecipeCatalogue.jsx` | "Cost Mapped" column |
| `DailyConsumptionReport.jsx` | Days of Cover column |
| `HierarchyManagement.jsx` | Push Status column (Synced/Stale) |
| `HierarchySummary.jsx` | Health column (Active/No activity) |
| `StoreDetail.jsx` | Stock health summary strip (3 KPI cards) |
| `DirectDispatchForm.jsx` | Destination health strip |
| `RequestStockForm.jsx` | Low-stock suggestions banner |

## Key Dependencies

| Component | Depends On |
|-----------|-----------|
| All frontend components | `api.js`, `terminology.js`, `useLoginContext.js` |
| Intelligence screens | `useStockIntelligence.js`, `StockIntelligenceBar.jsx`, `formatters.js` |
| Transfer write forms | `useWriteAction.js`, `transferActions.js` |
| Approval inbox | `FulfillmentVerdict.jsx`, `StoreHealthStrip.jsx` |
| Catalogue screens | `useCatalogueCrud.js` |
| All screens | `screenVisibility.js` (nav gating) |
