-- Sprint 7 Phase 2 + Phase 3 + Phase 4 + Phase 5 + Phase 6 seed
-- Project: id = UUID PK; demo_key = frontend route key (prj-001)
-- Quotes: V1/V2/V3 for prj-001; demo_key = frontend quote ids; final total = 64800
-- Customer owned item: Nike white sneakers (demo_key coi-003) + full timeline
-- Design proofs: V1/V2/V3 for prj-001; V3 status CONFIRMED (Approved)
-- Orders: ord-001 for prj-001; order_number ORD-20260802-001; total 64800;
--   status COMPLETED, payment PAID, production FINISHED, shipping DELIVERED
-- Sprint 8 Phase 2 Storage: image columns keep picsum URLs as Demo fallback.
--   Optional Storage objects use path `{userId|demo}/{entityId}/{filename}`
--   in buckets avatars | project-images | design-proofs | customer-items | public-assets.
--   Binary seed upload is optional (no service_role required for App path).
-- Sprint 9: conversations/messages + notifications for prj-001 (Realtime-ready).
-- Prerequisite: projects + quotes + design_proofs + orders + chat migrations applied.
-- Idempotent: on conflict do update; items/revisions/versions/payments re-upserted by fixed UUIDs.

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

-- ---------------------------------------------------------------------------
-- Design proofs V1 / V2 / V3 (prj-001) — V3 Approved (CONFIRMED)
-- ---------------------------------------------------------------------------

insert into public.design_proofs (
  id,
  project_id,
  current_version,
  status,
  customer_comment,
  seller_comment,
  approved_at,
  rejected_at,
  demo_key,
  created_at,
  updated_at
)
values (
  '51111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  3,
  'CONFIRMED',
  '이 시안으로 확인했습니다.',
  '요청하신 크기로 로고를 확대했습니다. 네이비 실 색상은 유지했습니다.',
  '2026-07-12 17:05:00+09',
  null,
  'dp-prj001',
  '2026-07-11 15:00:00+09',
  '2026-07-12 17:05:00+09'
)
on conflict (id) do update set
  project_id = excluded.project_id,
  current_version = excluded.current_version,
  status = excluded.status,
  customer_comment = excluded.customer_comment,
  seller_comment = excluded.seller_comment,
  approved_at = excluded.approved_at,
  rejected_at = excluded.rejected_at,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.design_proof_versions (
  id,
  proof_id,
  version_no,
  image_url,
  thumbnail_url,
  notes,
  demo_key,
  created_at
)
values
  (
    '61111111-1111-4111-8111-111111111111',
    '51111111-1111-4111-8111-111111111111',
    1,
    'https://picsum.photos/seed/krcustom-dp-v1a/960/720',
    'https://picsum.photos/seed/krcustom-dp-v1a/320/240',
    '초기 시안 발송|기본 위치 시안|기본 왼쪽 가슴 위치에 로고를 배치한 시안입니다.|위치를 조금 더 안으로 옮겨 주세요.|위치 수정 요청',
    'dp-prj001-v1',
    '2026-07-11 15:00:00+09'
  ),
  (
    '61111111-1111-4111-8111-111111111112',
    '51111111-1111-4111-8111-111111111111',
    2,
    'https://picsum.photos/seed/krcustom-dp-v2a/960/720',
    'https://picsum.photos/seed/krcustom-dp-v2a/320/240',
    '위치 안쪽 이동 반영|위치 조정 시안|요청하신 위치로 로고를 이동했습니다. 확인해 주세요.|로고를 조금 더 크게 해 주세요.|로고 크기 확대 요청',
    'dp-prj001-v2',
    '2026-07-12 11:00:00+09'
  ),
  (
    '61111111-1111-4111-8111-111111111113',
    '51111111-1111-4111-8111-111111111111',
    3,
    'https://picsum.photos/seed/krcustom-dp-v3a/960/720',
    'https://picsum.photos/seed/krcustom-dp-v3a/320/240',
    '로고 크기 확대 반영|로고 확대 시안|요청하신 크기로 로고를 확대했습니다. 네이비 실 색상은 유지했습니다.|이 시안으로 확인했습니다.|',
    'dp-prj001-v3',
    '2026-07-12 16:00:00+09'
  )
