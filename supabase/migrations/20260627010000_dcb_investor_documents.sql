-- Seed Discharge Bridge source documents into InvestorOS VDR.

insert into public.documents (title, type, status, access, views, owner, version, slug)
values
  ('DCB Investor Summary', 'Memo', 'Internal review', 'NDA', 0, 'Founder', 'v0.9', 'dcb-investor-summary'),
  ('DCB One-Pager', 'One-Pager', 'Ready', 'NDA', 0, 'Founder', 'v1.0', 'dcb-one-pager'),
  ('DCB Platform Overview', 'Technical', 'Ready', 'NDA', 0, 'Architecture', 'v1.0', 'dcb-platform-overview'),
  ('DCB Fundable Pitch Outline', 'Deck Outline', 'Ready', 'NDA', 0, 'Founder', 'v1.0', 'dcb-pitch-outline'),
  ('DCB Hospital + SNF GTM System', 'GTM', 'Ready', 'NDA', 0, 'GTM', 'v1.0', 'dcb-gtm-system'),
  ('DCB Global Infrastructure Blueprint', 'Strategy', 'Roadmap', 'Restricted', 0, 'Architecture', 'v1.0', 'dcb-global-blueprint'),
  ('DCB Pricing + Offer Stack', 'Pricing', 'Ready', 'Restricted', 0, 'Finance', 'v1.0', 'dcb-pricing-offers')
on conflict (slug) do update set
  title = excluded.title,
  type = excluded.type,
  status = excluded.status,
  access = excluded.access,
  owner = excluded.owner,
  version = excluded.version,
  updated_at = now();
