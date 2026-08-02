-- Sprint 7 Phase 2 + Phase 3 seed
-- Project: id = UUID PK; demo_key = frontend route key (prj-001)
-- Quotes: V1/V2/V3 for prj-001; demo_key = frontend quote ids; final total = 64800
-- Prerequisite: projects + quotes migrations applied.
-- Idempotent: on conflict do update; items/revisions re-upserted by fixed UUIDs.

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

-- ---------------------------------------------------------------------------
-- Quotes V1 / V2 / V3 (prj-001)
-- ---------------------------------------------------------------------------

insert into public.quotes (
  id,
  project_id,
  version,
  status,
  subtotal,
  discount,
  shipping_fee,
  extra_fee,
  tax,
  total,
  currency,
  note,
  created_by,
  approved_by,
  approved_at,
  sent_at,
  expires_at,
  customer_confirmed,
  demo_key,
  created_at,
  updated_at
)
values
  (
    '21111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    1,
    'REVISION_REQUESTED',
    29000,
    0,
    3000,
    0,
    0,
    32000,
    'KRW',
    '초기 견적입니다. 양면 인쇄는 미포함.',
    '스티치하우스',
    '',
    null,
    '2026-07-11 14:20:00+09',
    '2026-07-18',
    false,
    'quote-prj001-v1',
    '2026-07-11 14:10:00+09',
    '2026-07-11 18:40:00+09'
  ),
  (
    '21111111-1111-4111-8111-111111111112',
    '11111111-1111-4111-8111-111111111111',
    2,
    'REVISION_REQUESTED',
    42500,
    2000,
    0,
    3000,
    0,
    43500,
    'KRW',
    '양면·급행 반영. 급행은 추가비용으로 분리했습니다.',
    '스티치하우스',
    '',
    null,
    '2026-07-12 10:05:00+09',
    '2026-07-19',
    false,
    'quote-prj001-v2',
    '2026-07-12 09:50:00+09',
    '2026-07-12 16:10:00+09'
  ),
  (
    '21111111-1111-4111-8111-111111111113',
    '11111111-1111-4111-8111-111111111111',
    3,
    'ACCEPTED',
    64800,
    0,
    0,
    0,
    0,
    64800,
    'KRW',
    '시안 확정 기준으로 조정된 최종 견적입니다.',
    '스티치하우스',
    '이서연',
    '2026-07-12 17:20:00+09',
    '2026-07-12 17:10:00+09',
    '2026-07-20',
    true,
    'quote-prj001-v3',
    '2026-07-12 17:00:00+09',
    '2026-07-12 17:28:00+09'
  )
on conflict (id) do update set
  project_id = excluded.project_id,
  version = excluded.version,
  status = excluded.status,
  subtotal = excluded.subtotal,
  discount = excluded.discount,
  shipping_fee = excluded.shipping_fee,
  extra_fee = excluded.extra_fee,
  tax = excluded.tax,
  total = excluded.total,
  currency = excluded.currency,
  note = excluded.note,
  created_by = excluded.created_by,
  approved_by = excluded.approved_by,
  approved_at = excluded.approved_at,
  sent_at = excluded.sent_at,
  expires_at = excluded.expires_at,
  customer_confirmed = excluded.customer_confirmed,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

