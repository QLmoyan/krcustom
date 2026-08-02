import {
  PUBLIC_STORAGE_BUCKETS,
  STORAGE_SIGNED_URL_TTL_SECONDS,
  type StorageBucketId,
} from "@/constants/storage";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type StorageUploadBody = File | Blob | ArrayBuffer | FormData | string;

export type StorageUploadOptions = {
  contentType?: string;
  upsert?: boolean;
  cacheControl?: string;
};

export type StorageObjectItem = {
  name: string;
  id: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  lastAccessedAt: string | null;
  metadata: Record<string, unknown> | null;
};

type StorageClient = SupabaseClient<Database>;

async function getServerStorageClient(): Promise<StorageClient> {
  return createServerClient();
}

function getBrowserStorageClient(): StorageClient {
  return createBrowserClient();
}

function toErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Storage request failed";
}

/**
 * Upload an object. Prefer server client when called from Server Actions /
 * Route Handlers; pass `client: "browser"` from Client Components.
 */
export async function upload(
  bucket: StorageBucketId,
  objectPath: string,
  body: StorageUploadBody,
  options: StorageUploadOptions & { client?: "server" | "browser" } = {},
): Promise<{ path: string; fullPath: string }> {
  const supabase =
    options.client === "browser"
      ? getBrowserStorageClient()
      : await getServerStorageClient();

  const { data, error } = await supabase.storage.from(bucket).upload(objectPath, body, {
    contentType: options.contentType,
    upsert: options.upsert ?? true,
    cacheControl: options.cacheControl ?? "3600",
  });

  if (error) {
    throw new Error(toErrorMessage(error));
  }

  return {
    path: data.path,
    fullPath: data.fullPath,
  };
}

export async function remove(
  bucket: StorageBucketId,
  objectPaths: string | string[],
  options: { client?: "server" | "browser" } = {},
): Promise<void> {
  const supabase =
    options.client === "browser"
      ? getBrowserStorageClient()
      : await getServerStorageClient();

  const paths = Array.isArray(objectPaths) ? objectPaths : [objectPaths];
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function list(
  bucket: StorageBucketId,
  prefix = "",
  options: {
    limit?: number;
    offset?: number;
    search?: string;
    client?: "server" | "browser";
  } = {},
): Promise<StorageObjectItem[]> {
  const supabase =
    options.client === "browser"
      ? getBrowserStorageClient()
      : await getServerStorageClient();

  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
    search: options.search,
  });

  if (error) {
    throw new Error(toErrorMessage(error));
  }

  return (data ?? []).map((item) => ({
    name: item.name,
    id: item.id,
    updatedAt: item.updated_at,
    createdAt: item.created_at,
    lastAccessedAt: item.last_accessed_at,
    metadata: (item.metadata as Record<string, unknown> | null) ?? null,
  }));
}

export async function signedUrl(
  bucket: StorageBucketId,
  objectPath: string,
  expiresIn = STORAGE_SIGNED_URL_TTL_SECONDS,
  options: { client?: "server" | "browser" } = {},
): Promise<string> {
  const supabase =
    options.client === "browser"
      ? getBrowserStorageClient()
      : await getServerStorageClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(toErrorMessage(error ?? "Missing signed URL"));
  }

  return data.signedUrl;
}

/** Sync public URL (no network). Safe on server and browser. */
export function publicUrl(bucket: StorageBucketId, objectPath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  const encoded = objectPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${bucket}/${encoded}`;
}

/** Async public URL helper (same as publicUrl; kept for repository symmetry). */
export async function getPublicUrl(
  bucket: StorageBucketId,
  objectPath: string,
): Promise<string> {
  return publicUrl(bucket, objectPath);
}

export function isPublicBucket(bucket: StorageBucketId): boolean {
  return PUBLIC_STORAGE_BUCKETS.has(bucket);
}

/**
 * Resolve a readable URL for an object. Public buckets → public URL;
 * private → signed URL. Throws if signing/listing fails.
 */
export async function resolveReadableUrl(
  bucket: StorageBucketId,
  objectPath: string,
  options: {
    expiresIn?: number;
    client?: "server" | "browser";
  } = {},
): Promise<string> {
  if (isPublicBucket(bucket)) {
    return getPublicUrl(bucket, objectPath);
  }
  return signedUrl(bucket, objectPath, options.expiresIn, options);
}

/**
 * Check whether an object exists under prefix/filename via list.
 * Avoids downloading the full file.
 */
export async function objectExists(
  bucket: StorageBucketId,
  objectPath: string,
  options: { client?: "server" | "browser" } = {},
): Promise<boolean> {
  const slash = objectPath.lastIndexOf("/");
  const folder = slash >= 0 ? objectPath.slice(0, slash) : "";
  const filename = slash >= 0 ? objectPath.slice(slash + 1) : objectPath;
  if (!filename) return false;

  try {
    const items = await list(bucket, folder, {
      search: filename,
      limit: 100,
      client: options.client,
    });
    return items.some((item) => item.name === filename);
  } catch {
    return false;
  }
}
