# L2 — Handover Protocol (Agent Onboarding)

> **Updated:** 2026-06-01 (Sprint A+B+C implementation complete)

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
8. **`control/sessions/INTELLIGENT_UI_FREEZE_PHASE_7_FINAL_FREEZE.md`** — frozen implementation spec
9. **`control/sessions/ui_review/UI_UX_FINAL_DESIGN_REVIEW_REPORT.md`** — UI/UX review findings

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

### PO Number Format

Transfers use `formatPO(id)` from `lib/formatters.js` which converts transfer ID to `PO-XXXX` format (last 4 digits, zero-padded). Example: transfer #129 → PO-0129. This is a temporary frontend-only identifier until backend implements G-013 (real PO numbers).

### Intelligence Layer (Sprint A+B+C)

All intelligence is **frontend-computed** from existing API data. No backend changes were made. Key patterns:
- `useStockIntelligence.js` — shared hook for stock health, stale approvals, activity
- `StockIntelligenceBar.jsx` — reusable 6-metric health strip
- `FulfillmentVerdict.jsx` — can/partial/can't fulfill badge
- Age badges — red (>72h stale), amber (24-72h aging), gray (fresh)
- Impact previews — stock before/after projections in forms

### API Data Quirk

POS API returns `display_qty` as a **string**, not a number. Always wrap in `Number()` before arithmetic operations. This caused BUG-016 during Sprint C.

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
| Current branch | `10-may` (deployed from GitHub) |
| Previous branch | `31_5_26` |
| Repo | `Abhi-mygenie/central-iventory` |
| Deploy URL | `https://deploy-workflow-14.preview.emergentagent.com` |
