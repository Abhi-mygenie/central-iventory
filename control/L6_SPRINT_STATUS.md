# L6 — Sprint Status

> **Updated:** 2026-06-14 (CR-030 QA complete)
> **Source of truth for items:** `control/registry.json`

---

## Active Sprint: S3 — API Reality Check + Intelligent PO + Screen Audit

- **Period:** 2026-06-01 → ongoing
- **Branch:** `14-june-planning`
- **CRs:** CR-023 (CLOSED), CR-024 (CLOSED), CR-025 (CLOSED), CR-015 (CLOSED), CR-016 (CLOSED), CR-030 (QA)

### S3 Deliverables

| CR | Title | Status | QA Report | Owner Signoff |
|----|-------|:------:|:---------:|:-------------:|
| CR-023 | API Reality Check — 17 bug fixes | **CLOSED** | iteration_34 | DONE |
| CR-024 | API Response Cache (71→20 calls) | **CLOSED** | iteration_36 | DONE |
| CR-025 | Intelligent PO (Request Stock + Dispatch) | **CLOSED** | iteration_39 | DONE |
| CR-015 | P24 — FEFO Batch Stock Detail | **CLOSED** | iteration_41 | PENDING |
| CR-016 | P20-Phase2 — Hierarchy Toggle | **CLOSED** | iteration_44 | PENDING |
| CR-030 | Inward Screens Audit (Vendor + RawMat + PO) | **QA** | CR030_ARTIFACT_5_QA_REPORT.md | **PENDING** |

### CR-030 Detail — Inward Screens (Implemented 2026-06-14)

**Scope:** 3 screen rewrites + 1 new module (9 sub-screens)

| Phase | Screen | Change | Status |
|:-----:|--------|--------|:------:|
| 0 | api.js | `getVendorItemList` + 10 PO methods + extended `getStockInventory` params | ✅ |
| 1 | VendorManagement | FULL REWRITE → master-detail + purchase intelligence | ✅ |
| 2 | IngredientCatalogue | FULL REWRITE → expandable rows + intelligence + filters | ✅ |
| 3.1 | PurchaseOrderList | NEW — status tabs, 4 KPI cards, filters | ✅ |
| 3.2 | PurchaseOrderCreate | NEW — By Vendor (intel columns, TIP banner) + By Item Need (urgency, multi-PO) | ✅ |
| 3.3 | PurchaseOrderDetail | NEW — stock context, card-per-line receive, variance detection | ✅ |
| 3.4 | AddStockPurchaseForm | EDIT — PO gate redirect (proactive + reactive) | ✅ |
| 3.5 | App.js | EDIT — 3 PO routes + imports | ✅ |

### S3 Remaining (Planned)

| CR | Title | Status | UX Freezes |
|----|-------|:------:|:----------:|
| CR-031 | Production Screens Audit | PLANNED | 3 freezes |
| CR-032 | Outward Screens Audit | PLANNED | 5 freezes |

## Closed Sprints

### S2 — Intelligent UI Implementation (CLOSED)
- CRs: CR-021, CR-022

### S1 — Governance Setup (CLOSED)
- CRs: CR-019

### S0 — Pre-Governance (CLOSED)
- CRs: CR-001 to CR-014

## QA Completed — Pending Owner Signoff

| ID | Title | QA Status | Report |
|----|-------|:---------:|--------|
| CR-026 | P28 Production Unit Module | ✅ PASS | `test_reports/iteration_43.json` |
| CR-027 | Navigation Restructure | ✅ PASS | `test_reports/iteration_43.json` |
| CR-029 | Stock Inventory FG/Raw Split | ✅ PASS | `test_reports/iteration_43.json` |
| CR-030 | Inward Screens Audit | ✅ IMPL | `CR030_ARTIFACT_5_QA_REPORT.md` |

## Backlog (Next Work)

| ID | Title | Priority | Planning Doc |
|----|-------|----------|-------------|
| CR-031 | Production Screens Audit | **P0** | `CR031_ARTIFACT_2_3_UNIFIED_IMPLEMENTATION_PLAN.md` |
| CR-032 | Outward Screens Audit | **P0** | `CR032_ARTIFACT_2_3_UNIFIED_IMPLEMENTATION_PLAN.md` |
| CR-033 | Action Screens Audit | P1 | `CR033_ARTIFACT_1_INTAKE.md` |
| CR-018 | P25 Wastage Report | P1 | — |

## Backlog (Blocked on Backend)

| Item | Blocker |
|------|---------|
| Invoice AI extraction | G-014 |
| Excel import parsing | G-015 |
| Unit conversion | G-020 |
