# L6 — Sprint Status

> **Updated:** 2026-06-01 (Sprint A+B+C complete)
> **Source of truth for items:** `control/registry.json`

---

## Active Sprint

### S2 — Intelligent UI Implementation
- **Start:** 2026-06-01
- **End:** 2026-06-01 (all 3 sub-sprints completed in single session)
- **Goal:** Implement intelligence layer across all screens per Phase 7 frozen spec.

**Sprint A — Foundation Intelligence (COMPLETE, 21/21 PASS):**
- OperationsHub.jsx — full rewrite (greeting, NBA banners, KPIs, stock health, store grid, quick actions, activity feed)
- StockInventorySummary.jsx — +3 columns (Expiry Risk, Pending, Days of Cover), Export CSV
- StockDetailPanel.jsx — +% of Total, Action column, FEFO dispatch-first badge, reorder suggestion
- HistoryLedger.jsx — PO/Ref column (PO-XXXX format), Export CSV
- StatusTimeline.jsx — relative timestamps, durations, lifecycle total, stale detection
- NEW: useStockIntelligence.js hook, StockIntelligenceBar.jsx component
- NEW: formatPO() utility in formatters.js

**Sprint B — Transfer Flow Intelligence (COMPLETE, 18/18 PASS):**
- PendingQueues.jsx — full rewrite: table → card-based approval inbox with item-level table, age badges, fulfillment verdicts, sort control
- TransferDetail.jsx — PO format title, "Created X days ago" relative time
- ReceiveDialog.jsx — PO format, dispatch time context
- ApproveWaveDialog.jsx — PO format
- DisputeResolutionDialog.jsx — PO format
- SourceSelector.jsx — FEFO badges on segments, expired segments disabled
- NEW: PostSubmitConfirmation.jsx, StoreHealthStrip.jsx, FulfillmentVerdict.jsx

**Sprint C — Operations + Config Intelligence (COMPLETE, 11/11 PASS):**
- StockAdjustmentForm.jsx — stock context bar, impact preview, undo guidance
- WastageEntryForm.jsx — stock context, undo guidance
- OperationalSettings.jsx — "High impact" badge, "Affects all stores" badge
- VendorManagement.jsx — Status column (Active/Inactive detection >60 days)
- WastageReport.jsx — Export CSV button
- BUG FIX: display_qty string → Number() conversion for arithmetic

**Remaining polish (deferred to next session):**
- Catalogue screens: "Used in X recipes" cross-ref columns
- DailyConsumptionReport: days-of-cover column
- HierarchyManagement: push status (Synced/Stale)
- RequestStockForm: Intelligent PO auto-detect tab
- DirectDispatchForm: destination needs auto-detect

## Closed Sprints

### S1 — Governance Setup + Intelligent UI Freeze
- **Period:** 2026-05-31
- **Deliverables:** 10-layer control, registry.json, dev dashboard, 7-phase UI freeze, 9 HTML previews, 24/24 screens approved
- **Status:** CLOSED

### S0 — Pre-Governance (Retroactive)
- **Period:** 2026-01-01 → 2026-05-29
- **CRs:** CR-001 to CR-014 (14 CRs, all CLOSED)
- **BUGs:** BUG-001 to BUG-015 (15 BUGs, mixed status)
- **Closure Note:** Owner sign-off pending on all items.

## Unassigned Items (Backlog)

| ID | Title | Status | Priority |
|----|-------|--------|----------|
| CR-015 | P24 — FEFO Batch Stock Detail | PLANNED | P0 |
| CR-016 | P20-Phase2 — Hierarchy Toggle | PLANNED | P1 |
| CR-017 | P21-Smart — Smart Dispatch Assistance | PROPOSED | P1 |
| CR-018 | P25 — Wastage Report Enhancements | PLANNED | P2 |
| CR-020 | Daily Intelligence Digest (SMS/WhatsApp/Email) | PROPOSED | Future |
