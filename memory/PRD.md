# Central Inventory — PRD

## Original Problem Statement
Build a governance & control system + intelligent UI freeze for the Central Inventory project.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, craco (34 components, 8 hooks, 88 API methods)
- **Backend**: FastAPI proxy → preprod.mygenie.online (177 lines, zero business logic)
- **Governance**: 10-layer control + registry.json (35 items) + dev dashboard

## Current Status: PHASE 7 FROZEN — Implementation Ready

### Governance System (Complete)
- 10-layer control layer, dev dashboard at `/__dev/`, drift linter

### Intelligent UI Freeze (FROZEN)
- **24/24 screens approved** across 5 flows
- **9 HTML previews** at `/__dev/previews/`
- **Phase 7 Final Freeze** at `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md`
- **3 implementation sprints planned**: Sprint A (read-only, 3-4d), Sprint B (transfer flow, 5-6d), Sprint C (operations, 4-5d)
- **~28% codebase growth** estimated (9,800 → 12,500 lines)
- **6 new files** to create (1 hook + 5 shared components)
- **24 existing files** modified
- **5 backend gaps** (G-012 to G-016) for parallel POS team work

### Key Innovations
- Intelligent PO (auto-detect low stock, pre-build request)
- Intelligent Approval Inbox (requester stock, store health, fulfillment verdict)
- 3-mode Procurement (Invoice AI + Excel + Manual)
- Store Health Grid + Next Best Actions command center
- FEFO recommendations + anomaly detection + days-of-cover
- Cross-item expiry scan + undo guidance + CSV export

### Backend Gaps
- G-013: No PO number (P0) — blocks user-facing identifiers
- G-012: Catalog category (P1)
- G-014: Invoice OCR endpoint (P1)
- G-015: Excel parsing (P2)
- G-016: Invoice storage (P2)

### CRs Registered
- CR-019: Intelligent UI Freeze (IN_PROGRESS → OWNER_REVIEW)
- CR-020: Daily Intelligence Digest SMS/WhatsApp/Email (PROPOSED, future phase)

## Next Steps
1. **Implementation Sprint A** — Hub + Inventory + Detail + History + Timeline
2. **Implementation Sprint B** — Request + Queues + Transfer + Dispatch + Modals
3. **Implementation Sprint C** — Procurement + Adjustment + Wastage + Config
4. **G-013 resolution** with POS backend team (P0 blocker)
