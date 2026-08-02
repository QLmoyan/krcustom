-- Sprint 9: conversations / messages / notifications + Realtime publication
-- Chat images reuse Storage bucket project-images (no new bucket).
-- Demo RLS stays public-select compatible (same pattern as projects/orders).

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete set null,
  customer_id uuid,
  seller_id uuid,
  demo_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists conversations_demo_key_uidx
  on public.conversations (demo_key)
  where demo_key is not null;

create index if not exists conversations_project_id_idx
  on public.conversations (project_id);

create index if not exists conversations_customer_id_idx
  on public.conversations (customer_id);

create index if not exists conversations_seller_id_idx
  on public.conversations (seller_id);

create index if not exists conversations_updated_at_idx
  on public.conversations (updated_at desc);

create or replace function public.set_conversations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row
  execute function public.set_conversations_updated_at();

comment on table public.conversations is
  'Chat thread between customer and seller; optional project_id for Project Workspace.';

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid,
  sender_role text not null,
  content_type text not null default 'text',
  body text not null default '',
  image_url text,
  image_path text,
  is_read boolean not null default false,
  read_at timestamptz,
  demo_key text,
  created_at timestamptz not null default now(),
  constraint messages_sender_role_check
    check (sender_role in ('CUSTOMER', 'SELLER', 'ADMIN')),
  constraint messages_content_type_check
    check (content_type in ('text', 'image'))
);

create unique index if not exists messages_demo_key_uidx
  on public.messages (demo_key)
  where demo_key is not null;

create index if not exists messages_conversation_id_idx
  on public.messages (conversation_id);

create index if not exists messages_created_at_idx
  on public.messages (created_at asc);

create index if not exists messages_is_read_idx
  on public.messages (is_read);

comment on table public.messages is
  'Chat messages (text|image). Images may use Storage path in project-images or external image_url.';

-- Touch conversation.updated_at when a message is inserted
create or replace function public.touch_conversation_on_message()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
  after insert on public.messages
  for each row
  execute function public.touch_conversation_on_message();

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  type text not null,
  title text not null,
  body text not null default '',
  link_path text,
  entity_type text,
  entity_id uuid,
  is_read boolean not null default false,
  read_at timestamptz,
  demo_key text,
  created_at timestamptz not null default now(),
  constraint notifications_type_check
    check (type in (
      'QUOTE_UPDATED',
      'DESIGN_UPLOADED',
      'DESIGN_APPROVED',
      'ORDER_CREATED',
      'ORDER_PAID',
      'PRODUCTION_STARTED',
      'SHIPPED',
      'DELIVERED'
    ))
);

create unique index if not exists notifications_demo_key_uidx
  on public.notifications (demo_key)
  where demo_key is not null;

create index if not exists notifications_user_id_idx
  on public.notifications (user_id);

create index if not exists notifications_is_read_idx
  on public.notifications (is_read);

create index if not exists notifications_created_at_idx
  on public.notifications (created_at desc);

create index if not exists notifications_type_idx
  on public.notifications (type);

comment on table public.notifications is
  'User notifications with stable type codes (Quote/Design/Order lifecycle).';

-- ---------------------------------------------------------------------------
-- RLS (demo-compatible public read/write; tighten with Auth later)
-- ---------------------------------------------------------------------------

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "conversations_select_public" on public.conversations;
create policy "conversations_select_public"
  on public.conversations for select to anon, authenticated
  using (true);

drop policy if exists "conversations_insert_public" on public.conversations;
create policy "conversations_insert_public"
  on public.conversations for insert to anon, authenticated
  with check (true);

drop policy if exists "conversations_update_public" on public.conversations;
create policy "conversations_update_public"
  on public.conversations for update to anon, authenticated
  using (true) with check (true);

drop policy if exists "messages_select_public" on public.messages;
create policy "messages_select_public"
  on public.messages for select to anon, authenticated
  using (true);

drop policy if exists "messages_insert_public" on public.messages;
create policy "messages_insert_public"
  on public.messages for insert to anon, authenticated
  with check (true);

drop policy if exists "messages_update_public" on public.messages;
create policy "messages_update_public"
  on public.messages for update to anon, authenticated
  using (true) with check (true);

drop policy if exists "notifications_select_public" on public.notifications;
create policy "notifications_select_public"
  on public.notifications for select to anon, authenticated
  using (true);

drop policy if exists "notifications_insert_public" on public.notifications;
create policy "notifications_insert_public"
  on public.notifications for insert to anon, authenticated
  with check (true);

drop policy if exists "notifications_update_public" on public.notifications;
create policy "notifications_update_public"
  on public.notifications for update to anon, authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Realtime publication (idempotent)
-- ---------------------------------------------------------------------------

do $$
declare
  tbl text;
  tables text[] := array[
    'projects',
    'quotes',
    'quote_items',
    'design_proofs',
    'design_proof_versions',
    'orders',
    'timeline_events',
    'conversations',
    'messages',
    'notifications'
  ];
begin
  foreach tbl in array tables
  loop
    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'public' and table_name = tbl
    ) and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = tbl
    ) then
      execute format(
        'alter publication supabase_realtime add table public.%I',
        tbl
      );
    end if;
  end loop;
end $$;
