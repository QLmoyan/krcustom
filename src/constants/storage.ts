/** Supabase Storage bucket ids (Sprint 8 Phase 2). */

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  PROJECT_IMAGES: "project-images",
  DESIGN_PROOFS: "design-proofs",
  CUSTOMER_ITEMS: "customer-items",
  PUBLIC_ASSETS: "public-assets",
} as const;

export type StorageBucketId =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const PUBLIC_STORAGE_BUCKETS: ReadonlySet<StorageBucketId> = new Set([
  STORAGE_BUCKETS.AVATARS,
  STORAGE_BUCKETS.PUBLIC_ASSETS,
]);

export const DEMO_STORAGE_OWNER = "demo";

/** Default signed URL lifetime (seconds). */
export const STORAGE_SIGNED_URL_TTL_SECONDS = 60 * 60;
