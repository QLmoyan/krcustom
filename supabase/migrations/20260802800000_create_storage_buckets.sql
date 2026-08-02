-- Sprint 8 Phase 2: Supabase Storage buckets + storage.objects RLS
-- Idempotent: buckets upsert on conflict; policies drop + recreate.
-- Does not change existing public demo RLS on business tables.
--
-- Path convention (object name within bucket):
--   {userId|demo}/{entityId}/{filename}

-- ---------------------------------------------------------------------------
-- Buckets
-- public-assets, avatars → public
-- design-proofs, customer-items, project-images → private (signed URL)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  ),
  (
    'public-assets',
    'public-assets',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
  ),
  (
    'project-images',
    'project-images',
    false,
    20971520,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']::text[]
  ),
  (
    'design-proofs',
    'design-proofs',
    false,
    20971520,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']::text[]
  ),
  (
    'customer-items',
    'customer-items',
    false,
    20971520,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.current_profile_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid();
$$;

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

create or replace function public.storage_object_owner(object_name text)
returns text
language sql
immutable
as $$
  select nullif(split_part(object_name, '/', 1), '');
$$;

create or replace function public.is_storage_object_owner(object_name text)
returns boolean
language sql
stable
as $$
  select
    auth.uid() is not null
    and public.storage_object_owner(object_name) = auth.uid()::text;
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
      )
  );
$$;

-- Safe: entity folder may be demo_key (not uuid) → false
create or replace function public.is_project_participant_from_path(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  entity_part text;
  entity_uuid uuid;
begin
  entity_part := nullif(split_part(object_name, '/', 2), '');
  if entity_part is null then
    return false;
  end if;
  begin
    entity_uuid := entity_part::uuid;
  exception
    when invalid_text_representation then
      return false;
  end;
  return public.is_project_participant(entity_uuid);
end;
$$;

grant execute on function public.current_profile_role() to authenticated, anon;
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.storage_object_owner(text) to authenticated, anon;
grant execute on function public.is_storage_object_owner(text) to authenticated, anon;
grant execute on function public.is_project_participant(uuid) to authenticated, anon;
grant execute on function public.is_project_participant_from_path(text) to authenticated, anon;

-- ---------------------------------------------------------------------------
-- storage.objects policies
-- ---------------------------------------------------------------------------

-- Public SELECT
drop policy if exists "storage_public_select_avatars" on storage.objects;
create policy "storage_public_select_avatars"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'avatars');

drop policy if exists "storage_public_select_public_assets" on storage.objects;
create policy "storage_public_select_public_assets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'public-assets');

-- Private SELECT (owner / demo folder / project participant / admin)
drop policy if exists "storage_private_select_design_proofs" on storage.objects;
create policy "storage_private_select_design_proofs"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'design-proofs'
    and (
      public.is_admin()
      or public.is_storage_object_owner(name)
      or public.storage_object_owner(name) = 'demo'
      or public.is_project_participant_from_path(name)
    )
  );

drop policy if exists "storage_private_select_customer_items" on storage.objects;
create policy "storage_private_select_customer_items"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'customer-items'
    and (
      public.is_admin()
      or public.is_storage_object_owner(name)
      or public.storage_object_owner(name) = 'demo'
      or public.is_project_participant_from_path(name)
    )
  );

drop policy if exists "storage_private_select_project_images" on storage.objects;
create policy "storage_private_select_project_images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'project-images'
    and (
      public.is_admin()
      or public.is_storage_object_owner(name)
      or public.storage_object_owner(name) = 'demo'
      or public.is_project_participant_from_path(name)
    )
  );

-- avatars write (own folder or admin)
drop policy if exists "storage_insert_avatars" on storage.objects;
create policy "storage_insert_avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (public.is_admin() or public.is_storage_object_owner(name))
  );

drop policy if exists "storage_update_avatars" on storage.objects;
create policy "storage_update_avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (public.is_admin() or public.is_storage_object_owner(name))
  )
  with check (
    bucket_id = 'avatars'
    and (public.is_admin() or public.is_storage_object_owner(name))
  );

drop policy if exists "storage_delete_avatars" on storage.objects;
create policy "storage_delete_avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (public.is_admin() or public.is_storage_object_owner(name))
  );

