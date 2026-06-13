# CR-030 — Unified Implementation Plan (UX Redesign + Bug Fixes)

> **Date:** 2026-06-14
> **Scope:** Vendor Management, Raw Material Master, Purchase
> **Replaces:** Previous Artifact 2-3 (bug-fix-only plan)
> **Estimated effort:** ~26.5h

---

## API Probing Results (2026-06-14)

| API | Status | Response |
|-----|:------:|----------|
| `GET /inventory/vendor-item-list?restaurant_ids[]={rid}&from_date=&to_date=` | ✅ WORKS | 70 records. Fields: `ID`, `restaurant_id`, `ingredient_id`, `Ingredient_Name`, `Purchase_Date`, `Vendor_Name`, `vendor_id`, `Quantity`, `stock_quantity_raw`, `Amount`, `line_total`, `unit_price`, `Payment_Type` |
| `GET /inventory/stock-inventory?include_segments=true&segment_limit=3&include_consumption=true` | ✅ WORKS | Returns `segments_preview[]`, `consumption_summary{}`, `consumption_lines[]` per item. **G-022 not needed.** |

---

## Files Affected

| File | Change Type | Current Lines | Estimated After | Risk |
|------|-------------|:------------:|:---------------:|:----:|
| `services/api.js` | Add `getVendorItemList()` | 1035 | ~1050 | LOW |
| `VendorManagement.jsx` | **FULL REWRITE** | 212 | ~450 | HIGH |
| `VendorFormDialog.jsx` | DELETE (inline form replaces popup) | 93 | 0 | LOW |
| `IngredientCatalogue.jsx` | **FULL REWRITE** | 326 | ~550 | HIGH |
| `AddStockPurchaseForm.jsx` | EDIT (add PO gate redirect) | 442 | ~470 | LOW |
| `PurchaseOrderList.jsx` | **NEW** | 0 | ~300 | HIGH |
| `PurchaseOrderCreate.jsx` | **NEW** | 0 | ~350 | HIGH |
| `PurchaseOrderDetail.jsx` | **NEW** | 0 | ~400 | HIGH |
| `App.js` | EDIT (add PO routes) | — | — | LOW |

---

## Phase 0: API Layer (30 min)

### 0.1 — Add `getVendorItemList()` to `api.js`

```javascript
function _getVendorItemList(restaurantId, { fromDate, toDate } = {}) {
  const params = new URLSearchParams();
  params.set("restaurant_ids[]", restaurantId);
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);
  return client.get(`/proxy/v2/inventory/vendor-item-list?${params.toString()}`).then((resp) => {
    return { ...resp, data: resp.data?.data || [] };
  });
}
const getVendorItemList = _cached("getVendorItemList", TTL.LONG, _getVendorItemList);
```

Export in the `api` object.

### 0.2 — Update `getStockInventory()` to pass segment/consumption params

Current `_getStockInventory` already accepts `{ includeHierarchy }`. Extend:

```javascript
function _getStockInventory({ includeHierarchy, includeSegments, segmentLimit, includeConsumption } = {}) {
  const params = {};
  if (includeHierarchy) params.include_hierarchy = true;
  if (includeSegments) { params.include_segments = true; if (segmentLimit) params.segment_limit = segmentLimit; }
  if (includeConsumption) params.include_consumption = true;
  return client.get("/proxy/v2/inventory/stock-inventory", { params }).then(/* existing normalizer */);
}
```

### Test checkpoint:
```bash
curl -s "$API_URL/api/proxy/v2/inventory/vendor-item-list?restaurant_ids[]=806&from_date=2025-01-01&to_date=2026-12-31" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json;d=json.load(sys.stdin);print(len(d.get('data',d)),'records')"
```

---

## Phase 1: Vendor Management — Full Rewrite (6h)

### Current → Target

| Current (212 lines) | Target (~450 lines) |
|---------------------|---------------------|
| Simple table + popup dialogs | **Master-detail** (35% list / 65% detail) |
| "Inactive" based on `created_at` | "Inactive" based on **real last purchase date** |
| No intelligence | KPIs + monthly bar chart + recent purchases table |
| CRUD in popups | **Inline form** in right panel |

