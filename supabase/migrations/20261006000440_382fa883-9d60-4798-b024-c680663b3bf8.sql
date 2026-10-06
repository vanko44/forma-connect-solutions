ALTER TABLE public.quote_requests
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN offer jsonb,
  ADD COLUMN approved_at timestamptz;
ALTER TABLE public.quote_requests ALTER COLUMN status SET DEFAULT 'En attente d''approbation direction';
UPDATE public.quote_requests SET status = 'En attente d''approbation direction' WHERE status = 'Nouveau';
DROP POLICY IF EXISTS "Anyone submits quotes" ON public.quote_requests;
CREATE POLICY "Anyone submits quotes" ON public.quote_requests FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'En attente d''approbation direction' AND offer IS NULL AND approved_at IS NULL
    AND (user_id IS NULL OR user_id = auth.uid())
    AND length(name) BETWEEN 2 AND 100 AND length(needs) <= 1500);
CREATE POLICY "Clients read own quotes" ON public.quote_requests FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS quote_requests_user_id_idx ON public.quote_requests(user_id);