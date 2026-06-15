# CR-036 — Artifact 3: Implementation Plan

> **CR ID:** CR-036
> **Title:** Control Layer Redesign — Agent Prompt Rewrite
> **Date:** 2026-06-15
> **Role:** PLANNING
> **Prerequisite:** Artifact 2 (Impact Analysis) — DONE. Owner answers Q1-Q6 — RECEIVED.
> **Scope:** ONE FILE — `control/AGENT_PROMPT.md` (152 lines → ~900-1100 lines)

---

## 0. Owner Decisions (Locked)

| Q# | Decision | Value |
|----|----------|-------|
| Q1 | Gate numbering | **(b)** POS-style gate names: Intake → Impact Analysis → Plan → Gate 4 → Code → QA → Smoke |
| Q2 | Handover format | **(a)** Structured template with mandatory header fields |
| Q3 | EXIT GATE | **(a)** Mandatory for IMPLEMENTATION + BUG FIX — blocks handover |
| Q4 | Code markers | **(a)** Mandatory `// CR-XXX` / `// BUG-XXX` in every modified file |
| Q5 | STEP -1 | **(c)** Skip until dashboard dispatch CR — owner assigns role in chat |
| Q6 | Reading lists | **(a)** Role-specific (3-5 files per role, not universal 10) |
| +  | Role-first flow | Agent asks role FIRST. INTAKE never checks batch/queue. |

---

## 1. Document Architecture — New AGENT_PROMPT.md

The new prompt is organized into **4 layers**: Identity → Boot → Roles → Shared Infrastructure.

```
┌─────────────────────────────────────────────────┐
│  §1  IDENTITY                        (~30 lines)│
│  §2  STEP 0: ROLE SELECTION          (~40 lines)│
│  §3  STEP 0.5: ENVIRONMENT CHECK     (~30 lines)│
│  §4  GATE SYSTEM                     (~30 lines)│
│  §5  CI-SPECIFIC RULES               (~40 lines)│
│  §6  ROLE 1: INTAKE                  (~80 lines)│
│  §7  ROLE 2: PLANNING                (~90 lines)│
│  §8  ROLE 3: IMPLEMENTATION          (~100 lines)│
│  §9  ROLE 4: QA                      (~60 lines)│
│  §10 ROLE 5: BUG FIX                 (~60 lines)│
│  §11 ROLE 6: INVESTIGATION           (~50 lines)│
│  §12 ROLE 7: DEPLOYMENT              (~40 lines)│
│  §13 ROLE 8: SMOKE FACILITATOR       (~50 lines)│
│  §14 ROLE 9: REGRESSION              (~50 lines)│
│  §15 ROLE 10: PRE-RELEASE AUDIT      (~50 lines)│
│  §16 ROLE 11: CLOSURE                (~60 lines)│
│  §17 SHARED RULES (ALL ROLES)        (~50 lines)│
│  §18 EXIT GATE                       (~30 lines)│
│  §19 HANDOVER TEMPLATE               (~30 lines)│
│  §20 GOVERNANCE UPDATE CHECKLIST     (~20 lines)│
│  §21 KEY FILES                       (~25 lines)│
│  §22 TEST ACCOUNTS                   (~15 lines)│
│  §23 COMMANDS                        (~10 lines)│
└─────────────────────────────────────────────────┘
                              TOTAL: ~940 lines est.
```

---

## 2. Section-by-Section Content Specification

### §1 IDENTITY (~30 lines)

**Source:** Adapt from current `AGENT_PROMPT.md` lines 1-22 + POS IDENTITY block.

**Content:**
- Project name: Central Inventory
- Tech stack: React 19 + Craco + Tailwind + Radix UI (shadcn). Backend: proxy-only FastAPI. POS API: `preprod.mygenie.online`.
- The "you are NOT a greenfield builder" paragraph (from POS — adapt for CI)
- The terminology inversion table (carry over verbatim from current prompt lines 14-21):

```
| UI Label       | API Value   | Level  |
|----------------|-------------|:------:|
| Central Store  | master      | TOP    |
| Master Store   | central     | MIDDLE |
| Outlet         | franchise   | BOTTOM |
```

- One-liner: "Use `terminology.js` for ALL display. Never show raw API terms."

**What changes from current prompt:** Add the "active codebase" framing from POS. Remove "Current State" table (moves to L1). Remove "Immediate Work Items" (stale — belongs in L6).

---

### §2 STEP 0: ROLE SELECTION (~40 lines)

**Source:** New — adapted from POS STEP 0, but with role-first flow per owner's additional instruction.

**Content:**

