# L6 — Sprint Status

> **Updated:** 2026-06-13 (CR-023, CR-024, CR-025 CLOSED)
> **Source of truth for items:** `control/registry.json`

---

## Active Sprint: S3 — API Reality Check + Intelligent PO + FEFO Detail

- **Period:** 2026-06-01 → ongoing
- **CRs:** CR-023 (CLOSED), CR-024 (CLOSED), CR-025 (CLOSED), CR-015 (PLANNED), CR-016 (PLANNED)
- **Branch:** `13-6-26`

### S3 Deliverables

| CR | Title | Status | QA Report | Owner Signoff |
|----|-------|:------:|:---------:|:-------------:|
| CR-023 | API Reality Check — 17 bug fixes | **CLOSED** | iteration_34 | DONE |
| CR-024 | API Response Cache (71→20 calls, 72%) | **CLOSED** | iteration_36 | DONE |
| CR-025 | Intelligent PO (Request Stock + Direct Dispatch) | **CLOSED** | iteration_39 | DONE |
| CR-015 | P24 — FEFO Batch Stock Detail Panel | **PLANNED** | — | — |
| CR-016 | P20-Phase2 — Stock Inventory Hierarchy Toggle | **PLANNED** | — | — |

### CR-023 Detail — 17 Bugs Fixed
- Batch 1: OperationsHub field fix + store health grid
- Batch 2: Restaurant names on Queues, TransferDetail, History
- Batch 3: TransferDetail Requester Snapshot + Approval Impact
- Batch 4: Consumption intelligence + Dispatch auto-detect
- Batch 5: ReceiveDialog + ApproveWaveDialog FEFO + HierarchySummary health
- Batch 6: Catalogues + HierarchyMgmt + Dialog polish
- **DEFERRED:** B10 (Vendor purchase history — G-017)

### CR-024 Detail — Performance
- Single-file change: `frontend/src/services/api.js`
- In-memory cache: LONG 60s / MEDIUM 45s / SHORT 30s TTL
- In-flight dedup eliminates React StrictMode double-fires
- Auto-invalidation on all 15 write/mutation endpoints

### CR-025 Detail — Intelligent PO
- **Request Stock:** Coverage selector (3/7/10/30d), consumption-based + threshold fallback, category grouping, source cross-validation, pending request count, order summary
- **Direct Dispatch:** Integrated table (Qty to Send + Source Segment inline), "You'll retain X%", "You only have X" warnings, review section, PO auto-gen note
- **Sub-task pending:** Wire `reference_code` as PO number (planning artifacts 0-3 complete)

## Closed Sprints

### S2 — Intelligent UI Implementation
- **CRs:** CR-021 (CLOSED), CR-022 (CLOSED)
- **Audit:** 55/55 tests covered implemented subset only; 18 bugs found → CR-023

### S1 — Governance Setup
- **CRs:** CR-019 (UI Freeze, CLOSED — 7/7 artifacts)

### S0 — Pre-Governance (Retroactive)
- **CRs:** CR-001 to CR-014 (all CLOSED)
- **BUGs:** BUG-001 to BUG-015 (mixed status)

## Backlog (Next Work)

| ID | Title | Priority | Planning Doc |
|----|-------|----------|-------------|
| CR-015 | P24 — FEFO Batch Stock Detail | **P0** | `AI/Plans/phase3/P24_fefo_batch_stock_planning.md` |
| CR-016 | P20-Phase2 — Hierarchy Toggle | P1 | `AI/Plans/phase2/P20_stock_inventory_summary_plan.md` |
| CR-018 | P25 — Wastage Report Enhancements | P1 | — |
| CR-017 | P21-Smart — Smart Dispatch Assistance | P2 | `AI/Plans/phase3/P21_smart_dispatch_request_assistance.md` |
| CR-020 | Daily Intelligence Digest | Future | — |

## Backlog (Blocked on Backend)

| Item | Blocker |
|------|---------|
| Wire Invoice AI extraction | G-014 |
| Wire Excel import parsing | G-015 |