on conflict (id) do update set
  proof_id = excluded.proof_id,
  version_no = excluded.version_no,
  image_url = excluded.image_url,
  thumbnail_url = excluded.thumbnail_url,
  notes = excluded.notes,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at;

-- ---------------------------------------------------------------------------
-- Order + items + payment (prj-001 / ord-001) — Completed delivery, 64,800원
-- Linked to Quote V3 (ACCEPTED)
-- ---------------------------------------------------------------------------

insert into public.orders (
  id,
  project_id,
  quote_id,
  seller_id,
  customer_id,
  order_number,
  status,
  subtotal,
  shipping_fee,
  discount,
  tax,
  total,
  currency,
  payment_status,
  production_status,
  shipping_status,
  demo_key,
  created_at,
  updated_at
)
values (
  '71111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  '21111111-1111-4111-8111-111111111113',
  '44444444-4444-4444-8444-444444444444',
  '33333333-3333-4333-8333-333333333333',
  'ORD-20260802-001',
  'COMPLETED',
  64800,
  0,
  0,
  0,
  64800,
  'KRW',
  'PAID',
  'FINISHED',
  'DELIVERED',
  'ord-001',
  '2026-07-12 17:20:00+09',
  '2026-07-12 17:28:00+09'
)
on conflict (id) do update set
  project_id = excluded.project_id,
  quote_id = excluded.quote_id,
  seller_id = excluded.seller_id,
  customer_id = excluded.customer_id,
  order_number = excluded.order_number,
  status = excluded.status,
  subtotal = excluded.subtotal,
  shipping_fee = excluded.shipping_fee,
  discount = excluded.discount,
  tax = excluded.tax,
  total = excluded.total,
  currency = excluded.currency,
  payment_status = excluded.payment_status,
  production_status = excluded.production_status,
  shipping_status = excluded.shipping_status,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.order_items (
  id, order_id, item_name, quantity, unit_price, total_price, demo_key
)
values
  ('81111111-1111-4111-8111-111111111111', '71111111-1111-4111-8111-111111111111', '로고 자수', 1, 45000, 45000, 'oi-1'),
  ('81111111-1111-4111-8111-111111111112', '71111111-1111-4111-8111-111111111111', '고객 소지품 검수·라벨', 1, 8000, 8000, 'oi-2'),
  ('81111111-1111-4111-8111-111111111113', '71111111-1111-4111-8111-111111111111', '반송 포장·배송', 1, 11800, 11800, 'oi-3')
on conflict (id) do update set
  order_id = excluded.order_id,
  item_name = excluded.item_name,
  quantity = excluded.quantity,
  unit_price = excluded.unit_price,
  total_price = excluded.total_price,
  demo_key = excluded.demo_key;

insert into public.payment_records (
  id,
  order_id,
  method,
  status,
  amount,
  transaction_no,
  paid_at,
  demo_key,
  created_at,
  updated_at
)
values (
  '91111111-1111-4111-8111-111111111111',
  '71111111-1111-4111-8111-111111111111',
  'CREDIT_CARD',
  'PAID',
  64800,
  'TXN-64800-001',
  '2026-07-12 17:28:00+09',
  'pay-001',
  '2026-07-12 17:22:00+09',
  '2026-07-12 17:28:00+09'
)
on conflict (id) do update set
  order_id = excluded.order_id,
  method = excluded.method,
  status = excluded.status,
  amount = excluded.amount,
  transaction_no = excluded.transaction_no,
  paid_at = excluded.paid_at,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

-- ---------------------------------------------------------------------------
-- Customer owned item (prj-001 / coi-003) — Nike white sneakers
-- ---------------------------------------------------------------------------