### Layout Structure

```
┌─────────────────────┬──────────────────────────────────────┐
│ VENDOR LIST (35%)    │ DETAIL PANEL (65%)                    │
│                      │                                       │
│ [Search...]          │ State 1: Empty → "Select or add"      │
│ [+ Add Vendor]       │ State 2: Edit form + intelligence     │
│                      │ State 3: New vendor form               │
│ ┌──────────────┐     │                                       │
│ │ VendorA      │◄────│ ┌─ EDIT FORM ────────────────────┐   │
│ │ Active       │     │ │ Name / Contact / Phone / Email  │   │
│ ├──────────────┤     │ │ Address / GST                   │   │
│ │ VendorB      │     │ │ [Save] [Delete]                 │   │
│ │ Active       │     │ └─────────────────────────────────┘   │
│ ├──────────────┤     │                                       │
│ │ VendorC      │     │ ┌─ PURCHASE INTELLIGENCE ─────────┐   │
│ │ Inactive 45d │     │ │ [Last Purchase] [Total] [Avg $]  │   │
│ └──────────────┘     │ │ Monthly Bar Chart (6 months)     │   │
│                      │ │ Recent Purchases Table (last 5)  │   │
│                      │ └─────────────────────────────────┘   │
└─────────────────────┴──────────────────────────────────────┘
```

### Implementation Steps

**1.1 — Rewrite VendorManagement.jsx** as master-detail

State:
- `vendors[]`, `loading`, `error`, `blocked` (keep)
- `selectedVendorId` (new — replaces popup flow)
- `isAddMode` (new — clears form for new vendor)
- `purchaseData[]` (new — from `getVendorItemList`)
- `search` (keep)

On mount:
1. `api.getVendors()` → vendor list
2. `api.getVendorItemList(restaurantId, { fromDate: 1yr ago, toDate: today })` → purchase data (cached)

**Left panel** (35%):
- Search input
- "+ Add Vendor" button → sets `isAddMode=true`, clears `selectedVendorId`
- Vendor cards with: name (bold), phone, Active/Inactive badge
- Active/Inactive computed from `purchaseData`: filter by `Vendor_Name`, find max `Purchase_Date`. If > 60 days ago or never → Inactive.
- Selected card gets blue left border

**Right panel** (65%):
- **State 1 (empty):** "Select a vendor or add a new one"
- **State 2 (edit):** Inline form (Name, Contact, Phone, Email, Address, GST) + Save/Delete buttons + intelligence section below
- **State 3 (add):** Same form but empty, "Create Vendor" button, intelligence hidden

**Intelligence section** (only in edit mode):
- **KPI row (3 cards):**
  - Last Purchase: most recent `Purchase_Date` for this vendor → relative time ("3 days ago" / "Never")
  - Total Purchases: count of records for this vendor
  - Avg Order Value: `sum(Amount) / count` → "₹X"
- **Monthly bar chart (last 6 months):**
  - Group `purchaseData` by month where `Vendor_Name === selectedVendor.vendor_name`
  - Y-axis: ₹ total. Current month highlighted amber.
  - Use recharts `<BarChart>` (already in dependencies)
- **Recent purchases table (last 5):**
  - Columns: Date, Item, Qty, Rate, Amount
  - From `purchaseData` filtered by vendor, sorted by date desc, limit 5

**1.2 — Delete `VendorFormDialog.jsx`** — no longer needed (inline form replaces it)

**1.3 — Update `ConfirmActionDialog.jsx`** usage — delete confirmation stays as dialog (inline "Are you sure?" below delete button would also work, but dialog is cleaner for destructive actions)

### Test checkpoint:
- Login as Central (806) → /vendor-management
- Verify: master-detail layout renders
- Select vendor → see form + intelligence
- Click "Add Vendor" → see empty form
- Delete vendor → confirm → removed
- Intelligence: verify KPIs show data from vendor-item-list

