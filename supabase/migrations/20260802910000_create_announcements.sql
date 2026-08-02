-- Sprint 10: announcements + demo-compatible profiles select
-- Prefer timeline_events + notifications for workflow logging (no workflow_events table).

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  published_at timestamptz,
  demo_key text,
  created_at timestamptz not null default now(),
  constraint announcements_title_nonempty check (char_length(trim(title)) > 0)
);

create unique index if not exists announcements_demo_key_uidx
  on public.announcements (demo_key)
  where demo_key is not null;

create index if not exists announcements_published_at_idx
  on public.announcements (published_at desc nulls last);

create index if not exists announcements_created_at_idx
  on public.announcements (created_at desc);

comment on table public.announcements is
  'Platform announcements for admin console and optional storefront banners.';
comment on column public.announcements.demo_key is
  'Optional stable demo label for seed linkage.';
comment on column public.announcements.published_at is
  'Null = draft / not yet published; set when visible.';

alter table public.announcements enable row level security;

drop policy if exists "announcements_select_public" on public.announcements;
create policy "announcements_select_public"
  on public.announcements for select to anon, authenticated
  using (true);

drop policy if exists "announcements_insert_public" on public.announcements;
create policy "announcements_insert_public"
  on public.announcements for insert to anon, authenticated
  with check (true);

drop policy if exists "announcements_update_public" on public.announcements;
create policy "announcements_update_public"
  on public.announcements for update to anon, authenticated
  using (true) with check (true);

-- Demo-compatible public read for admin lists (profiles were own-select only).
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
  on public.profiles for select to anon, authenticated
  using (true);

grant select, insert, update on table public.announcements to anon, authenticated;
