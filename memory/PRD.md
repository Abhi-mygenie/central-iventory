# Central Inventory — PRD

## Original Problem Statement
Build a governance & control system + intelligent UI freeze for the Central Inventory project.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, craco
- **Backend**: FastAPI proxy → preprod.mygenie.online (zero business logic)
- **Database**: MongoDB (token sessions only)
- **Governance**: 10-layer Markdown control + registry.json + generator + dashboard

## What's Been Implemented

### Phase 1: Repo Pull & Run (May 31, 2026)
- Cloned repo from GitHub (branch: 31_5_26), app running

### Phase 2: Governance & Control System (May 31, 2026)
- 10-layer control layer, registry.json (33 items), generator + drift linter, dev dashboard at /__dev/

### Phase 3: Intelligent UI Freeze (May 31, 2026 — IN PROGRESS)
- Phase 0+1: Current state audit + screen inventory (22 screens, 120 gaps)
- Phase 2: Flow B brainstorming — 61 elements, all approved as Must Have
- Phase 3: API feasibility — 40 frontend-only, 15 feasible, 0 blocked
- Phase 4 (in progress): Screen previews
  - B1 Request Stock — APPROVED (Intelligent PO concept)
  - B2 Pending Queues — APPROVED (Intelligent Approval Inbox with requester stock)
  - B3 Transfer Detail — APPROVED (Store snapshot + approval impact)
  - B5 Direct Dispatch — NEXT
  - B6-B8 — PENDING

### Backend Gaps Registered
- G-012: request-catalog missing category fields (P1)
- G-013: No PO number in transfer API (P0)

## Prioritized Backlog
- Complete Phase 4 for B5-B8
- Phase 2 brainstorming for Flow C (Stock Operations) + Flow D (Stock Visibility)
- Phase 5: Slice Approval Gate
- Phase 6: E2E Intelligence Review
- Phase 7: Final Freeze Document

## Next Tasks
- B5 Direct Dispatch preview
- B6 Source Selector, B7 Receive Dialog, B8 Dispute Resolution
- Flow C + D brainstorming