-- public-assets write (seller / admin)
drop policy if exists "storage_insert_public_assets" on storage.objects;
create policy "storage_insert_public_assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'public-assets'
    and (
      public.is_admin()
      or public.current_profile_role() in (
        'SELLER'::public.user_role,
        'ADMIN'::public.user_role
      )
    )
  );

drop policy if exists "storage_update_public_assets" on storage.objects;
create policy "storage_update_public_assets"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'public-assets'
    and (
      public.is_admin()
      or public.current_profile_role() in (
        'SELLER'::public.user_role,
        'ADMIN'::public.user_role
      )
    )
  )
  with check (
    bucket_id = 'public-assets'
    and (
      public.is_admin()
      or public.current_profile_role() in (
        'SELLER'::public.user_role,
        'ADMIN'::public.user_role
      )
    )
  );

drop policy if exists "storage_delete_public_assets" on storage.objects;
create policy "storage_delete_public_assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'public-assets'
    and public.is_admin()
  );

-- design-proofs write (seller / admin, own folder)
drop policy if exists "storage_insert_design_proofs" on storage.objects;
create policy "storage_insert_design_proofs"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'design-proofs'
    and (
      public.is_admin()
      or (
        public.is_storage_object_owner(name)
        and public.current_profile_role() in (
          'SELLER'::public.user_role,
          'ADMIN'::public.user_role
        )
      )
    )
  );

drop policy if exists "storage_update_design_proofs" on storage.objects;
create policy "storage_update_design_proofs"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'design-proofs'
    and (
      public.is_admin()
      or (
        public.is_storage_object_owner(name)
        and public.current_profile_role() in (
          'SELLER'::public.user_role,
          'ADMIN'::public.user_role
        )
      )
    )
  )
  with check (
    bucket_id = 'design-proofs'
    and (
      public.is_admin()
      or (
        public.is_storage_object_owner(name)
        and public.current_profile_role() in (
          'SELLER'::public.user_role,
          'ADMIN'::public.user_role
        )
      )
    )
  );

drop policy if exists "storage_delete_design_proofs" on storage.objects;
create policy "storage_delete_design_proofs"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'design-proofs'
    and (
      public.is_admin()
      or (
        public.is_storage_object_owner(name)
        and public.current_profile_role() in (
          'SELLER'::public.user_role,
          'ADMIN'::public.user_role
        )
      )
    )
  );

-- customer-items write (customer / seller / admin, own folder)
drop policy if exists "storage_insert_customer_items" on storage.objects;
create policy "storage_insert_customer_items"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'customer-items'
    and (
      public.is_admin()
      or (
        public.is_storage_object_owner(name)
        and public.current_profile_role() in (
          'CUSTOMER'::public.user_role,
          'SELLER'::public.user_role,
          'ADMIN'::public.user_role
        )
      )
    )
  );

drop policy if exists "storage_update_customer_items" on storage.objects;
create policy "storage_update_customer_items"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'customer-items'
    and (public.is_admin() or public.is_storage_object_owner(name))
  )
  with check (
    bucket_id = 'customer-items'
    and (public.is_admin() or public.is_storage_object_owner(name))
  );

drop policy if exists "storage_delete_customer_items" on storage.objects;
create policy "storage_delete_customer_items"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'customer-items'
    and (public.is_admin() or public.is_storage_object_owner(name))
  );

-- project-images write (customer / seller / admin, own folder)
drop policy if exists "storage_insert_project_images" on storage.objects;
create policy "storage_insert_project_images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'project-images'
    and (
      public.is_admin()
      or (
        public.is_storage_object_owner(name)
        and public.current_profile_role() in (
          'CUSTOMER'::public.user_role,
          'SELLER'::public.user_role,
          'ADMIN'::public.user_role
        )
      )
    )
  );

drop policy if exists "storage_update_project_images" on storage.objects;
create policy "storage_update_project_images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'project-images'
    and (public.is_admin() or public.is_storage_object_owner(name))
  )
  with check (
    bucket_id = 'project-images'
    and (public.is_admin() or public.is_storage_object_owner(name))
  );

drop policy if exists "storage_delete_project_images" on storage.objects;
create policy "storage_delete_project_images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'project-images'
    and (public.is_admin() or public.is_storage_object_owner(name))
  );
