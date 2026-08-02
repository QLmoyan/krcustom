import { createClient } from "@/lib/supabase/server";
import { mapProfileRow } from "@/repositories/profile/map";
import type { AppProfile } from "@/types/Auth";
import type { ProfileRow, ProfileUpdate } from "@/types/database";

export async function getById(id: string): Promise<AppProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfileRow(data as ProfileRow) : null;
}

export async function getByAuthUserId(
  authUserId: string,
): Promise<AppProfile | null> {
  // profiles.id === auth.users.id
  return getById(authUserId);
}

export async function getByDemoKey(
  demoKey: string,
): Promise<AppProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("demo_key", demoKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfileRow(data as ProfileRow) : null;
}

export async function updateOwn(
  id: string,
  patch: Pick<ProfileUpdate, "nickname" | "avatar" | "phone" | "language">,
): Promise<AppProfile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProfileRow(data as ProfileRow);
}
