# Central Inventory — PRD

## Original Problem Statement
Pull https://github.com/Abhi-mygenie/central-iventory.git (branch 14-june-1), set up and run. Then follow control layer governance for all subsequent work.

## Architecture
- **Backend**: Python FastAPI proxy-only (~180 lines, zero business logic) → `preprod.mygenie.online`
- **Frontend**: React 19 + CRACO + Tailwind CSS + Radix UI / shadcn components
- **Database**: MongoDB (local, used only for token sessions)
- **External API**: MyGenie POS preprod API (v1 auth + v2 vendor employee)

## What's Been Implemented (2026-06-15)
- [2026-06-15] Cloned repo, installed deps, services running
- [2026-06-15] Full onboarding completed (10 mandatory files)
- [2026-06-15] 8-bug intake from owner walkthrough (BUG-A through BUG-H)
- [2026-06-15] Impact Analysis + Deep Implementation Plan for 7 bugs (BUG-A deferred)
- [2026-06-15] Backend gap G-023 filed (push-form API missing entity types)
- [2026-06-15] CR-036 registered (Control Layer Redesign — Agent Prompt Rewrite)
- [2026-06-15] CR-036 Artifacts 0-2 complete, Artifact 3 pending
- [2026-06-15] CR-018 status verified: NOT DONE (planning complete, zero code)
- [2026-06-15] 2 interactive mock previews created (Production Run layout, Food Edit pattern)

## Prioritized Backlog

### P0 — Active
| Item | Status | Next Step |
|------|--------|-----------|
| CR-036 | Impact Analysis done | Planning agent: write Artifact 3 (ask Q1-Q6 first) |

### P0 — Ready for Gate 4
| Item | Status | Next Step |
|------|--------|-----------|
| BUG-C (Unknown From/To) | Plan ready | Owner Gate 4 GO → Implementation |
| BUG-F ($ → ₹ icon) | Plan ready | Owner Gate 4 GO → Implementation |
| BUG-B (Stock split FG/RM) | Plan ready | Owner Gate 4 GO → Implementation |
| BUG-D (Remove Adjust Stock) | Plan ready | Owner Gate 4 GO → Implementation |
| BUG-E (PO gate redirect) | Plan ready | Owner Gate 4 GO → Implementation |
| BUG-G (Production Run layout) | Plan ready | Owner Gate 4 GO → Implementation |
| BUG-H (Food edit Sheet) | Plan ready | Owner Gate 4 GO → Implementation |

### P1 — Deferred
| Item | Status | Blocker |
|------|--------|---------|
| BUG-A (Push status 125 behind) | DEFERRED | Backend G-023 |
| CR-018 (Wastage Report) | IN_PROGRESS (no code) | Needs implementation |

### P2 — Backlog
| Item | Status |
|------|--------|
| CR-031 | Production Screens Audit — PLANNED |
| CR-032 | Outward Screens Audit — PLANNED |
| CR-033 | Action Screens Audit — QA |
