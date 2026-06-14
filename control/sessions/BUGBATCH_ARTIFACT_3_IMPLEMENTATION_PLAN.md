# Implementation Plan — BUG-B through BUG-H (7 items)

> **Date:** 2026-06-14
> **Artifact:** 3 — Implementation Plan
> **BUG-A:** DEFERRED (backend G-023)
> **Estimated total:** ~2.5 hours

---

## Phase 1: Quick Wins (BUG-F, BUG-D) — ~10 min

### BUG-F: DollarSign → IndianRupee

**4 files, find-and-replace:**

| File | Import Line | Usage Lines | Change |
|------|:-----------:|:-----------:|--------|
| `ProductionRunForm.jsx` | 22 | 438 | `DollarSign` → `IndianRupee` |
| `ProductionHistory.jsx` | 11 | 199, 202 | `DollarSign` → `IndianRupee` |
| `SubRecipeMaster.jsx` | 13 | 405 | `DollarSign` → `IndianRupee` |
| `RecipeCatalogue.jsx` | 12 | (import only — verify if used in JSX) | `DollarSign` → `IndianRupee` |

**Test:** Visual check — cost cards should show ₹ icon instead of $.

---

### BUG-D: Remove Adjust Stock card

**1 file:**

| File | Lines | Change |
|------|:-----:|--------|
| `OperationsHub.jsx` | 456–463 | Delete the `{canDo("adjust-stock") && (...)}` block |

**Test:** Operations Hub Quick Actions should not show "Adjust Stock" card.

---

## Phase 2: Data Fix (BUG-C) — ~15 min

### BUG-C: Wire useRestaurantMap into StoreDetail

**File:** `StoreDetail.jsx`

**Step 1:** Add import
```jsx
import { useRestaurantMap } from "@/hooks/useRestaurantMap";
```

**Step 2:** Call hook inside component
```jsx
const { restaurantMap } = useRestaurantMap();
```

**Step 3:** Replace lines 302-303. Change:
```jsx
<TableCell>{mapRestaurantType(txn.from_restaurant_type)}: {txn.from_restaurant_name || "—"}</TableCell>
<TableCell>{mapRestaurantType(txn.to_restaurant_type)}: {txn.to_restaurant_name || "—"}</TableCell>
```
To:
```jsx
<TableCell>{resolveStore(txn.from_restaurant_id, txn.from_restaurant_type, txn.from_restaurant_name)}</TableCell>
<TableCell>{resolveStore(txn.to_restaurant_id, txn.to_restaurant_type, txn.to_restaurant_name)}</TableCell>
```

**Step 4:** Add helper function:
```jsx
const resolveStore = (id, type, name) => {
  const mapped = restaurantMap[String(id)];
  const displayType = mapRestaurantType(mapped?.type || type);
  const displayName = mapped?.name || name || "—";
  return `${displayType}: ${displayName}`;
};
```

**Test:** Login as Chai Central (owner@chai.com), navigate to Store Detail for a child store with transactions. From/To should show resolved names instead of "Unknown: —".

---

## Phase 3: UX Fix (BUG-E) — ~10 min

### BUG-E: Auto-redirect when PO required

**File:** `AddStockPurchaseForm.jsx`

**Change lines 176-191:** Replace the gate page render with a `useEffect` auto-redirect:

```jsx
// Replace the poRequired render block with:
useEffect(() => {
  if (poRequired) {
    navigate("/purchase/orders", { replace: true });
  }
}, [poRequired, navigate]);
```

Remove the entire `if (poRequired) { return (...) }` block (lines 176-191).

**Test:** 
1. Login as Chai Central (PO required)
2. Click "Purchase" in sidebar → should redirect straight to PO list
3. Click "Purchase" in Quick Actions → same redirect

---

## Phase 4: Food Edit Sheet (BUG-H) — ~30 min

### BUG-H: Dialog → Sheet for Food edit

**File:** `ProductCatalogue.jsx`

**Step 1:** Replace Dialog imports with Sheet imports:
```jsx
// Remove: Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
// Add: Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter (from @/components/ui/sheet)
```

**Step 2:** Rename `FoodFormDialog` → `FoodFormSheet`

**Step 3:** Change JSX structure:
- `Dialog` → `Sheet`
- `DialogContent className="max-w-sm"` → `SheetContent side="right" className="w-[400px] sm:w-[450px]"`
- `DialogHeader` → `SheetHeader`
- `DialogTitle` → `SheetTitle`
- `DialogFooter` → `SheetFooter` (or div with flex-end)

**Step 4:** Add Quick Info section at bottom of sheet (before footer):
- Has Recipe badge
- Status badge
- FG Stock (if available from recipe cross-ref)

**Step 5:** Update all references: `dialogOpen` → `sheetOpen`, `setDialogOpen` → `setSheetOpen`

**Test:** Click edit pencil on any food → sheet slides in from right. Table stays visible. Save works. Cancel closes sheet.

---

## Phase 5: Stock Inventory Split (BUG-B) — ~20 min

### BUG-B: FG in Outward, RM in Inward

**File 1:** `screenVisibility.js` (FROZEN — owner approved unfreeze)