insert into public.customer_owned_items (
  id,
  project_id,
  customer_id,
  item_number,
  category,
  name,
  brand,
  color,
  size,
  condition,
  quantity,
  tracking_company,
  tracking_number,
  received_at,
  notes,
  photos,
  status,
  demo_key,
  created_at,
  updated_at
)
values (
  'a1111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  '33333333-3333-4333-8333-333333333333',
  'ITEM-20260715-001',
  'sneakers',
  '나이키 화이트 스니커즈',
  '나이키',
  '화이트',
  '270',
  '기록 전',
  1,
  'CJ대한통운',
  '1234-5678-9012',
  null,
  '판매자 수령 대기 중입니다. 수령 후 개봉 사진을 등록합니다.',
  '["https://picsum.photos/seed/coi-003-nike-1/320/320","https://picsum.photos/seed/coi-003-nike-2/320/320"]'::jsonb,
  'CUSTOMER_SHIPPED',
  'coi-003',
  '2026-07-12 18:00:00+09',
  '2026-07-15 08:40:00+09'
)
on conflict (id) do update set
  project_id = excluded.project_id,
  customer_id = excluded.customer_id,
  item_number = excluded.item_number,
  category = excluded.category,
  name = excluded.name,
  brand = excluded.brand,
  color = excluded.color,
  size = excluded.size,
  condition = excluded.condition,
  quantity = excluded.quantity,
  tracking_company = excluded.tracking_company,
  tracking_number = excluded.tracking_number,
  received_at = excluded.received_at,
  notes = excluded.notes,
  photos = excluded.photos,
  status = excluded.status,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

-- ---------------------------------------------------------------------------
-- Timeline events (prj-001) — full custom-service lifecycle
-- ---------------------------------------------------------------------------

