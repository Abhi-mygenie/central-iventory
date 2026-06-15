# CR-036 — Session Start

> **CR ID:** CR-036
> **Title:** Control Layer Redesign — Role-Based Agent Dispatch System
> **Date:** 2026-06-15
> **Agent Role:** PLANNING (Impact Analysis)
> **Branch:** 14-june-1

## Context
Owner wants to restructure the Central Inventory control layer from a single-agent sequential model to a multi-role dispatch system. Reference architecture: MyGenie POS Agent Prompt Alpha v0.6 (11 roles, dashboard batch queue, gate progress tracking).

## Current State
- Single `AGENT_PROMPT.md` with sequential 7-artifact flow
- One agent does everything: intake → planning → implementation → QA → closure
- No workflow queue, no batch dispatch, no role separation
- Dashboard (`/__dev/index.html`) exists but has no workflow controls (only data display)

## Goal
- 11 specialized roles (all except RELEASE)
- Dashboard-driven batch dispatch (owner selects items → sends to stage)
- Agent reads queue at session start → auto-picks role
- Clean handoff between roles via structured handover docs

## Reference Files
- POS Agent Prompt: `/app/control/reference/MYGENIE_POS_AGENT_PROMPT_v0.6.md`
- POS Dispatch System: `/app/control/reference/` (15 files)
