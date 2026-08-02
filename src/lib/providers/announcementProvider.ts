import { formatKoreanDate, formatKoreanDateTime } from "@/lib/format";
import * as announcementRepository from "@/repositories/announcement";
import type { AnnouncementRow } from "@/types/database";

export type AnnouncementDataSource = "supabase" | "mock";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  createdAt: string;
  demoKey: string | null;
};

export type AnnouncementsResult = {
  announcements: Announcement[];
  source: AnnouncementDataSource;
};

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-001",
    title: "커스텀코리아 베타 오픈 안내",
    body: "견적·시안·고객 소지품 커스텀 워크플로를 데모로 체험해 보세요.",
    publishedAt: "2026.07.01",
    createdAt: "2026.07.01 10:00",
    demoKey: "ann-001",
  },
  {
    id: "ann-002",
    title: "판매자 센터 대시보드 개선",
    body: "대기 견적·시안·제작·발송 지표와 최신 알림을 한곳에서 확인합니다.",
    publishedAt: "2026.07.15",
    createdAt: "2026.07.15 09:30",
    demoKey: "ann-002",
  },
  {
    id: "ann-003",
    title: "고객 소지품 라벨 가이드",
    body: "입고 시 물품번호·주문자명·연락처를 교차 확인해 주세요.",
    publishedAt: "2026.07.20",
    createdAt: "2026.07.20 14:00",
    demoKey: "ann-003",
  },
];

export function mapRowToAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.demo_key ?? row.id,
    title: row.title,
    body: row.body,
    publishedAt: row.published_at
      ? formatKoreanDate(row.published_at)
      : "",
    createdAt: formatKoreanDateTime(row.created_at),
    demoKey: row.demo_key,
  };
}

export async function listAnnouncements(): Promise<AnnouncementsResult> {
  try {
    const rows = await announcementRepository.listAnnouncements();
    if (rows.length === 0) {
      return { announcements: MOCK_ANNOUNCEMENTS, source: "mock" };
    }
    return {
      announcements: rows.map(mapRowToAnnouncement),
      source: "supabase",
    };
  } catch {
    return { announcements: MOCK_ANNOUNCEMENTS, source: "mock" };
  }
}

export async function getAnnouncementById(
  identifier: string,
): Promise<{ announcement: Announcement | undefined; source: AnnouncementDataSource }> {
  try {
    const row = await announcementRepository.getById(identifier);
    if (row) {
      return { announcement: mapRowToAnnouncement(row), source: "supabase" };
    }
  } catch {
    // fall through
  }
  const mock = MOCK_ANNOUNCEMENTS.find(
    (a) => a.id === identifier || a.demoKey === identifier,
  );
  return { announcement: mock, source: "mock" };
}

export { MOCK_ANNOUNCEMENTS };
