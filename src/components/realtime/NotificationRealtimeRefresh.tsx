"use client";

import { useRealtimeRefresh } from "@/lib/realtime/useRealtimeRefresh";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type NotificationRealtimeRefreshProps = {
  channelKey?: string;
};

/**
 * Invisible client wrapper for notifications Realtime → refresh.
 */
export function NotificationRealtimeRefresh({
  channelKey = "notifications",
}: NotificationRealtimeRefreshProps) {
  const supabaseConfigured = isSupabaseConfigured();

  useRealtimeRefresh({
    tables: ["notifications"],
    channelKey,
    enabled: supabaseConfigured,
  });

  return null;
}
