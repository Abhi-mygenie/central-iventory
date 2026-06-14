# Impact Analysis — BUG-A through BUG-H (Batch)

> **Date:** 2026-06-14
> **Artifact:** 2 — Impact Analysis
> **Scope:** 8 bugs from owner walkthrough session

---

## BUG-A: "125 items behind" push status misleading

### Files Affected
| File | Lines | Change |
|------|:-----:|--------|
| `HierarchyManagement.jsx` | 465–480, 563–566 | Modify label text and/or computation logic |

### Impact
- **LOW** — text label change only, no API or data flow change
- Computation: `behind = max(0, totalSource - totalChild)` comparing entity counts from `hierarchy-detail` API
- 125 = total catalog items at Central not yet pushed to child store

### Risk: NONE
Pure display change. No API calls affected.

---

## BUG-B: Stock Inventory split — FG in Outward, RM in Inward

### Files Affected
| File | Lines | Change | Frozen? |
|------|:-----:|--------|:-------:|
| `StockInventorySummary.jsx` | 222–241 | Accept URL query param to pre-select stock type tab | No |
| `screenVisibility.js` | 81–87, 99–107 | Add "RM Stock" link under Inward section | **YES** |
| `App.js` | 86 | Possibly add alternate route or query param handling | No |

### Impact
- **MEDIUM** — `screenVisibility.js` is **FROZEN**. Adding a nav item under Inward requires owner approval.
- Two approaches possible (see Questions below)

### Risk: MEDIUM
Touching a frozen file. Need owner sign-off on the nav change.

---

## BUG-C: "Unknown: —" in Store Detail Recent Transactions

### Files Affected
| File | Lines | Change |
|------|:-----:|--------|
| `StoreDetail.jsx` | 1–5, 302–303 | Import + use `useRestaurantMap` hook, resolve IDs to names |

### Impact
- **HIGH priority fix, LOW risk** — the `useRestaurantMap` hook already exists and works in HistoryLedger, PendingQueues, TransferDetail, OperationsHub
- StoreDetail receives `txn.from_restaurant_id` / `txn.to_restaurant_id` from the API — need to confirm these fields exist in the API response
- If IDs are present: resolve via map. If not: fallback to hierarchy data already loaded on the page

### API Investigation Needed
- Check if `transactions[]` in `getHierarchyDetail` response includes `from_restaurant_id` / `to_restaurant_id` fields
- If yes → direct lookup. If no → need alternate resolution from hierarchy data on the page

### Risk: LOW
Adding an existing hook. No new API calls beyond what the hook already makes.

---

## BUG-D: Remove "Adjust Stock" quick action

### Files Affected
| File | Lines | Change | Frozen? |
|------|:-----:|--------|:-------:|
| `OperationsHub.jsx` | 456–463 | Remove the Adjust Stock card | No |
| `App.js` | 93 | Remove `/adjustment/new` route (optional) | No |
| `screenVisibility.js` | 61 | Remove `adjust-stock` permission (optional) | **YES** |
| `StockAdjustmentForm.jsx` | entire file | Keep on disk or delete (optional) | No |

### Impact
- **LOW** — removing a card from Quick Actions
- Route and component can stay if we only remove the card (safer — minimal change)
- Removing from `screenVisibility.js` (frozen) would require owner approval

### Risk: NONE (if card-only removal)
Just delete 7 lines from OperationsHub.jsx.

---

## BUG-E: Unnecessary "Direct Stock Entry Disabled" gate page

### Files Affected
| File | Lines | Change |
|------|:-----:|--------|
| `OperationsHub.jsx` | ~425–435 | Change Purchase quick action to navigate `/purchase/orders` when PO required |
| `AddStockPurchaseForm.jsx` | 176–191 | Replace gate page with auto-redirect to `/purchase/orders` |
| `Sidebar.jsx` (via screenVisibility) | — | Sidebar "Purchase" link also hits the gate |

### Impact
- **LOW** — UX improvement, no data flow change
- Need to handle TWO entry points: (1) Quick Action card in OperationsHub, (2) Sidebar nav "Purchase" link
- Option 1: Auto-redirect in `AddStockPurchaseForm.jsx` (covers both entry points)
- Option 2: Change nav link path in screenVisibility (FROZEN) to `/purchase/orders`

### Risk: LOW
Auto-redirect in AddStockPurchaseForm is safest — handles all entry points without touching frozen files.

---

## BUG-F: Dollar sign ($) icon → Rupee (₹) icon

### Files Affected
| File | Lines | Change |
|------|:-----:|--------|
| `ProductionRunForm.jsx` | 22, 438 | `DollarSign` → `IndianRupee` |
| `ProductionHistory.jsx` | 11, 199, 202 | `DollarSign` → `IndianRupee` |
| `SubRecipeMaster.jsx` | 13, 405 | `DollarSign` → `IndianRupee` |
| `RecipeCatalogue.jsx` | 12 | `DollarSign` → `IndianRupee` (import only — verify usage) |

