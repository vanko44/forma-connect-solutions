create or replace function public.grant_owner_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE'
     and lower(old.email) in ('emmanuelvanko@gmail.com', 'formaeventandsecurity@gmail.com', 'formaeventandsecuriy@gmail.com')
     and (new.email_confirmed_at is null or lower(new.email) not in ('emmanuelvanko@gmail.com', 'formaeventandsecurity@gmail.com', 'formaeventandsecuriy@gmail.com')) then
    delete from public.user_roles where user_id = new.id and role = 'admin';
  end if;
  if new.email_confirmed_at is not null
     and lower(new.email) in ('emmanuelvanko@gmail.com', 'formaeventandsecurity@gmail.com', 'formaeventandsecuriy@gmail.com') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_direction_confirmed_admin after update of email_confirmed_at, email on auth.users for each row execute function public.grant_owner_admin();
insert into public.user_roles(user_id, role)
select id, 'admin' from auth.users
where email_confirmed_at is not null
  and lower(email) in ('emmanuelvanko@gmail.com', 'formaeventandsecurity@gmail.com', 'formaeventandsecuriy@gmail.com')
on conflict do nothing;
revoke execute on function public.claim_direction_admin() from authenticated;