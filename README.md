# InvestorOS Review Hub

InvestorOS Review Hub is a secure investor room for Discharge Bridge by Mport Media Technologies, Inc. It combines a virtual data room, investor CRM, engagement analytics, admin role management, roadmap visibility, and an AI diligence concierge.

## Stack

- TanStack Start
- React
- TypeScript
- Vite
- Supabase Auth, Postgres, RLS, and service-role admin functions
- Gemini-compatible AI concierge with fallback behavior
- Netlify deployment configuration

## Core routes

- `/auth` — sign in / sign up
- `/` — investor room dashboard
- `/documents` — admin document management
- `/admin` — admin user-role management

## Current fundraising seed

InvestorOS seed data is currently configured for:

```text
$2M Seed
```

## DCB source documents integrated

The data room now includes Discharge Bridge source material from `portmi3-ai/discharge-bridge-media`:

- DCB Investor Summary
- DCB One-Pager
- DCB Platform Overview
- DCB Fundable Pitch Outline
- DCB Hospital + SNF GTM System
- DCB Global Infrastructure Blueprint
- DCB Pricing + Offer Stack

These are wired as InvestorOS catalog entries, downloadable markdown files under `public/docs`, and Supabase document seed rows.

## Required environment variables

Copy `.env.example` to `.env.local` for local development and set the same values in Netlify.

Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`

`GEMINI_API_KEY` is optional. If it is not set, the concierge returns a grounded fallback answer from the built-in InvestorOS context.

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code. It should only exist in the server runtime.

## Supabase setup

Apply migrations in order:

```text
supabase/migrations/20260626000000_investor_os_schema.sql
supabase/migrations/20260627000000_investor_os_workspace.sql
supabase/migrations/20260627010000_dcb_investor_documents.sql
```

The migrations create and seed:

- `profiles`
- `user_roles`
- `documents`
- `investor_contacts`
- `diligence_requests`
- `investor_updates`
- `investor_events`
- `product_sandbox_items`
- `has_role(_user_id, _role)`
- profile creation trigger for new auth users
- investor/admin row-level security policies
- starter investor-room document records
- DCB source investor-room document records

After the first admin user signs up, promote that user in Supabase SQL:

```sql
insert into public.user_roles (user_id, role)
values ('YOUR_USER_ID', 'admin')
on conflict (user_id, role) do nothing;
```

## RLS verification

The migration enables RLS on all InvestorOS tables and separates access as follows:

- investors can read their own profile
- admins can read profiles
- users can read their own roles
- admins can manage roles
- investors can read `Public` and `NDA` documents
- admins can create, update, delete, and read all documents
- admin-only workspace tables remain protected by role policies

Static readiness tests assert that the required tables, functions, policy names, DCB document files, and DCB migration rows are present.

## Local development

```bash
npm install
npm run dev
```

## Readiness checks

```bash
npm run lint
node --test tests/*.test.mjs
npm run build
```

The branch also includes:

```bash
node scripts/readiness-check.mjs
```

## Netlify deployment

The repo includes `netlify.toml`.

Recommended Netlify settings:

```text
Build command: npm run build
Publish directory: .output/public
```

Set the environment variables from `.env.example` in Netlify before building.

## CI checks

See `docs/CI.md` for the GitHub Actions workflow. The connector blocked direct creation of `.github/workflows` in this session, so the workflow is documented for local or GitHub UI creation.

## Production notes

This is an InvestorOS MVP. Before live fundraising use, add real document storage, per-investor link tracking, audit event persistence, document download controls, and an investor-specific NDA workflow.
