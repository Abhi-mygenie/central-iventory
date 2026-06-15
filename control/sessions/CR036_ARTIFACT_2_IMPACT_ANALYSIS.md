# CR-036 — Artifact 2: Impact Analysis

> **CR ID:** CR-036
> **Title:** Control Layer Redesign — Role-Based Agent Dispatch System
> **Date:** 2026-06-15
> **Code Reality:** NONE — entirely new infrastructure

---

## 1. Strategic Comparison: POS v0.6 vs Central Inventory Current

| Dimension | POS v0.6 | Central Inventory (Current) | Gap |
|-----------|----------|---------------------------|-----|
| **Agent roles** | 12 specialized roles | 1 role (does everything) | Need 11 roles |
| **Role dispatch** | STEP -1 reads `workflow_queue.json` → auto-picks role | Chat-based — owner instructs in conversation | Need queue + auto-dispatch |
| **Dashboard** | Interactive — stage filter, multi-select, batch send, gate progress, smoke cards, auth | Read-only — 3 tabs (Debt, Bugs, CRs), search, filters, CSV export | Need workflow controls layer |
| **Workflow queue** | `workflow_queue.json` + `workflow.js` + `POST /api/workflow-queue` | Does not exist | Need entire dispatch chain |
| **Gate tracking** | 7 gates per item with ✅⬜🟡🔴 progress bar | 7 artifacts in `artifact_refs` array (status: DONE/MISSING) | Need visual gate mapping |
| **EXIT GATE** | 5-checkbox blocker before handover | No enforcement | Need exit gate per role |
| **Handover** | Structured handover docs in `/app/memory/handover/` | Ad-hoc session docs in `control/sessions/` | Need standardized handover format |
| **Registry schema** | Flat fields: `art1_intake`, `art2_impact`, etc. + `category`, `completeness` | Nested `artifact_refs[]` with `artifact`, `label`, `status`, `paths` | Our schema is richer — KEEP, add gate status helpers |
| **Environment check** | STEP -1.5 conditional (code roles check, doc roles skip) | No formal check | Need conditional env check |
| **Session start** | Read latest handover → read queue → present batches → wait for approval | Read 10 mandatory files | Need STEP -1 + retain mandatory reading per role |
| **Terminology rules** | Backend quirks (misspellings, null values) | Terminology inversion (master↔central) | CI-SPECIFIC — keep as-is |
| **Backend** | Direct frontend → Laravel | Proxy-only FastAPI → POS API | CI-SPECIFIC — keep proxy-only rule |

---

## 2. What We KEEP from Central Inventory (Don't Change)

| Item | Why |
|------|-----|
| `registry.json` schema (nested `artifact_refs`) | Richer than POS flat fields — supports multiple artifact paths per gate |
| `gen_dashboard_data.js` pipeline | Works — generates `__dev/data/*.json` from registry |
| Governance layers L0-L9 | Already comprehensive |
| Terminology inversion rule | Project-specific, critical |
| Proxy-only backend rule | Architecture contract |
| Frozen file list | Already in L7 |
| `control/sessions/` structure | Good — organized by CR/BUG ID |
| Mock preview system (`__dev/previews/`) | Already working |
| `CODE_GATE_POLICY.md` | Merge into new prompt as role-specific gate rules |

## 3. What We ADAPT from POS v0.6

| POS Feature | Central Inventory Adaptation |
|-------------|------------------------------|
| 12 roles | 11 roles (drop RELEASE) |
| `AGENT_PROMPT_ALPHA.md` (1482 lines) | New `AGENT_PROMPT.md` — adapted for CI context, CI rules, CI terminology |
| `workflow.js` (215 lines) | Adapt — same batch/approval/smoke logic, CI-specific gate mapping |
| `workflow_queue.json` schema | Adopt as-is — `batches[]`, `approvals[]`, `smoke_results[]` |
| `dashboard.js` (1777 lines) | Major adaptation — CI dashboard is 332 lines, needs workflow controls added |
| `auth.js` + `access.json` | Adopt — dashboard login gate |
| `server.py` workflow endpoints | Add `POST/GET /api/workflow-queue` to existing CI server.py |
| STEP -1 (session start) | Adopt — read handover + read queue + present batches |
| STEP -1.5 (env check) | Adopt — conditional by role |
| EXIT GATE (5 checkboxes) | Adopt — enforce on IMPLEMENTATION + BUG FIX roles |
| Verification Matrix (planning output) | Adopt — seeds QA handover |
| Handover format | Adopt — `/app/memory/handover/SESSION_HANDOVER_*.md` |

