# Central Inventory — PRD

## Original Problem Statement
Build a governance & control system + intelligent UI freeze for the Central Inventory project.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, craco
- **Backend**: FastAPI proxy → preprod.mygenie.online
- **Governance**: 10-layer control + registry.json + generator + dashboard

## What's Been Implemented

### Phase 1: Repo Pull & Run (May 31, 2026)
- Cloned repo (branch: 31_5_26), app running

### Phase 2: Governance & Control System (May 31, 2026)
- 10-layer control layer, registry.json (34 items), dev dashboard at /__dev/

### Phase 3: Intelligent UI Freeze (May 31, 2026) — ALL 24 SCREENS APPROVED

**Flow A — Operations Hub (1 screen):** Intelligent Command Center with Next Best Actions, Store Health Grid, Priority KPIs, Today's Activity feed

**Flow B — Transfer Lifecycle (7 screens):** Intelligent PO (auto-detect low stock), Intelligent Approval Inbox (requester stock in brackets, store health), Transfer Detail (store snapshot, approval impact, dual stock), Direct Dispatch (destination needs auto-detect), Source Selector (FEFO), Receive (dispatched-vs-expected), Dispute (impact cards)

**Flow C — Stock Operations (4 screens):** Adjustment (impact preview, FEFO), Wastage (anomaly detection 3.2x), Procurement (3-mode: Invoice AI + Excel upload + Manual, review-approve), Wastage Report (trend ranking)

**Flow D — Stock Visibility (4 screens):** Inventory Summary (expiry risk, pending in/out, days of cover), Stock Detail (FEFO batches, consumption context, reorder suggestion), History/Ledger (movement badges, PO ref, signed qty), Timeline (relative timestamps, stale detection)

**Flow E — Configuration (8 screens):** Settings (impact badges), Vendors (inactive detection), Catalogue (usage cross-ref, push status), Consumption (vs stock, trend), Hierarchy (push sync status, stale detection)

### Design Decisions Locked
- 3-color palette: red + amber + neutral gray
- Intelligent PO as default on Request Stock
- Requester stock in brackets on approval cards
- PO auto-generation for direct dispatch
- 3-mode procurement (Invoice AI + Excel + Manual)
- Web-first, mobile-compatible

### Backend Gaps
- G-012: request-catalog missing category (P1)
- G-013: No PO number (P0)
- G-014: Invoice OCR/AI endpoint (P1)
- G-015: Excel/CSV parsing (P2)
- G-016: Invoice number storage (P2)

### 10 HTML Previews
All at `/__dev/previews/`:
A1, B1, B2, B3, B5, B6_B7_B8, C_stock_operations, D_stock_visibility, E_configuration

## Next Steps
- Phase 5: Slice Approval Gate
- Phase 6: E2E Intelligence Review (request→approve→dispatch→receive→ledger)
- Phase 7: Final Freeze Document (implementation-ready spec)
- Then: Implementation sprints
