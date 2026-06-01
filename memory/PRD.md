# Central Inventory — PRD

## Original Problem Statement
Build a governance & control system + intelligent UI freeze for the Central Inventory project. Pull code from GitHub (branch: 10-may), deploy, and perform final UI/UX design review.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, craco (34 components, 10 hooks, 88 API methods)
- **Backend**: FastAPI proxy → preprod.mygenie.online (177 lines, zero business logic)
- **Database**: MongoDB (session storage)
- **Governance**: 10-layer control + registry.json (35 items) + dev dashboard

## What's Been Implemented

### June 1, 2026 — Deployment
- Cloned repo from GitHub (branch: 10-may) into /app
- Preserved platform essentials (.emergent, .git, frontend/.env, backend/.env)
- Installed all backend + frontend dependencies
- Added PREPROD_API_BASE_V1 and PREPROD_API_BASE_V2 to backend .env
- Both services running and verified

### June 1, 2026 — UI/UX Final Design Review
- Reviewed all 9 HTML previews covering 24 screens + 3 modals
- Created 7 review documents in `/app/control/sessions/ui_review/`
- **Verdict: STRONG PROFESSIONAL QUALITY — READY FOR IMPLEMENTATION WITH MINOR REFINEMENTS**
- Found 16 issues: 3 Must Have, 5 Should Have, 5 Could Have, 3 Defer
- No preview rebuilds required — all fixes are implementation-time
- 2 items pending owner approval (loading/error states, E8 badge colors)

## Current Status: UI/UX REVIEW COMPLETE — Owner Approval Pending

## Key Documents
- Phase 7 Freeze: `control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md`
- UI Review Report: `control/sessions/ui_review/UI_UX_FINAL_DESIGN_REVIEW_REPORT.md`
- Screen Matrix: `control/sessions/ui_review/SCREEN_BY_SCREEN_UI_CHANGE_MATRIX.md`
- Owner Checklist: `control/sessions/ui_review/OWNER_UI_APPROVAL_CHECKLIST.md`

## Next Steps
1. Owner reviews UI/UX report and approves 2 pending items
2. Implementation Sprint A: Read-only intelligence (3-4 days)
3. Implementation Sprint B: Transfer flow intelligence (5-6 days)
4. Implementation Sprint C: Operations + config intelligence (4-5 days)
5. Backend gap resolution (G-012 to G-016) with POS team

## Backlog (P0/P1/P2)
- P0: G-013 PO number generation (backend team)
- P1: G-012 Catalog category fields, G-014 Invoice OCR endpoint
- P2: G-015 Excel parsing, G-016 Invoice storage
- Future: CR-020 Daily Intelligence Digest, CR-015 FEFO Batch Detail, CR-016 Hierarchy Toggle
