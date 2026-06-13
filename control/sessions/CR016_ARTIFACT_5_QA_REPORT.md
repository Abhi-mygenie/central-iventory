# CR-016 Artifact 5 — QA Report

> **CR ID:** CR-016
> **Title:** P20-Phase2 — Stock Inventory Hierarchy Toggle
> **Tester:** Testing Agent (iteration_42)
> **Date:** 2026-06-13
> **Status:** PASS — all 12 tests passed

---

## Test Results

| # | Test | Status | Details |
|---|------|:------:|---------|
| 1 | Backend API /api/ | PASS | 200 OK |
| 2 | Login as Central Store (806) | PASS | Token + rid=806 returned |
| 3 | /inventory loads with KPI cards + table | PASS | 47 items, 1 low stock, 4 categories |
| 4 | Hierarchy toggle VISIBLE for master user | PASS | data-testid hierarchy-toggle present, label "My store" |
| 5 | Toggle ON → 4th KPI "Stores in Scope" | PASS | Shows "6 Stores in Scope" |
| 6 | Toggle ON → low-stock alert banner | PASS | "52 low stock items across 6 stores" |
| 7 | Toggle ON → store heatmap grid | PASS | 6 cards, sorted worst-first (Central Kitchen Beta 11/11 first) |
| 8 | Heatmap card click → /store/{id} | PASS | Clicked card-808 → navigated to store detail |
| 9 | Toggle OFF → hierarchy section hidden | PASS | KPI card, banner, heatmap all removed. Table stays |
| 10 | Franchise user → toggle HIDDEN | PASS | No toggle in DOM for franchise (809) |
| 11 | Search, sort, category filter | PASS | All functional |
| 12 | CSV export | PASS | Downloads stock_inventory.csv |

## Evidence
- Test report: `test_reports/iteration_42.json`
- Success rate: Backend 100% (2/2), Frontend 100% (12/12)

## Files Changed (3)

| File | Change |
|------|--------|
| `services/api.js` | `_getStockInventory` accepts `{ includeHierarchy }` param |
| `hooks/useStockInventory.js` | Added hierarchy state, toggle, role gate via `useLoginContext` |
| `StockInventorySummary.jsx` | Toggle switch, 4th KPI card, alert banner, StoreHeatmapCard, store heatmap grid |

---

*QA PASSED. Proceed to governance closure.*