---

## Phase 2: Raw Material Master — Full Rewrite (8h)

### Current → Target

| Current (326 lines) | Target (~550 lines) |
|---------------------|---------------------|
| Table + popup edit/add dialogs | **Expandable rows** with inline edit + intelligence |
| No intelligence | KPIs (avg rate, consumption, days-of-stock) + vendor price comparison |
| "OK" for 0-stock items | "Empty" badge (I-5) |
| Silent add failure | Toast on error (I-7) |
| No "Pushed to" column | "Pushed to X stores" (I-6) |

### Layout Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ Raw Material Master                                                   │
│ [Ingredients] [Categories]                                            │
│                                                                       │
│ [Search...]  [Category ▾] [Status ▾]  [+ Add Item]                   │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────────── │
│ │ Name          Category  Qty      Unit  Min Alert  Status  Recipes   │
│ │ Almonds       Cookie    2 kg     kg    0 kg       OK      0         │
│ │ ▼ Baking Powder Cookie  3.21 kg  kg    500 gm     OK      0     ◀──SELECTED
│ │ ┌────────────────────────────────────────────────────────────────┐  │
│ │ │ EDIT FORM                      │ INTELLIGENCE                  │  │
│ │ │ Name: [Baking Powder    ]      │ ┌Avg Rate─┐ ┌Consump─┐ ┌DoS┐│  │
│ │ │ Category: [Cookie       ▾]     │ │₹130/kg  │ │42gm/d  │ │76d││  │
│ │ │ Unit: [kg              ▾]      │ └─────────┘ └────────┘ └───┘│  │
│ │ │ Min Alert: [500] [gm   ▾]     │                              │  │
│ │ │                                │ VENDOR PRICE COMPARISON      │  │
│ │ │ [Save] [Cancel]               │ Budget ₹100/kg ✓ best        │  │
│ │ │                                │ Premium ₹150/kg              │  │
│ │ │                                │ bakery ₹240/kg               │  │
│ │ │                                │                              │  │
│ │ │                                │ Pushed to: 3 of 5 stores     │  │
│ │ └──────────────────────────────┴──────────────────────────────┘  │
│ │ Baking Soda   Cookie    3.32 kg  kg    500 gm     OK      0       │
│ └──────────────────────────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

**2.1 — Rewrite IngredientCatalogue.jsx** with expandable rows

State:
- `items[]`, `loading`, `error`, `search` (keep)
- `expandedItemId` (new — which row is expanded)
- `editForm{}` (new — inline edit form state)
- `purchaseData[]` (new — from `getVendorItemList`)
- `hierarchyChildren[]` (new — for "Pushed to" column)
- `categoryFilter`, `statusFilter` (new — dropdown filters)
- `addMode` (new — inline add form at top)

On mount:
1. `api.getStockInventory({ includeSegments: true, includeConsumption: true })` → items with segments + consumption
2. `api.getStockItemCategories()` → category list
3. `api.getRecipeList()` → recipe cross-ref
4. `api.getVendorItemList(restaurantId, { fromDate: 1yr ago, toDate: today })` → purchase intel
5. `api.getHierarchyList()` → children for "Pushed to" (only if `isTopLevel`)

**Table columns:**
- Name, Category, Qty (monospace), Unit, Min Alert, Status (badge), Recipes (count), click to expand

**Status badge logic (updated):**
```javascript
if (is_low_stock) → "Low" (red)
else if (cal_quantity == 0) → "Empty" (gray)  // I-5 fix
else → "OK" (green)
```

**Filters above table:**
- Search (by name or category)
- Category dropdown (from categories list)
- Status dropdown (All / OK / Low / Empty)

**"+ Add Item" inline form** (above table, not popup):
- Fields: Name, Category dropdown, Unit dropdown, Min Alert + unit
- On success: toast + new item in table
- On error: toast with message (I-7 fix)

