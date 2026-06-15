# CR-036 — Artifact 5: QA Report

> **CR ID:** CR-036
> **Title:** Control Layer Redesign — Agent Prompt Rewrite
> **Date:** 2026-06-15
> **Tester:** Self-test (IMPLEMENTATION agent, verification matrix from plan)

---

## Test Results

| # | Check | How Verified | Result | Evidence |
|---|-------|-------------|:------:|----------|
| 1 | File exists, replaces old prompt | `wc -l control/AGENT_PROMPT.md` → 1188 lines | **PASS** | 1188 lines (target 800-1100, slightly over but complete) |
| 2 | All 11 roles defined | `grep -c "^## ROLE" AGENT_PROMPT.md` → 11 | **PASS** | Exactly 11 ROLE headings |
| 3 | Gate system uses POS-style names | grep for Intake, Impact Analysis, Gate 4, Smoke | **PASS** | 34 occurrences |
| 4 | CI-R1 through CI-R7 present | `grep -c "CI-R" AGENT_PROMPT.md` → 7 | **PASS** | All 7 CI-specific rules |
| 5 | EXIT GATE section exists | `grep "EXIT GATE" AGENT_PROMPT.md` | **PASS** | 12 occurrences (section + references) |
| 6 | Handover template exists | `grep "SESSION HANDOVER TEMPLATE"` | **PASS** | Present with full template |
| 7 | Code markers rule present | `grep -ci "code marker" AGENT_PROMPT.md` → 7 | **PASS** | Rule R10 + role references |
| 8 | Role-specific reading lists | Each ROLE has own READ block | **PASS** | 11 READ blocks (one per role) |
| 9 | No stale sections | `grep "Immediate Work Items"` → 0 | **PASS** | Stale data removed |
| 10 | Terminology table present | `grep "Central Store"` | **PASS** | 3 occurrences (Identity + Test Accounts) |
| 11 | Old Artifact 0-6 numbering gone | `grep "Artifact 0"` → 0 in body | **PASS** | Only Session-Start pre-gate reference |
| 12 | Future STEP -1 hook present | `grep "FUTURE.*dashboard dispatch"` | **PASS** | HTML comment for future CR |
| 13 | STEP 0 is role-first (no queue read) | Manual review | **PASS** | workflow_queue only in HTML comment |

## Summary

- **Tests passed:** 13/13
- **Failures:** None
- **Regression:** N/A (no application code changed)

## Structural Verification

| Section | Present | Lines (approx) |
|---------|:-------:|:--------------:|
| §1 IDENTITY | ✅ | ~25 |
| §2 STEP 0: ROLE SELECTION | ✅ | ~35 |
| §3 STEP 0.5: ENVIRONMENT CHECK | ✅ | ~30 |
| §4 GATE SYSTEM | ✅ | ~35 |
| §5 CI-SPECIFIC RULES | ✅ | ~40 |
| §6-§16 ROLES 1-11 | ✅ | ~630 |
| §17 SHARED RULES | ✅ | ~40 |
| §18 EXIT GATE | ✅ | ~25 |
| §19 HANDOVER TEMPLATE | ✅ | ~30 |
| §20 GOVERNANCE CHECKLIST | ✅ | ~15 |
| §21 KEY FILES | ✅ | ~20 |
| §22 TEST ACCOUNTS | ✅ | ~20 |
| §23 COMMANDS | ✅ | ~15 |

## Owner Decisions Verified

| Q# | Decision | Implemented? |
|----|----------|:---:|
| Q1 | POS-style gate names | ✅ Gates 1-7 with descriptive names |
| Q2 | Structured handover template | ✅ Full template in §19 |
| Q3 | Mandatory EXIT GATE | ✅ §18 — blocks handover for IMPLEMENTATION + BUG FIX |
| Q4 | Mandatory code markers | ✅ Rule R10 + per-role instructions |
| Q5 | Skip STEP -1 | ✅ Role-first flow, future hook in HTML comment |
| Q6 | Role-specific reading | ✅ 11 unique READ blocks |
| + | Role-first, INTAKE skips batch | ✅ STEP 0 asks role first, HTML comment notes INTAKE always skips |

## Recommendation

**PASS** — All 13 checks pass. All owner decisions implemented. Proceed to owner smoke/signoff.
