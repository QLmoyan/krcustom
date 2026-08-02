import {
  DEMO_STORAGE_OWNER,
  STORAGE_BUCKETS,
  STORAGE_SIGNED_URL_TTL_SECONDS,
  type StorageBucketId,
} from "@/constants/storage";
import {
  buildStorageObjectPath,
  extractStorageObjectPath,
  isStorageObjectPath,
  sanitizeUploadFilename,
} from "@/lib/storage/paths";
import * as storageRepository from "@/repositories/storage";

/** Lazy import avoids circular dependency with authProvider. */
async function getSignedInUser() {
  const { getCurrentUser } = await import("@/lib/providers/authProvider");
  return getCurrentUser();
}

export type StorageDataSource = "storage" | "mock";

export type ResolvedMediaUrl = {
  url: string;
  source: StorageDataSource;
  bucket?: StorageBucketId;
  path?: string;
};

export type StorageUploadInput = {
  bucket: StorageBucketId;
  entityId: string;
  file: File | Blob;
  filename?: string;
  contentType?: string;
  /** Override owner folder; defaults to auth user id. */
  ownerId?: string;
  upsert?: boolean;
  /** Demo / mock URL when not signed in or upload fails. */
  fallbackUrl?: string;
};

export type StorageUploadResult = {
  url: string;
  path: string | null;
  bucket: StorageBucketId;
  source: StorageDataSource;
  error?: string;
};

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function mockPicsum(seed: string, w = 640, h = 480): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/**
 * Prefer Storage object when present; otherwise keep fallback (DB / picsum / mock).
 * Relative paths and Supabase object URLs are resolved to public/signed URLs.
 * Full non-storage URLs (e.g. picsum) pass through unchanged.
 */
export async function resolveMediaUrl(options: {
  bucket: StorageBucketId;
  /** Relative object path, storage URL, or empty. */
  pathOrUrl?: string | null;
  /** Used when Storage miss / error / anonymous private access. */
  fallbackUrl: string;
  /** Optional candidate paths to probe (e.g. demo/{entityId}/preview.jpg). */
  candidatePaths?: string[];
  expiresIn?: number;
}): Promise<ResolvedMediaUrl> {
  const {
    bucket,
    pathOrUrl,
    fallbackUrl,
    candidatePaths = [],
    expiresIn = STORAGE_SIGNED_URL_TTL_SECONDS,
  } = options;

  const candidates: string[] = [];

  if (pathOrUrl) {
    const extracted = extractStorageObjectPath(pathOrUrl, bucket);
    if (extracted) {
      candidates.push(extracted);
    } else if (isStorageObjectPath(pathOrUrl)) {
      candidates.push(pathOrUrl.replace(/^\/+/, ""));
    }
  }

  for (const path of candidatePaths) {
    if (path) candidates.push(path.replace(/^\/+/, ""));
  }

  const unique = [...new Set(candidates)];

  for (const objectPath of unique) {
    try {
      const exists = await storageRepository.objectExists(bucket, objectPath);
      if (!exists) continue;

      const url = await storageRepository.resolveReadableUrl(bucket, objectPath, {
        expiresIn,
      });
      return { url, source: "storage", bucket, path: objectPath };
    } catch {
      // try next candidate
    }
  }

  // Absolute non-storage URL (picsum / CDN) — keep as-is
  if (pathOrUrl && isHttpUrl(pathOrUrl) && !extractStorageObjectPath(pathOrUrl, bucket)) {
    return { url: pathOrUrl, source: "mock" };
  }

  return { url: fallbackUrl, source: "mock" };
}

