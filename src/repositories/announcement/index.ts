import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  AnnouncementInsert,
  AnnouncementRow,
} from "@/types/database";

export { isProjectUuid as isAnnouncementUuid };

export async function listAnnouncements(): Promise<AnnouncementRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getById(
  identifier: string,
): Promise<AnnouncementRow | null> {
  const supabase = await createClient();
  const column = isProjectUuid(identifier) ? "id" : "demo_key";

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq(column, identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createAnnouncement(
  input: AnnouncementInsert,
): Promise<AnnouncementRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
