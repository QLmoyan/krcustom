import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Refresh Supabase Auth cookies on each request.
 * Does NOT force login — unauthenticated Demo paths stay open.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!url || !publishableKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  // Validates / refreshes the JWT; keep between createServerClient and return.
  await supabase.auth.getClaims();

  return supabaseResponse;
}
