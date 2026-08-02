/**
 * Public Supabase env helpers.
 * Keep property access static (`process.env.NEXT_PUBLIC_*`) so Next can inline
 * values into the browser bundle.
 */

const PLACEHOLDER_VALUES = new Set([
  "",
  "your-project-url",
  "your-publishable-key",
  "your-anon-key",
  "changeme",
]);

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || PLACEHOLDER_VALUES.has(trimmed)) {
    return undefined;
  }
  return trimmed;
}

export function getSupabaseUrl(): string | undefined {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

/** Prefer publishable key; fall back to legacy anon key. */
export function getSupabasePublishableKey(): string | undefined {
  return (
    clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function requireSupabasePublicEnv(): { url: string; key: string } {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();

  if (!url) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!key) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return { url, key };
}

export const SUPABASE_NOT_CONFIGURED = "Supabase is not configured";