insert into public.timeline_events (
  id,
  project_id,
  event_type,
  title,
  description,
  status,
  actor_type,
  actor_id,
  actor_name,
  occurred_at,
  metadata,
  demo_key,
  created_at
)
values
  (
    'b1111111-1111-4111-8111-111111111101',
    '11111111-1111-4111-8111-111111111111',
    'PROJECT_CREATED',
    '프로젝트 생성',
    '고객 소지품 커스텀 프로젝트가 생성되었습니다.',
    'COMPLETED',
    'SYSTEM',
    null,
    '시스템',
    '2026-07-11 10:00:00+09',
    '{}'::jsonb,
    'tl-prj001-01',
    '2026-07-11 10:00:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111102',
    '11111111-1111-4111-8111-111111111111',
    'QUOTE_SENT',
    '견적 발송',
    '견적서 QT-20260712-008가 고객에게 발송되었습니다.',
    'COMPLETED',
    'SELLER',
    '44444444-4444-4444-8444-444444444444',
    '스티치하우스',
    '2026-07-11 14:20:00+09',
    '{}'::jsonb,
    'tl-prj001-02',
    '2026-07-11 14:20:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111103',
    '11111111-1111-4111-8111-111111111111',
    'QUOTE_ACCEPTED',
    '견적 수락',
    '고객이 견적 V3를 수락했습니다.',
    'COMPLETED',
    'CUSTOMER',
    '33333333-3333-4333-8333-333333333333',
    '이서연',
    '2026-07-12 17:20:00+09',
    '{}'::jsonb,
    'tl-prj001-03',
    '2026-07-12 17:20:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111104',
    '11111111-1111-4111-8111-111111111111',
    'DESIGN_UPLOADED',
    '시안 업로드',
    '판매자가 시안을 업로드했습니다.',
    'COMPLETED',
    'SELLER',
    '44444444-4444-4444-8444-444444444444',
    '스티치하우스',
    '2026-07-12 16:40:00+09',
    '{}'::jsonb,
    'tl-prj001-04',
    '2026-07-12 16:40:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111105',
    '11111111-1111-4111-8111-111111111111',
    'DESIGN_APPROVED',
    '시안 확정',
    '고객이 시안을 확정했습니다.',
    'COMPLETED',
    'CUSTOMER',
    '33333333-3333-4333-8333-333333333333',
    '이서연',
    '2026-07-12 17:05:00+09',
    '{}'::jsonb,
    'tl-prj001-05',
    '2026-07-12 17:05:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111106',
    '11111111-1111-4111-8111-111111111111',
    'ORDER_CREATED',
    '주문 생성',
    '결제 완료 후 주문이 생성되었습니다. (64,800원)',
    'COMPLETED',
    'SYSTEM',
    null,
    '시스템',
    '2026-07-12 17:28:00+09',
    '{}'::jsonb,
    'tl-prj001-06',
    '2026-07-12 17:28:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111107',
    '11111111-1111-4111-8111-111111111111',
    'ITEM_RECEIVED',
    '물품 수령',
    '판매자가 나이키 화이트 스니커즈 수령을 확인했습니다.',
    'COMPLETED',
    'SELLER',
    '44444444-4444-4444-8444-444444444444',
    '스티치하우스',
    '2026-07-15 14:00:00+09',
    '{}'::jsonb,
    'tl-prj001-07',
    '2026-07-15 14:00:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111108',
    '11111111-1111-4111-8111-111111111111',
    'PRODUCTION_STARTED',
    '제작 시작',
    '자수 제작이 시작되었습니다.',
    'COMPLETED',
    'SELLER',
    '44444444-4444-4444-8444-444444444444',
    '스티치하우스',
    '2026-07-16 09:00:00+09',
    '{}'::jsonb,
    'tl-prj001-08',
    '2026-07-16 09:00:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111109',
    '11111111-1111-4111-8111-111111111111',
    'QC_FINISHED',
    '검수 완료',
    '제작 후 품질 검수가 완료되었습니다.',
    'COMPLETED',
    'SELLER',
    '44444444-4444-4444-8444-444444444444',
    '스티치하우스',
    '2026-07-17 11:30:00+09',
    '{}'::jsonb,
    'tl-prj001-09',
    '2026-07-17 11:30:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111110',
    '11111111-1111-4111-8111-111111111111',
    'SHIPPED',
    '반송 발송',
    '완성품이 고객에게 반송 발송되었습니다.',
    'COMPLETED',
    'SELLER',
    '44444444-4444-4444-8444-444444444444',
    '스티치하우스',
    '2026-07-17 15:00:00+09',
    '{}'::jsonb,
    'tl-prj001-10',
    '2026-07-17 15:00:00+09'
  ),
  (
    'b1111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    'DELIVERED',
    '배송 완료',
    '고객에게 배송이 완료되었습니다.',
    'CURRENT',
    'SYSTEM',
    null,
    '시스템',
    '2026-07-18 10:20:00+09',
    '{}'::jsonb,
    'tl-prj001-11',
    '2026-07-18 10:20:00+09'
  )
on conflict (id) do update set
  project_id = excluded.project_id,
  event_type = excluded.event_type,
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  actor_type = excluded.actor_type,
  actor_id = excluded.actor_id,
  actor_name = excluded.actor_name,
  occurred_at = excluded.occurred_at,
  metadata = excluded.metadata,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at;

-- ---------------------------------------------------------------------------
-- Sprint 8 Phase 1: profiles (optional ? requires matching auth.users rows)
-- Pattern: profiles.id = auth.users.id
-- Demo UUID targets (match projects.customer_id / seller_id):
--   customer: 33333333-3333-4333-8333-333333333333
--   seller:   44444444-4444-4444-8444-444444444444
-- Auth users cannot be inserted via public SQL seed reliably.
-- Create users in Dashboard (or Admin API) with those UUIDs, then re-run seed;
-- or rely on handle_new_auth_user trigger after normal email sign-up.
-- ---------------------------------------------------------------------------