/** Avatar: profiles.avatar path/URL → Storage public URL or fallback. */
export async function resolveAvatarUrl(
  avatar: string | null | undefined,
  options: {
    profileId?: string;
    fallbackUrl?: string | null;
  } = {},
): Promise<string | null> {
  const fallback = options.fallbackUrl ?? null;
  if (!avatar && !options.profileId) {
    return fallback;
  }

  const candidates: string[] = [];
  if (options.profileId) {
    candidates.push(
      buildStorageObjectPath(options.profileId, "profile", "avatar.jpg"),
      buildStorageObjectPath(options.profileId, "profile", "avatar.png"),
      buildStorageObjectPath(DEMO_STORAGE_OWNER, options.profileId, "avatar.jpg"),
    );
  }

  const resolved = await resolveMediaUrl({
    bucket: STORAGE_BUCKETS.AVATARS,
    pathOrUrl: avatar,
    fallbackUrl: fallback ?? "",
    candidatePaths: candidates,
  });

  if (!resolved.url) return fallback;
  return resolved.url;
}

/** Design proof image/thumb → Storage signed URL when object exists. */
export async function resolveDesignProofImageUrl(
  imageUrl: string,
  options: {
    proofId?: string;
    version?: number;
    fallbackUrl?: string;
  } = {},
): Promise<string> {
  const fallback = options.fallbackUrl ?? imageUrl;
  const candidates: string[] = [];
  if (options.proofId) {
    const version = options.version ?? 1;
    candidates.push(
      buildStorageObjectPath(
        DEMO_STORAGE_OWNER,
        options.proofId,
        `v${version}.jpg`,
      ),
      buildStorageObjectPath(
        DEMO_STORAGE_OWNER,
        options.proofId,
        `preview.jpg`,
      ),
    );
  }

  const resolved = await resolveMediaUrl({
    bucket: STORAGE_BUCKETS.DESIGN_PROOFS,
    pathOrUrl: imageUrl,
    fallbackUrl: fallback,
    candidatePaths: candidates,
  });
  return resolved.url;
}

/** Customer owned item photo list → Storage when objects exist. */
export async function resolveCustomerItemPhotoUrls(
  photos: string[],
  options: {
    itemId?: string;
    fallbackPhotos?: string[];
  } = {},
): Promise<string[]> {
  const fallbacks =
    options.fallbackPhotos && options.fallbackPhotos.length > 0
      ? options.fallbackPhotos
      : photos;

  if (photos.length === 0 && fallbacks.length === 0) {
    return [];
  }

  const source = photos.length > 0 ? photos : fallbacks;

  const resolved = await Promise.all(
    source.map(async (photo, index) => {
      const candidates: string[] = [];
      if (options.itemId) {
        candidates.push(
          buildStorageObjectPath(
            DEMO_STORAGE_OWNER,
            options.itemId,
            `photo-${index + 1}.jpg`,
          ),
        );
      }
      const result = await resolveMediaUrl({
        bucket: STORAGE_BUCKETS.CUSTOMER_ITEMS,
        pathOrUrl: photo,
        fallbackUrl: fallbacks[index] ?? photo ?? mockPicsum(`coi-${index}`),
        candidatePaths: candidates,
      });
      return result.url;
    }),
  );

  return resolved;
}

/**
 * Upload only when signed in. Anonymous / failure → Demo fallback URL
 * (does not write Storage). Preserves current Demo UX.
 */
