# Central Inventory — PRD

## Original Problem Statement
Build a governance & control system for the Central Inventory project: (A) 10-layer Markdown control layer, (B) single-source-of-truth registry + generator, (C) hidden read-only Dev Control Dashboard. No app-behaviour code changes.

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS 3, Radix UI, craco
- **Backend**: FastAPI proxy → preprod.mygenie.online (zero business logic)
- **Database**: MongoDB (token sessions only)
- **Governance**: 10-layer Markdown control + registry.json + generator + dashboard

## What's Been Implemented

### Phase 1: Repo Pull & Run (May 31, 2026)
- Cloned repo from GitHub (branch: 31_5_26)
- Installed all dependencies, app running as-is

### Phase 2: Governance & Control System (May 31, 2026)

**Pillar A — 10-Layer Markdown Control Layer** (`/app/control/`):
- L0 Baseline Index, L1 Control Dashboard, L2 Handover Protocol
- L3 CR Registry, L4 Bug Tracker, L5 Env & Config
- L6 Sprint Status, L7 File Ownership, L8 Access Registry, L9 Open Gaps
- Agent Prompt, Code Gate Policy, Maintenance Rules
- Session-Start Template in `sessions/`

**Pillar B — Single Source of Truth + Generator**:
- `registry.json` seeded with 18 CRs + 15 BUGs (retroactive from 104 existing docs)
- `gen_dashboard_data.js` generates summary, CRs, bugs, debt JSONs
- `--check` drift linter (exits non-zero if stale)
- 7-Artifact Closure Model enforced

**Pillar C — Hidden Dev Control Dashboard**:
- Static page at `/__dev/index.html` (zero React coupling)
- 3 tabs: Closure Debt, Bug Tracker, CR Registry
- Filters: search, sprint, severity, status
- Expandable rows with artifact links
- CSV export
- Summary cards with headline counts

## Sprints
- **S0** (Pre-Governance): All historical work (Slices 1-5, P17-P24). CLOSED.
- **S1** (Governance Setup): Current. Establishing control layer.

## Prioritized Backlog
- P0: CR-015 (P24 FEFO Batch Stock Detail)
- P1: CR-016 (P20 Hierarchy Toggle), CR-017 (Smart Dispatch)
- P2: CR-018 (P25 Wastage Enhancements)

## Next Tasks
- Owner batch sign-off on S0 items (14 CRs pending signoff)
- Assign CR-015 to Sprint 2
- Clear DC-1 to DC-10 doc debt items
