ALTER TABLE public.security_sites
ADD COLUMN instructions text NOT NULL DEFAULT '';

CREATE TABLE public.security_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  site_id uuid NOT NULL REFERENCES public.security_sites(id) ON DELETE CASCADE,
  entry_type text NOT NULL CHECK (entry_type IN ('Prise de poste', 'Ronde de patrouille', 'Incident')),
  shift_type text CHECK (shift_type IN ('Jour', 'Nuit')),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  agent_name text NOT NULL,
  supervisor text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'Information' CHECK (severity IN ('Information', 'Vigilance', 'Critique')),
  summary text NOT NULL,
  details text NOT NULL DEFAULT '',
  action_taken text NOT NULL DEFAULT '',
  CHECK (entry_type = 'Prise de poste' OR shift_type IS NULL OR shift_type IN ('Jour', 'Nuit'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.security_operations TO authenticated;
GRANT ALL ON public.security_operations TO service_role;
ALTER TABLE public.security_operations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Direction manages security operations" ON public.security_operations
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX security_operations_site_date_idx ON public.security_operations(site_id, occurred_at DESC);
CREATE INDEX security_operations_type_idx ON public.security_operations(entry_type);