```
## STEP 0: WHAT IS YOUR ROLE THIS SESSION?

Owner declares ONE role. This determines your boot reading, allowed actions,
outputs, and what you skip.

| #  | Role              | When You're Called                    | One-liner                                              |
|----|-------------------|--------------------------------------|--------------------------------------------------------|
| 1  | INTAKE            | Owner reports new issue/feature       | Register bugs/CRs. Classify, evidence, blast radius.  |
| 2  | PLANNING          | Registered item needs Gates 2-3      | Impact Analysis + Implementation Plan. No code.        |
| 3  | IMPLEMENTATION    | Plan approved (Gate 4 GO)            | Code from approved plans. Self-test. EXIT GATE.        |
| 4  | QA                | Implementation complete              | Execute test cases. Report pass/fail. No code.         |
| 5  | BUG FIX           | QA reports failures                  | Fix specific failures. Reproduce first. EXIT GATE.     |
| 6  | INVESTIGATION     | Issue needs root cause analysis      | Curl-probe, trace data, identify cause. No code.       |
| 7  | DEPLOYMENT        | Environment setup needed             | Clone, configure, verify services.                     |
| 8  | SMOKE FACILITATOR | Items ready for owner testing        | Present items to owner. Capture PASS/FAIL.             |
| 9  | REGRESSION        | All items passed smoke               | Cross-item interaction testing.                        |
| 10 | PRE-RELEASE AUDIT | Regression clean                     | Performance, security, code quality, registry check.   |
| 11 | CLOSURE           | Audit clean                          | Verify artifacts, update registries, reconciliation.   |

After owner declares role → jump to the matching ROLE section below.
Follow ONLY that role's boot sequence.
```

**Key difference from POS:** POS has STEP -1 that reads batch queue and auto-picks role. Per Q5=c and the additional instruction, we **skip queue reading entirely**. Owner states the role. No batch mechanism until dashboard dispatch CR lands.

**INTAKE special case:** INTAKE never needs batch/queue context. It creates new items — it doesn't process existing pipeline items. This is baked in by the role-first flow (no queue check happens at all).

**Future hook (comment in prompt):**
```
<!-- FUTURE: When dashboard dispatch CR lands, add STEP -1 here:
     read workflow_queue.json → present batches → owner approves →
     auto-pick role from batch stage. INTAKE still skips batch. -->
```

---

### §3 STEP 0.5: ENVIRONMENT CHECK (~30 lines)

**Source:** Adapt from POS STEP -1.5 verbatim, rename to STEP 0.5.

**Content:**

```
## STEP 0.5: ENVIRONMENT CHECK (after role is picked)

ROLES THAT NEED LIVE APP: IMPLEMENTATION, QA, BUG FIX, DEPLOYMENT,
                          SMOKE, REGRESSION, PRE-RELEASE AUDIT
  → Check:
    1. Frontend compiles: tail -5 /var/log/supervisor/frontend.out.log → "Compiled"
    2. Backend responds: curl -s <PREVIEW_URL>/api/ → expect {"message":"Central Inventory API Proxy"}
    3. Login works: curl test credentials → expect token
  → If ANY fail: offer DEPLOYMENT role switch or owner-fix.

ROLES THAT DON'T NEED LIVE APP: INTAKE, PLANNING, CLOSURE
  → Skip entirely. Only need file system access.

INVESTIGATION (partial):
  → Check POS API reachable: curl preprod.mygenie.online/api/v2/...
  → Don't need local frontend/backend.
```

---

### §4 GATE SYSTEM (~30 lines)

**Source:** New — combines POS gate names (Q1=b) with CI's artifact path conventions.

**Content:**

```
## GATE SYSTEM

Every CR and BUG follows this 7-gate pipeline:

| Gate | Name               | Who               | Artifact Path                                       |
|:----:|--------------------|--------------------|-----------------------------------------------------|
|  1   | Intake             | INTAKE agent       | control/sessions/<ID>_ARTIFACT_1_INTAKE.md           |
|  2   | Impact Analysis    | PLANNING agent     | control/sessions/<ID>_ARTIFACT_2_IMPACT_ANALYSIS.md  |
|  3   | Implementation Plan| PLANNING agent     | control/sessions/<ID>_ARTIFACT_3_IMPLEMENTATION_PLAN.md |
|  4   | Gate 4 (Owner GO)  | Owner (in chat)    | control/sessions/<ID>_ARTIFACT_4_CODE_GATE.md        |
|  5   | Code               | IMPLEMENTATION agent | (code changes + self-test output)                  |
|  6   | QA                 | QA agent           | control/sessions/<ID>_ARTIFACT_5_QA_REPORT.md        |
|  7   | Smoke              | SMOKE FACILITATOR  | control/sessions/<ID>_ARTIFACT_6_OWNER_SIGNOFF.md    |

Session-Start doc (Artifact 0) is ALWAYS created before Gate 1:
  control/sessions/<ID>_SESSION_START.md

Mandatory vs. Waivable rules: see control/CODE_GATE_POLICY.md
```

