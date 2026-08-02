import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Browser / Client Component Supabase client (cookie-aware via @supabase/ssr).
 * Uses Publishable Key only — never service_role.
 */
export function createClient() {
  const { url, key } = requireSupabasePublicEnv();
  return createBrowserClient<Database>(url, key);
}
