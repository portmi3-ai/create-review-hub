# Product Architecture — Discharge Bridge

## Architecture summary

Discharge Bridge is designed as a modular orchestration platform for hospital-to-SNF transitions.

## Core modules

- Hospital intake
- FHIR gateway
- Routing engine
- SNF dispatcher
- Prior-auth readiness
- Medication coordination
- Mission-control analytics
- Advisory AI concierge

## Design principles

- Deterministic workflow control
- Advisory AI, not autonomous clinical decisioning
- Auditability
- Tenant isolation
- Server-side secret isolation
- No PHI in investor environments

## Demo path

The investor demo should show one referral moving from readiness review to matched SNF options, documentation handoff, and follow-up analytics.
