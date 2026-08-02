-- V1.0 Release Gate: tighten RLS for Customer / Seller / Admin.
-- anon: no writes; limited public marketing reads (announcements only).
-- authenticated: participant / own-row access; demo_key rows readable.
-- ADMIN: full access via profiles.role = 'ADMIN'.

-- ---------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER to avoid profiles RLS recursion)
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'ADMIN'::public.user_role
  );
$$;

create or replace function public.is_project_participant(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects pr
    where pr.id = p_project_id
      and (
        pr.customer_id = auth.uid()
        or pr.seller_id = auth.uid()
        or public.is_admin()
      )
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_project_participant(uuid) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_project_participant(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Drop legacy open policies
-- ---------------------------------------------------------------------------

drop policy if exists "projects_select_public" on public.projects;
drop policy if exists "projects_insert_public" on public.projects;
drop policy if exists "projects_update_public" on public.projects;

drop policy if exists "quotes_select_public" on public.quotes;
drop policy if exists "quotes_insert_public" on public.quotes;
drop policy if exists "quotes_update_public" on public.quotes;
drop policy if exists "quote_items_select_public" on public.quote_items;
drop policy if exists "quote_items_insert_public" on public.quote_items;
drop policy if exists "quote_items_update_public" on public.quote_items;
drop policy if exists "quote_items_delete_public" on public.quote_items;
drop policy if exists "quote_revisions_select_public" on public.quote_revisions;
drop policy if exists "quote_revisions_insert_public" on public.quote_revisions;

drop policy if exists "design_proofs_select_public" on public.design_proofs;
drop policy if exists "design_proofs_insert_public" on public.design_proofs;
drop policy if exists "design_proofs_update_public" on public.design_proofs;
drop policy if exists "design_proof_versions_select_public" on public.design_proof_versions;
drop policy if exists "design_proof_versions_insert_public" on public.design_proof_versions;
drop policy if exists "design_proof_versions_update_public" on public.design_proof_versions;

drop policy if exists "orders_select_public" on public.orders;
drop policy if exists "orders_insert_public" on public.orders;
drop policy if exists "orders_update_public" on public.orders;
drop policy if exists "order_items_select_public" on public.order_items;
drop policy if exists "order_items_insert_public" on public.order_items;
drop policy if exists "order_items_update_public" on public.order_items;
drop policy if exists "order_items_delete_public" on public.order_items;
drop policy if exists "payment_records_select_public" on public.payment_records;
drop policy if exists "payment_records_insert_public" on public.payment_records;
drop policy if exists "payment_records_update_public" on public.payment_records;

drop policy if exists "customer_owned_items_select_public" on public.customer_owned_items;
drop policy if exists "customer_owned_items_insert_public" on public.customer_owned_items;
drop policy if exists "customer_owned_items_update_public" on public.customer_owned_items;

drop policy if exists "timeline_events_select_public" on public.timeline_events;
drop policy if exists "timeline_events_insert_public" on public.timeline_events;
drop policy if exists "timeline_events_update_public" on public.timeline_events;

drop policy if exists "conversations_select_public" on public.conversations;
drop policy if exists "conversations_insert_public" on public.conversations;
drop policy if exists "conversations_update_public" on public.conversations;
drop policy if exists "messages_select_public" on public.messages;
drop policy if exists "messages_insert_public" on public.messages;
drop policy if exists "messages_update_public" on public.messages;

drop policy if exists "notifications_select_public" on public.notifications;
drop policy if exists "notifications_insert_public" on public.notifications;
drop policy if exists "notifications_update_public" on public.notifications;

drop policy if exists "announcements_select_public" on public.announcements;
drop policy if exists "announcements_insert_public" on public.announcements;
drop policy if exists "announcements_update_public" on public.announcements;

drop policy if exists "profiles_select_public" on public.profiles;

-- ---------------------------------------------------------------------------
-- profiles: own row + admin; public nickname read for authenticated only
-- ---------------------------------------------------------------------------

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles
  for select
  to authenticated
  using (
    auth.uid() = id
    or public.is_admin()
    or true
  );

-- Keep own-row insert/update from prior migration.
-- Admin may update any profile.
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

create policy "projects_select_participant"
  on public.projects
  for select
  to authenticated
  using (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
    or demo_key is not null
  );

create policy "projects_insert_authenticated"
  on public.projects
  for insert
  to authenticated
  with check (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  );

create policy "projects_update_participant"
  on public.projects
  for update
  to authenticated
  using (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  )
  with check (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  );

-- ---------------------------------------------------------------------------
-- quotes / items / revisions
-- ---------------------------------------------------------------------------

create policy "quotes_select_participant"
  on public.quotes
  for select
  to authenticated
  using (
    public.is_admin()
    or demo_key is not null
    or public.is_project_participant(project_id)
  );

create policy "quotes_insert_participant"
  on public.quotes
  for insert
  to authenticated
  with check (
    public.is_admin()
    or public.is_project_participant(project_id)
  );

create policy "quotes_update_participant"
  on public.quotes
  for update
  to authenticated
  using (
    public.is_admin()
    or public.is_project_participant(project_id)
  )
  with check (
    public.is_admin()
    or public.is_project_participant(project_id)
  );

create policy "quote_items_select_participant"
  on public.quote_items
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.quotes q
      where q.id = quote_id
        and (
          q.demo_key is not null
          or public.is_project_participant(q.project_id)
        )
    )
  );

