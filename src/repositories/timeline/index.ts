import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  Json,
  TimelineEventInsert,
  TimelineEventRow,
} from "@/types/database";

export { isProjectUuid as isTimelineEventUuid };

export type TimelineEventWithProject = TimelineEventRow & {
  projects: { id: string; demo_key: string | null; project_number: string } | null;
};

const EVENT_SELECT = `
  *,
  projects ( id, demo_key, project_number )
`;

async function resolveProjectUuid(identifier: string): Promise<string | null> {
  const supabase = await createClient();
  if (isProjectUuid(identifier)) {
    return identifier;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("demo_key", identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

/**
 * Timeline events for a project (UUID or demo_key), oldest first for display.
 */
export async function listByProject(
  projectIdentifier: string,
): Promise<TimelineEventWithProject[]> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timeline_events")
    .select(EVENT_SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as TimelineEventWithProject[];
}

export async function getById(
  identifier: string,
): Promise<TimelineEventWithProject | null> {
  const supabase = await createClient();

  if (isProjectUuid(identifier)) {
    const { data, error } = await supabase
      .from("timeline_events")
      .select(EVENT_SELECT)
      .eq("id", identifier)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as TimelineEventWithProject | null;
  }

  const { data, error } = await supabase
    .from("timeline_events")
    .select(EVENT_SELECT)
    .eq("demo_key", identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as TimelineEventWithProject | null;
}

type TimelineAppendInput = {
  projectId: string;
  eventType: string;
  title: string;
  description?: string;
  status?: string;
  actorType?: string;
  actorId?: string | null;
  actorName?: string;
  occurredAt?: string | null;
  metadata?: Record<string, unknown>;
  demoKey?: string | null;
};

/**
 * Append a lifecycle event to a project timeline.
 */
export async function appendEvent(
  input: TimelineAppendInput,
): Promise<TimelineEventWithProject> {
  const projectId = await resolveProjectUuid(input.projectId);
  if (!projectId) {
    throw new Error(`Project not found: ${input.projectId}`);
  }

  const supabase = await createClient();
  const row: TimelineEventInsert = {
    project_id: projectId,
    event_type: input.eventType,
    title: input.title,
    description: input.description ?? "",
    status: input.status ?? "COMPLETED",
    actor_type: input.actorType ?? "SYSTEM",
    actor_id: input.actorId ?? null,
    actor_name: input.actorName ?? "",
    occurred_at: input.occurredAt ?? new Date().toISOString(),
    metadata: (input.metadata ?? {}) as Json,
    demo_key: input.demoKey ?? null,
  };

  const { data: created, error } = await supabase
    .from("timeline_events")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const full = await getById(created.id);
  if (!full) {
    throw new Error("Created timeline event could not be reloaded");
  }
  return full;
}