**Note:** Keep Artifact 0 (Session-Start) as a pre-gate doc, not a numbered gate. Gates 1-7 align with the POS model. File naming keeps `ARTIFACT_N` convention for backward compatibility with existing artifacts.

---

### §5 CI-SPECIFIC RULES (~40 lines)

**Source:** Impact Analysis §6b (CI-R1 through CI-R7) + current prompt "Rules You Must Not Break" (lines 86-94).

**Content — 7 rules, verbatim from Impact Analysis with minor formatting:**

```
## CI-SPECIFIC RULES — ALL ROLES MUST KNOW

CI-R1  TERMINOLOGY INVERSION
       API `master` = Central (TOP). API `central` = Master (MID). API `franchise` = Outlet (BOTTOM).
       ALWAYS use `frontend/src/lib/terminology.js`. Never raw API terms in UI.

CI-R2  BACKEND IS PROXY-ONLY
       `server.py` forwards to preprod.mygenie.online. NEVER add business logic.

CI-R3  display_qty IS A STRING
       POS API returns display_qty as string. ALWAYS Number() wrap before arithmetic.

CI-R4  STOCK SOURCE OF TRUTH
       Segment ledger (inventory_stock_segments), not aggregate. Never trust top-level qty.

CI-R5  HIGH-RISK FILES
       api.js (~1144 lines), terminology.js (FROZEN), screenVisibility.js (FROZEN).
       Extra caution: view before editing, verify line numbers, check cache invalidation.

CI-R6  CACHE LAYER
       api.js has _cached() with TTL + in-flight dedup. Write endpoints MUST call invalidation.
       Never bypass cache for reads. Never skip invalidation for writes.

CI-R7  DASHBOARD DATA PIPELINE
       Never hand-edit __dev/data/*.json. Edit registry.json → run gen_dashboard_data.js.
```

---

### §6 ROLE 1: INTAKE (~80 lines)

**Source:** Adapt POS ROLE 1 (lines 142-245) for CI context.

**Structure:** Boot → Do (4 steps) → Output → Handover → Skip

**Boot reading list (Q6=a — role-specific, 4 files):**
```
READ:
  1. control/L1_CONTROL_DASHBOARD.md     → current project state
  2. control/L3_CR_REGISTRY.md           → check CR duplicates
  3. control/L4_BUG_TRACKER.md           → check BUG duplicates
  4. memory/test_credentials.md          → quick-ref logins
```

**Do steps (adapt from POS):**
- Step 0a: Code Reality Check — `grep -rn "<keyword>" frontend/src/ --include="*.js" --include="*.jsx"`
- Step 0b: Duplicate Detection — search registry.json + L3 + L4 for keywords. Classification: DUPLICATE / RELATED / DISTINCT.
- Step 1: Classify + Severity — POS severity rubric (P0-P3) adapted: replace "money loss" with "stock data corruption", replace "order loss" with "transfer/production data loss"
- Step 2: Evidence Capture — storage at `memory/evidence/<ID>/`. Intake doc must include screenshot path, repro steps, curl output, source, confidence.
- Step 3: Blast Radius — quick grep + file count
- Step 4: Register — create intake doc at `control/sessions/<ID>_ARTIFACT_1_INTAKE.md`, register in `registry.json`, update L3/L4

**Output:** Intake doc, registry entry, L3/L4 updated. Code reality + duplicate check + blast radius in doc.

**Handover format:**
```
"Item <ID> registered. Intake at <path>.
 Code reality: NONE | PARTIAL | FULL.
 Duplicate check: DISTINCT | RELATED to <ID> | DUPLICATE of <ID>.
 Severity: <P0-P3>.
 Blast radius: <SMALL/MEDIUM/LARGE>.
 Next: PLANNING agent for Gates 2-3."
```

**Skip:** Frozen baseline reading, file ownership, sprint status (unless duplicate check), all coding.

---

### §7 ROLE 2: PLANNING (~90 lines)

**Source:** Adapt POS ROLE 2 (lines 248-353) for CI context.

**Boot reading list (5 files):**
```
READ:
  1. control/L1_CONTROL_DASHBOARD.md              → current state
  2. Intake doc(s) for assigned item(s)            → what you're planning
  3. control/L7_FILE_OWNERSHIP.md                  → frozen files, conflict zones
  4. control/L9_OPEN_GAPS_REGISTER.md              → backend gaps that block frontend
  5. Relevant source code (trace the feature/bug)  → code reality
```

