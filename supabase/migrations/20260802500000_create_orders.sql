-- Sprint 7 Phase 5: orders / order_items / payment_records
-- Order is the paid transaction linked to a Project (and optionally an accepted Quote).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  quote_id uuid references public.quotes (id) on delete set null,
  seller_id uuid not null,
  customer_id uuid not null,
  order_number text not null,
  status text not null,
  subtotal integer not null default 0,
  shipping_fee integer not null default 0,
  discount integer not null default 0,
  tax integer not null default 0,
  total integer not null default 0,
  currency text not null default 'KRW',
  payment_status text not null default 'READY',
  demo_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_order_number_uidx unique (order_number)
);

create unique index if not exists orders_demo_key_uidx
  on public.orders (demo_key)
  where demo_key is not null;

create index if not exists orders_project_id_idx
  on public.orders (project_id);

create index if not exists orders_quote_id_idx
  on public.orders (quote_id);

create index if not exists orders_seller_id_idx
  on public.orders (seller_id);

create index if not exists orders_customer_id_idx
  on public.orders (customer_id);

create index if not exists orders_status_idx
  on public.orders (status);

create index if not exists orders_payment_status_idx
  on public.orders (payment_status);

create index if not exists orders_updated_at_idx
  on public.orders (updated_at desc);

create or replace function public.set_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row
  execute function public.set_orders_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  title text not null,
  quantity integer not null default 1,
  unit_price integer not null default 0,
  total_price integer not null default 0,
  demo_key text,
  created_at timestamptz not null default now(),
  constraint order_items_quantity_nonnegative check (quantity >= 0)
);

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create unique index if not exists order_items_demo_key_uidx
  on public.order_items (demo_key)
  where demo_key is not null;

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  method text not null,
  status text not null,
  amount integer not null default 0,
  transaction_no text not null default '',
  paid_at timestamptz,
  demo_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_records_order_id_idx
  on public.payment_records (order_id);

create index if not exists payment_records_status_idx
  on public.payment_records (status);

create unique index if not exists payment_records_demo_key_uidx
  on public.payment_records (demo_key)
  where demo_key is not null;

create or replace function public.set_payment_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists payment_records_set_updated_at on public.payment_records;
create trigger payment_records_set_updated_at
  before update on public.payment_records
  for each row
  execute function public.set_payment_records_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_records enable row level security;

-- Phase 5: publishable-key access for foundation / demo (tighten with Auth later)
create policy "orders_select_public"
  on public.orders
  for select
  to anon, authenticated
  using (true);

create policy "orders_insert_public"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

create policy "orders_update_public"
  on public.orders
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "order_items_select_public"
  on public.order_items
  for select
  to anon, authenticated
  using (true);

create policy "order_items_insert_public"
  on public.order_items
  for insert
  to anon, authenticated
  with check (true);

create policy "order_items_update_public"
  on public.order_items
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "order_items_delete_public"
  on public.order_items
  for delete
  to anon, authenticated
  using (true);

create policy "payment_records_select_public"
  on public.payment_records
  for select
  to anon, authenticated
  using (true);

create policy "payment_records_insert_public"
  on public.payment_records
  for insert
  to anon, authenticated
  with check (true);

create policy "payment_records_update_public"
  on public.payment_records
  for update
  to anon, authenticated
  using (true)
  with check (true);

comment on table public.orders is 'Paid custom-service order linked to a Project (and optional Quote).';
comment on table public.order_items is 'Line items belonging to a single order.';
comment on table public.payment_records is 'Payment attempts / records for an order.';
