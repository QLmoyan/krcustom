import type { AppProfile, AuthUser } from "@/types/Auth";
import { UserRole } from "@/types/Role";

/**
 * Demo identities used when Supabase Auth is unavailable or the visitor
 * is not signed in. IDs match seed customer_id / seller_id placeholders.
 */
export const DEMO_CUSTOMER_PROFILE_ID =
  "33333333-3333-4333-8333-333333333333";
export const DEMO_SELLER_PROFILE_ID =
  "44444444-4444-4444-8444-444444444444";

export const mockCustomerProfile: AppProfile = {
  id: DEMO_CUSTOMER_PROFILE_ID,
  role: UserRole.CUSTOMER,
  nickname: "데모 고객",
  avatar: null,
  phone: "010-1234-5678",
  language: "ko",
  demoKey: "demo-customer",
  createdAt: "2026-07-01T00:00:00+09:00",
  updatedAt: "2026-07-01T00:00:00+09:00",
};

export const mockSellerProfile: AppProfile = {
  id: DEMO_SELLER_PROFILE_ID,
  role: UserRole.SELLER,
  nickname: "스티치하우스",
  avatar: null,
  phone: "010-9876-5432",
  language: "ko",
  demoKey: "demo-seller",
  createdAt: "2026-07-01T00:00:00+09:00",
  updatedAt: "2026-07-01T00:00:00+09:00",
};

export const mockDemoCustomer: AuthUser = {
  authUserId: DEMO_CUSTOMER_PROFILE_ID,
  email: "demo.customer@krcustom.local",
  profile: mockCustomerProfile,
  source: "mock",
};

export const mockDemoSeller: AuthUser = {
  authUserId: DEMO_SELLER_PROFILE_ID,
  email: "demo.seller@krcustom.local",
  profile: mockSellerProfile,
  source: "mock",
};
