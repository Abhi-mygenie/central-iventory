# CR-030 Artifact 5 — QA Report

> **CR ID:** CR-030
> **Title:** Inward Screens Audit (Vendor Management, Raw Material Master, Purchase)
> **Date:** 2026-06-13
> **Test Report:** `/app/test_reports/iteration_45.json`
> **Overall Status:** ✅ ALL PASS (8/8)

---

## Test Results

| # | Test | Status | Evidence |
|---|------|:------:|----------|
| T1 | VendorManagement: delete error → toast (not alert) | ✅ PASS | Toast import confirmed, delete dialog works |
| T2 | IngredientCatalogue: add ingredient error → toast | ✅ PASS | Toast on error at save, disabled button validation |
| T3 | "Pushed to" column shows "5 stores" badges | ✅ PASS | 48 cells with badges, only for isTopLevel users |
| T4 | Purchase file inputs show G-014/G-015 toast | ✅ PASS | Both file inputs clear + toast on select |
| T5 | "Empty" badge for 0-stock items | ✅ PASS | 22 Empty, 24 OK, 2 Low badges |
| T6 | Regression: Vendor CRUD | ✅ PASS | Add/Edit/Delete/Search all working |
| T7 | Regression: Ingredient table columns | ✅ PASS | All columns including new "Pushed to" |
| T8 | Regression: Purchase Manual Entry | ✅ PASS | Full flow working |

## Issues Found

**None.**
