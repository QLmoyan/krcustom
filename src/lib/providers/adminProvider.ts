import {
  mockCustomerProfile,
  mockSellerProfile,
} from "@/data/mockAuth";
import { formatKoreanDateTime } from "@/lib/format";
import { listAnnouncements } from "@/lib/providers/announcementProvider";
import { listProjects } from "@/lib/providers/projectProvider";
import * as profileRepository from "@/repositories/profile";
import type { AppProfile } from "@/types/Auth";
import type { ProjectRow } from "@/types/database";
import type { UserRole } from "@/types/Role";

export type AdminDataSource = "supabase" | "mock" | "mixed";

export type AdminSellerStore = {
  id: string;
  profileId: string;
  storeName: string;
  nickname: string;
  phone: string | null;
  demoKey: string | null;
  updatedAt: string;
};

export type AdminDashboardSnapshot = {
  users: AppProfile[];
  sellers: AdminSellerStore[];
  projects: ProjectRow[];
  announcements: Awaited<
    ReturnType<typeof listAnnouncements>
  >["announcements"];
  source: AdminDataSource;
};

const MOCK_ADMIN_PROFILE: AppProfile = {
  id: "55555555-5555-4555-8555-555555555555",
  role: "ADMIN",
  nickname: "데모 관리자",
  avatar: null,
  phone: "010-0000-0000",
  language: "ko",
  demoKey: "demo-admin",
  createdAt: "2026-07-01T00:00:00+09:00",
  updatedAt: "2026-07-01T00:00:00+09:00",
};

const MOCK_USERS: AppProfile[] = [
  mockCustomerProfile,
  mockSellerProfile,
  MOCK_ADMIN_PROFILE,
];

const MOCK_SELLERS: AdminSellerStore[] = [
  {
    id: "store-stitch",
    profileId: mockSellerProfile.id,
    storeName: "스티치하우스",
    nickname: mockSellerProfile.nickname,
    phone: mockSellerProfile.phone,
    demoKey: mockSellerProfile.demoKey,
    updatedAt: formatKoreanDateTime(mockSellerProfile.updatedAt),
  },
];

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

async function listProfilesSafe(role?: UserRole): Promise<{
  profiles: AppProfile[];
  source: "supabase" | "mock";
}> {
  if (!isSupabaseConfigured()) {
    const profiles = role
      ? MOCK_USERS.filter((p) => p.role === role)
      : MOCK_USERS;
    return { profiles, source: "mock" };
  }

  try {
    const profiles = await profileRepository.listProfiles(
      role ? { role } : undefined,
    );
    if (profiles.length === 0) {
      const fallback = role
        ? MOCK_USERS.filter((p) => p.role === role)
        : MOCK_USERS;
      return { profiles: fallback, source: "mock" };
    }
    return { profiles, source: "supabase" };
  } catch {
    const profiles = role
      ? MOCK_USERS.filter((p) => p.role === role)
      : MOCK_USERS;
    return { profiles, source: "mock" };
  }
}

function mapSellerStores(profiles: AppProfile[]): AdminSellerStore[] {
  return profiles
    .filter((p) => p.role === "SELLER")
    .map((p) => ({
      id: p.demoKey ?? p.id,
      profileId: p.id,
      storeName: p.nickname || "판매자",
      nickname: p.nickname,
      phone: p.phone,
      demoKey: p.demoKey,
      updatedAt: formatKoreanDateTime(p.updatedAt),
    }));
}

export async function getAdminDashboardSnapshot(): Promise<AdminDashboardSnapshot> {
  // Single profiles query — derive sellers locally (avoid duplicate listProfiles).
  const [usersResult, projectsResult, announcementsResult] = await Promise.all([
    listProfilesSafe(),
    listProjects(),
    listAnnouncements(),
  ]);

  const sources = [
    usersResult.source,
    projectsResult.source,
    announcementsResult.source,
  ];
  const allMock = sources.every((s) => s === "mock");
  const allSupabase = sources.every((s) => s === "supabase");

  const sellerProfiles = usersResult.profiles.filter((p) => p.role === "SELLER");
  const sellers =
    usersResult.source === "supabase" && sellerProfiles.length > 0
      ? mapSellerStores(sellerProfiles)
      : MOCK_SELLERS;

  return {
    users:
      usersResult.profiles.length > 0 ? usersResult.profiles : MOCK_USERS,
    sellers,
    projects: projectsResult.projects,
    announcements: announcementsResult.announcements,
    source: allMock ? "mock" : allSupabase ? "supabase" : "mixed",
  };
}

export async function listAdminUsers(): Promise<{
  users: AppProfile[];
  source: "supabase" | "mock";
}> {
  const result = await listProfilesSafe();
  return { users: result.profiles, source: result.source };
}

export async function listAdminSellers(): Promise<{
  sellers: AdminSellerStore[];
  source: "supabase" | "mock";
}> {
  const result = await listProfilesSafe("SELLER");
  if (result.source === "mock" || result.profiles.length === 0) {
    return { sellers: MOCK_SELLERS, source: "mock" };
  }
  return { sellers: mapSellerStores(result.profiles), source: "supabase" };
}

export { MOCK_USERS, MOCK_SELLERS, MOCK_ADMIN_PROFILE };
