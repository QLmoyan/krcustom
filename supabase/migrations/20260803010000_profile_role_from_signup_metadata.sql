-- Sprint V1.0: honor role from auth signup metadata when creating profiles.
-- Default remains CUSTOMER when metadata.role is missing or invalid.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  resolved_role public.user_role;
begin
  requested_role := upper(coalesce(new.raw_user_meta_data ->> 'role', 'CUSTOMER'));
  if requested_role in ('CUSTOMER', 'SELLER', 'ADMIN') then
    resolved_role := requested_role::public.user_role;
  else
    resolved_role := 'CUSTOMER'::public.user_role;
  end if;

  insert into public.profiles (id, role, nickname, language)
  values (
    new.id,
    resolved_role,
    coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1), ''),
    coalesce(new.raw_user_meta_data ->> 'language', 'ko')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
