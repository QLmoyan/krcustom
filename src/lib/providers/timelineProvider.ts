import { getProjectById as getMockProjectById } from "@/data/mockProject";
import { formatKoreanDateTime } from "@/lib/format";
import * as timelineRepository from "@/repositories/timeline";
import type { TimelineEventWithProject } from "@/repositories/timeline";
import type {
  TimelineActorType,
  TimelineEvent,
  TimelineEventStatus,
} from "@/types/TimelineEvent";

export type TimelineDataSource = "supabase" | "mock";

export type TimelineEventsResult = {
  events: TimelineEvent[];
  source: TimelineDataSource;
};

const STATUS_VALUES: TimelineEventStatus[] = [
  "COMPLETED",
  "CURRENT",
  "UPCOMING",
  "ERROR",
  "CANCELLED",
];

const ACTOR_VALUES: TimelineActorType[] = [
  "CUSTOMER",
  "SELLER",
  "SYSTEM",
  "ADMIN",
];

function mapStatus(value: string): TimelineEventStatus {
  return STATUS_VALUES.includes(value as TimelineEventStatus)
    ? (value as TimelineEventStatus)
    : "COMPLETED";
}

function mapActorType(value: string): TimelineActorType {
  return ACTOR_VALUES.includes(value as TimelineActorType)
    ? (value as TimelineActorType)
    : "SYSTEM";
}

function displayOccurredAt(value: string | null | undefined): string {
  if (!value) return "";
  return formatKoreanDateTime(value);
}

function metadataFromJson(
  value: unknown,
): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

/**
 * Map DB timeline row to shared TimelineEvent.
 * Uses demo_key as id when present for stable demo references.
 */
export function mapRowToTimelineEvent(
  row: TimelineEventWithProject,
): TimelineEvent {
  return {
    id: row.demo_key ?? row.id,
    type: row.event_type,
    title: row.title,
    description: row.description,
    status: mapStatus(row.status),
    actorType: mapActorType(row.actor_type),
    actorName: row.actor_name,
    occurredAt: displayOccurredAt(row.occurred_at),
    metadata: metadataFromJson(row.metadata),
  };
}

function mockTimelineForProject(projectIdentifier: string): TimelineEvent[] {
  const project =
    getMockProjectById(projectIdentifier) ?? getMockProjectById("prj-001");
  return project?.timeline ?? [];
}

/**
 * Project timeline (UUID or demo_key). Falls back to mock project timeline.
 */
export async function listTimelineEventsByProjectId(
  projectIdentifier: string,
): Promise<TimelineEventsResult> {
  try {
    const rows = await timelineRepository.listByProject(projectIdentifier);
    if (rows.length === 0) {
      return {
        events: mockTimelineForProject(projectIdentifier),
        source: "mock",
      };
    }
    return {
      events: rows.map(mapRowToTimelineEvent),
      source: "supabase",
    };
  } catch {
    return {
      events: mockTimelineForProject(projectIdentifier),
      source: "mock",
    };
  }
}

export async function appendTimelineEvent(
  input: Parameters<typeof timelineRepository.appendEvent>[0],
) {
  return timelineRepository.appendEvent(input);
}
