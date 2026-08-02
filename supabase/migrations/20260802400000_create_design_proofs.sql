-- Sprint 7 Phase 4: design_proofs / design_proof_versions
-- One proof entity per project; versions are append-only (V1, V2, V3…).

create table if not exists public.design_proofs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  current_version integer not null default 1,
  status text not null,
  customer_comment text not null default '',
  seller_comment text not null default '',
  approved_at timestamptz,
  rejected_at timestamptz,
  demo_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint design_proofs_current_version_positive check (current_version > 0)
);

create unique index if not exists design_proofs_demo_key_uidx
  on public.design_proofs (demo_key)
  where demo_key is not null;

create unique index if not exists design_proofs_project_id_uidx
  on public.design_proofs (project_id);

create index if not exists design_proofs_status_idx
  on public.design_proofs (status);

create index if not exists design_proofs_updated_at_idx
  on public.design_proofs (updated_at desc);

create or replace function public.set_design_proofs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists design_proofs_set_updated_at on public.design_proofs;
create trigger design_proofs_set_updated_at
  before update on public.design_proofs
  for each row
  execute function public.set_design_proofs_updated_at();

create table if not exists public.design_proof_versions (
  id uuid primary key default gen_random_uuid(),
  proof_id uuid not null references public.design_proofs (id) on delete cascade,
  version_no integer not null,
  image_url text not null default '',
  thumbnail_url text not null default '',
  notes text not null default '',
  demo_key text,
  created_at timestamptz not null default now(),
  constraint design_proof_versions_version_positive check (version_no > 0),
  constraint design_proof_versions_proof_version_uidx unique (proof_id, version_no)
);

create unique index if not exists design_proof_versions_demo_key_uidx
  on public.design_proof_versions (demo_key)
  where demo_key is not null;

create index if not exists design_proof_versions_proof_id_idx
  on public.design_proof_versions (proof_id);

create index if not exists design_proof_versions_version_idx
  on public.design_proof_versions (proof_id, version_no desc);

alter table public.design_proofs enable row level security;
alter table public.design_proof_versions enable row level security;

-- Phase 4: publishable-key access for foundation / demo (tighten with Auth later)
create policy "design_proofs_select_public"
  on public.design_proofs
  for select
  to anon, authenticated
  using (true);

create policy "design_proofs_insert_public"
  on public.design_proofs
  for insert
  to anon, authenticated
  with check (true);

create policy "design_proofs_update_public"
  on public.design_proofs
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "design_proof_versions_select_public"
  on public.design_proof_versions
  for select
  to anon, authenticated
  using (true);

create policy "design_proof_versions_insert_public"
  on public.design_proof_versions
  for insert
  to anon, authenticated
  with check (true);

create policy "design_proof_versions_update_public"
  on public.design_proof_versions
  for update
  to anon, authenticated
  using (true)
  with check (true);

comment on table public.design_proofs is 'Design proof entity for a Project (current version + review status).';
comment on table public.design_proof_versions is 'Append-only design proof image versions (V1, V2, …); never overwrite history.';
