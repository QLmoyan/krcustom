"use client";

import { useRealtimeRefresh, type RealtimeTable } from "@/lib/realtime/useRealtimeRefresh";

type ProjectRealtimeRefreshProps = {
  /** Stable channel key (project demo_key or UUID). */
  projectKey: string;
};

const PROJECT_TABLES: RealtimeTable[] = [
  "projects",
  "quotes",
  "quote_items",
  "design_proofs",
  "design_proof_versions",
  "orders",
  "timeline_events",
  "conversations",
  "messages",
];

/**
 * Invisible client wrapper: Realtime changes → router.refresh().
 * Place inside Project Workspace; does not alter layout.
 */
export function ProjectRealtimeRefresh({
  projectKey,
}: ProjectRealtimeRefreshProps) {
  useRealtimeRefresh({
    tables: PROJECT_TABLES,
    channelKey: `project:${projectKey}`,
    enabled: true,
  });

  return null;
}
