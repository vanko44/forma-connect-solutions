ALTER TABLE public.portal_records ADD COLUMN source_quote_id uuid REFERENCES public.quote_requests(id);
ALTER TABLE public.portal_records ADD COLUMN service_id uuid REFERENCES public.portal_records(id);
CREATE UNIQUE INDEX portal_contract_source_quote ON public.portal_records(source_quote_id) WHERE kind='contract' AND source_quote_id IS NOT NULL;
CREATE INDEX portal_report_service ON public.portal_records(service_id) WHERE kind='report';
CREATE OR REPLACE FUNCTION public.validate_portal_record() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE p public.portal_records; BEGIN
IF TG_OP='UPDATE' AND (new.kind IS DISTINCT FROM old.kind OR new.owner_id IS DISTINCT FROM old.owner_id OR new.source_quote_id IS DISTINCT FROM old.source_quote_id) THEN RAISE EXCEPTION 'Dossier identity is immutable'; END IF;
IF length(new.title)<2 OR length(new.title)>200 OR new.end_date<new.start_date THEN RAISE EXCEPTION 'Invalid title or dates'; END IF;
IF NOT ((new.kind='contract' AND new.status IN ('brouillon','actif','terminé','résilié')) OR (new.kind='service' AND new.status IN ('planifiée','en cours','terminée')) OR (new.kind='mission' AND new.status IN ('brouillon','attribuée','acceptée','refusée','en cours','en attente de validation','terminée')) OR (new.kind='report' AND new.status IN ('soumis','en attente','validé','rejeté')) OR (new.kind='complaint' AND new.status IN ('nouvelle','en cours de traitement','en attente','clôturée')) OR (new.kind='invoice' AND new.status IN ('brouillon','émise','annulée')) OR (new.kind='payment' AND new.status IN ('en attente','validé','rejeté')) OR (new.kind='notification' AND new.status IN ('nouvelle','lue'))) THEN RAISE EXCEPTION 'Invalid lifecycle status'; END IF;
IF new.kind='mission' AND new.status<>'brouillon' AND (new.owner_id IS NULL OR new.provider_id IS NULL OR NOT EXISTS(SELECT 1 FROM public.portal_roles WHERE user_id=new.provider_id AND role='provider')) THEN RAISE EXCEPTION 'Assigned mission requires a provider'; END IF;
IF new.parent_id IS NOT NULL THEN
SELECT * INTO p FROM public.portal_records WHERE id=new.parent_id FOR UPDATE;
IF p.id IS NULL OR new.owner_id IS DISTINCT FROM p.owner_id OR (new.kind IN ('report','payment') AND new.provider_id IS DISTINCT FROM p.provider_id) THEN RAISE EXCEPTION 'Invalid tenant relationship'; END IF;
IF (new.kind='service' AND p.kind<>'contract') OR (new.kind='mission' AND p.kind<>'service') OR (new.kind='report' AND p.kind<>'mission') OR (new.kind='payment' AND p.kind NOT IN ('invoice','mission')) THEN RAISE EXCEPTION 'Invalid parent kind'; END IF;
IF new.kind='report' THEN new.service_id=p.parent_id; END IF;
ELSIF new.kind IN ('report','payment') OR (new.kind='mission' AND new.status<>'brouillon') THEN RAISE EXCEPTION 'Parent required'; END IF;
IF new.kind<>'report' THEN new.service_id=NULL; END IF;
IF new.kind='payment' THEN
IF NOT public.portal_can('finance') OR new.amount<=0 THEN RAISE EXCEPTION 'Forbidden payment'; END IF;
IF TG_OP='UPDATE' AND old.status='validé' THEN RAISE EXCEPTION 'Validated payments are immutable'; END IF;
IF new.status='validé' AND new.amount+(SELECT coalesce(sum(amount),0) FROM public.portal_records WHERE parent_id=new.parent_id AND kind='payment' AND status='validé' AND id<>new.id)>p.amount THEN RAISE EXCEPTION 'Payment exceeds balance'; END IF;
END IF;
IF TG_OP='UPDATE' AND new.kind='report' AND (new.parent_id IS DISTINCT FROM old.parent_id OR new.provider_id IS DISTINCT FROM old.provider_id) THEN RAISE EXCEPTION 'Report assignment is immutable'; END IF;
IF NOT public.portal_record_staff(new.kind) THEN
IF new.kind='complaint' AND (new.attributes - ARRAY['description','category'])<>'{}'::jsonb THEN RAISE EXCEPTION 'Client cannot write staff response'; END IF;
IF new.kind='report' AND (new.attributes - ARRAY['description','incident','difficulties'])<>'{}'::jsonb THEN RAISE EXCEPTION 'Provider cannot write validation'; END IF;
END IF;
new.updated_at=now(); RETURN new; END $$;
CREATE OR REPLACE FUNCTION public.sync_portal_report() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE m public.portal_records; BEGIN
IF new.kind<>'report' THEN RETURN new; END IF;
SELECT * INTO m FROM public.portal_records WHERE id=new.parent_id FOR UPDATE;
IF new.status IN ('soumis','en attente') AND m.status IN ('acceptée','en cours') THEN UPDATE public.portal_records SET status='en attente de validation' WHERE id=m.id;
ELSIF new.status='validé' AND (TG_OP='INSERT' OR old.status IS DISTINCT FROM 'validé') THEN
UPDATE public.portal_records SET status='terminée' WHERE id=m.id;
IF m.parent_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.portal_records WHERE parent_id=m.parent_id AND kind='mission' AND status<>'terminée') THEN UPDATE public.portal_records SET status='terminée' WHERE id=m.parent_id AND kind='service'; END IF;
ELSIF new.status='rejeté' AND m.status='en attente de validation' AND NOT EXISTS(SELECT 1 FROM public.portal_records WHERE parent_id=m.id AND kind='report' AND status IN ('soumis','en attente','validé') AND id<>new.id) THEN UPDATE public.portal_records SET status='en cours' WHERE id=m.id;
END IF; RETURN new; END $$;
CREATE TRIGGER portal_report_sync AFTER INSERT OR UPDATE ON public.portal_records FOR EACH ROW EXECUTE FUNCTION public.sync_portal_report();
CREATE OR REPLACE FUNCTION public.provider_mission_action(mission_id uuid, action text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE m public.portal_records; next_status text; BEGIN
SELECT * INTO m FROM public.portal_records WHERE id=mission_id FOR UPDATE;
IF auth.uid() IS NULL OR m.id IS NULL OR m.kind<>'mission' OR m.provider_id IS DISTINCT FROM auth.uid() OR NOT EXISTS(SELECT 1 FROM public.portal_roles WHERE user_id=auth.uid() AND role='provider') THEN RAISE EXCEPTION 'Forbidden'; END IF;
next_status=CASE WHEN m.status='attribuée' AND action='accept' THEN 'acceptée' WHEN m.status='attribuée' AND action='refuse' THEN 'refusée' WHEN m.status='acceptée' AND action='start' THEN 'en cours' WHEN m.status='en cours' AND action='finish' AND EXISTS(SELECT 1 FROM public.portal_records WHERE parent_id=m.id AND kind='report' AND status IN ('soumis','en attente')) THEN 'en attente de validation' END;
IF next_status IS NULL THEN RAISE EXCEPTION 'Invalid transition or missing report'; END IF;
UPDATE public.portal_records SET status=next_status,attributes=attributes||jsonb_build_object(action||'_at',now()) WHERE id=mission_id;
IF action='start' THEN UPDATE public.portal_records SET status='en cours' WHERE id=m.parent_id AND kind='service' AND status='planifiée'; END IF;
END $$;
CREATE OR REPLACE FUNCTION public.convert_portal_quote(quote_id uuid) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE q public.quote_requests; c uuid; s uuid; BEGIN
IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Direction only'; END IF;
SELECT * INTO q FROM public.quote_requests WHERE id=quote_id FOR UPDATE;
IF q.id IS NULL OR q.user_id IS NULL OR q.approved_at IS NULL OR q.offer IS NULL OR q.status NOT IN ('Offre approuvée','Chiffrage envoyé','En négociation','Signé','Traité') THEN RAISE EXCEPTION 'Approved quote with client account required'; END IF;
SELECT id INTO c FROM public.portal_records WHERE source_quote_id=q.id AND kind='contract';
IF c IS NULL THEN INSERT INTO public.portal_records(kind,title,status,owner_id,source_quote_id,created_by,attributes) VALUES('contract',q.pole||' — '||coalesce(q.organization,q.name),'brouillon',q.user_id,q.id,auth.uid(),jsonb_build_object('description',q.needs)) RETURNING id INTO c; END IF;
SELECT id INTO s FROM public.portal_records WHERE parent_id=c AND kind='service' ORDER BY created_at LIMIT 1;
IF s IS NULL THEN INSERT INTO public.portal_records(kind,title,status,owner_id,parent_id,created_by,attributes) VALUES('service',q.pole||' — '||q.place,'planifiée',q.user_id,c,auth.uid(),jsonb_build_object('description',q.needs,'site',q.place)) RETURNING id INTO s; END IF;
RETURN s; END $$;
REVOKE ALL ON FUNCTION public.convert_portal_quote(uuid) FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.convert_portal_quote(uuid) TO authenticated;
CREATE OR REPLACE VIEW public.portal_quotes WITH (security_barrier=true) AS SELECT id,created_at,pole,name,organization,phone,email,needs,place,desired_date,status,user_id,CASE WHEN public.has_role(auth.uid(),'admin') OR (status IN ('Offre approuvée','Chiffrage envoyé','En négociation','Signé','Traité') AND approved_at IS NOT NULL) THEN offer ELSE NULL END AS offer,CASE WHEN public.has_role(auth.uid(),'admin') OR (status IN ('Offre approuvée','Chiffrage envoyé','En négociation','Signé','Traité') AND approved_at IS NOT NULL) THEN amount ELSE NULL END AS amount,CASE WHEN public.has_role(auth.uid(),'admin') OR (status IN ('Offre approuvée','Chiffrage envoyé','En négociation','Signé','Traité') AND approved_at IS NOT NULL) THEN approved_at ELSE NULL END AS approved_at FROM public.quote_requests WHERE public.has_role(auth.uid(),'admin') OR user_id=auth.uid();