create policy "quote_items_write_participant"
  on public.quote_items
  for all
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.quotes q
      where q.id = quote_id
        and public.is_project_participant(q.project_id)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.quotes q
      where q.id = quote_id
        and public.is_project_participant(q.project_id)
    )
  );

create policy "quote_revisions_select_participant"
  on public.quote_revisions
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.quotes q
      where q.id = quote_id
        and (
          q.demo_key is not null
          or public.is_project_participant(q.project_id)
        )
    )
  );

create policy "quote_revisions_insert_participant"
  on public.quote_revisions
  for insert
  to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1 from public.quotes q
      where q.id = quote_id
        and public.is_project_participant(q.project_id)
    )
  );

-- ---------------------------------------------------------------------------
-- design proofs
-- ---------------------------------------------------------------------------

create policy "design_proofs_select_participant"
  on public.design_proofs
  for select
  to authenticated
  using (
    public.is_admin()
    or demo_key is not null
    or public.is_project_participant(project_id)
  );

create policy "design_proofs_insert_participant"
  on public.design_proofs
  for insert
  to authenticated
  with check (
    public.is_admin()
    or public.is_project_participant(project_id)
  );

create policy "design_proofs_update_participant"
  on public.design_proofs
  for update
  to authenticated
  using (
    public.is_admin()
    or public.is_project_participant(project_id)
  )
  with check (
    public.is_admin()
    or public.is_project_participant(project_id)
  );

create policy "design_proof_versions_select_participant"
  on public.design_proof_versions
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.design_proofs dp
      where dp.id = proof_id
        and (
          dp.demo_key is not null
          or public.is_project_participant(dp.project_id)
        )
    )
  );

create policy "design_proof_versions_write_participant"
  on public.design_proof_versions
  for all
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.design_proofs dp
      where dp.id = proof_id
        and public.is_project_participant(dp.project_id)
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.design_proofs dp
      where dp.id = proof_id
        and public.is_project_participant(dp.project_id)
    )
  );

-- ---------------------------------------------------------------------------
-- orders / items / payments
-- ---------------------------------------------------------------------------

create policy "orders_select_participant"
  on public.orders
  for select
  to authenticated
  using (
    public.is_admin()
    or demo_key is not null
    or customer_id = auth.uid()
    or seller_id = auth.uid()
    or (project_id is not null and public.is_project_participant(project_id))
  );

create policy "orders_insert_participant"
  on public.orders
  for insert
  to authenticated
  with check (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  );

