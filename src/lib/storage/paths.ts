import {
  DEMO_STORAGE_OWNER,
  type StorageBucketId,
} from "@/constants/storage";

/**
 * Object path within a bucket:
 * `{userId|demo}/{entityId}/{filename}`
 */
export function buildStorageObjectPath(
  ownerId: string,
  entityId: string,
  filename: string,
): string {
  const safeOwner = ownerId.trim() || DEMO_STORAGE_OWNER;
  const safeEntity = entityId.trim() || "unknown";
  const safeName = filename.trim().replace(/^\/+/, "") || "file";
  return `${safeOwner}/${safeEntity}/${safeName}`;
}

export function splitStorageObjectPath(objectPath: string): {
  ownerId: string;
  entityId: string;
  filename: string;
} | null {
  const parts = objectPath.replace(/^\/+/, "").split("/").filter(Boolean);
  if (parts.length < 3) return null;
  const filename = parts.slice(2).join("/");
  return {
    ownerId: parts[0]!,
    entityId: parts[1]!,
    filename,
  };
}

/** Detect relative storage object path (not a full URL). */
export function isStorageObjectPath(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return false;
  if (trimmed.includes("://")) return false;
  return trimmed.includes("/");
}

/**
 * Extract object path from a Supabase public/signed URL, or return
 * the value if it is already a relative object path.
 */
export function extractStorageObjectPath(
  value: string,
  bucket?: StorageBucketId,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (isStorageObjectPath(trimmed)) {
    if (bucket && trimmed.startsWith(`${bucket}/`)) {
      return trimmed.slice(bucket.length + 1);
    }
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const markers = [
      "/storage/v1/object/public/",
      "/storage/v1/object/sign/",
      "/storage/v1/object/authenticated/",
    ];
    for (const marker of markers) {
      const idx = url.pathname.indexOf(marker);
      if (idx < 0) continue;
      const rest = url.pathname.slice(idx + marker.length);
      const slash = rest.indexOf("/");
      if (slash < 0) return null;
      const urlBucket = rest.slice(0, slash);
      const objectPath = decodeURIComponent(rest.slice(slash + 1));
      if (bucket && urlBucket !== bucket) return null;
      return objectPath;
    }
  } catch {
    return null;
  }

  return null;
}

export function sanitizeUploadFilename(filename: string): string {
  const base = filename.trim().replace(/\\/g, "/").split("/").pop() ?? "file";
  const cleaned = base.replace(/[^\w.\-()+ ]+/g, "_").replace(/\s+/g, "-");
  return cleaned || `file-${Date.now()}`;
}
