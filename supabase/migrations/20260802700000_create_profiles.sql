-- Sprint 8 Phase 1: profiles (business Profile linked to Supabase Auth)
--
-- Pattern: profiles.id = auth.users.id
-- One UUID identity for both Auth and business Profile (customer_id / seller_id
-- in projects/orders can equal profiles.id when demo auth users are created
-- with the fixed seed UUIDs below). Clearer than a separate auth_user_id column.
--
-- Existing projects/orders public demo RLS is intentionally left unchanged.

create type public.user_role as enum ('CUSTOMER', 'SELLER', 'ADMIN');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'CUSTOMER',
  nickname text not null default '',
  avatar text,
  phone text,
  language text not null default 'ko',
  demo_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_language_nonempty check (char_length(trim(language)) > 0)
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_demo_key_idx on public.profiles (demo_key)
  where demo_key is not null;

comment on table public.profiles is
  'Business Profile. PK id equals auth.users.id (1:1). Role: CUSTOMER|SELLER|ADMIN.';
comment on column public.profiles.id is
  'Same UUID as auth.users.id — preferred over a separate auth_user_id FK.';
comment on column public.profiles.demo_key is
  'Optional stable demo label (e.g. demo-customer, demo-seller) for seed linkage.';

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- Auto-create a CUSTOMER profile when a new auth user registers.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nickname, language)
  values (
    new.id,
    'CUSTOMER',
    coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1), ''),
    coalesce(new.raw_user_meta_data ->> 'language', 'ko')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

alter table public.profiles enable row level security;

-- Logged-in users can read their own profile.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Logged-in users can update their own profile (not role escalation via client).
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- Inserts are normally done by the auth trigger (security definer).
-- Allow authenticated insert of own row as a safety net (e.g. missed trigger).
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Phase 1: no broad admin policies; service_role bypasses RLS when needed.

grant select, insert, update on table public.profiles to authenticated;
grant usage on type public.user_role to authenticated, anon, service_role;
