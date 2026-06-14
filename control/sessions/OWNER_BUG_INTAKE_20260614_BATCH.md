# Owner Bug Intake — 2026-06-14 (Batch: Pre-Registration Notes)

> **Status:** NOTED — Owner observations. Not yet registered in `registry.json`.
> **Source:** Owner screenshot walkthrough (Chai 813 hierarchy, Central Store login)
> **Action:** Owner will confirm, then agent registers as BUG-018+ in registry.

---

## BUG-A: "Stale — 125 items behind" on Store Management is misleading

**Screen:** Store Management (`/store-management`)
**Logged in as:** Central Store (Chai)
**Screenshot:** Store Management — Chai Master South shows "Stale — 125 behind", Chai Master North shows "Stale — 125 behind"

### What's Happening
The push status logic in `HierarchyManagement.jsx` (line 472–476) compares `source_entities` count vs `child_existing` count from the hierarchy-detail API. It computes:
```
behind = max(0, totalSource - totalChild)
```
This counts **all items in the Central Store catalog** minus **items that exist in the child store**, showing the raw difference as "items behind". With 125 source items and 0 child items → "125 behind".

### Owner Question
Why 125? This number likely reflects the total raw material + finished good catalog at Central level minus what's been pushed to that Master Store. The label "Stale — 125 items behind" is confusing — it implies something is broken rather than "125 catalog items haven't been pushed to this child store yet".

### Possible Fix Directions (pending owner decision)
- a) Change label to be clearer: e.g. "125 items not yet pushed" or "125 unpushed items"
- b) Separate counts: "X raw materials + Y finished goods not pushed"
- c) Investigate if the 125 count is accurate (could be counting items that shouldn't be pushed)
- d) Owner decides if this is even a useful metric to show

**Severity:** MEDIUM (UX confusion, no data loss)
**Files:** `frontend/src/components/central-inventory/HierarchyManagement.jsx` (lines 465–480, 563–565)

---

## BUG-B: Stock Inventory under OUTWARD shows all items (should split FG / Raw)

**Screen:** Stock Inventory (`/inventory`) — under OUTWARD sidebar section
**Screenshot:** Shows All (75), Finished Goods (31), Raw Materials (44) all in one view

### Owner Request
- **OUTWARD** section's Stock Inventory should show **only Finished Goods** (items you dispatch out)
- **INWARD** section should show **Raw Materials** (items you receive in)

### Current Behavior
`StockInventorySummary.jsx` shows all items with tab filters (All / Finished Goods / Raw Materials). The screen lives under the OUTWARD sidebar section but displays everything.

### Possible Fix Directions
- a) Default the OUTWARD Stock Inventory to Finished Goods tab, hide Raw Materials tab
- b) Create a separate "Raw Material Stock" screen under INWARD, or add RM view to existing Inward screens (Raw Material Master / Vendor Management)
- c) Split into two routes: `/inventory/outward` (FG only) and `/inventory/inward` (RM only)
- d) Keep one screen but change sidebar placement and default filter based on which section user clicked from

**Severity:** MEDIUM (UX/navigation, functional but confusing)
**Files:** `frontend/src/components/central-inventory/StockInventorySummary.jsx`, `frontend/src/App.js`, `frontend/src/components/layout/Sidebar.jsx`, `frontend/src/lib/screenVisibility.js` (FROZEN — may need owner approval if nav changes)

---

## BUG-C: "Unknown: —" in From/To on child Store Detail Recent Transactions

**Screen:** Store Detail (`/store/818`) — Recent Transactions section
**Screenshot:** All transactions show "Unknown: —" for both From and To columns

### Root Cause
In `StoreDetail.jsx` (lines 302–303), the code renders:
```jsx
{mapRestaurantType(txn.from_restaurant_type)}: {txn.from_restaurant_name || "—"}
```
The POS API transfer history response doesn't include `from_restaurant_type` or `from_restaurant_name` fields in the per-line items. `mapRestaurantType(undefined)` returns `"Unknown"` per `terminology.js` line 46. Combined with missing name → `"Unknown: —"`.

