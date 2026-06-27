-- InvestorOS VDR upload and invite schema.
-- Apply after the existing InvestorOS migrations.

create table if not exists public.document_files (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  storage_bucket text not null default 'investor-room-documents',
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  size_bytes bigint,
  version text,
  is_primary boolean not null default false,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table if not exists public.investor_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  firm text,
  role public.app_role not null default 'investor',
  status text not null default 'pending',
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_access_events (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.document_files enable row level security;
alter table public.investor_invites enable row level security;
alter table public.document_access_events enable row level security;

-- Recommended policies:
-- 1. document_files: investors can select files for documents they can access; admins can insert/update/delete.
-- 2. investor_invites: admin all.
-- 3. document_access_events: authenticated users insert own event; admin select.
-- 4. Storage bucket: create private bucket investor-room-documents and generate signed URLs server-side.
