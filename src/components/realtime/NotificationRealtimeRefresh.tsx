"use client";

import { useRealtimeRefresh } from "@/lib/realtime/useRealtimeRefresh";

type NotificationRealtimeRefreshProps = {
  channelKey?: string;
};

/**
 * Invisible client wrapper for notifications Realtime → refresh.
 */
export function NotificationRealtimeRefresh({
  channelKey = "notifications",
}: NotificationRealtimeRefreshProps) {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  useRealtimeRefresh({
    tables: ["notifications"],
    channelKey,
    enabled: supabaseConfigured,
  });

  return null;
}
