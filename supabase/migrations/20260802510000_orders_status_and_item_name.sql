-- Sprint 7 Phase 5 follow-up: align orders schema with final design.
-- Already-applied 20260802500000 created base tables; this migration:
--   - renames order_items.title → item_name
--   - adds production_status / shipping_status
--   - adds check constraints for stable status enums
--   - normalizes existing demo row values

-- ---------------------------------------------------------------------------
-- order_items: title → item_name
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'order_items'
      and column_name = 'title'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'order_items'
      and column_name = 'item_name'
  ) then
    alter table public.order_items rename column title to item_name;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- orders: production_status / shipping_status
-- ---------------------------------------------------------------------------
alter table public.orders
  add column if not exists production_status text not null default 'PENDING';

alter table public.orders
  add column if not exists shipping_status text not null default 'PENDING';

-- Normalize legacy free-form values before adding checks
update public.orders
set
  status = case
    when status in ('DRAFT') then 'DRAFT'
    when status in ('CONFIRMED', 'ORDER_CONFIRMED', 'PAID') then 'CONFIRMED'
    when status in ('IN_PRODUCTION', 'INSPECTION', 'PRODUCTION_COMPLETED') then 'IN_PRODUCTION'
    when status in ('READY_TO_SHIP', 'SHIPPING_PENDING', 'SHIPPED') then 'READY_TO_SHIP'
    when status in ('COMPLETED', 'DELIVERED') then 'COMPLETED'
    when status in ('CANCELLED', 'CANCELLATION_REQUESTED', 'REFUNDED') then 'CANCELLED'
    else 'COMPLETED'
  end,
  payment_status = case
    when payment_status in ('PAID') then 'PAID'
    when payment_status in ('REFUNDED', 'PARTIALLY_REFUNDED') then 'REFUNDED'
    else 'PENDING'
  end,
  production_status = coalesce(nullif(production_status, ''), 'PENDING'),
  shipping_status = coalesce(nullif(shipping_status, ''), 'PENDING');

-- Demo ord-001: completed delivery profile
update public.orders
set
  status = 'COMPLETED',
  payment_status = 'PAID',
  production_status = 'FINISHED',
  shipping_status = 'DELIVERED'
where demo_key = 'ord-001'
   or order_number = 'ORD-20260802-001';

update public.payment_records
set status = case
  when status in ('PAID') then 'PAID'
  when status in ('REFUNDED', 'PARTIALLY_REFUNDED') then 'REFUNDED'
  when status in ('FAILED', 'CANCELLED') then 'PENDING'
  else 'PENDING'
end;

-- ---------------------------------------------------------------------------
-- Check constraints (drop-if-exists then recreate for idempotent re-run safety)
-- ---------------------------------------------------------------------------
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (status in (
    'DRAFT',
    'CONFIRMED',
    'IN_PRODUCTION',
    'READY_TO_SHIP',
    'COMPLETED',
    'CANCELLED'
  ));

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('PENDING', 'PAID', 'REFUNDED'));

alter table public.orders drop constraint if exists orders_production_status_check;
alter table public.orders
  add constraint orders_production_status_check
  check (production_status in (
    'PENDING',
    'DESIGN',
    'PRINTING',
    'QC',
    'FINISHED'
  ));

alter table public.orders drop constraint if exists orders_shipping_status_check;
alter table public.orders
  add constraint orders_shipping_status_check
  check (shipping_status in (
    'PENDING',
    'PREPARING',
    'SHIPPED',
    'DELIVERED'
  ));

alter table public.payment_records drop constraint if exists payment_records_status_check;
alter table public.payment_records
  add constraint payment_records_status_check
  check (status in ('PENDING', 'PAID', 'REFUNDED'));

alter table public.orders
  alter column payment_status set default 'PENDING';

create index if not exists orders_production_status_idx
  on public.orders (production_status);

create index if not exists orders_shipping_status_idx
  on public.orders (shipping_status);

comment on column public.orders.production_status is 'Production pipeline: PENDING | DESIGN | PRINTING | QC | FINISHED';
comment on column public.orders.shipping_status is 'Shipping pipeline: PENDING | PREPARING | SHIPPED | DELIVERED';
comment on column public.order_items.item_name is 'Line item display name (was title in initial migration).';