export async function uploadIfAuthenticated(
  input: StorageUploadInput,
): Promise<StorageUploadResult> {
  const fallbackUrl =
    input.fallbackUrl ??
    mockPicsum(`upload-${input.bucket}-${input.entityId}`);

  const user = await getSignedInUser();
  if (!user) {
    return {
      url: fallbackUrl,
      path: null,
      bucket: input.bucket,
      source: "mock",
    };
  }

  const filename = sanitizeUploadFilename(
    input.filename ??
      (input.file instanceof File ? input.file.name : `upload-${Date.now()}.bin`),
  );
  const ownerId = input.ownerId ?? user.profile.id;
  const objectPath = buildStorageObjectPath(ownerId, input.entityId, filename);

  try {
    const contentType =
      input.contentType ??
      (input.file instanceof File ? input.file.type : undefined) ??
      "application/octet-stream";

    await storageRepository.upload(input.bucket, objectPath, input.file, {
      contentType,
      upsert: input.upsert ?? true,
      client: "server",
    });

    const url = await storageRepository.resolveReadableUrl(
      input.bucket,
      objectPath,
    );

    return {
      url,
      path: objectPath,
      bucket: input.bucket,
      source: "storage",
    };
  } catch (error) {
    return {
      url: fallbackUrl,
      path: null,
      bucket: input.bucket,
      source: "mock",
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * List readable URLs for objects under `{ownerId}/{projectId}/` in project-images.
 * Used so sellers/customers can see reference uploads for a project.
 */
export async function listProjectImageUrls(
  projectId: string,
  options: {
    ownerId?: string | null;
    fallbackUrls?: string[];
  } = {},
): Promise<{ urls: string[]; source: StorageDataSource }> {
  const fallbacks = options.fallbackUrls ?? [];

  try {
    const projectRepository = await import("@/repositories/project");
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      return { urls: fallbacks, source: "mock" };
    }

    const ownerId = options.ownerId ?? project.customer_id;
    const prefix = `${ownerId}/${project.id}`;
    const items = await storageRepository.list(
      STORAGE_BUCKETS.PROJECT_IMAGES,
      prefix,
      { limit: 50 },
    );

    const files = items.filter(
      (item) => item.name && !item.name.endsWith("/") && item.id !== null,
    );

    if (files.length === 0) {
      return { urls: fallbacks, source: "mock" };
    }

    const urls = await Promise.all(
      files.map(async (item) => {
        const objectPath = `${prefix}/${item.name}`;
        return storageRepository.resolveReadableUrl(
          STORAGE_BUCKETS.PROJECT_IMAGES,
          objectPath,
        );
      }),
    );

    return { urls, source: "storage" };
  } catch {
    return { urls: fallbacks, source: "mock" };
  }
}

/** Convenience wrappers for domain uploads (logged-in only). */
export async function uploadDesignProofImage(
  entityId: string,
  file: File | Blob,
  options: { filename?: string; fallbackUrl?: string } = {},
): Promise<StorageUploadResult> {
  return uploadIfAuthenticated({
    bucket: STORAGE_BUCKETS.DESIGN_PROOFS,
    entityId,
    file,
    filename: options.filename,
    fallbackUrl: options.fallbackUrl,
  });
}

export async function uploadCustomerItemPhoto(
  entityId: string,
  file: File | Blob,
  options: { filename?: string; fallbackUrl?: string } = {},
): Promise<StorageUploadResult> {
  return uploadIfAuthenticated({
    bucket: STORAGE_BUCKETS.CUSTOMER_ITEMS,
    entityId,
    file,
    filename: options.filename,
    fallbackUrl: options.fallbackUrl,
  });
}

export async function uploadAvatar(
  file: File | Blob,
  options: { filename?: string; fallbackUrl?: string } = {},
): Promise<StorageUploadResult> {
  const user = await getSignedInUser();
  return uploadIfAuthenticated({
    bucket: STORAGE_BUCKETS.AVATARS,
    entityId: "profile",
    file,
    filename: options.filename ?? "avatar.jpg",
    ownerId: user?.profile.id,
    fallbackUrl: options.fallbackUrl,
  });
}

export async function uploadProjectImage(
  entityId: string,
  file: File | Blob,
  options: { filename?: string; fallbackUrl?: string } = {},
): Promise<StorageUploadResult> {
  return uploadIfAuthenticated({
    bucket: STORAGE_BUCKETS.PROJECT_IMAGES,
    entityId,
    file,
    filename: options.filename,
    fallbackUrl: options.fallbackUrl,
  });
}

export { STORAGE_BUCKETS, buildStorageObjectPath };