create policy "orders_update_participant"
  on public.orders
  for update
  to authenticated
  using (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  )
  with check (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  );

create policy "order_items_select_participant"
  on public.order_items
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.demo_key is not null
          or o.customer_id = auth.uid()
          or o.seller_id = auth.uid()
        )
    )
  );

create policy "order_items_write_participant"
  on public.order_items
  for all
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.customer_id = auth.uid() or o.seller_id = auth.uid())
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.customer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

create policy "payment_records_select_participant"
  on public.payment_records
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.demo_key is not null
          or o.customer_id = auth.uid()
          or o.seller_id = auth.uid()
        )
    )
  );

create policy "payment_records_write_participant"
  on public.payment_records
  for all
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.customer_id = auth.uid() or o.seller_id = auth.uid())
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.customer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- customer owned items + timeline
-- ---------------------------------------------------------------------------

create policy "customer_owned_items_select_participant"
  on public.customer_owned_items
  for select
  to authenticated
  using (
    public.is_admin()
    or demo_key is not null
    or public.is_project_participant(project_id)
  );

create policy "customer_owned_items_write_participant"
  on public.customer_owned_items
  for all
  to authenticated
  using (
    public.is_admin()
    or public.is_project_participant(project_id)
  )
  with check (
    public.is_admin()
    or public.is_project_participant(project_id)
  );

create policy "timeline_events_select_participant"
  on public.timeline_events
  for select
  to authenticated
  using (
    public.is_admin()
    or demo_key is not null
    or public.is_project_participant(project_id)
  );

create policy "timeline_events_write_participant"
  on public.timeline_events
  for all
  to authenticated
  using (
    public.is_admin()
    or public.is_project_participant(project_id)
  )
  with check (
    public.is_admin()
    or public.is_project_participant(project_id)
  );

-- ---------------------------------------------------------------------------
-- chat
-- ---------------------------------------------------------------------------

create policy "conversations_select_participant"
  on public.conversations
  for select
  to authenticated
  using (
    public.is_admin()
    or demo_key is not null
    or customer_id = auth.uid()
    or seller_id = auth.uid()
    or (project_id is not null and public.is_project_participant(project_id))
  );

create policy "conversations_insert_participant"
  on public.conversations
  for insert
  to authenticated
  with check (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  );

create policy "conversations_update_participant"
  on public.conversations
  for update
  to authenticated
  using (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  )
  with check (
    public.is_admin()
    or customer_id = auth.uid()
    or seller_id = auth.uid()
  );

create policy "messages_select_participant"
  on public.messages
  for select
  to authenticated
  using (
    public.is_admin()
    or demo_key is not null
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (
          c.customer_id = auth.uid()
          or c.seller_id = auth.uid()
          or c.demo_key is not null
        )
    )
  );

create policy "messages_insert_participant"
  on public.messages
  for insert
  to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.customer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "messages_update_participant"
  on public.messages
  for update
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.customer_id = auth.uid() or c.seller_id = auth.uid())
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.customer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- notifications: own rows only (+ admin)
-- ---------------------------------------------------------------------------

create policy "notifications_select_own"
  on public.notifications
  for select
  to authenticated
  using (
    public.is_admin()
    or user_id = auth.uid()
  );

create policy "notifications_insert_authenticated"
  on public.notifications
  for insert
  to authenticated
  with check (
    public.is_admin()
    or user_id = auth.uid()
    or user_id is not null
  );

create policy "notifications_update_own"
  on public.notifications
  for update
  to authenticated
  using (
    public.is_admin()
    or user_id = auth.uid()
  )
  with check (
    public.is_admin()
    or user_id = auth.uid()
  );

-- ---------------------------------------------------------------------------
-- announcements: anon + authenticated can read; only admin writes
-- ---------------------------------------------------------------------------

create policy "announcements_select_public"
  on public.announcements
  for select
  to anon, authenticated
  using (true);

create policy "announcements_write_admin"
  on public.announcements
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
