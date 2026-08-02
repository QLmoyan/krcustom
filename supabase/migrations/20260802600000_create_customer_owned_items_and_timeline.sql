-- Sprint 7 Phase 6: customer_owned_items + timeline_events
-- Customer-owned item lifecycle and project activity timeline.

-- ---------------------------------------------------------------------------
-- customer_owned_items
-- ---------------------------------------------------------------------------
create table if not exists public.customer_owned_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  customer_id uuid not null,
  item_number text not null,
  category text not null,
  name text not null,
  brand text not null default '',
  color text not null default '',
  size text not null default '',
  condition text not null default '',
  quantity integer not null default 1,
  tracking_company text not null default '',
  tracking_number text not null default '',
  received_at timestamptz,
  notes text not null default '',
  photos jsonb not null default '[]'::jsonb,
  status text not null,
  demo_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_owned_items_quantity_nonnegative check (quantity >= 0),
  constraint customer_owned_items_category_check check (
    category in ('tshirt', 'hoodie', 'ecoBag', 'cap', 'sneakers', 'jacket')
  ),
  constraint customer_owned_items_status_check check (
    status in (
      'WAITING_CUSTOMER_SHIPMENT',
      'CUSTOMER_SHIPPED',
      'DELIVERY_COMPLETED',
      'RECEIPT_CONFIRMATION_REQUIRED',
      'RECEIVED',
      'INFORMATION_MISMATCH',
      'PRODUCTION_UNAVAILABLE',
      'LABEL_PENDING',
      'READY_FOR_PRODUCTION',
      'IN_PRODUCTION',
      'INSPECTION',
      'PRODUCTION_COMPLETED',
      'RETURN_PENDING',
      'RETURN_SHIPPED',
      'RETURN_COMPLETED'
    )
  )
);

create unique index if not exists customer_owned_items_demo_key_uidx
  on public.customer_owned_items (demo_key)
  where demo_key is not null;

create unique index if not exists customer_owned_items_item_number_uidx
  on public.customer_owned_items (item_number);

create index if not exists customer_owned_items_project_id_idx
  on public.customer_owned_items (project_id);

create index if not exists customer_owned_items_customer_id_idx
  on public.customer_owned_items (customer_id);

create index if not exists customer_owned_items_status_idx
  on public.customer_owned_items (status);

create index if not exists customer_owned_items_updated_at_idx
  on public.customer_owned_items (updated_at desc);

create or replace function public.set_customer_owned_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customer_owned_items_set_updated_at on public.customer_owned_items;
create trigger customer_owned_items_set_updated_at
  before update on public.customer_owned_items
  for each row
  execute function public.set_customer_owned_items_updated_at();

alter table public.customer_owned_items enable row level security;

create policy "customer_owned_items_select_public"
  on public.customer_owned_items
  for select
  to anon, authenticated
  using (true);

create policy "customer_owned_items_insert_public"
  on public.customer_owned_items
  for insert
  to anon, authenticated
  with check (true);

create policy "customer_owned_items_update_public"
  on public.customer_owned_items
  for update
  to anon, authenticated
  using (true)
  with check (true);

comment on table public.customer_owned_items is
  'Customer-owned item sent to seller for custom work; demo_key aligns with coi-* routes.';

-- ---------------------------------------------------------------------------
-- timeline_events
-- ---------------------------------------------------------------------------
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  event_type text not null,
  title text not null,
  description text not null default '',
  status text not null default 'COMPLETED',
  actor_type text not null default 'SYSTEM',
  actor_id uuid,
  actor_name text not null default '',
  occurred_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  demo_key text,
  created_at timestamptz not null default now(),
  constraint timeline_events_event_type_check check (
    event_type in (
      'PROJECT_CREATED',
      'QUOTE_SENT',
      'QUOTE_ACCEPTED',
      'DESIGN_UPLOADED',
      'DESIGN_APPROVED',
      'ORDER_CREATED',
      'ITEM_RECEIVED',
      'PRODUCTION_STARTED',
      'QC_FINISHED',
      'SHIPPED',
      'DELIVERED'
    )
  ),
  constraint timeline_events_status_check check (
    status in ('COMPLETED', 'CURRENT', 'UPCOMING', 'ERROR', 'CANCELLED')
  ),
  constraint timeline_events_actor_type_check check (
    actor_type in ('CUSTOMER', 'SELLER', 'SYSTEM', 'ADMIN')
  )
);

create unique index if not exists timeline_events_demo_key_uidx
  on public.timeline_events (demo_key)
  where demo_key is not null;

create index if not exists timeline_events_project_id_created_at_idx
  on public.timeline_events (project_id, created_at);

create index if not exists timeline_events_project_id_occurred_at_idx
  on public.timeline_events (project_id, occurred_at);

create index if not exists timeline_events_event_type_idx
  on public.timeline_events (event_type);

alter table public.timeline_events enable row level security;

create policy "timeline_events_select_public"
  on public.timeline_events
  for select
  to anon, authenticated
  using (true);

create policy "timeline_events_insert_public"
  on public.timeline_events
  for insert
  to anon, authenticated
  with check (true);

create policy "timeline_events_update_public"
  on public.timeline_events
  for update
  to anon, authenticated
  using (true)
  with check (true);

comment on table public.timeline_events is
  'Project lifecycle timeline events; event_type uses stable codes, titles may be localized.';
