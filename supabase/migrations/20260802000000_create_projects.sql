-- Sprint 7 Phase 1: projects table
-- Core Project entity for custom service transactions

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null,
  customer_id uuid not null,
  seller_id uuid not null,
  status text not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_service_id_idx on public.projects (service_id);
create index if not exists projects_customer_id_idx on public.projects (customer_id);
create index if not exists projects_seller_id_idx on public.projects (seller_id);
create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_updated_at_idx on public.projects (updated_at desc);

create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_projects_updated_at();

alter table public.projects enable row level security;

-- Phase 1: publishable-key access for foundation / demo (tighten with Auth later)
create policy "projects_select_public"
  on public.projects
  for select
  to anon, authenticated
  using (true);

create policy "projects_insert_public"
  on public.projects
  for insert
  to anon, authenticated
  with check (true);

create policy "projects_update_public"
  on public.projects
  for update
  to anon, authenticated
  using (true)
  with check (true);

comment on table public.projects is 'Custom service transaction workspace (Project), not a product SKU.';