**Expanded row (on click):**
- **Left half: Edit form** — Name, Category (dropdown), Unit (dropdown), Min Alert (number + unit)
  - Save / Cancel buttons
  - On save: `api.updateStockItem(id, payload)` → toast → reload
- **Right half: Intelligence panel:**
  - **KPI row (3 cards):**
    - Avg Purchase Rate: from `purchaseData` filtered by `Ingredient_Name` → `sum(Amount) / sum(stock_quantity_raw)` → "₹X/unit"
    - Consumption Rate: from item's `consumption_summary.total_consumed_cal / date_range_days` → "X gm/day"
    - Days of Stock: `cal_quantity / daily_consumption_rate` → "76 days" (green/amber/red)
  - **Vendor Price Comparison:**
    - Group `purchaseData` by `Vendor_Name` where `Ingredient_Name` matches
    - Per vendor: compute avg rate = `sum(Amount) / sum(stock_quantity_raw)`
    - Horizontal bars (green=cheapest, amber=mid, red=most expensive)
    - "✓ best" label on cheapest
  - **Pushed to Stores:**
    - Cross-ref inventory across hierarchy children
    - Show "Pushed to X of Y stores"

### Test checkpoint:
- Login as Central (806) → /raw-materials
- Table renders with correct columns + status badges
- Click row → expand → see edit form + intelligence
- Verify KPIs show real data from vendor-item-list
- Verify vendor price comparison bars render
- Click "+ Add Item" → inline form appears above table
- Filter by category → works
- Filter by status → works

---

## Phase 3: Purchase → Purchase Order Module — Full Rewrite (12h)

### G-021 CLOSED (2026-06-14) — All PO APIs Validated

The Purchase screen transforms from direct stock entry to a **structured PO lifecycle module**. Direct `add-stock` is now gated behind `require_po_for_purchase: true` for hierarchy stores.

**API Contract:** `AI/Plans/phase3/P35_purchase_order_api_contract.md`

### Current → Target

| Current (442 lines) | Target (~800 lines + new components) |
|---------------------|--------------------------------------|
| Direct `add-stock/{id}` per item | **PO lifecycle**: create → approve → send → receive → close |
| No PO concept | PO list with status tabs + PO detail + PO create form |
| Upload Invoice / Manual Entry tabs | **PO List / Create PO** (Upload Invoice deferred — G-014) |
| Sequential item submission | PO create = single API call with all lines |
| No variance detection | **Variance flagging** on receive (actual vs expected rate) |
| No GRN concept | **Receive against PO lines** with batch + expiry per line |

### New Files

| File | Purpose | Lines |
|------|---------|:-----:|
| `PurchaseOrderList.jsx` | PO list with status tabs, vendor filter, date range | ~300 |
| `PurchaseOrderCreate.jsx` | Create/edit PO form (vendor, lines, rates) | ~350 |
| `PurchaseOrderDetail.jsx` | PO detail with lines, receipts, receive action, status timeline | ~400 |

### Modified Files

| File | Change |
|------|--------|
| `services/api.js` | Add 10 PO methods: `createPO`, `listPOs`, `getPODetail`, `updatePO`, `deletePO`, `approvePO`, `sendPO`, `receivePO`, `cancelPO`, `closePO` |
| `AddStockPurchaseForm.jsx` | Redirect to PO flow when `DIRECT_PURCHASE_REQUIRES_PO`. Keep as fallback for standalone stores or when `require_po_for_purchase: false`. |
| `App.js` | Add routes: `/purchase/orders`, `/purchase/orders/new`, `/purchase/orders/:id` |
| `lib/screenVisibility.js` | Add PO screens to nav (if not frozen — check first) |

### 3.1 — API Layer: Add PO Methods to api.js

