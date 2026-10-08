CREATE SEQUENCE public.mission_order_number_seq;
CREATE TABLE public.mission_orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 order_number text NOT NULL UNIQUE DEFAULT ('ODM-' || extract(year from now())::text || '-' || lpad(nextval('public.mission_order_number_seq')::text, 3, '0')),
 partner_id uuid REFERENCES public.partner_applications(id) ON DELETE SET NULL,
 partner_name text NOT NULL,
 partner_phone text NOT NULL DEFAULT '',
 partner_email text NOT NULL DEFAULT '',
 title text NOT NULL,
 pole text NOT NULL CHECK (pole IN ('Facility Management','Événementiel','Support technique')),
 client_site text NOT NULL,
 location text NOT NULL DEFAULT 'Kinshasa',
 start_date date NOT NULL,
 end_date date NOT NULL,
 instructions text NOT NULL DEFAULT '',
 supervisor text NOT NULL DEFAULT '',
 amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
 paid_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0 AND paid_amount <= amount),
 due_date date,
 status text NOT NULL DEFAULT 'Brouillon' CHECK (status IN ('Brouillon','Émis / Transmis','En cours d''exécution','Livrable contrôlé','Clôturé')),
 CHECK (end_date >= start_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_orders TO authenticated;
GRANT ALL ON public.mission_orders TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.mission_order_number_seq TO authenticated, service_role;
ALTER TABLE public.mission_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Direction manages mission orders" ON public.mission_orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX mission_orders_created_idx ON public.mission_orders(created_at DESC);