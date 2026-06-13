# CR-025 — Wire `reference_code` as PO Number: Code-Gate Review (Artifact #4)

> **Date:** 2026-06-13
> **CR:** CR-025 (sub-task)
> **Reviewer:** E1 (new agent session)
> **Status:** APPROVED — Proceed to implementation

---

## 1. Pre-Implementation Review Checklist

| # | Check | Status | Notes |
|---|-------|:------:|-------|
| 1 | Artifacts 0-3 reviewed (Session-Start, Intake, Impact Analysis, Impl Plan) | PASS | All 4 documents are thorough, consistent, and complete |
| 2 | No frozen files in scope | PASS | `terminology.js`, `screenVisibility.js`, `backend/server.py` all untouched |
| 3 | `formatPO` change is backwards-compatible | PASS | New optional param; existing 1-arg calls unchanged |
| 4 | All 15 call sites across 8 files identified | PASS | Matches Impact Analysis §2.2–2.9 |
| 5 | Derived ledger entries propagation planned | PASS | 4 `entries.push()` calls in `deriveLedgerEntries()` need `reference_code: t.reference_code` |
| 6 | API evidence confirms `reference_code` field exists | PASS | Verified in pending-queues, details, and history endpoints (Artifact 1, §4) |
| 7 | Legacy fallback (null `reference_code`) handled | PASS | `formatPO(id, undefined)` → existing `PO-XXXX` path |
| 8 | No cache layer changes | PASS | `reference_code` passes through `api.js` normalization unmodified |
| 9 | No new API calls | PASS | Reading existing field only |
| 10 | No backend changes | PASS | Proxy-only server untouched |
| 11 | Dead import cleanup included | PASS | `StockInventorySummary.jsx` unused `formatPO` import removed |
| 12 | PostSubmitConfirmation.jsx correctly excluded | PASS | Only used by procurement — no transfer `reference_code` |

## 2. Risk Re-Assessment

| Risk | Verdict |
|------|---------|
| Breaking existing PO display | **NONE** — optional param, fallback intact |
| Missing `reference_code` on old data | **HANDLED** — falsy check triggers `PO-XXXX` fallback |
| Derived ledger entries miss propagation | **MITIGATED** — explicitly planned in Impl Plan §4a |
| Cache stale after change | **N/A** — no cache key changes |

## 3. Implementation Readiness

- **Estimated edits:** 17 across 9 files (matching Impl Plan §2)
- **Execution strategy:** Single parallel batch — all changes independent at file level
- **Estimated time:** ~30 minutes
- **Rollback:** Single line in `formatPO` disables new behavior (Impl Plan §6)

## 4. Gate Decision

**APPROVED** — All pre-conditions met. No frozen files affected. Change is low-risk, backwards-compatible, display-layer-only threading of an existing API field. Proceed to implementation.

---

## 5. Post-Implementation Requirements

After coding:
1. Run testing to verify `TRF-XXX-YYYY-ZZZZ` format renders on all screens
2. Verify legacy fallback with `formatPO("123")` → `PO-0123`
3. Create Artifact 5 (QA Report) with evidence
4. Update governance layers per Impl Plan §5
5. Mark Artifact 6 as PENDING until owner confirms

---

*Code-Gate APPROVED. Implementation may proceed.*