-- Quote items
insert into public.quote_items (
  id, quote_id, name, description, quantity, unit_price, amount, editable, sort_order, demo_key
)
values
  -- V1
  ('31111111-1111-4111-8111-111111111111', '21111111-1111-4111-8111-111111111111', '로고 인쇄', '왼쪽 가슴 위치 기본 자수', 1, 22000, 22000, true, 1, 'qi-v1-1'),
  ('31111111-1111-4111-8111-111111111112', '21111111-1111-4111-8111-111111111111', '고객 소지품 검수', '개봉·상태 촬영·물품번호', 1, 5000, 5000, true, 2, 'qi-v1-2'),
  ('31111111-1111-4111-8111-111111111113', '21111111-1111-4111-8111-111111111111', '포장', '기본 반송 포장', 1, 2000, 2000, true, 3, 'qi-v1-3'),
  -- V2
  ('31111111-1111-4111-8111-111111111121', '21111111-1111-4111-8111-111111111112', '로고 인쇄', '왼쪽 가슴 + 등판 양면 자수', 1, 28000, 28000, true, 1, 'qi-v2-1'),
  ('31111111-1111-4111-8111-111111111122', '21111111-1111-4111-8111-111111111112', '특수 공정', '미세 자수 보정', 1, 4000, 4000, true, 2, 'qi-v2-2'),
  ('31111111-1111-4111-8111-111111111123', '21111111-1111-4111-8111-111111111112', '고객 소지품 검수', '개봉·상태 촬영·라벨', 1, 5000, 5000, true, 3, 'qi-v2-3'),
  ('31111111-1111-4111-8111-111111111124', '21111111-1111-4111-8111-111111111112', '포장', '기본 반송 포장', 1, 2000, 2000, true, 4, 'qi-v2-4'),
  ('31111111-1111-4111-8111-111111111125', '21111111-1111-4111-8111-111111111112', '운송비', '반송 택배', 1, 3500, 3500, true, 5, 'qi-v2-5'),
  -- V3 (final 64,800원)
  ('31111111-1111-4111-8111-111111111131', '21111111-1111-4111-8111-111111111113', '로고 자수', '왼쪽 가슴 단일 위치', 1, 45000, 45000, true, 1, 'qi-v3-1'),
  ('31111111-1111-4111-8111-111111111132', '21111111-1111-4111-8111-111111111113', '고객 소지품 검수·라벨', '개봉·촬영·라벨', 1, 8000, 8000, true, 2, 'qi-v3-2'),
  ('31111111-1111-4111-8111-111111111133', '21111111-1111-4111-8111-111111111113', '반송 포장·배송', '전국 택배', 1, 11800, 11800, true, 3, 'qi-v3-3')
on conflict (id) do update set
  quote_id = excluded.quote_id,
  name = excluded.name,
  description = excluded.description,
  quantity = excluded.quantity,
  unit_price = excluded.unit_price,
  amount = excluded.amount,
  editable = excluded.editable,
  sort_order = excluded.sort_order,
  demo_key = excluded.demo_key;

-- Quote revisions (change log)
insert into public.quote_revisions (
  id, quote_id, version, summary, actor, occurred_at, demo_key
)
values
  ('41111111-1111-4111-8111-111111111111', '21111111-1111-4111-8111-111111111111', 1, '견적 V1 작성 및 발송', '스티치하우스', '2026-07-11 14:20:00+09', 'cl-v1-1'),
  ('41111111-1111-4111-8111-111111111112', '21111111-1111-4111-8111-111111111111', 1, '고객이 수정 요청: 급행·양면 옵션 추가 희망', '이서연', '2026-07-11 18:40:00+09', 'cl-v1-2'),
  ('41111111-1111-4111-8111-111111111121', '21111111-1111-4111-8111-111111111112', 2, 'V1 기반으로 복사 후 양면·급행 반영', '스티치하우스', '2026-07-12 09:50:00+09', 'cl-v2-1'),
  ('41111111-1111-4111-8111-111111111122', '21111111-1111-4111-8111-111111111112', 2, '할인 2,000원 / 급행 추가 3,000원 적용', '스티치하우스', '2026-07-12 10:00:00+09', 'cl-v2-2'),
  ('41111111-1111-4111-8111-111111111123', '21111111-1111-4111-8111-111111111112', 2, '고객 수정 요청: 총액 조정 희망', '이서연', '2026-07-12 16:10:00+09', 'cl-v2-3'),
  ('41111111-1111-4111-8111-111111111131', '21111111-1111-4111-8111-111111111113', 3, 'V2에서 복사 후 양면 제거·총액 조정', '스티치하우스', '2026-07-12 17:00:00+09', 'cl-v3-1'),
  ('41111111-1111-4111-8111-111111111132', '21111111-1111-4111-8111-111111111113', 3, '고객 수락', '이서연', '2026-07-12 17:20:00+09', 'cl-v3-2'),
  ('41111111-1111-4111-8111-111111111133', '21111111-1111-4111-8111-111111111113', 3, '결제 완료', '시스템', '2026-07-12 17:28:00+09', 'cl-v3-3')
on conflict (id) do update set
  quote_id = excluded.quote_id,
  version = excluded.version,
  summary = excluded.summary,
  actor = excluded.actor,
  occurred_at = excluded.occurred_at,
  demo_key = excluded.demo_key;