Add new nav item under Inward section (after raw-material-master):
```jsx
{ id: "rm-stock", screen: "scr-stock-inventory", label: "Raw Material Stock", path: "/inventory?type=raw", icon: "Package" },
```

**File 2:** `StockInventorySummary.jsx`

**Step 1:** Read URL query param on mount:
```jsx
const [searchParams] = useSearchParams();
const defaultType = searchParams.get("type") || "all";
```

**Step 2:** Initialize `stockType` state with `defaultType`:
```jsx
const [stockType, setStockType] = useState(defaultType);
```

**Step 3:** When accessed from Outward nav (no query param or `?type=fg`), default to "fg". When from Inward nav (`?type=raw`), default to "raw".

**File 3:** `screenVisibility.js` — Change Outward stock-inventory path:
```jsx
{ id: "stock-inventory", screen: "scr-stock-inventory", label: "Stock Inventory", path: "/inventory?type=fg", icon: "Package" },
```

**Test:**
1. Click "Stock Inventory" under Outward → shows Finished Goods tab by default
2. Click "Raw Material Stock" under Inward → shows Raw Materials tab by default
3. Tab switching still works manually

---

## Phase 6: Production Run Rewrite (BUG-G) — ~90 min

### BUG-G: Vertical → Master-Detail layout

**File:** `ProductionRunForm.jsx` (628 lines → full rewrite)

**Layout structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Run Production                                            │
│ ┌─────────────┬──────────────────────────────────────────┐│
│ │ LEFT (30%)  │ RIGHT (70%)                              ││
│ │             │                                          ││
│ │ [Search...] │ Recipe Header (name + FG stock)          ││
│ │             │                                          ││
│ │ Recipe List │ ┌─ Batch Details ─────────────────────┐  ││
│ │ (sorted by  │ │ Multiplier | Output | Label | Expiry│  ││
│ │  demand)    │ └─────────────────────────────────────┘  ││
│ │             │                                          ││
│ │ [Sesame] ◄──│ ┌─ Coverage Estimate ────────────────┐  ││
│ │ [Oats]      │ └─────────────────────────────────────┘  ││
│ │ [Ragi]      │                                          ││
│ │ [Whole W.]  │ ┌─ Ingredient BOM Table ─────────────┐  ││
│ │             │ │ Name | Health | Req | Avail | Cost  │  ││
│ │             │ └─────────────────────────────────────┘  ││
│ │             │                                          ││
│ │             │ ┌─ Cost Summary ──────────────────────┐  ││
│ │             │ └─────────────────────────────────────┘  ││
│ │             │                                          ││
│ │             │ ┌─ Confirmation (green) ──────────────┐  ││
│ │             │ │ [Back to Edit] [Confirm & Run]      │  ││
│ │             │ └─────────────────────────────────────┘  ││
│ └─────────────┴──────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Preserved logic (NO changes):**
- Recipe sorting by demand (lowest FG first)
- Multiplier → total output computation
- Batch label auto-generation
- Coverage estimate computation
- FEFO cost allocation per ingredient
- Insufficient stock detection + warning banner
- Allow/block negative stock setting
- Confirmation flow (review → confirm → submit)
- Post-production result + NBA dispatch suggestions
- Role gating (Central/Master only)

**What changes:**
- Layout only: horizontal card grid → vertical list in left panel
- Form + BOM + confirmation moves to right panel
- Recipe selection highlights in left panel (blue border)
- Right panel shows empty state when no recipe selected
- Search input added to left panel for recipe filtering

**Implementation approach:**
1. Extract left panel as `RecipeListPanel` section
2. Extract right panel as `ProductionFormPanel` section
3. Wrap in `flex` container with `w-[280px]` left + `flex-1` right
4. Move all existing state/hooks to parent — pass via props or keep inline
5. Preserve all `data-testid` attributes

**Test checkpoints:**
- [ ] Left panel shows recipes sorted by demand with stock badges
- [ ] Selecting recipe populates right panel
- [ ] Multiplier, batch label, expiry all work
- [ ] Coverage estimate shows correctly
- [ ] BOM table renders with health bars, costs, status
- [ ] Insufficient stock banner appears when applicable
- [ ] Cost summary shows ₹ (not $)
- [ ] Confirmation card renders with all fields
- [ ] Submit works → post-production result shows
- [ ] NBA dispatch suggestions show after success

---

## Execution Order & Dependencies

```
Phase 1 ─── BUG-F (icon swap)          ─┐
         └── BUG-D (card removal)        ├── parallel, no deps
Phase 2 ─── BUG-C (restaurant map)      ─┘
Phase 3 ─── BUG-E (auto-redirect)       ── independent
Phase 4 ─── BUG-H (food sheet)          ── independent
Phase 5 ─── BUG-B (stock split)         ── independent (frozen file approved)
Phase 6 ─── BUG-G (production rewrite)  ── depends on BUG-F (₹ icon already swapped)
```

Phases 1-3 can run in parallel. Phase 6 last (highest risk, most effort).

---

*Ready for Artifact 4 (Code Gate) → Owner approval before implementation begins.*
