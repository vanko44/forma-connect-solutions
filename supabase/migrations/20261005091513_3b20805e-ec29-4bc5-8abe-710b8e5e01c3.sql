create or replace function public.grant_owner_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) in ('emmanuelvanko@gmail.com', 'formaeventandsecurity@gmail.com', 'formaeventandsecuriy@gmail.com') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;

create or replace function public.claim_direction_admin() returns boolean language plpgsql security definer set search_path = public as $$
declare
  direction_email text;
  confirmed_at timestamptz;
begin
  if auth.uid() is null then return false; end if;
  select lower(email), email_confirmed_at into direction_email, confirmed_at from auth.users where id = auth.uid();
  if direction_email not in ('emmanuelvanko@gmail.com', 'formaeventandsecurity@gmail.com', 'formaeventandsecuriy@gmail.com') or confirmed_at is null then
    return false;
  end if;
  insert into public.user_roles(user_id, role) values (auth.uid(), 'admin') on conflict do nothing;
  return true;
end $$;
revoke execute on function public.claim_direction_admin() from public, anon;
grant execute on function public.claim_direction_admin() to authenticated;
delete from public.user_roles r using auth.users u
where r.user_id = u.id and r.role = 'admin'
  and lower(u.email) in ('emmanuelvanko@gmail.com', 'formaeventandsecurity@gmail.com', 'formaeventandsecuriy@gmail.com')
  and u.email_confirmed_at is null;