### Impact
- **LOW** — icon swap in lucide-react imports. `IndianRupee` is available in lucide-react.
- Text values already show ₹ correctly — only the icon component is wrong.

### Risk: NONE
1:1 icon replacement. No logic change.

---

## BUG-G: Run Production → Master-Detail layout

### Files Affected
| File | Lines | Change |
|------|:-----:|--------|
| `ProductionRunForm.jsx` | 1–628 (entire) | **FULL REWRITE** — vertical layout → master-detail (30/70 split) |

### Impact
- **HIGH effort** — 628 lines, full layout restructure
- All business logic (recipe selection, multiplier, BOM computation, cost estimation, FEFO allocation, coverage estimate, confirmation flow, post-submit NBA) must be preserved
- API calls unchanged — just layout restructure
- Left panel: recipe list with search, demand sort, stock badges, color coding
- Right panel: batch form → coverage → ingredient BOM → cost → confirmation

### Risk: MEDIUM
Large rewrite. Risk of breaking BOM computation, FEFO cost estimation, or post-submit flow. Thorough QA needed.

---

## BUG-H: Food Edit → Side Sheet pattern

### Files Affected
| File | Lines | Change |
|------|:-----:|--------|
| `ProductCatalogue.jsx` | 59, 101, 119, 128, 133–176 | Replace `Dialog` with `Sheet` (from `@/components/ui/sheet`) |

### Impact
- **LOW** — swap Dialog component with Sheet component (both are shadcn/radix)
- `FoodFormDialog` function → rename to `FoodFormSheet`, change Dialog → Sheet, DialogContent → SheetContent, etc.
- Sheet component already exists at `@/components/ui/drawer.jsx` or may need `sheet.jsx`

### Check
- Verify `@/components/ui/sheet.jsx` exists, or if we need to use `drawer.jsx` (Vaul) instead

### Risk: LOW
Component swap. Same form logic, different container.

---

## Cross-Cutting Concerns

| Concern | Bugs Affected | Notes |
|---------|:------------:|-------|
| **Frozen file: `screenVisibility.js`** | BUG-B, BUG-D | BUG-B needs nav change (requires owner approval). BUG-D can skip it. |
| **Frozen file: `screenVisibility.js`** | BUG-E | Can avoid by using auto-redirect in AddStockPurchaseForm |
| **No frozen files** | BUG-A, C, F, G, H | Safe to proceed |

---

## Execution Priority (recommended)

| Order | Bug | Effort | Reason |
|:-----:|-----|:------:|--------|
| 1 | BUG-F | 5 min | Icon swap — quick win, zero risk |
| 2 | BUG-D | 5 min | Remove 7 lines — quick win |
| 3 | BUG-C | 15 min | HIGH priority data fix, hook already exists |
| 4 | BUG-E | 10 min | Auto-redirect, no frozen files |
| 5 | BUG-A | 10 min | Label clarification |
| 6 | BUG-H | 30 min | Sheet swap for food edit |
| 7 | BUG-B | 20 min | Stock split — depends on frozen file decision |
| 8 | BUG-G | 90 min | Full rewrite of ProductionRunForm |

**Total estimated: ~3 hours**

---

## QUESTIONS FOR OWNER

### Q1: BUG-B — How to add RM Stock under Inward?
`screenVisibility.js` is **FROZEN**. Two options:

**Option (a):** Modify the frozen file — add a new nav item under Inward:
```
{ id: "rm-stock", label: "Raw Material Stock", path: "/inventory?type=raw", icon: "Package" }
```
And default the Outward Stock Inventory to show Finished Goods only.
→ Requires your approval to unfreeze.

**Option (b):** Keep nav as-is, but change the **default tab** in Stock Inventory to "Finished Goods" (under Outward) and add a "View Raw Material Stock" link in the Raw Material Master screen (already under Inward).
→ No frozen file change needed.

Which do you prefer?

### Q2: BUG-A — What label do you want?
Current: `"Stale — 125 items behind"`
Options:
- (a) `"125 items not pushed"` 
- (b) `"125 unpushed catalog items"`
- (c) `"Catalog gap: 125 items"` 
- (d) Different text? What wording feels right to you?

### Q3: BUG-D — Remove route and sidebar too, or just the Quick Action card?
- (a) **Card only** — remove from OperationsHub Quick Actions. Route `/adjustment/new` still works if someone navigates directly. No frozen file change.
- (b) **Full removal** — card + route + sidebar reference. Requires touching `screenVisibility.js` (FROZEN).

### Q4: BUG-C — Need to verify API field
I need to test whether the `getHierarchyDetail` API response includes `from_restaurant_id` and `to_restaurant_id` in the `transactions[]` array. Can I run a test call to confirm, or do you know if these fields are present?
