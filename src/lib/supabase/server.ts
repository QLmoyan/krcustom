import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Server Component / Server Action / Route Handler Supabase client.
 * Cookie session via @supabase/ssr. Uses Publishable Key only.
 */
export async function createClient() {
  const { url, key } = requireSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — proxy refreshes the session.
        }
      },
    },
  });
}
