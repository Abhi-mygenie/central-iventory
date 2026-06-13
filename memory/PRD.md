# Central Inventory — PRD

## Project Identity
Central Inventory — a multi-store hierarchy stock management module for the MyGenie POS platform. Backend is proxy-only FastAPI (~180 lines) forwarding to `preprod.mygenie.online`. Frontend is React 19 + CRACO + Tailwind + Radix UI (shadcn).

## Architecture
- **Backend**: FastAPI proxy on port 8001 (supervisor-managed) — ZERO business logic
- **Frontend**: React 19 + CRACO on port 3000 (supervisor-managed)
- **Database**: MongoDB (local state only — token sessions, status checks)
- **POS API**: `preprod.mygenie.online/api/v2/vendoremployee`
- **Branch**: `13-june-2`

## Hierarchy Model (TERMINOLOGY INVERTED)
| UI Label | API Value | Level |
|----------|-----------|:-----:|
| Central Store | `master` | TOP |
| Master Store | `central` | MIDDLE |
| Outlet | `franchise` | BOTTOM |

## Governance
- **Control Layer**: 10 governance documents in `/app/control/`
- **Code Gate Policy**: 7-artifact closure model for CRs
- **Frozen Files**: terminology.js, screenVisibility.js, backend .env, frontend .env, server.py (by policy)
- **Registry**: `control/registry.json` — single source of truth

## Current State (June 13, 2026)
- **Active Sprint**: S3 — API Reality Check + Intelligent PO + FEFO Detail
- **Closed in S3**: CR-023, CR-024, CR-025, CR-015, CR-016
- **QA Pending Signoff**: CR-026, CR-027, CR-029
- **Screen Audit CRs**: CR-030, CR-031, CR-032, CR-033 (artifacts 4/7)

## What's Been Implemented
- 24/24 intelligent UI screens (Phase 7 frozen spec)
- 86 API methods with cache layer (72% call reduction)
- Intelligent PO (consumption-based ordering)
- Production Unit Module
- Navigation restructured (6 sections, 15 items)
- Stock Inventory FG/Raw Split (3 tabs)
- FEFO Batch Stock Detail Panel

## Prioritized Backlog
| Priority | CR | Title | Status |
|----------|-----|-------|--------|
| P0 | CR-025 sub-task | Wire `reference_code` as PO number | Planning done, implementation queued |
| P0 | CR-028 | Product Catalog Overhaul | PROPOSED |
| P1 | CR-018 | P25 — Wastage Report Enhancements | PLANNED |
| P2 | CR-017 | Smart Dispatch Assistance | PROPOSED |
| Future | CR-020 | Daily Intelligence Digest | PROPOSED |

## Open Backend Gaps
| ID | Gap | Priority |
|----|-----|:--------:|
| G-014 | Invoice OCR endpoint | P1 |
| G-015 | Excel parsing endpoint | P2 |
| G-016 | Invoice storage | P2 |
| G-017 | Vendor purchase history | P2 |
| G-020 | Custom unit conversion | P1 |
| G-021 | Purchase Order Module | P0 |