```javascript
// Purchase Order APIs
function createPO(payload) {
  return client.post("/proxy/v2/inventory/purchase-order/create", payload);
}
function listPOs({ status, vendorId, fromDate, toDate, restaurantIds, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (vendorId) params.set("vendor_id", vendorId);
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);
  if (restaurantIds) restaurantIds.forEach(id => params.append("restaurant_ids[]", id));
  if (limit) params.set("limit", limit);
  if (offset) params.set("offset", offset);
  return client.get(`/proxy/v2/inventory/purchase-order/list?${params.toString()}`);
}
function getPODetail(poId) {
  return client.get(`/proxy/v2/inventory/purchase-order/${poId}`);
}
function updatePO(poId, payload) {
  return client.put(`/proxy/v2/inventory/purchase-order/${poId}/update`, payload);
}
function deletePO(poId) {
  return client.delete(`/proxy/v2/inventory/purchase-order/${poId}`);
}
function approvePO(poId) {
  return client.post(`/proxy/v2/inventory/purchase-order/${poId}/approve`, {});
}
function sendPO(poId) {
  return client.post(`/proxy/v2/inventory/purchase-order/${poId}/send`, {});
}
function receivePO(poId, payload) {
  return client.post(`/proxy/v2/inventory/purchase-order/${poId}/receive`, payload);
}
function cancelPO(poId, cancelReason) {
  return client.post(`/proxy/v2/inventory/purchase-order/${poId}/cancel`, { cancel_reason: cancelReason });
}
function closePO(poId) {
  return client.post(`/proxy/v2/inventory/purchase-order/${poId}/close`, {});
}
```

