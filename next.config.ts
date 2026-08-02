import type { NextConfig } from "next";

function supabaseImageHost(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const supabaseHost = supabaseImageHost();

const nextConfig: NextConfig = {
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
