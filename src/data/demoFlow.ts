/**
 * Canonical Alpha demo flow IDs — keep mock records consistent with these.
 */
export const DEMO = {
  serviceId: "svc-001",
  storeId: "store-004",
  projectId: "prj-001",
  quoteId: "quote-prj001-v3",
  designProofId: "dp-prj001-v4",
  orderId: "ord-001",
  paymentPendingOrderId: "ord-002",
  ownedItemId: "coi-003",
  orderNumber: "ORD-20260714-014",
  projectNumber: "PRJ-20260714-014",
  itemNumber: "ITEM-20260715-001",
  customerName: "이서연",
  storeName: "스티치하우스",
  serviceName: "고객 소지품 자수",
  amount: 64800,
} as const;

/** Seed UUIDs aligned with supabase/seed.sql (no FK required on projects). */
export const DEMO_UUIDS = {
  project: "11111111-1111-4111-8111-111111111111",
  service: "22222222-2222-4222-8222-222222222222",
  customer: "33333333-3333-4333-8333-333333333333",
  seller: "44444444-4444-4444-8444-444444444444",
} as const;