### 3.2 — PurchaseOrderList.jsx (~300 lines)

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ Purchase Orders                                      [+ Create PO]   │
│                                                                      │
│ [All] [Draft 2] [Sent 3] [Partial 1] [Received] [Closed 5] [Canc]  │
│                                                                      │
│ [Vendor ▾]  [📅 From] [📅 To]  [🔍 Search PO#...]                   │
│                                                                      │
│ ┌── TABLE ─────────────────────────────────────────────────────────┐ │
│ │ PO#              │ Vendor         │ Items │ Total  │ Status │Date│ │
│ │ PO-806-2026-0001 │ Premium Organics│ 3     │ ₹4,500 │ Sent   │13J│ │
│ │ PO-806-2026-0002 │ Budget Ingred.  │ 2     │ ₹1,200 │ Draft  │12J│ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

- Status tab pills with counts
- Vendor dropdown filter
- Date range picker
- Click row → navigate to PO detail
- "+ Create PO" → navigate to create form

### 3.3 — PurchaseOrderCreate.jsx (~350 lines)

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Back to POs          New Purchase Order                            │
│                                                                      │
│ Vendor: [Premium Organics Ltd ▾]   Expected Delivery: [2026-06-20]  │
│ Payment Type: [Cash ▾]            Notes: [Monthly flour order    ]  │
│                                                                      │
│ ┌── LINE ITEMS ────────────────────────────────────────────────────┐ │
│ │ Item (dropdown)     │ Qty  │ Unit │ Exp Rate │ Line Total │ ✕   │ │
│ │ Baking Powder       │ 30   │ kg   │ ₹150     │ ₹4,500    │ ✕   │ │
│ │ Milk                │ 5    │ ltr  │ ₹40      │ ₹200      │ ✕   │ │
│ │ [+ Add Line]                                                     │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌── PRICE INTELLIGENCE (from vendor-item-list) ────────────────────┐ │
│ │ Baking Powder: Last rate ₹150/kg (Premium). Best: ₹100/kg (Bud) │ │
│ │ Milk: Last rate ₹40/ltr (Premium). Best: ₹38/ltr (Budget)       │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌── SUMMARY ───────────────────────────────────────────────────────┐ │
│ │ 2 items · ₹4,700 total                                          │ │
│ │ [Save as Draft]                      [Create & Send to Vendor]   │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

- Vendor dropdown from `api.getVendors()`
- Item dropdown from `api.getInventoryMaster()`
- **Price intelligence per line**: from `vendor-item-list` — show last rate, best rate across vendors
- Two submit paths: "Save as Draft" (create only) or "Create & Send" (create + send in sequence)
- Also used for editing draft POs (pre-fill from `getPODetail`)

### 3.4 — PurchaseOrderDetail.jsx (~400 lines)

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Back to POs     PO-806-2026-0001     [Sent]    14 Jun 2026       │
│                                                                      │
│ Vendor: Premium Organics Ltd       Expected: 20 Jun 2026            │
│ Notes: Monthly flour order         Payment: Cash                    │
│                                                                      │
│ ┌── STATUS TIMELINE ───────────────────────────────────────────────┐ │
│ │ ● Created (14 Jun 1:05) → ● Approved (1:07) → ● Sent (1:07)    │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌── LINE ITEMS ────────────────────────────────────────────────────┐ │
│ │ Item        │ Ordered │ Unit │ Exp Rate │ Received │ Remaining  │ │
│ │ Baking Pwdr │ 30 kg   │ kg   │ ₹150     │ 25 kg    │ 5 kg      │ │
│ │ Milk        │ 5 ltr   │ ltr  │ ₹40      │ 0        │ 5 ltr     │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌── RECEIPTS (GRN History) ────────────────────────────────────────┐ │
│ │ #1 — 15 Jun: Baking Powder 25kg @ ₹160 (⚠ +10.3% variance)    │ │
│ │     Batch: GSM-JUN-001  Expiry: 2026-12-31                      │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌── ACTIONS ───────────────────────────────────────────────────────┐ │
│ │ [Edit] [Approve] [Send] [Receive Goods] [Cancel] [Close]        │ │
│ │ (contextual — only valid actions shown per status)               │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌── RECEIVE FORM (shown when "Receive Goods" clicked) ─────────── │ │
│ │ Purchase Date: [2026-06-15]  Payment: [Cash ▾]                   │ │
│ │ Line        │ Remaining │ Receive Qty │ Actual Rate │ Batch │ Exp│ │
│ │ Baking Pwdr │ 5 kg      │ [5]         │ [155]       │ [B-2] │[..]│ │
│ │ Milk        │ 5 ltr     │ [5]         │ [42]        │ [M-1] │[..]│ │
│ │                                                                  │ │
│ │ ⚠ Baking Powder: ₹155 vs expected ₹150 (+3.3%)                 │ │
│ │                        [Cancel]  [Confirm & Receive]             │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Contextual actions per status:**

| Status | Available Actions |
|--------|------------------|
| `draft` | Edit, Send (if approval not required), Approve, Delete |
| `approved` | Send, Cancel |
| `sent` | Receive Goods, Cancel |
| `partially_received` | Receive Goods (remaining), Close, Cancel |
| `received` | Close |
| `closed` | (none — read only) |
| `cancelled` | (none — read only) |

**Receive form:**
- Inline expandable section (not a separate page)
- Shows remaining qty per line — user enters: received_qty, actual_rate, batch, expiry_date
- **Variance indicator**: if actual_rate differs from expected_rate by > `po_variance_alert_pct`, show amber/red warning
- On confirm: `api.receivePO(poId, { purchase_date, payment_type, receive_lines })` → refresh detail
- Over-receive blocked by API (`PO_LINE_OVER_RECEIVE`)

### 3.5 — Gate: AddStockPurchaseForm.jsx Update

When hierarchy store attempts direct add-stock and gets `DIRECT_PURCHASE_REQUIRES_PO`:
- Show redirect card: "Direct stock intake is disabled for your store. Purchase orders are required."
- CTA button: "Go to Purchase Orders" → navigates to `/purchase/orders`
- Keep existing form as fallback for standalone stores or `require_po_for_purchase: false`

### Test checkpoint:
- Login as Central (806) → /purchase/orders → PO list renders with status tabs
- Create PO → select vendor + items + rates → save draft → appears in list
- Edit draft → change qty → save
- Send PO → status changes to "sent"
- Receive → fill batch/expiry/actual rate → variance warning shows → confirm → stock updated
- Partial receive → status "partially_received" → receive remaining → auto-close
- Cancel PO → reason dialog → cancelled
- Direct add-stock → blocked → redirect to PO flow
- Login as Franchise (811) → PO create → blocked (`VENDOR_PURCHASE_NOT_ALLOWED`)

---

## ALSO: Price Intelligence (from vendor-item-list) — included in PO Create

The price comparison intelligence (I-10, previously planned as standalone) is now **integrated into PO Create form** (Phase 3.3). When user selects an item and vendor, show:
- Last purchase rate for this item from this vendor
- Best rate across all vendors for this item
- Historical avg rate
- Source: same `getVendorItemList()` API from Phase 0

---

## Implementation Order

| Order | Phase | Screen | Effort | Risk |
|:-----:|-------|--------|:------:|:----:|
| 1 | Phase 0 | api.js (add `getVendorItemList`, update `getStockInventory`) | 30min | LOW |
| 2 | Phase 1 | VendorManagement.jsx full rewrite | 6h | HIGH |
| 3 | Phase 2 | IngredientCatalogue.jsx full rewrite | 8h | HIGH |
| 4 | Phase 3 | Purchase Order Module (3 new components + api.js + gate) | 12h | HIGH |

**Total estimated: ~26.5h**

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|:-----------:|:------:|------------|
| Vendor form inline breaks CRUD | LOW | HIGH | Keep `ConfirmActionDialog` for delete. Test create/edit/delete flow end-to-end. |
| `vendor-item-list` returns 0 records for some vendors | MEDIUM | LOW | Show "No purchase history yet" gracefully |
| Expandable row in IngredientCatalogue breaks existing search/filter | MEDIUM | MEDIUM | Keep filter logic intact, just change row render |
| `getStockInventory` with segments adds latency | LOW | LOW | API already handles it (tested: returns in <2s for 48 items) |
| `updateStockItem` doesn't support category change | MEDIUM | LOW | If API rejects, show toast "Category change not supported" |

---

## Dependencies

| Dependency | Status | Impact |
|-----------|:------:|--------|
| `vendor-item-list` API | ✅ CONFIRMED | Unlocks vendor intelligence + raw material price comparison |
| `stock-inventory` with segments | ✅ CONFIRMED | Unlocks inline segment display + consumption data |
| `getHierarchyList()` | ✅ EXISTS | For "Pushed to X stores" column |
| recharts (bar chart) | ✅ IN package.json | For monthly purchase chart |
| G-017 (vendor history) | ✅ CLOSED | No longer a blocker |
| G-020 (unit conversion) | OPEN | Not blocking — current assumption: purchase unit = consumption unit |

---

## Files Created / Deleted

| Action | File | Reason |
|--------|------|--------|
| DELETE | `VendorFormDialog.jsx` | Replaced by inline form in VendorManagement |
| MODIFY | `services/api.js` | Add `getVendorItemList()`, update `getStockInventory()`, add 10 PO methods |
| REWRITE | `VendorManagement.jsx` | Master-detail layout |
| REWRITE | `IngredientCatalogue.jsx` | Expandable rows with intelligence |
| EDIT | `AddStockPurchaseForm.jsx` | PO gate redirect for hierarchy stores |
| **NEW** | `PurchaseOrderList.jsx` | PO list with status tabs, filters |
| **NEW** | `PurchaseOrderCreate.jsx` | Create/edit PO form with price intelligence |
| **NEW** | `PurchaseOrderDetail.jsx` | PO detail with receive flow, variance detection |
| EDIT | `App.js` | Add PO routes |

---

## Governance Updates Required After Implementation

1. `control/registry.json` — update CR-030 status to IN_PROGRESS, update artifact_refs for new plan
2. `control/L7_FILE_OWNERSHIP.md` — add VendorFormDialog.jsx as DELETED
3. `control/L9_OPEN_GAPS_REGISTER.md` — confirm G-017 CLOSED, note G-022 NOT NEEDED (API supports params)
4. `node control/gen_dashboard_data.js` — regenerate

---

*This plan supersedes the previous Artifact 2-3 (bug-fix-only plan). Implementation proceeds against UX freeze specs.*
