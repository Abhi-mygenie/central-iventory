# Central Inventory — PRD

## Original Problem Statement
CR-036: Rewrite `control/AGENT_PROMPT.md` from single-agent sequential model to 11-role dispatch system. Adapted from MyGenie POS Agent Prompt Alpha v0.6. Scope: ONE FILE only — `control/AGENT_PROMPT.md`.

## Architecture
- **Frontend**: React 19 (CRA + CRACO), Tailwind CSS, Radix UI, Recharts, React Router v7
- **Backend**: FastAPI (Python) — proxy-only to preprod.mygenie.online
- **Database**: MongoDB (local)
- **Agent Control**: 11-role dispatch system (AGENT_PROMPT.md v2.0)

## What's Been Implemented (June 15, 2026)

### CR-036: Agent Prompt Rewrite — IMPLEMENTED + QA PASS
- Artifact 0 (Session Start): DONE
- Artifact 1 (Intake): DONE
- Artifact 2 (Impact Analysis): DONE — 6 owner questions asked and answered
- Artifact 3 (Implementation Plan): DONE — 23-section architecture, 13-point verification matrix
- Artifact 4 (Code-Gate): DONE — Owner GO received
- Artifact 5 (QA Report): DONE — 13/13 checks PASS
- Artifact 6 (Owner Signoff): PENDING

### Key Deliverables
- `control/AGENT_PROMPT.md` rewritten: 152 lines → 1188 lines
- 11 roles: INTAKE, PLANNING, IMPLEMENTATION, QA, BUG FIX, INVESTIGATION, DEPLOYMENT, SMOKE FACILITATOR, REGRESSION, PRE-RELEASE AUDIT, CLOSURE
- 7-gate pipeline with POS-style names
- Role-specific boot reading lists (3-5 files per role)
- Mandatory EXIT GATE for IMPLEMENTATION + BUG FIX
- Mandatory code markers (// CR-XXX / // BUG-XXX)
- Structured handover template
- 7 CI-specific rules (CI-R1 through CI-R7)
- Future STEP -1 hook for dashboard dispatch

### Owner Decisions Locked
| Q# | Decision |
|----|----------|
| Q1 | POS-style gate names (not Artifact 0-6) |
| Q2 | Structured handover template |
| Q3 | Mandatory EXIT GATE |
| Q4 | Mandatory code markers |
| Q5 | Skip STEP -1 until dashboard CR |
| Q6 | Role-specific reading lists |
| +  | Role-first flow, INTAKE skips batch |

## Status
- CR-036: IMPLEMENTED, QA 13/13 PASS — awaiting owner signoff (Artifact 6)
- Registry synced, dashboard data regenerated, drift check passes

## Backlog (P0/P1/P2)
- **P1**: Bug batch (BUG-B through BUG-H) — plans ready, awaiting Gate 4 GO
- **P1**: CR-018 (Wastage Report Intelligence) — planned but not coded
- **P2**: Dashboard dispatch system (workflow_queue, batch UI) — separate future CR
- **P2**: BUG-A (Push status) — blocked on backend gap G-023
