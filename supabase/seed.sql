-- Sprint 7 Phase 2: seed Demo Project
-- id = UUID PK; demo_key = frontend route key (prj-001); project_number = business number
-- Prerequisite: run projects migrations (create table + project_number/demo_key).

insert into public.projects (
  id,
  service_id,
  customer_id,
  seller_id,
  status,
  title,
  description,
  project_number,
  demo_key
)
values (
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444',
  '고객 발송 완료',
  '흰색 티셔츠 소지품 자수',
  '고객 소지품 자수',
  'PRJ-20260802-001',
  'prj-001'
)
on conflict (id) do update set
  service_id = excluded.service_id,
  customer_id = excluded.customer_id,
  seller_id = excluded.seller_id,
  status = excluded.status,
  title = excluded.title,
  description = excluded.description,
  project_number = excluded.project_number,
  demo_key = excluded.demo_key,
  updated_at = now();
