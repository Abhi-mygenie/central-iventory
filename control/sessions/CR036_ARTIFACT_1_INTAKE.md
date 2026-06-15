# CR-036 — Artifact 1: Intake

> **CR ID:** CR-036
> **Title:** Control Layer Redesign — Role-Based Agent Dispatch System
> **Priority:** P1
> **Area:** Agent Control Layer / Process / Dashboard
> **Sprint:** S3

---

## Problem Statement

Central Inventory currently uses a **single-agent sequential model** — one agent handles everything from intake to implementation to QA. This creates:

1. **Role contamination** — planning agent starts coding, implementation agent skips QA
2. **No dispatch mechanism** — owner instructs via chat, no structured queue
3. **No gate enforcement** — artifacts can be skipped, no EXIT GATE blocking handover
4. **No handover continuity** — new agent doesn't know where previous agent left off
5. **No batch processing** — can't send multiple items to a stage at once

## Scope

Redesign the control layer to support **11 specialized agent roles** with a **dashboard-driven batch dispatch system**, adapted from MyGenie POS v0.6.

### Roles (11 — all except RELEASE)

| # | Role | Purpose |
|---|------|---------|
| 1 | INTAKE | Register bugs/CRs, classify, evidence capture |
| 2 | PLANNING | Impact Analysis + Implementation Plan (no code) |
| 3 | IMPLEMENTATION | Code from approved plans, self-test, EXIT GATE |
| 4 | QA | Execute test cases, report pass/fail (no code) |
| 5 | BUG FIX | Fix QA failures, reproduce-first, RCA |
| 6 | INVESTIGATION | Root cause analysis, curl-probe, no code |
| 7 | DEPLOYMENT | Environment setup, clone, configure |
| 8 | SMOKE FACILITATOR | Present items to owner, capture PASS/FAIL |
| 9 | REGRESSION | Cross-item interaction testing |
| 10 | PRE-RELEASE AUDIT | Performance, security, code quality, registry integrity |
| 11 | CLOSURE | Verify artifacts, update registries, reconciliation |

### Dispatch System

- Dashboard at `/__dev/index.html` gets workflow controls
- Owner selects items → filter by stage → "Send to <stage>" button
- Creates batch in `workflow_queue.json` via `POST /api/workflow-queue`
- Agent reads queue at session start (STEP -1) → auto-picks role

### Gate System (7 gates per item)

```
Intake → Impact Analysis → Implementation Plan → Gate 4 (owner GO) → 
Code → QA → Smoke (owner verify)
```

## Deliverables

1. **New `AGENT_PROMPT.md`** — 11-role architecture with boot/do/output/skip/handover per role
2. **`workflow.js`** — Batch manager (createBatch, approvals, smoke results)
3. **`workflow_queue.json`** — Queue file agents read at session start
4. **Dashboard enhancements** — Stage filter, multi-select, batch action bar, gate progress, approval/smoke buttons
5. **`server.py` additions** — `POST/GET /api/workflow-queue` endpoints
6. **Updated `registry.json` schema** — Add gate status fields, sprint_key alignment
7. **Updated governance docs** — L1, L6, L7, MAINTENANCE_RULES

## Duplicate Check
- DISTINCT — no existing CR covers control layer redesign

## Blast Radius
- LARGE — touches control/, frontend/public/__dev/, backend/server.py, all governance docs
- But NO application code changes (only agent infrastructure)

## Evidence
- Reference: `/app/control/reference/` (15 POS files)
- Owner confirmed: all 11 roles, dashboard batch dispatch

## Code Reality
- NONE — this is entirely new infrastructure for Central Inventory
