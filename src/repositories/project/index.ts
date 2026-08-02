import { createClient } from "@/lib/supabase/server";
import type {
  ProjectInsert,
  ProjectRow,
  ProjectUpdate,
} from "@/types/database";

/** RFC 4122 UUID (versions 1–8), case-insensitive. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isProjectUuid(identifier: string): boolean {
  return UUID_RE.test(identifier);
}

/**
 * Load a project by UUID primary key, or by demo_key (e.g. prj-001).
 */
export async function getProjectById(
  identifier: string,
): Promise<ProjectRow | null> {
  const supabase = await createClient();
  const column = isProjectUuid(identifier) ? "id" : "demo_key";

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq(column, identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/** Returns true when a project exists (UUID id or demo_key). */
export async function existsProject(identifier: string): Promise<boolean> {
  const supabase = await createClient();
  const column = isProjectUuid(identifier) ? "id" : "demo_key";

  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq(column, identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}

export type ProjectListFilter = {
  sellerId?: string;
  customerId?: string;
};

export async function listProjects(
  filter?: ProjectListFilter,
): Promise<ProjectRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (filter?.sellerId) {
    query = query.eq("seller_id", filter.sellerId);
  }
  if (filter?.customerId) {
    query = query.eq("customer_id", filter.customerId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createProject(
  input: ProjectInsert,
): Promise<ProjectRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProject(
  id: string,
  input: ProjectUpdate,
): Promise<ProjectRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
