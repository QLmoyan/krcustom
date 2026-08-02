import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server Component / Server Action / Route Handler 用 Supabase 客户端。
 * 当前为基础接入；后续如需 Cookie Auth，可再升级为 @supabase/ssr。
 * 仅使用 Publishable Key，不要在此使用 service_role。
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!publishableKey) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return createSupabaseClient<Database>(url, publishableKey);
}
