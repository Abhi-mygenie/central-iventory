# Central Inventory - PRD

## Problem Statement
Central Inventory — multi-store hierarchy stock management module for MyGenie POS. Backend is proxy-only FastAPI (~180 lines) forwarding to preprod.mygenie.online. Frontend is React 19 + Craco + Tailwind + Radix UI.

## Tech Stack
- **Backend**: FastAPI (Python) + Motor (async MongoDB) + httpx (proxy to POS API)
- **Frontend**: React 19 + Craco + Tailwind CSS + Radix UI (shadcn) + Recharts + React Router
- **Database**: MongoDB (local, token sessions only)
- **External APIs**: preprod.mygenie.online (POS API v1 + v2)

## What's Been Implemented

### Session 1 — 2026-06-13
- Cloned repo from GitHub (branch 13-6-26), installed dependencies, configured platform .env files
- **CR-023, CR-024, CR-025 CLOSED** — smoke tested, all governance layers updated
- **G-009, G-010, G-012, G-013 CLOSED** in L9 gaps register
- **CR-025 sub-task: Wire `reference_code` as PO number** — IMPLEMENTED
  - 9 files, 17 edits: `formatPO` now accepts optional `referenceCode` param
  - All screens display `TRF-806-2026-XXXX` format from API instead of `PO-XXXX` placeholder
  - Backwards compatible — legacy transfers fall back to `PO-XXXX`
  - Full governance artifacts (0-5) at `control/sessions/CR025_REFERENCE_CODE_*.md`
- **CR-015 assigned to S3** — FEFO Batch Stock Detail Panel (PLANNED)
- **Governance updated**: AGENT_PROMPT.md rewritten, L1/L6/L7/L8/L9 updated, P20 plan replaced
- **P20 planning doc** replaced with owner-provided content

## Current Sprint: S3
| CR | Title | Status |
|----|-------|--------|
| CR-023 | API Reality Check | CLOSED |
| CR-024 | API Response Cache | CLOSED |
| CR-025 | Intelligent PO + reference_code wire | CLOSED |
| CR-015 | FEFO Batch Stock Detail Panel | PLANNED |

## Backlog (Prioritized)
| Priority | CR | Title |
|----------|-----|-------|
| P0 | CR-015 | P24 — FEFO Batch Stock Detail Panel (~80% built, needs Phase 3 + QA) |
| P1 | CR-016 | P20-Phase2 — Stock Inventory Hierarchy Toggle |
| P1 | CR-018 | P25 — Wastage Report Enhancements |
| P2 | CR-017 | P21-Smart — Smart Dispatch Assistance |
| Future | CR-020 | Daily Intelligence Digest |

## Open Backend Gaps
- G-006: Stock return flow API (P1)
- G-014: Invoice OCR endpoint (P1)
- G-015: Excel parsing endpoint (P2)
- G-016: Invoice number storage (P2)
- G-017: Vendor purchase history API (P2)