**Do steps:**
- Stage dispatch: owner states "Impact Analysis", "Implementation Plan", or "both". Execute only what's requested.
- Step 0: Code Reality Check (mandatory)
- Step 1: Conflict Pre-Check — L7 last modifier, registry.json for overlapping items
- Step 2: Gate 2 — Impact Analysis (trace data flow, affected files, risks, owner decisions, curl-probe)
- Step 3: Gate 3 — Implementation Plan (exact edits with file:line, verification steps, risk register, execution sequence, scope lock)
- Step 4: Verification Matrix (NEW — seeds QA):

```
| Edit # | File | Change | How to Verify | Automated? |
|--------|------|--------|---------------|:---:|
```

- Step 5: Post-Code Registry Checklist (for IMPLEMENTATION agent to execute after coding):

```
- [ ] registry.json: <ID> → status updated
- [ ] L3/L4: row updated
- [ ] L7: files added
- [ ] Code markers: // <ID> in every modified file
```

**Output:** Impact Analysis doc + Implementation Plan doc (with Verification Matrix + Registry Checklist). Owner Decision Queue if unresolved questions.

**Handover:**
```
"Plan ready at <path>. <N> edits across <N> files.
 Code reality: <NONE|PARTIAL|FULL>.
 Scope lock: <files WILL change> / <files will NOT touch>.
 Verification matrix: <N> checks.
 Owner decisions needed: <list or none>.
 Awaiting Gate 4 GO."
```

**Skip:** Intake (done), all coding, QA.

---

### §8 ROLE 3: IMPLEMENTATION (~100 lines)

**Source:** Adapt POS ROLE 3 (lines 356-427) for CI context.

**Boot reading list (4 files):**
```
READ:
  1. control/L1_CONTROL_DASHBOARD.md
  2. Latest SESSION_HANDOVER_*.md in control/sessions/
  3. Implementation Plan doc(s) for assigned item(s)
  4. control/L7_FILE_OWNERSHIP.md → conflict check
  + Verify environment (STEP 0.5)
```

**Do steps:**
- Step 0: Entry Verification — for each edit in plan, verify file:line still matches. If stale → STOP, return to PLANNING.
- Step 1: Execute edits from plan, edit-by-edit. No improvisation (scope-locked).
- Step 2: Checkpoint after every file group (3+ files):
```
✅ api.js — cache invalidation added (lines 997-1010)
✅ PendingQueues.jsx — column updated
⬜ TransferDetail.jsx — not started
```
- Step 3: Self-Verification — execute Verification Matrix from plan. Run tests. Take screenshot for browser-verifiable items.
- Step 4: EXIT GATE (mandatory — see §18). All 5 checks must pass before handover.
- Step 5: Write QA Handover doc — test cases derived from Verification Matrix.

**Code Markers (Q4=a — mandatory):**
```
Every modified file gets a comment at the top of the changed block:
  // CR-036 — <brief description of change>
  // BUG-019 — <brief description of fix>
```

**Output:** Code changes, QA handover doc, session handover doc, updated registries.

**Skip:** Intake, Impact Analysis (done). Scope changes (ask owner first).

---

### §9 ROLE 4: QA (~60 lines)

**Source:** POS ROLE 4 concept, adapted for CI.

**Boot reading list (4 files):**
```
READ:
  1. control/L1_CONTROL_DASHBOARD.md
  2. QA Handover doc from IMPLEMENTATION agent
  3. Implementation Plan doc (for Verification Matrix)
  4. memory/test_credentials.md
  + Verify environment (STEP 0.5)
```

**Do:**
- Execute test cases from QA handover, one by one
- For each: record PASS / FAIL with evidence (screenshot, curl output, or test log)
- Do NOT fix code. If failure found → document and hand to BUG FIX.
- Regression spot-check: verify 2-3 adjacent features still work (e.g., if transfer detail changed, check pending queues still load)

**Output:** QA Report at `control/sessions/<ID>_ARTIFACT_5_QA_REPORT.md`

**Handover:**
```
"QA complete: <N>/<M> tests PASS.
 Failures: <list with evidence paths>.
 Next: SMOKE FACILITATOR (if all pass) or BUG FIX (if failures)."
```

**Skip:** All coding. Intake. Planning.

---

### §10 ROLE 5: BUG FIX (~60 lines)

**Source:** POS ROLE 5 concept, adapted for CI.

**Boot reading list (4 files):**
```
READ:
  1. QA Report (the failures to fix)
  2. Implementation Plan (understand original intent)
  3. control/L7_FILE_OWNERSHIP.md
  4. memory/test_credentials.md
  + Verify environment (STEP 0.5)
```

**Do:**
- Step 0: Reproduce FIRST — never fix blind. Curl-probe or browser-verify each failure.
- Step 1: Root cause analysis — trace from symptom to cause.
- Step 2: Fix — minimal change, scoped to the reported failure. No scope creep.
- Step 3: Re-test the specific QA case that failed.
- Step 4: EXIT GATE (mandatory — see §18).

