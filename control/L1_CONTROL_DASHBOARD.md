# L1 — Control Dashboard (Project Status)

> **Updated:** 2026-05-31

---

## Current State

| Field | Value |
|-------|-------|
| **Branch** | `31_5_26` |
| **Repo** | `parth-mygenie/central_inventory` |
| **Active Sprint** | S1 — Governance Setup |
| **Backend** | FastAPI proxy → `preprod.mygenie.online` |
| **Frontend** | React 19 + Tailwind + Radix UI |
| **Database** | MongoDB (token sessions only — no business data local) |
| **Dev Dashboard** | `/__dev/index.html` |

## Service Health

| Service | Port | Status |
|---------|------|--------|
| Backend (uvicorn) | 8001 | Running |
| Frontend (craco) | 3000 | Running |
| MongoDB | 27017 | Running |

## Quick Links

| Layer | Path | Purpose |
|-------|------|---------|
| L0 Baseline | `control/L0_BASELINE_INDEX.md` | Frozen truth |
| L1 Dashboard | `control/L1_CONTROL_DASHBOARD.md` | This file |
| L2 Handover | `control/L2_HANDOVER_PROTOCOL.md` | Agent onboarding |
| L3 CR Registry | `control/L3_CR_REGISTRY.md` | CR process + schema |
| L4 Bug Tracker | `control/L4_BUG_TRACKER.md` | Bug process + schema |
| L5 Env & Config | `control/L5_ENV_CONFIG_REGISTRY.md` | Environment variables |
| L6 Sprint Status | `control/L6_SPRINT_STATUS.md` | Sprint board |
| L7 File Ownership | `control/L7_FILE_OWNERSHIP.md` | File categories |
| L8 Access Registry | `control/L8_ACCESS_REGISTRY.md` | Test accounts + keys |
| L9 Open Gaps | `control/L9_OPEN_GAPS_REGISTER.md` | Consolidated gaps |
| Registry (SSOT) | `control/registry.json` | Single source of truth |
| Generator | `control/gen_dashboard_data.js` | Derive dashboard data |
| Agent Prompt | `control/AGENT_PROMPT.md` | System prompt for agents |
| Code Gate Policy | `control/CODE_GATE_POLICY.md` | Artifact gate rules |
| Maintenance Rules | `control/MAINTENANCE_RULES.md` | When to update what |

## Headline Counts (derived from registry.json)

Run `node control/gen_dashboard_data.js` to regenerate. View at `/__dev/`.
