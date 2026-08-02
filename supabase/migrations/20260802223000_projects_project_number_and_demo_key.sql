-- Sprint 7 Phase 2 (corrected): business number + demo key
-- Keep UUID primary key; do not convert id to text.

alter table public.projects
  add column if not exists project_number text,
  add column if not exists demo_key text;

-- Backfill any pre-existing rows before enforcing NOT NULL (empty table is a no-op)
update public.projects
set project_number = 'PRJ-' || upper(substr(replace(id::text, '-', ''), 1, 12))
where project_number is null;

alter table public.projects
  alter column project_number set not null;

create unique index if not exists projects_project_number_uidx
  on public.projects (project_number);

create unique index if not exists projects_demo_key_uidx
  on public.projects (demo_key);
