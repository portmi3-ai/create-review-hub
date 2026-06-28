# InvestorOS full platform schema roadmap

This document defines the persistence contracts needed to move InvestorOS from MVP to production-grade investor operations.

## VDR storage

Tables:

- `document_files`
- `document_versions`
- `document_access_events`
- `document_downloads`

Purpose:

- file metadata
- signed URL delivery
- version history
- download analytics

## NDA and legal

Tables:

- `nda_templates`
- `nda_acceptances`
- `legal_documents`

Purpose:

- investor gatekeeping
- acceptance ledger
- legal artifact tracking

## Investor CRM

Tables:

- `investor_contacts`
- `investor_firms`
- `investor_notes`
- `investor_tasks`
- `investor_meetings`
- `investor_commitments`

Purpose:

- relationship tracking
- tasks and reminders
- meeting history
- soft-circle and commitment tracking

## Diligence workflow

Tables:

- `diligence_requests`
- `diligence_comments`
- `diligence_assignments`

Purpose:

- track investor requests
- assign owners
- manage status and deadlines

## AI diligence

Tables:

- `document_chunks`
- `document_embeddings`
- `ai_questions`
- `ai_answers`
- `ai_answer_sources`

Purpose:

- role-aware RAG
- citation-backed answers
- investor question history

## Financial center

Tables:

- `fundraising_rounds`
- `commitments`
- `investment_instruments`
- `use_of_funds`

Purpose:

- raise tracking
- commitment tracking
- SAFE / note tracking
- use-of-funds narrative

## Media center

Tables:

- `media_assets`
- `press_mentions`
- `demo_assets`

Purpose:

- logos
- screenshots
- videos
- press materials

## Integrations

Tables:

- `integration_connections`
- `integration_events`
- `sync_runs`

Purpose:

- GitHub
- Google Calendar
- Gmail / Resend
- DocuSign
- Discharge Bridge demo tenant

## Automation

Tables:

- `automation_rules`
- `automation_runs`
- `notification_events`

Purpose:

- investor follow-up reminders
- monthly updates
- diligence reminders
- activity alerts

## Security requirements

- RLS enabled on every table.
- Admins manage all records.
- Investors see only records scoped to their user, firm, or access grants.
- Service role key remains server-only.
- No PHI belongs in InvestorOS.
