import type { AppProfile } from "@/types/Auth";
import type { ProfileRow } from "@/types/database";
import type { UserRole } from "@/types/Role";

export function mapProfileRow(row: ProfileRow): AppProfile {
  return {
    id: row.id,
    role: row.role as UserRole,
    nickname: row.nickname,
    avatar: row.avatar,
    phone: row.phone,
    language: row.language,
    demoKey: row.demo_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
