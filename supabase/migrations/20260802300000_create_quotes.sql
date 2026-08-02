-- Sprint 7 Phase 3: quotes / quote_items / quote_revisions
-- Quote versions are append-only (V1, V2, V3…); do not overwrite historical rows.

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  version integer not null,
  status text not null,
  subtotal integer not null default 0,
  discount integer not null default 0,
  shipping_fee integer not null default 0,
  extra_fee integer not null default 0,
  tax integer not null default 0,
  total integer not null default 0,
  currency text not null default 'KRW',
  note text not null default '',
  created_by text not null default '',
  approved_by text not null default '',
  approved_at timestamptz,
  sent_at timestamptz,
  expires_at date,
  customer_confirmed boolean not null default false,
  demo_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quotes_version_positive check (version > 0),
  constraint quotes_project_version_uidx unique (project_id, version)
);

create unique index if not exists quotes_demo_key_uidx
  on public.quotes (demo_key)
  where demo_key is not null;

create index if not exists quotes_project_id_idx
  on public.quotes (project_id);

create index if not exists quotes_version_idx
  on public.quotes (project_id, version desc);

create index if not exists quotes_status_idx
  on public.quotes (status);

create index if not exists quotes_updated_at_idx
  on public.quotes (updated_at desc);

create or replace function public.set_quotes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at
  before update on public.quotes
  for each row
  execute function public.set_quotes_updated_at();

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  name text not null,
  description text not null default '',
  quantity integer not null default 1,
  unit_price integer not null default 0,
  amount integer not null default 0,
  editable boolean not null default true,
  sort_order integer not null default 0,
  demo_key text,
  created_at timestamptz not null default now(),
  constraint quote_items_quantity_nonnegative check (quantity >= 0)
);

create index if not exists quote_items_quote_id_idx
  on public.quote_items (quote_id);

create unique index if not exists quote_items_demo_key_uidx
  on public.quote_items (demo_key)
  where demo_key is not null;

-- Append-only change / revision log (historical versions are never overwritten)
create table if not exists public.quote_revisions (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  version integer not null,
  summary text not null,
  actor text not null default '',
  occurred_at timestamptz not null default now(),
  demo_key text,
  created_at timestamptz not null default now(),
  constraint quote_revisions_version_positive check (version > 0)
);

create index if not exists quote_revisions_quote_id_idx
  on public.quote_revisions (quote_id);

create index if not exists quote_revisions_version_idx
  on public.quote_revisions (quote_id, version);

create unique index if not exists quote_revisions_demo_key_uidx
  on public.quote_revisions (demo_key)
  where demo_key is not null;

alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.quote_revisions enable row level security;

-- Phase 3: publishable-key access for foundation / demo (tighten with Auth later)
create policy "quotes_select_public"
  on public.quotes
  for select
  to anon, authenticated
  using (true);

create policy "quotes_insert_public"
  on public.quotes
  for insert
  to anon, authenticated
  with check (true);

create policy "quotes_update_public"
  on public.quotes
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "quote_items_select_public"
  on public.quote_items
  for select
  to anon, authenticated
  using (true);

create policy "quote_items_insert_public"
  on public.quote_items
  for insert
  to anon, authenticated
  with check (true);

create policy "quote_items_update_public"
  on public.quote_items
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "quote_items_delete_public"
  on public.quote_items
  for delete
  to anon, authenticated
  using (true);

create policy "quote_revisions_select_public"
  on public.quote_revisions
  for select
  to anon, authenticated
  using (true);

create policy "quote_revisions_insert_public"
  on public.quote_revisions
  for insert
  to anon, authenticated
  with check (true);

comment on table public.quotes is 'Append-only quote versions for a Project (V1, V2, …).';
comment on table public.quote_items is 'Line items belonging to a single quote version.';
comment on table public.quote_revisions is 'Append-only change log / revision history for quote versions.';