**Output:** Fixed code, updated QA report (re-test results), session handover.

**Skip:** New features. Scope expansion. Intake/Planning.

---

### §11 ROLE 6: INVESTIGATION (~50 lines)

**Source:** POS ROLE 6 concept.

**Boot reading list (3 files):**
```
READ:
  1. control/L1_CONTROL_DASHBOARD.md
  2. Item intake doc (what's being investigated)
  3. control/L9_OPEN_GAPS_REGISTER.md → known backend gaps
```

**Do:**
- Curl-probe POS API endpoints involved
- Trace data flow: API response → transform → component → UI
- Identify root cause: frontend bug, backend gap, data issue, or API contract mismatch
- Document findings with curl evidence

**Output:** Investigation report. Filed as backend gap (in L9) if cause is API-side.

**No code.** Investigation informs PLANNING or BUG FIX — it doesn't implement.

---

### §12 ROLE 7: DEPLOYMENT (~40 lines)

**Source:** POS ROLE 7 concept.

**Boot reading list (3 files):**
```
READ:
  1. control/L5_ENV_CONFIG_REGISTRY.md
  2. control/L2_HANDOVER_PROTOCOL.md
  3. backend/.env + frontend/.env
```

**Do:**
- Clone repo, checkout correct branch
- Install dependencies: `pip install -r requirements.txt`, `yarn install`
- Verify: supervisor start backend + frontend, check compilation, curl health check
- Verify MongoDB running
- Seed data if needed (run `seed_data.py`, `seed_stock.py`, `seed_chocolatehut.py`)

**Output:** Environment running. L5 updated if config changed.

---

### §13 ROLE 8: SMOKE FACILITATOR (~50 lines)

**Source:** POS ROLE 8 concept, adapted for CI.

**Boot reading list (3 files):**
```
READ:
  1. control/L1_CONTROL_DASHBOARD.md
  2. QA Report(s) for items to smoke
  3. memory/test_credentials.md
  + Verify environment (STEP 0.5)
```

**Do:**
- Present each item to owner with:
  - What changed (1-2 sentences)
  - How to verify (specific steps)
  - Which account to login with
- For each item, capture owner's verdict: PASS / FAIL / DEFER
- If FAIL: capture owner's feedback (what's wrong, screenshot if possible)

**Output:** Smoke results in `control/sessions/<ID>_ARTIFACT_6_OWNER_SIGNOFF.md`. Registry updated.

---

### §14 ROLE 9: REGRESSION (~50 lines)

**Source:** POS ROLE 9 concept.

**Boot reading list (4 files):**
```
READ:
  1. control/L1_CONTROL_DASHBOARD.md
  2. All QA Reports for current sprint items
  3. control/L7_FILE_OWNERSHIP.md → shared files
  4. memory/test_credentials.md
  + Verify environment (STEP 0.5)
```

**Do:**
- Identify cross-item interactions (items that touched same files)
- Test interaction scenarios: e.g., if CR-030 changed `api.js` and CR-026 also changed `api.js`, test both flows together
- Test with all 3 hierarchy levels (Central 806, Master 807, Outlet 809)
- Document any inter-feature bugs

**Output:** Regression report. New BUG IDs registered if issues found.

---

### §15 ROLE 10: PRE-RELEASE AUDIT (~50 lines)

**Source:** POS ROLE 10 concept, adapted for CI.

**Boot reading list (4 files):**
```
READ:
  1. control/registry.json → completeness check
  2. control/L7_FILE_OWNERSHIP.md → orphaned files
  3. control/L9_OPEN_GAPS_REGISTER.md → unresolved gaps
  4. control/L6_SPRINT_STATUS.md → sprint scope
```

**Do:**
- Registry integrity: all items have complete artifact chains, no MISSING artifacts for CLOSED items
- Code markers audit: grep for `// CR-XXX` / `// BUG-XXX` in codebase, cross-ref with registry
- Dashboard data drift: `node control/gen_dashboard_data.js --check`
- File ownership: all modified files in L7
- Console warnings: check frontend compile output for new warnings
- Performance: check for obvious N+1 patterns, large re-renders

**Output:** Audit report with PASS/FAIL per check. Blockers listed.

---

### §16 ROLE 11: CLOSURE (~60 lines)

**Source:** POS ROLE 11 concept, adapted for CI.

**Boot reading list (4 files):**
```
READ:
  1. control/registry.json
  2. control/L3_CR_REGISTRY.md + control/L4_BUG_TRACKER.md
  3. control/L6_SPRINT_STATUS.md
  4. Pre-Release Audit report (if exists)
```

**Do — Phase A (Normal Closure):**
- Verify all 7 gates have artifacts for each item being closed
- Update registry.json: status → "CLOSED — OWNER VERIFIED"
- Update L3/L4, L6, L1
- Run `node control/gen_dashboard_data.js`
- Verify with `--check`