## 4. What We CREATE (New for CI)

| Item | Description |
|------|-------------|
| `/app/memory/handover/` directory | Structured handover storage |
| `/app/memory/evidence/` directory | Evidence storage per item |
| `__dev/data/workflow_queue.json` | Dispatch queue |
| `__dev/data/access.json` | Dashboard auth |
| Updated `__dev/dashboard.js` | Add workflow controls to existing dashboard |
| Updated `__dev/index.html` | Add auth gate + workflow scripts |
| `__dev/workflow.js` | Batch manager |
| `__dev/auth.js` | Dashboard login |

---

## 5. Files Affected

### SCOPE: AGENT_PROMPT.md ONLY

| File | Lines Now | Change | Risk |
|------|:---------:|--------|:----:|
| `control/AGENT_PROMPT.md` | 152 | **FULL REWRITE** → ~800-1000 lines, 11 roles | HIGH — this is the agent's operating system |

### OUT OF SCOPE (separate CR if needed later)
- Dashboard enhancements (workflow controls, auth, batch UI)
- `workflow.js`, `auth.js`, `workflow_queue.json`
- `server.py` workflow endpoints
- `CODE_GATE_POLICY.md` (keep as-is, prompt references it)
- `MAINTENANCE_RULES.md`

### NO CHANGE
- All governance layers (L0-L9)
- All application code
- All `control/sessions/*.md` artifacts
- Dashboard files (`__dev/`)
- `registry.json` schema
- `gen_dashboard_data.js`

---

## 6. CI-Specific Adaptations Needed (POS → Central Inventory)

### 6a. Terminology — POS rules don't apply to CI

| POS Rule | CI Equivalent |
|----------|---------------|
| R9: `'sucess'` misspelling | N/A — CI has no backend misspellings |
| R7: AppProviders.jsx order | N/A — CI doesn't have AppProviders |
| R8: localStorage keys | N/A — CI doesn't depend on localStorage |
| R13: Walk-in is special | N/A — CI has no walk-in concept |
| R5: High-risk files (OrderEntry, CollectPayment) | **REPLACE** with CI high-risk files: `api.js`, `terminology.js`, `screenVisibility.js` |
| R6: Financial logic sacred | **REPLACE** with: Stock arithmetic sacred (Number() wrap, segment ledger truth) |

### 6b. CI-Specific Rules to ADD

| Rule | Content |
|------|---------|
| CI-R1 | Terminology inversion: API `master`=Central, `central`=Master, `franchise`=Outlet. Use `terminology.js` always. |
| CI-R2 | Backend is proxy-only. NEVER add business logic to `server.py`. |
| CI-R3 | `display_qty` is a STRING from POS API. Always `Number()` wrap before arithmetic. |
| CI-R4 | Stock source of truth is segment ledger (`inventory_stock_segments`), not aggregate. |
| CI-R5 | High-risk files: `api.js` (~1144 lines), `terminology.js` (FROZEN), `screenVisibility.js` (FROZEN). |
| CI-R6 | Cache layer in `api.js` — write endpoints MUST call invalidation. |
| CI-R7 | Never hand-edit `__dev/data/*.json`. Edit `registry.json` → run `gen_dashboard_data.js`. |

### 6c. Gate Mapping — POS 7-gate vs CI 7-artifact

