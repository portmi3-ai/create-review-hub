
CREATE TYPE public.doc_access AS ENUM ('NDA', 'Restricted', 'Public');

CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  access public.doc_access NOT NULL DEFAULT 'Restricted',
  views INTEGER NOT NULL DEFAULT 0,
  owner TEXT,
  version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Investors: only NDA docs
CREATE POLICY "Investors read NDA docs"
ON public.documents FOR SELECT
TO authenticated
USING (
  access = 'NDA'
  AND public.has_role(auth.uid(), 'investor')
  AND NOT public.has_role(auth.uid(), 'admin')
);

-- Admins: read all
CREATE POLICY "Admins read all docs"
ON public.documents FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins: full write
CREATE POLICY "Admins insert docs"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update docs"
ON public.documents FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete docs"
ON public.documents FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.documents (slug, title, type, status, access, views, owner, version) VALUES
  ('deck',     'Investor Pitch Deck',              'Deck',        'Ready',         'NDA',        42, 'Founder',      'v1.0'),
  ('memo',     'Investment Memo',                  'Memo',        'Draft',         'NDA',        17, 'Founder',      'v0.8'),
  ('model',    'Financial Model',                  'Spreadsheet', 'Needs update',  'Restricted',  9, 'Finance',      'v0.4'),
  ('patent',   'Patent Receipt + Summary',         'Legal',       'Ready',         'Restricted', 13, 'Legal',        'v1.0'),
  ('security', 'HIPAA Alignment + SOC 2 Roadmap',  'Security',    'Ready',         'NDA',        22, 'Architecture', 'v1.0'),
  ('product',  'Product Architecture',             'Technical',   'Ready',         'NDA',        29, 'Architecture', 'v1.2');
