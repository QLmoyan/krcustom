"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export type RealtimeTable =
  | "projects"
  | "quotes"
  | "quote_items"
  | "design_proofs"
  | "design_proof_versions"
  | "orders"
  | "timeline_events"
  | "conversations"
  | "messages"
  | "notifications";

type UseRealtimeRefreshOptions = {
  tables: RealtimeTable[];
  channelKey?: string;
  enabled?: boolean;
};

/**
 * Lightweight Realtime → router.refresh() invalidation.
 * Does not alter layout; Server Components re-fetch on refresh.
 */
export function useRealtimeRefresh({
  tables,
  channelKey = "default",
  enabled = true,
}: UseRealtimeRefreshOptions) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tablesKey = tables.join(",");

  useEffect(() => {
    if (!enabled || tables.length === 0) {
      return;
    }

    let cancelled = false;
    let client: ReturnType<typeof createClient> | null = null;

    try {
      client = createClient();
    } catch {
      return;
    }

    const scheduleRefresh = () => {
      if (cancelled) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (!cancelled) {
          router.refresh();
        }
      }, 250);
    };

    const channel = client.channel(`realtime-refresh:${channelKey}`);

    for (const table of tables) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        scheduleRefresh,
      );
    }

    channel.subscribe();

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      void client?.removeChannel(channel);
    };
    // tablesKey captures tables membership without referential churn
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tablesKey derives from tables
  }, [tablesKey, channelKey, enabled, router]);
}