insert into public.profiles (id, role, nickname, avatar, phone, language, demo_key)
select
  u.id,
  'CUSTOMER'::public.user_role,
  '���� ����',
  null,
  '010-1234-5678',
  'ko',
  'demo-customer'
from auth.users u
where u.id = '33333333-3333-4333-8333-333333333333'
on conflict (id) do update set
  role = excluded.role,
  nickname = excluded.nickname,
  phone = excluded.phone,
  language = excluded.language,
  demo_key = excluded.demo_key,
  updated_at = now();

insert into public.profiles (id, role, nickname, avatar, phone, language, demo_key)
select
  u.id,
  'SELLER'::public.user_role,
  '��Ƽġ�Ͽ콺',
  null,
  '010-9876-5432',
  'ko',
  'demo-seller'
from auth.users u
where u.id = '44444444-4444-4444-8444-444444444444'
on conflict (id) do update set
  role = excluded.role,
  nickname = excluded.nickname,
  phone = excluded.phone,
  language = excluded.language,
  demo_key = excluded.demo_key,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Sprint 9: conversation + messages (prj-001) + notifications
-- ---------------------------------------------------------------------------

insert into public.conversations (
  id,
  project_id,
  customer_id,
  seller_id,
  demo_key,
  created_at,
  updated_at
)
values (
  '51111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444',
  'conv-prj-001',
  '2026-07-11 10:00:00+09',
  '2026-07-14 11:35:00+09'
)
on conflict (id) do update set
  project_id = excluded.project_id,
  customer_id = excluded.customer_id,
  seller_id = excluded.seller_id,
  demo_key = excluded.demo_key,
  updated_at = excluded.updated_at;

insert into public.messages (
  id, conversation_id, sender_id, sender_role, content_type, body, image_url, image_path,
  is_read, read_at, demo_key, created_at
)
values
  (
    '52111111-1111-4111-8111-111111111101',
    '51111111-1111-4111-8111-111111111111',
    null,
    'ADMIN',
    'text',
    '프로젝트가 생성되었습니다. 채팅·견적·시안·물품 현황을 이 화면에서 함께 확인할 수 있습니다.',
    null,
    null,
    true,
    '2026-07-11 10:01:00+09',
    'm-01',
    '2026-07-11 10:00:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111102',
    '51111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'CUSTOMER',
    'text',
    '안녕하세요. 가지고 있는 흰색 티셔츠에 작은 로고를 자수하고 싶어요.',
    null,
    null,
    true,
    '2026-07-11 10:15:00+09',
    'm-02',
    '2026-07-11 10:12:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111103',
    '51111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'CUSTOMER',
    'image',
    '현재 옷 상태 사진입니다.',
    'https://picsum.photos/seed/krcustom-chat-item/480/360',
    null,
    true,
    '2026-07-11 10:16:00+09',
    'm-03',
    '2026-07-11 10:13:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111104',
    '51111111-1111-4111-8111-111111111111',
    '44444444-4444-4444-8444-444444444444',
    'SELLER',
    'text',
    '밝은 면 티셔츠라 자수 가능합니다. 로고 파일을 보내 주시면 시안을 제작해 드릴게요.',
    null,
    null,
    true,
    '2026-07-11 10:25:00+09',
    'm-04',
    '2026-07-11 10:22:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111105',
    '51111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'CUSTOMER',
    'text',
    'PSD 원본 첨부했습니다. (logo_mark.psd · 8.4MB)',
    null,
    null,
    true,
    '2026-07-11 11:10:00+09',
    'm-05',
    '2026-07-11 11:05:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111106',
    '51111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'CUSTOMER',
    'text',
    'logo_export.pdf · 420KB',
    null,
    null,
    true,
    '2026-07-11 11:10:00+09',
    'm-06',
    '2026-07-11 11:06:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111107',
    '51111111-1111-4111-8111-111111111111',
    '44444444-4444-4444-8444-444444444444',
    'SELLER',
    'image',
    '최종 제작 시안이 잠겼습니다. 확인해 주세요. (V4)',
    'https://picsum.photos/seed/krcustom-dp-v4a/480/360',
    null,
    true,
    '2026-07-12 17:30:00+09',
    'm-07',
    '2026-07-12 17:25:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111108',
    '51111111-1111-4111-8111-111111111111',
    '44444444-4444-4444-8444-444444444444',
    'SELLER',
    'text',
    '시안 확정 기준 견적서입니다. QT-20260712-008 · 64,800원 · 결제 완료',
    null,
    null,
    true,
    '2026-07-12 17:15:00+09',
    'm-08',
    '2026-07-12 17:10:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111109',
    '51111111-1111-4111-8111-111111111111',
    null,
    'ADMIN',
    'text',
    '결제가 완료되었습니다. 안내된 주소로 물품을 발송해 주세요.',
    null,
    null,
    true,
    '2026-07-12 17:30:00+09',
    'm-09',
    '2026-07-12 17:28:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111110',
    '51111111-1111-4111-8111-111111111111',
    '44444444-4444-4444-8444-444444444444',
    'SELLER',
    'text',
    '주문이 생성되었습니다. ORD-20260714-014 · 64,800원 · 고객 발송 완료',
    null,
    null,
    true,
    '2026-07-12 17:35:00+09',
    'm-09b',
    '2026-07-12 17:29:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111111',
    '51111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'CUSTOMER',
    'text',
    '고객 물품을 발송했습니다. CJ대한통운 · 1234-5678-9012',
    null,
    null,
    true,
    '2026-07-14 11:25:00+09',
    'm-10',
    '2026-07-14 11:20:00+09'
  ),
  (
    '52111111-1111-4111-8111-111111111112',
    '51111111-1111-4111-8111-111111111111',
    '44444444-4444-4444-8444-444444444444',
    'SELLER',
    'text',
    '운송장 확인했습니다. 수령 후 개봉 사진과 물품 번호를 등록할게요.',
    null,
    null,
    false,
    null,
    'm-11',
    '2026-07-14 11:35:00+09'
  )