**Do — Phase B (Retroactive Registration):**
- For items that were coded without proper registration (Code Reality = FULL)
- Create retroactive intake + impact analysis docs from existing code
- Register in registry.json with appropriate waiver annotations

**Output:** Updated registry, governance layers, dashboard data. Sprint reconciliation if sprint closing.

---

### §17 SHARED RULES — ALL ROLES (~50 lines)

**Source:** Merge POS shared rules (lines 436-449) with CI-specific rules (§5). Drop POS-only rules.

**Rules to include:**

```
R0   NO WORK WITHOUT ID — Every code change ties to a registered CR-XXX or BUG-XXX.
R1   CODE IS TRUTH — If doc says X but code says Y, code wins. Flag the stale doc.
R2   FROZEN FILES — Never edit without owner approval. Check L7 first.
R3   DON'T INVENT POLICY — When uncertain about business rules, ASK owner. Never guess.
R4   GATE SEQUENCE — Follow gates in order. Don't skip Impact Analysis to start coding.
R5   HIGH-RISK FILES — api.js, terminology.js, screenVisibility.js. Extra caution.
R6   STOCK ARITHMETIC IS SACRED — Number() wrap display_qty. Segment ledger is truth.
R7   SCOPE-LOCK — IMPLEMENTATION follows the plan. No improvisation, no bonus features.
R8   YARN ONLY — Never npm. yarn add, yarn install.
R9   CURL-PROBE BEFORE WIRING — Test API endpoints with curl before writing frontend integration.
R10  CODE MARKERS — // CR-XXX or // BUG-XXX in every modified file (mandatory per Q4).
R11  REGISTRY SYNC — After every status change: edit registry.json → run gen_dashboard_data.js → verify with --check.
```

**POS rules DROPPED (from Impact Analysis §6a):**
- R7 (AppProviders order) — N/A
- R8 (localStorage keys) — N/A
- R9 (sucess misspelling) — N/A
- R13 (Walk-in special) — N/A

---

### §18 EXIT GATE (~30 lines)

**Source:** POS EXIT GATE (lines 406-416), mandatory per Q3=a.

**Applies to:** IMPLEMENTATION + BUG FIX roles ONLY.

```
## EXIT GATE (MANDATORY — blocks handover creation)

Do NOT write SESSION_HANDOVER until ALL 5 checks pass:

□ 1. REGISTRY SYNC
     registry.json updated: item status, artifact_refs, sprint_key.
     Run: node control/gen_dashboard_data.js --check → PASS

□ 2. TRACKER UPDATED
     control/L3_CR_REGISTRY.md or control/L4_BUG_TRACKER.md: row reflects new status.

□ 3. FILE OWNERSHIP
     control/L7_FILE_OWNERSHIP.md: every file created or modified is listed.

□ 4. CODE MARKERS
     Every modified file contains // CR-XXX or // BUG-XXX comment.
     Verify: grep -rn "// CR-XXX\|// BUG-XXX" frontend/src/ (replace XXX with actual ID)

□ 5. COMPILE CHECK
     tail -5 /var/log/supervisor/frontend.out.log → "Compiled" with 0 NEW warnings.
     (Pre-existing warnings are acceptable. New warnings from your changes are not.)

If ANY checkbox fails → fix it before creating handover. No exceptions.
```

---

### §19 HANDOVER TEMPLATE (~30 lines)

**Source:** New — structured template per Q2=a.

```
## SESSION HANDOVER TEMPLATE

Every session ends with a handover doc. Use this template:

Path: control/sessions/SESSION_HANDOVER_<YYYYMMDD>_<SEQ>.md

---
# SESSION HANDOVER — <YYYY-MM-DD>

> **Agent Role:** <role name>
> **Items Worked:** <ID list>
> **Registry Synced:** YES / NO
> **Scope Drift:** NONE / <description>

## What Was Done
<Bullet list of completed work>

## What Was NOT Done (and why)
<Deferred items, blockers>

## State of Each Item
| ID | Gate Before | Gate After | Notes |
|----|-------------|------------|-------|

## Next Agent Should
<Specific instructions for the next agent — role, items, context>

## Files Created/Modified
| File | Change |
|------|--------|
---
```

---

### §20 GOVERNANCE UPDATE CHECKLIST (~20 lines)

**Source:** Current prompt lines 98-108. Carry over verbatim.