| POS Gate | CI Equivalent | Notes |
|----------|---------------|-------|
| Intake | Artifact 0 (Session-Start) + Artifact 1 (Intake) | CI has 2 artifacts where POS has 1 |
| Impact Analysis | Artifact 2 | Same |
| Implementation Plan | Artifact 3 | Same |
| Gate 4 (Owner GO) | Artifact 4 (Code-Gate) | Same — owner approval |
| Code (Implementation) | Between 4→5 | CI doesn't have a separate artifact — add self-test output |
| QA | Artifact 5 (QA Report) | Same |
| Smoke (Owner Verify) | Artifact 6 (Owner Signoff) | Same |

**Decision needed:** Should we keep CI's 7-artifact numbering (0-6) or switch to POS's 7-gate numbering?

---

## 7. Risk Assessment

| Risk | Severity | Mitigation |
|------|:--------:|------------|
| AGENT_PROMPT rewrite breaks existing agent behavior | HIGH | Test with a single CR after rewrite, validate all roles boot correctly |
| Dashboard rewrite breaks existing data display | MEDIUM | Keep existing tabs (Debt, Bugs, CRs) intact — ADD workflow controls as new tab/section |
| server.py workflow endpoint interferes with proxy | LOW | Additive — separate route prefix, no conflict with `/api/proxy/*` |
| Existing sessions artifacts become orphaned | NONE | No rename — existing paths stay valid |
| Registry schema mismatch with POS dashboard code | LOW | Keep CI schema, adapt dashboard JS to read CI's `artifact_refs` format |

---

## 8. Execution Estimate

| Component | Effort |
|-----------|:------:|
| AGENT_PROMPT.md (11 roles, CI-specific rules, boot sequences, handover templates) | 3-4 hours |
| Self-review + validation against existing artifacts | 30 min |
| **Total** | **~4 hours** |

---

## 9. QUESTIONS FOR OWNER

### Q1: Gate Numbering in the Prompt
CI currently uses Artifacts 0-6. POS uses Gates 1-7 (Intake → Impact → Plan → Gate4 → Code → QA → Smoke). The prompt needs to reference gates consistently.

**(a)** Keep CI's 0-6 artifact numbering in the prompt
**(b)** Switch to POS-style gate names — more descriptive, role-aligned

### Q2: Handover Format
POS mandates a 4-line header in every session handover. CI currently has no standard.

**(a)** Adopt structured handover template (stored in `control/sessions/SESSION_HANDOVER_*.md`)
**(b)** Keep current freeform session docs — just add role + status fields

### Q3: EXIT GATE Enforcement
POS blocks handover creation until 5 checkboxes pass (registry sync, file ownership, code markers, compile check, tracker update). Should the CI prompt enforce this?

**(a)** Yes — mandatory EXIT GATE for IMPLEMENTATION + BUG FIX roles
**(b)** Lighter — recommend but don't block

### Q4: Code Markers
POS requires `// CR-XXX` or `// BUG-XXX` comments in every modified file. This enables registry-to-code cross-checking during audit. Should CI adopt this?

**(a)** Yes — mandatory code markers
**(b)** No — CI codebase doesn't use them currently, too disruptive to add

### Q5: STEP -1 (Session Start) Without Dashboard
The dispatch system (dashboard + workflow queue) is out of scope for now. How should STEP -1 work without it?

**(a)** Agent reads latest session handover + `L1_CONTROL_DASHBOARD.md` + presents "where we left off" — owner picks role manually in chat
**(b)** Agent reads `registry.json` directly, finds items at each gate stage, presents options — owner picks role + items in chat
**(c)** Skip STEP -1 entirely until dashboard dispatch is built — roles are assigned by owner in chat as today

### Q6: Scope of Each Role's Mandatory Reading
POS has minimal boot reading per role (2-5 files). CI currently requires 10 files for ALL agents. Should we:

**(a)** Role-specific reading lists (INTAKE reads 4 files, PLANNING reads 5, IMPLEMENTATION reads 3, etc.)
**(b)** Keep universal 10-file reading for all roles

---

*Awaiting owner answers on Q1-Q6 before proceeding to Implementation Plan.*