on conflict (id) do update set
  conversation_id = excluded.conversation_id,
  sender_id = excluded.sender_id,
  sender_role = excluded.sender_role,
  content_type = excluded.content_type,
  body = excluded.body,
  image_url = excluded.image_url,
  image_path = excluded.image_path,
  is_read = excluded.is_read,
  read_at = excluded.read_at,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at;

insert into public.notifications (
  id, user_id, type, title, body, link_path, entity_type, entity_id,
  is_read, read_at, demo_key, created_at
)
values
  (
    '53111111-1111-4111-8111-111111111101',
    '33333333-3333-4333-8333-333333333333',
    'QUOTE_UPDATED',
    '견적이 업데이트되었습니다',
    '프로젝트를 확인하려면 견적서를 열어 주세요.',
    '/project/prj-001',
    'quote',
    '21111111-1111-4111-8111-111111111113',
    false,
    null,
    'notif-quote-updated',
    '2026-07-12 17:10:00+09'
  ),
  (
    '53111111-1111-4111-8111-111111111102',
    '33333333-3333-4333-8333-333333333333',
    'DESIGN_UPLOADED',
    '새 시안이 업로드되었습니다',
    '시안 확인 후 승인하거나 수정 요청을 남겨 주세요.',
    '/design-proofs/dp-prj001-v3',
    'design_proof',
    null,
    false,
    null,
    'notif-design-uploaded',
    '2026-07-12 17:25:00+09'
  ),
  (
    '53111111-1111-4111-8111-111111111103',
    '33333333-3333-4333-8333-333333333333',
    'DESIGN_APPROVED',
    '시안이 승인되었습니다',
    '확정된 시안 기준으로 제작을 진행할 수 있습니다.',
    '/design-proofs/dp-prj001-v3',
    'design_proof',
    null,
    true,
    '2026-07-12 17:28:30+09',
    'notif-design-approved',
    '2026-07-12 17:28:00+09'
  ),
  (
    '53111111-1111-4111-8111-111111111104',
    '33333333-3333-4333-8333-333333333333',
    'ORDER_CREATED',
    '주문이 생성되었습니다',
    '주문 상세와 결제 상태를 확인해 주세요.',
    '/orders/ord-001',
    'order',
    null,
    true,
    '2026-07-12 17:29:30+09',
    'notif-order-created',
    '2026-07-12 17:29:00+09'
  ),
  (
    '53111111-1111-4111-8111-111111111105',
    '33333333-3333-4333-8333-333333333333',
    'ORDER_PAID',
    '결제가 완료되었습니다',
    '고객 물품 발송 안내를 확인해 주세요.',
    '/orders/ord-001',
    'order',
    null,
    false,
    null,
    'notif-order-paid',
    '2026-07-12 17:30:00+09'
  ),
  (
    '53111111-1111-4111-8111-111111111106',
    '33333333-3333-4333-8333-333333333333',
    'PRODUCTION_STARTED',
    '제작이 시작되었습니다',
    '제작 진행 상황은 프로젝트에서 확인할 수 있습니다.',
    '/project/prj-001',
    'project',
    '11111111-1111-4111-8111-111111111111',
    true,
    '2026-07-15 10:05:00+09',
    'notif-production-started',
    '2026-07-15 10:00:00+09'
  ),
  (
    '53111111-1111-4111-8111-111111111107',
    '33333333-3333-4333-8333-333333333333',
    'SHIPPED',
    '상품이 발송되었습니다',
    '운송장 정보를 주문 상세에서 확인해 주세요.',
    '/orders/ord-001',
    'order',
    null,
    false,
    null,
    'notif-shipped',
    '2026-07-18 14:00:00+09'
  ),
  (
    '53111111-1111-4111-8111-111111111108',
    '33333333-3333-4333-8333-333333333333',
    'DELIVERED',
    '배송이 완료되었습니다',
    '수령 확인과 리뷰를 남겨 주세요.',
    '/orders/ord-001',
    'order',
    null,
    true,
    '2026-07-20 11:05:00+09',
    'notif-delivered',
    '2026-07-20 11:00:00+09'
  )