### This is a known gap
**G-003** in `L9_OPEN_GAPS_REGISTER.md`: "No user name resolution API" — and **G-004**: "History API missing restaurant_type". The transfer history API returns restaurant IDs but not names/types.

### Possible Fix Directions
- a) Use `useRestaurantMap` hook (already exists, built in CR-023) to resolve restaurant IDs to names — this is done in HistoryLedger.jsx but NOT in StoreDetail.jsx
- b) If the API returns `from_restaurant_id` / `to_restaurant_id`, we can look them up from the hierarchy data already loaded on the Store Detail page
- c) Fall back to showing just the store name without type prefix if type is unknown

**Severity:** HIGH (visible data quality issue on a frequently viewed screen)
**Files:** `frontend/src/components/central-inventory/StoreDetail.jsx` (lines 280–315), `frontend/src/hooks/useRestaurantMap.js`

---

## BUG-D: Remove "Adjust Stock" from Operations Hub Quick Actions

**Screen:** Operations Hub (`/`) — Quick Actions section
**Screenshot:** "Adjust Stock — Correct quantities" card highlighted by owner

### Owner Request
Remove it entirely. It was added for testing purposes only and is not needed in the production flow.

### Current Code
`OperationsHub.jsx` (line 456–462): gated by `canDo("adjust-stock")` permission check, navigates to `/stock-adjustment`.

### Fix
Remove the Adjust Stock card from Quick Actions. May also want to:
- Remove the `/stock-adjustment` route from `App.js`
- Remove from sidebar if present
- Keep or remove `StockAdjustmentForm.jsx` file (owner decision — could keep for future)

**Severity:** LOW (cosmetic, no functional impact)
**Files:** `frontend/src/components/central-inventory/OperationsHub.jsx` (lines 456–462), potentially `App.js`, `Sidebar.jsx`, `screenVisibility.js` (FROZEN)

---

## BUG-E: "Direct Stock Entry Disabled" gate screen — unnecessary redirect

**Screen:** Purchase / Add Stock (`/add-stock`) 
**Screenshot:** Shows "Direct Stock Entry Disabled" with "Go to Purchase Orders" button

### Owner Question
Why does this intermediate screen exist? If `require_po_for_purchase` is enabled (which it is for Chai), clicking "Purchase" in Quick Actions lands on this gate page that just tells the user to go to PO screen. Why not navigate directly to the PO screen?

### Current Code
`AddStockPurchaseForm.jsx` (line 80): checks `settings.require_po_for_purchase === true`, then renders a disabled-state page with a redirect button instead of the form.

### Possible Fix Directions
- a) When `require_po_for_purchase` is true, skip the gate entirely — redirect the "Purchase" Quick Action directly to `/purchase-orders`
- b) Remove the gate page from `AddStockPurchaseForm.jsx` and handle routing at the caller level (OperationsHub, Sidebar)
- c) Keep the gate but make it auto-redirect after 2 seconds (less preferred)

**Severity:** LOW (UX friction, extra click)
**Files:** `frontend/src/components/central-inventory/OperationsHub.jsx` (Purchase quick action), `frontend/src/components/central-inventory/AddStockPurchaseForm.jsx` (lines 78–190), `frontend/src/components/layout/Sidebar.jsx`

---

## Summary Table

| ID | Title | Severity | Screen | Type |
|----|-------|:--------:|--------|:----:|
| BUG-A | "125 items behind" push status misleading | MEDIUM | Store Management | UX |
| BUG-B | Stock Inventory should split FG (Outward) / RM (Inward) | MEDIUM | Stock Inventory | UX/Nav |
| BUG-C | "Unknown: —" in From/To on Store Detail transactions | HIGH | Store Detail | Data |
| BUG-D | Remove "Adjust Stock" quick action (testing only) | LOW | Operations Hub | Cleanup |
| BUG-E | Unnecessary "Direct Stock Entry Disabled" gate page | LOW | Purchase | UX |

---

*Awaiting owner confirmation to register as BUG-018 through BUG-022 in `registry.json`.*
