-- InvestorOS workspace schema: CRM, diligence requests, updates, events, and sandbox modules.

create table if not exists public.investor_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  firm text,
  stage text not null default 'Prospect',
  interest text,
  score integer not null default 0 check (score >= 0 and score <= 100),
  next_action text,
  last_touch date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diligence_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner text,
  priority text not null default 'Medium',
  state text not null default 'Open',
  due text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  update_date date not null default current_date,
  visibility public.doc_access not null default 'NDA',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  detail text,
  actor_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.product_sandbox_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'Planned',
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_investor_contacts_updated_at on public.investor_contacts;
create trigger set_investor_contacts_updated_at
before update on public.investor_contacts
for each row execute function public.set_updated_at();

drop trigger if exists set_diligence_requests_updated_at on public.diligence_requests;
create trigger set_diligence_requests_updated_at
before update on public.diligence_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_investor_updates_updated_at on public.investor_updates;
create trigger set_investor_updates_updated_at
before update on public.investor_updates
for each row execute function public.set_updated_at();

drop trigger if exists set_product_sandbox_items_updated_at on public.product_sandbox_items;
create trigger set_product_sandbox_items_updated_at
before update on public.product_sandbox_items
for each row execute function public.set_updated_at();

alter table public.investor_contacts enable row level security;
alter table public.diligence_requests enable row level security;
alter table public.investor_updates enable row level security;
alter table public.investor_events enable row level security;
alter table public.product_sandbox_items enable row level security;

drop policy if exists "investor_contacts_admin_all" on public.investor_contacts;
create policy "investor_contacts_admin_all"
on public.investor_contacts for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "diligence_requests_admin_all" on public.diligence_requests;
create policy "diligence_requests_admin_all"
on public.diligence_requests for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "investor_updates_select_by_access" on public.investor_updates;
create policy "investor_updates_select_by_access"
on public.investor_updates for select
to authenticated
using (public.has_role(auth.uid(), 'admin') or visibility in ('Public', 'NDA'));

drop policy if exists "investor_updates_admin_all" on public.investor_updates;
create policy "investor_updates_admin_all"
on public.investor_updates for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "investor_events_admin_select" on public.investor_events;
create policy "investor_events_admin_select"
on public.investor_events for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "investor_events_authenticated_insert" on public.investor_events;
create policy "investor_events_authenticated_insert"
on public.investor_events for insert
to authenticated
with check (actor_user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "product_sandbox_items_select_authenticated" on public.product_sandbox_items;
create policy "product_sandbox_items_select_authenticated"
on public.product_sandbox_items for select
to authenticated
using (true);

drop policy if exists "product_sandbox_items_admin_all" on public.product_sandbox_items;
create policy "product_sandbox_items_admin_all"
on public.product_sandbox_items for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

insert into public.investor_contacts (name, firm, stage, interest, score, next_action, last_touch)
values
  ('Healthcare AI Angel', 'Independent', 'Intro', 'Healthcare SaaS', 91, 'Send deck + memo', current_date),
  ('Digital Health Fund', 'Seed Fund', 'Diligence', 'Care coordination', 88, 'Send security roadmap', current_date),
  ('Strategic Hospital Partner', 'Innovation Office', 'Pilot Review', 'LOS reduction', 84, 'Book product walkthrough', current_date)
on conflict do nothing;

insert into public.diligence_requests (title, owner, priority, state, due)
values
  ('Upload final pitch deck PDF', 'Founder', 'High', 'Open', 'Before next investor send'),
  ('Replace financial model placeholder with spreadsheet export', 'Finance', 'High', 'Open', 'Before diligence'),
  ('Attach patent receipt and counsel-reviewed IP summary', 'Legal', 'Medium', 'Open', 'Before partner meeting')
on conflict do nothing;

insert into public.investor_updates (title, summary, update_date, visibility)
values
  ('InvestorOS VDR wired', 'Interactive document viewing, downloads, checklists, and role-gated access are implemented.', current_date, 'NDA'),
  ('Deploy readiness passed', 'Typecheck, lint, tests, and build passed locally with CI workflow configured.', current_date, 'NDA')
on conflict do nothing;

insert into public.product_sandbox_items (name, status, description, sort_order)
values
  ('Hospital portal walkthrough', 'Planned', 'Investor-safe demo tenant with synthetic referrals.', 1),
  ('SNF matching workflow', 'Planned', 'Show matched facilities, readiness, and routing explanation.', 2),
  ('Prior-auth readiness', 'Planned', 'Display documentation completeness and next steps.', 3),
  ('Mission Control', 'Planned', 'Show operational command center and audit trail.', 4)
on conflict do nothing;
