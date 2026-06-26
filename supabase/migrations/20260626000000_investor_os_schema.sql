-- InvestorOS core schema for Discharge Bridge / Mport investor room
-- Apply with Supabase CLI or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'investor');
create type public.doc_access as enum ('NDA', 'Restricted', 'Public');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  firm text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'investor',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'Document',
  status text not null default 'Draft',
  access public.doc_access not null default 'NDA',
  views integer not null default 0 check (views >= 0),
  owner text,
  version text,
  slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, firm)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'firm'
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    firm = excluded.firm;

  insert into public.user_roles (user_id, role)
  values (new.id, 'investor')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.documents enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.has_role(auth.uid(), 'admin'))
with check (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "roles_select_own_or_admin" on public.user_roles;
create policy "roles_select_own_or_admin"
on public.user_roles for select
to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "roles_admin_all" on public.user_roles;
create policy "roles_admin_all"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "documents_select_by_access" on public.documents;
create policy "documents_select_by_access"
on public.documents for select
to authenticated
using (
  public.has_role(auth.uid(), 'admin')
  or access in ('Public', 'NDA')
);

drop policy if exists "documents_admin_all" on public.documents;
create policy "documents_admin_all"
on public.documents for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

insert into public.documents (title, type, status, access, views, owner, version, slug)
values
  ('Investor Pitch Deck', 'Deck', 'Ready', 'NDA', 42, 'Founder', 'v1.0', 'investor-pitch-deck'),
  ('Investment Memo', 'Memo', 'Draft', 'NDA', 17, 'Founder', 'v0.8', 'investment-memo'),
  ('Financial Model', 'Spreadsheet', 'Needs update', 'Restricted', 9, 'Finance', 'v0.4', 'financial-model'),
  ('Patent Receipt + Summary', 'Legal', 'Ready', 'Restricted', 13, 'Legal', 'v1.0', 'patent-summary'),
  ('HIPAA Alignment + SOC 2 Roadmap', 'Security', 'Ready', 'NDA', 22, 'Architecture', 'v1.0', 'security-roadmap'),
  ('Product Architecture', 'Technical', 'Ready', 'NDA', 29, 'Architecture', 'v1.2', 'product-architecture')
on conflict (slug) do nothing;