```
## AFTER EVERY STATUS CHANGE — Governance Updates

1. Edit control/registry.json — update item status + artifact_refs
2. Run:  node control/gen_dashboard_data.js
3. Verify: node control/gen_dashboard_data.js --check
4. Update control/L1_CONTROL_DASHBOARD.md if sprint state changed
5. Update control/L6_SPRINT_STATUS.md if items moved
6. Update control/L9_OPEN_GAPS_REGISTER.md if gaps resolved
7. Update control/L7_FILE_OWNERSHIP.md if new files created/frozen
8. Update control/L3_CR_REGISTRY.md or L4_BUG_TRACKER.md
```

---

### §21 KEY FILES (~25 lines)

**Source:** Current prompt lines 124-137. Carry over, update line counts.

```
| File | Purpose | Frozen? |
|------|---------|:-------:|
| control/registry.json | All CRs + BUGs — SSOT | Edit carefully |
| control/gen_dashboard_data.js | Regenerates dashboard data | No |
| frontend/src/services/api.js | ~1144 API methods + cache layer | No (HIGH-RISK) |
| frontend/src/lib/terminology.js | Terminology inversion mapping | **YES** |
| frontend/src/lib/screenVisibility.js | Role-based access + nav gates | **YES** |
| frontend/src/lib/formatters.js | Date/number/PO formatting | No |
| frontend/src/App.js | Routes + auth guards | No |
| frontend/src/hooks/useLoginContext.js | Auth context + restaurant type | No |
| backend/server.py | Proxy layer — DO NOT ADD LOGIC | **YES** (by policy) |
| control/AGENT_PROMPT.md | This file — agent operating system | Requires owner approval |
| control/CODE_GATE_POLICY.md | Gate mandatory/waivable rules | Requires owner approval |
```

---

### §22 TEST ACCOUNTS (~15 lines)

**Source:** Current prompt lines 112-120.

```
## TEST ACCOUNTS (Primary — Restaurant 806 Hierarchy)

| Role | Email | Password | RID |
|------|-------|----------|:---:|
| Central Store (TOP) | manager@germanfluid.com | Qplazm@10 | 806 |
| Master Store (MID) | manager@centralkitchenalpha.com | Qplazm@10 | 807 |
| Outlet (BOTTOM) | manager@outletdirectone.com | Qplazm@10 | 809 |

Chai hierarchy (secondary):
| Central | owner@chai.com | Qplazm@10 | 813 |

Full list: control/L8_ACCESS_REGISTRY.md + memory/test_credentials.md
```

---

### §23 COMMANDS (~10 lines)

**Source:** Current prompt lines 140-151.

```
## COMMANDS

# Regenerate dashboard data (after registry.json edits)
node control/gen_dashboard_data.js

# Drift check (must pass before committing / handover)
node control/gen_dashboard_data.js --check

# View dev dashboard
Navigate to: /__dev/index.html
```

---

## 3. What Gets Removed from Current Prompt

| Current Section | Lines | Action | Reason |
|-----------------|:-----:|--------|--------|
| "Current State" table | 47-57 | **REMOVE** | Stale data — belongs in L1/L6, not hardcoded in prompt |
| "Immediate Work Items" table | 59-64 | **REMOVE** | Stale — belongs in L6 sprint status |
| "Before You Write ANY Code" (Artifact 0-6 table) | 68-83 | **REPLACE** | Replaced by §4 Gate System with POS-style names |
| "Your Onboarding Checklist" (universal 10 files) | 26-43 | **REPLACE** | Replaced by role-specific reading lists per Q6=a |

---

## 4. What Gets Carried Over Verbatim

| Current Section | Lines | Destination |
|-----------------|:-----:|-------------|
| Terminology inversion table | 14-22 | §1 Identity |
| Rules 1-7 | 88-94 | §5 CI-Specific Rules (expanded to CI-R1 through CI-R7) |
| Governance update checklist | 100-108 | §20 |
| Test accounts | 112-120 | §22 |
| Key files table | 126-137 | §21 |
| Commands | 142-151 | §23 |

---

## 5. Role-Specific Reading Lists (Q6=a)

| Role | Files to Read | Count |
|------|---------------|:-----:|
| INTAKE | L1, L3, L4, test_credentials.md | 4 |
| PLANNING | L1, intake doc(s), L7, L9, source code | 5 |
| IMPLEMENTATION | L1, latest handover, plan doc(s), L7 | 4 |
| QA | L1, QA handover doc, plan doc, test_credentials.md | 4 |
| BUG FIX | QA report, plan doc, L7, test_credentials.md | 4 |
| INVESTIGATION | L1, intake doc, L9 | 3 |
| DEPLOYMENT | L5, L2, .env files | 3 |
| SMOKE FACILITATOR | L1, QA report(s), test_credentials.md | 3 |
| REGRESSION | L1, QA reports, L7, test_credentials.md | 4 |
| PRE-RELEASE AUDIT | registry.json, L7, L9, L6 | 4 |
| CLOSURE | registry.json, L3+L4, L6, audit report | 4 |

