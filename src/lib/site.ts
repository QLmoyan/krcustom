/**
 * Canonical public site origin for metadata / sitemap / robots.
 * Prefer NEXT_PUBLIC_SITE_URL; never embed secrets here.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return "https://customkorea.kr";
}