on conflict (id) do update set
  user_id = excluded.user_id,
  type = excluded.type,
  title = excluded.title,
  body = excluded.body,
  link_path = excluded.link_path,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  is_read = excluded.is_read,
  read_at = excluded.read_at,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at;

-- ---------------------------------------------------------------------------
-- Sprint 10: announcements (admin console)
-- ---------------------------------------------------------------------------

insert into public.announcements (
  id,
  title,
  body,
  published_at,
  demo_key,
  created_at
)
values
  (
    '61111111-1111-4111-8111-111111111111',
    'Ŀ�����ڸ��� ��Ÿ ���� �ȳ�',
    '�������þȡ����� ����ǰ Ŀ���� ��ũ�÷θ� ����� ü���� ������.',
    '2026-07-01 10:00:00+09',
    'ann-001',
    '2026-07-01 10:00:00+09'
  ),
  (
    '61111111-1111-4111-8111-111111111112',
    '�Ǹ��� ���� ��ú��� ����',
    '��� �������þȡ����ۡ��߼� ��ǥ�� �ֽ� �˸��� �Ѱ����� Ȯ���մϴ�.',
    '2026-07-15 09:30:00+09',
    'ann-002',
    '2026-07-15 09:30:00+09'
  ),
  (
    '61111111-1111-4111-8111-111111111113',
    '���� ����ǰ �� ���̵�',
    '�԰� �� ��ǰ��ȣ���ֹ��ڸ�������ó�� ���� Ȯ���� �ּ���.',
    '2026-07-20 14:00:00+09',
    'ann-003',
    '2026-07-20 14:00:00+09'
  )
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  published_at = excluded.published_at,
  demo_key = excluded.demo_key,
  created_at = excluded.created_at;
