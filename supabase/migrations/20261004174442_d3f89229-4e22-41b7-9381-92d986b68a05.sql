create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.grant_owner_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin if lower(new.email) = 'emmanuelvanko@gmail.com' then insert into public.user_roles(user_id, role) values (new.id,'admin') on conflict do nothing; end if; return new; end $$;
create trigger on_auth_user_owner_admin after insert on auth.users for each row execute function public.grant_owner_admin();
insert into public.user_roles(user_id, role) select id,'admin' from auth.users where lower(email)='emmanuelvanko@gmail.com' on conflict do nothing;

create table public.quote_requests (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), pole text not null, name text not null, organization text, phone text not null, email text, needs text not null, place text not null, desired_date text, amount text, status text not null default 'Nouveau');
grant insert on public.quote_requests to anon, authenticated; grant select, update, delete on public.quote_requests to authenticated; grant all on public.quote_requests to service_role;
alter table public.quote_requests enable row level security;
create policy "Anyone submits quotes" on public.quote_requests for insert to anon, authenticated with check (status = 'Nouveau' and length(name) between 2 and 100 and length(needs) <= 1500);
create policy "Admins manage quotes" on public.quote_requests for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.partner_applications (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), business_name text not null, manager_name text not null, trade text not null, phone text not null, email text not null, documents text, details text not null, status text not null default 'Candidature reçue');
grant insert on public.partner_applications to anon, authenticated; grant select, update, delete on public.partner_applications to authenticated; grant all on public.partner_applications to service_role;
alter table public.partner_applications enable row level security;
create policy "Anyone applies" on public.partner_applications for insert to anon, authenticated with check (status = 'Candidature reçue' and length(details) <= 6000);
create policy "Admins manage partners" on public.partner_applications for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.security_sites (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), site text not null, location text not null, day_posts int not null default 0, night_posts int not null default 0, supervisor text, last_report text, status text not null default 'Opérationnel');
grant select, insert, update, delete on public.security_sites to authenticated; grant all on public.security_sites to service_role;
alter table public.security_sites enable row level security;
create policy "Admins manage sites" on public.security_sites for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));