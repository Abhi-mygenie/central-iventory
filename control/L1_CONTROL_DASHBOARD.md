# L1 — Control Dashboard (Project Status)

> **Updated:** 2026-06-14 (CR-030 IMPLEMENTED)

---

## Current State

| Field | Value |
|-------|-------|
| **Branch** | `14-june-planning` (deployed from GitHub) |
| **Deploy URL** | `https://ad4f49f5-1399-48dc-a1af-09db773e7c45.preview.emergentagent.com` |
| **Active Sprint** | **S3 — API Reality Check + Intelligent PO + Screen Audit** |
| **UI Freeze Status** | PHASE 7 FROZEN — CR-030 IMPLEMENTED, CR-031/032 PLANNED |
| **Implementation Status** | 24/24 screens + 3 new PO screens. CR-030 complete (Vendor, Raw Material, PO Module) |
| **Data** | Restaurant 806 hierarchy — 48 inventory items, 75 purchase records, 5 POs |
| **Dev Dashboard** | `/__dev/index.html` |
| **UI Previews** | `/__dev/previews/*.html` (17 files) |

## Sprint S3 — Closed Items

### CR-023: API Reality Check — **CLOSED**
- 17 of 18 bugs fixed (B10 deferred — resolved by G-017 in CR-030)
- All artifacts 0-6 DONE.

### CR-024: API Response Cache — **CLOSED**
- 71 → 20 API calls (72% reduction). Single file change.

### CR-025: Coverage-Based Intelligent PO — **CLOSED**
- Request Stock + Direct Dispatch intelligence. Sub-task (reference_code wire) CLOSED.

### CR-015, CR-016: FEFO Detail + Hierarchy Toggle — **CLOSED**

## Sprint S3 — Active Items

### CR-030: Inward Screens Audit — **QA** (Pending Owner Signoff)
- **Vendor Management:** Full rewrite → master-detail (35/65), purchase intelligence (KPIs + chart + recent purchases), Active/Inactive from real purchase dates
- **Raw Material Master:** Full rewrite → expandable rows, inline edit + intelligence (avg rate, consumption, DoS, vendor price comparison), category/status filters, "Pushed to X stores"
- **Purchase Order Module (NEW):** 9 screens implemented:
  - PO List: Status tabs + 4 KPI cards + vendor/date/search filters
  - Create By Vendor: Vendor cards (Active/Inactive, Cheapest for X items), history table (Last/Avg Rate, Cheapest Vendor, DoC), urgency sort, reorder-point auto-suggest, TIP banner
  - Create By Item Need: Urgency KPIs, per-item vendor picker, Other Vendors, savings calc, multi-PO auto-group
  - PO Detail: Status timeline, stock context columns (Your Stock/Days/After Receive)
  - Receive: Card-per-line layout, Rate Variance + Stock Impact panels, Invoice # field, summary
  - Add-Stock Gate: Proactive settings detection + reactive error handling
- All artifacts 0-5 DONE. Artifact 6 (Owner Signoff) PENDING.

| CR | Title | Status | Artifacts |
|----|-------|:------:|:---------:|
| CR-030 | Inward Screens Audit | **QA** | 6/7 (signoff pending) |
| CR-031 | Production Screens Audit | PLANNED | 4/7 |
| CR-032 | Outward Screens Audit | PLANNED | 4/7 |
| CR-033 | Action Screens Audit | PROPOSED | 2/7 |

## Registry: 33 CRs, 16 BUGs, 3 Sprints (S0-S2 closed, S3 active)

## Backend Gaps

| ID | Gap | Priority | Status |
|----|-----|:--------:|--------|
| G-014 | Invoice OCR endpoint | P1 | OPEN — UI shows "Coming Soon" |
| G-015 | Excel parsing endpoint | P2 | OPEN — Upload zone ready |
| G-017 | Vendor purchase history API | P2 | **CLOSED** — `vendor-item-list` confirmed (75 records, 2026-06-14) |
| G-020 | Custom unit conversion | P1 | OPEN — POS backend required |
| G-021 | Purchase Order Module | P0 | **CLOSED** — All 10 PO APIs validated (32/32, 2026-06-14) |
| G-022 | Aggregated stock with segments | P1 | **NOT NEEDED** — API supports `include_segments` + `include_consumption` params |

## QA Completed — Pending Owner Signoff

| CR | Title | QA Status | Report |
|----|-------|:---------:|--------|
| CR-026 | P28 Production Unit Module | ✅ PASS | `test_reports/iteration_43.json` |
| CR-027 | Navigation Restructure | ✅ PASS | `test_reports/iteration_43.json` |
| CR-029 | Stock Inventory FG/Raw Split | ✅ PASS | `test_reports/iteration_43.json` |
| CR-030 | Inward Screens Audit | ✅ IMPL COMPLETE | `control/sessions/CR030_ARTIFACT_5_QA_REPORT.md` |

## Next Work — Backlog Priority

| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| **P0** | CR-031 | Production Screens Audit | PLANNED |
| **P0** | CR-032 | Outward Screens Audit | PLANNED |
| P1 | CR-033 | Action Screens Audit | PROPOSED |
| P1 | CR-018 | P25 Wastage Report Enhancements | PLANNED |

## Quick Links

| Layer | Path |
|-------|------|
| L0 Baseline | `control/L0_BASELINE_INDEX.md` |
| L6 Sprint | `control/L6_SPRINT_STATUS.md` |
| L7 Files | `control/L7_FILE_OWNERSHIP.md` |
| L8 Credentials | `control/L8_ACCESS_REGISTRY.md` |
| L9 Gaps | `control/L9_OPEN_GAPS_REGISTER.md` |
| Registry | `control/registry.json` |
