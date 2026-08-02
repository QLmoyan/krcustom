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
  useRealtimeRefresh({
    tables: ["notifications"],
    channelKey,
    enabled: true,
  });

  return null;
}