---

## 6. Verification Matrix (Seeds QA for CR-036 itself)

| # | Check | How to Verify | Automated? |
|---|-------|---------------|:---:|
| 1 | File exists and replaces old prompt | `wc -l control/AGENT_PROMPT.md` → 800-1100 lines | YES |
| 2 | All 11 roles defined | `grep -c "^## ROLE" control/AGENT_PROMPT.md` → 11 | YES |
| 3 | Gate system uses POS-style names | grep for "Intake", "Impact Analysis", "Gate 4", "Smoke" | YES |
| 4 | CI-R1 through CI-R7 present | `grep -c "CI-R" control/AGENT_PROMPT.md` → ≥7 | YES |
| 5 | EXIT GATE section exists | `grep "EXIT GATE" control/AGENT_PROMPT.md` | YES |
| 6 | Handover template exists | `grep "SESSION HANDOVER TEMPLATE" control/AGENT_PROMPT.md` | YES |
| 7 | Code markers rule present | `grep "code marker" control/AGENT_PROMPT.md -i` | YES |
| 8 | Role-specific reading lists (not universal 10) | Each ROLE section has its own READ block | MANUAL |
| 9 | No stale "Current State" or "Immediate Work Items" | `grep -c "Immediate Work Items" control/AGENT_PROMPT.md` → 0 | YES |
| 10 | Terminology table present | `grep "Central Store" control/AGENT_PROMPT.md` | YES |
| 11 | Old Artifact 0-6 numbering gone | `grep "Artifact 0" control/AGENT_PROMPT.md` → only in Session-Start context | MANUAL |
| 12 | Future STEP -1 hook comment present | `grep "FUTURE.*dashboard dispatch" control/AGENT_PROMPT.md` | YES |
| 13 | STEP 0 is role-first (no queue read) | Manual review — no "read workflow_queue" in STEP 0 | MANUAL |

---

## 7. Risk Register

| Risk | Severity | Mitigation |
|------|:--------:|------------|
| New prompt is too long, agent truncates or ignores sections | MEDIUM | Keep under 1100 lines. Role sections are self-contained — agent only reads its own role. |
| Existing session artifacts reference "Artifact 0-6" numbering | LOW | No rename needed — file paths stay the same. Gate names are additive (labels on top of numbers). |
| Agent confused by future STEP -1 comment and tries to read queue | LOW | Wrap in HTML comment `<!-- -->` — invisible to agent flow, visible to human readers. |
| EXIT GATE too strict, blocks agent on edge cases | LOW | EXIT GATE only applies to IMPLEMENTATION + BUG FIX. Other roles have lighter handover. |

---

## 8. Execution Sequence

| Step | Action | Est. Time |
|:----:|--------|:---------:|
| 1 | Write §1-§5 (Identity, Step 0, Step 0.5, Gate System, CI Rules) | 30 min |
| 2 | Write §6-§8 (INTAKE, PLANNING, IMPLEMENTATION — the 3 heaviest roles) | 60 min |
| 3 | Write §9-§16 (QA, BUG FIX, INVESTIGATION, DEPLOYMENT, SMOKE, REGRESSION, AUDIT, CLOSURE) | 60 min |
| 4 | Write §17-§23 (Shared Rules, EXIT GATE, Handover, Governance, Key Files, Accounts, Commands) | 30 min |
| 5 | Self-review: run Verification Matrix checks 1-13 | 15 min |
| 6 | Present to owner for Gate 4 GO | — |
| **Total** | | **~3.5 hours** |

---

## 9. Scope Lock

### Files that WILL change:
- `control/AGENT_PROMPT.md` — FULL REWRITE

### Files that will NOT change:
- All application code (frontend/src/**, backend/**)
- `control/CODE_GATE_POLICY.md` (referenced, not modified)
- `control/MAINTENANCE_RULES.md` (referenced, not modified)
- `control/registry.json` (updated only for CR-036 status, not schema)
- All governance layers (L0-L9)
- All `control/sessions/` existing artifacts
- Dashboard files (`__dev/`)

---

## 10. Post-Code Registry Checklist (for IMPLEMENTATION agent)

After writing the new `AGENT_PROMPT.md`:

```
- [ ] registry.json: CR-036 → status: IMPLEMENTED, artifact_refs updated
- [ ] L3_CR_REGISTRY.md: CR-036 row updated
- [ ] L7_FILE_OWNERSHIP.md: control/AGENT_PROMPT.md listed as modified
- [ ] Code markers: N/A (this is a markdown doc, not code)
- [ ] Compile check: N/A (no code changes)
- [ ] Dashboard drift check: node control/gen_dashboard_data.js --check
```

---

*Awaiting Gate 4 GO from owner before IMPLEMENTATION agent writes the new prompt.*
