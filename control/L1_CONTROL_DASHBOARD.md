# L1 — Control Dashboard (Project Status)

> **Updated:** 2026-05-31 (post Flow B + C approval)

---

## Current State

| Field | Value |
|-------|-------|
| **Branch** | `31_5_26` |
| **Repo** | `parth-mygenie/central_inventory` |
| **Active Sprint** | S1 — Governance Setup + Intelligent UI Freeze |
| **Backend** | FastAPI proxy → `preprod.mygenie.online` |
| **Frontend** | React 19 + Tailwind + Radix UI |
| **Database** | MongoDB (token sessions only) |
| **Dev Dashboard** | `/__dev/index.html` |
| **UI Previews** | `/__dev/previews/*.html` |

## Active Work: Intelligent UI Freeze

| Flow | Screens | Status |
|------|:-------:|:------:|
| Flow B — Transfer Lifecycle | 7 | APPROVED |
| Flow C — Stock Operations | 4 | APPROVED |
| Flow D — Stock Visibility | 4 | PENDING |
| Flow E — Configuration | 8 | PENDING |
| Flow A — Operations Hub | 1 | PENDING |
| **Total** | **24** | **11/24 approved** |

## Backend Gaps (New — from UI Freeze)

| ID | Gap | Priority |
|----|-----|:--------:|
| G-012 | request-catalog missing category | P1 |
| G-013 | No PO number in transfer API | P0 |
| G-014 | Invoice OCR/AI extraction endpoint | P1 |
| G-015 | Excel/CSV parsing endpoint | P2 |
| G-016 | Invoice number storage | P2 |

## Quick Links

| Layer | Path | Purpose |
|-------|------|---------|
| L0 Baseline | `control/L0_BASELINE_INDEX.md` | Frozen truth |
| L1 Dashboard | `control/L1_CONTROL_DASHBOARD.md` | This file |
| L6 Sprint Status | `control/L6_SPRINT_STATUS.md` | Sprint board |
| L9 Open Gaps | `control/L9_OPEN_GAPS_REGISTER.md` | All gaps |
| UI Freeze Progress | `control/sessions/INTELLIGENT_UI_FREEZE_MASTER_PROGRESS.md` | Master tracker |
| Registry (SSOT) | `control/registry.json` | CR/BUG source of truth |
| Dev Dashboard | `/__dev/index.html` | CR/BUG dashboard |
| UI Previews | `/__dev/previews/` | Screen previews |
