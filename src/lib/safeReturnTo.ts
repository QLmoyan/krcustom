/**
 * Sanitize post-login redirect targets to prevent open redirects.
 * Only same-origin relative paths are allowed.
 */
export function sanitizeReturnTo(
  raw: string | null | undefined,
  fallback = "/",
): string {
  if (!raw) return fallback;

  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  if (value.includes("://") || value.includes("\\")) {
    return fallback;
  }

  return value;
}
