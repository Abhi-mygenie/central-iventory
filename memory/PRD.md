# Central Inventory — PRD

## Original Problem Statement
Build a governance & control system + intelligent UI freeze for the Central Inventory project. Convert all screens from crude functional UI into intelligent operational interfaces.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, craco
- **Backend**: FastAPI proxy → preprod.mygenie.online (zero business logic)
- **Database**: MongoDB (token sessions only)
- **Governance**: 10-layer Markdown control + registry.json + generator + dashboard

## What's Been Implemented

### Phase 1: Repo Pull & Run (May 31, 2026)
- Cloned repo from GitHub (branch: 31_5_26), app running

### Phase 2: Governance & Control System (May 31, 2026)
- 10-layer control layer (L0-L9) with full retroactive data
- registry.json: 18 CRs + 15 BUGs, 7-Artifact Closure Model
- gen_dashboard_data.js generator + --check drift linter
- Dev Control Dashboard at /__dev/ (3 tabs, expandable rows, copy buttons, CSV export)
- Session template + Agent Prompt + Code Gate Policy + Maintenance Rules

### Phase 3: Intelligent UI Freeze (May 31, 2026 — IN PROGRESS)

**Completed:**
- Phase 0+1: Current state audit — 22 screens, ~120 intelligence gaps, zero intelligence baseline
- Phase 2: Flow B brainstorming — 61 elements, all approved Must Have
- Phase 3: Flow B API feasibility — 40 frontend-only, 15 feasible, 0 blocked
- Phase 4 Flow B: 7 screen previews — ALL APPROVED
  - B1: Intelligent PO (auto-detect low stock, category grouping, consumption suggestions)
  - B2: Intelligent Approval Inbox (item-level, requester stock brackets, store health, age badges)
  - B3: Transfer Detail (requester store snapshot, approval impact, dual stock context)
  - B5: Direct Dispatch (destination needs auto-detect, FEFO segments, PO auto-gen)
  - B6+B7+B8: Source Selector + Receive + Dispute (FEFO badges, dispatched-vs-expected, impact cards)
- Phase 4 Flow C: 4 screen previews — ALL APPROVED
  - C1: Stock Adjustment (impact preview, FEFO segment)
  - C2: Wastage Entry (anomaly detection 3.2x above avg)
  - C3: Procurement (3-mode: Invoice AI upload + Excel/CSV upload + Manual, review-approve)
  - C4: Wastage Report (top items ranking, trend analysis)

**Pending:**
- Flow D: Stock Visibility (4 screens)
- Flow E: Configuration (8 screens)
- Flow A: Operations Hub (1 screen)
- Phase 5: Slice Approval Gate
- Phase 6: E2E Intelligence Review
- Phase 7: Final Freeze Document

### Design Decisions Locked
- 3-color palette: red (problem) + amber (caution) + neutral gray
- Intelligent PO as default on Request Stock
- Requester stock in brackets on approval cards
- Store health strip on queue + full snapshot on detail
- PO auto-generation for direct dispatch
- 3-mode procurement with review-approve flow
- Web-first, mobile-compatible

### Backend Gaps Registered
- G-012: request-catalog missing category (P1)
- G-013: No PO number in transfer API (P0)
- G-014: Invoice OCR/AI extraction endpoint (P1)
- G-015: Excel/CSV parsing endpoint (P2)
- G-016: Invoice number storage (P2)

## Previews
All at `/__dev/previews/`:
- B1_request_stock.html
- B2_pending_queues.html
- B3_transfer_detail.html
- B5_direct_dispatch.html
- B6_B7_B8_modals.html
- C_stock_operations.html

## Prioritized Backlog
- Complete UI Freeze for remaining 13 screens
- Phase 5-7: Approval Gate → E2E Review → Final Freeze
- CR-015 (P24 FEFO): Ready for implementation after freeze
- G-013 (PO number): P0 backend gap — blocks user-facing ID
