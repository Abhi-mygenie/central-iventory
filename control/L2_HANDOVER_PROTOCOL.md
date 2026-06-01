# L2 — Handover Protocol (Agent Onboarding)

> **Rule:** Updated on every branch change or credential rotation.

---

## Mandatory Reading Order

A new agent MUST read these in order before writing any code:

1. **This file** — orientation
2. **`control/AGENT_PROMPT.md`** — system prompt with project rules
3. **`control/L0_BASELINE_INDEX.md`** — what's frozen and cannot be changed
4. **`control/L8_ACCESS_REGISTRY.md`** — test accounts and credentials
5. **`control/L5_ENV_CONFIG_REGISTRY.md`** — environment setup
6. **`control/L6_SPRINT_STATUS.md`** — what's active, what to work on
7. **`control/CODE_GATE_POLICY.md`** — artifact requirements before coding

## Critical Architecture Facts

### The Terminology Inversion (READ THIS)

The backend API uses terminology that is the **exact inverse** of business terminology:

| What the UI displays | What the API returns | Hierarchy Level |
|---------------------|---------------------|:---------------:|
| **Central Store** | `restaurant_type: "master"` | TOP |
| **Master Store** | `restaurant_type: "central"` | MIDDLE |
| **Outlet** | `restaurant_type: "franchise"` | BOTTOM |

The frontend has a mandatory mapping layer at `frontend/src/lib/terminology.js`. **NEVER display raw API terms in the UI.**

### Backend is a Proxy

`backend/server.py` (177 lines) is a pass-through proxy to `preprod.mygenie.online`. It contains:
- Login proxy with POS profile enrichment
- Generic V2 catch-all (`/api/proxy/v2/{path}`)
- Zero business logic

### Governance Discipline

Every CR or BUG follows the **7-Artifact Closure Model** (see `CODE_GATE_POLICY.md`):
```
0 Session-Start → 1 Intake → 2 Impact Analysis → 3 Impl Plan →
4 Code-Gate → 5 QA Report → 6 Owner Signoff
```

Before coding, fill `control/sessions/SESSION_START_TEMPLATE.md` (Artifact #0).

## Branch Info

| Field | Value |
|-------|-------|
| Current branch | `31_5_26` |
| Previous branch | `29_5_26_1` |
| Repo | `parth-mygenie/central_inventory` |
