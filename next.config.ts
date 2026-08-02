import type { NextConfig } from "next";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "./src/lib/supabase/env";

function supabaseImageHost(): string | undefined {
  const raw = getSupabaseUrl();
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const supabaseUrl = getSupabaseUrl() ?? "";
const supabasePublishableKey = getSupabasePublishableKey() ?? "";
const supabaseHost = supabaseImageHost();

const nextConfig: NextConfig = {
  // Map resolved public env (incl. legacy ANON fallback) into the browser bundle.
  env: {
    ...(supabaseUrl ? { NEXT_PUBLIC_SUPABASE_URL: supabaseUrl } : {}),
    ...(supabasePublishableKey
      ? { NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabasePublishableKey }
      : {}),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/**",
            },
          ]
        : [
            {
              protocol: "https" as const,
              hostname: "*.supabase.co",
              pathname: "/storage/v1/object/**",
            },
          ]),
    ],
  },
};

export default nextConfig;
