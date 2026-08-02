import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  NotificationInsert,
  NotificationRow,
  NotificationUpdate,
} from "@/types/database";

export { isProjectUuid as isNotificationUuid };

export type NotificationListFilter = {
  userId?: string | null;
  unreadOnly?: boolean;
};

export async function listNotifications(
  filter?: NotificationListFilter,
): Promise<NotificationRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter?.userId) {
    query = query.eq("user_id", filter.userId);
  }

  if (filter?.unreadOnly) {
    query = query.eq("is_read", false);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getUnreadCount(
  userId?: string | null,
): Promise<number> {
  const supabase = await createClient();
  let query = supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { count, error } = await query;
  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function markNotificationRead(
  identifier: string,
): Promise<NotificationRow | null> {
  const supabase = await createClient();
  const column = isProjectUuid(identifier) ? "id" : "demo_key";

  const patch: NotificationUpdate = {
    is_read: true,
    read_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("notifications")
    .update(patch)
    .eq(column, identifier)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function markAllNotificationsRead(
  userId?: string | null,
): Promise<number> {
  const supabase = await createClient();
  let query = supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("is_read", false)
    .select("id");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data?.length ?? 0;
}

export async function createNotification(
  input: NotificationInsert,
): Promise<NotificationRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
