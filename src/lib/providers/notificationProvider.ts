import { formatKoreanDateTime } from "@/lib/format";
import * as notificationRepository from "@/repositories/notification";
import type { NotificationRow } from "@/types/database";

export type NotificationDataSource = "supabase" | "mock";

/** Stable notification type codes (DB constraint). */
export type NotificationTypeCode =
  | "QUOTE_UPDATED"
  | "DESIGN_UPLOADED"
  | "DESIGN_APPROVED"
  | "ORDER_CREATED"
  | "ORDER_PAID"
  | "PRODUCTION_STARTED"
  | "SHIPPED"
  | "DELIVERED";

export type AppNotification = {
  id: string;
  type: NotificationTypeCode | string;
  title: string;
  body: string;
  linkPath: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationsResult = {
  notifications: AppNotification[];
  source: NotificationDataSource;
};

export type UnreadCountResult = {
  count: number;
  source: NotificationDataSource;
};

/** Demo notifications when Supabase unavailable / empty. */
const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-quote-updated",
    type: "QUOTE_UPDATED",
    title: "견적이 업데이트되었습니다",
    body: "프로젝트를 확인하려면 견적서를 열어 주세요.",
    linkPath: "/project/prj-001",
    isRead: false,
    createdAt: "2026.07.12 17:10",
  },
  {
    id: "notif-design-uploaded",
    type: "DESIGN_UPLOADED",
    title: "새 시안이 업로드되었습니다",
    body: "시안 확인 후 승인하거나 수정 요청을 남겨 주세요.",
    linkPath: "/design-proofs/dp-prj001-v3",
    isRead: false,
    createdAt: "2026.07.12 17:25",
  },
  {
    id: "notif-design-approved",
    type: "DESIGN_APPROVED",
    title: "시안이 승인되었습니다",
    body: "확정된 시안 기준으로 제작을 진행할 수 있습니다.",
    linkPath: "/design-proofs/dp-prj001-v3",
    isRead: true,
    createdAt: "2026.07.12 17:28",
  },
  {
    id: "notif-order-created",
    type: "ORDER_CREATED",
    title: "주문이 생성되었습니다",
    body: "주문 상세와 결제 상태를 확인해 주세요.",
    linkPath: "/orders/ord-001",
    isRead: true,
    createdAt: "2026.07.12 17:29",
  },
  {
    id: "notif-order-paid",
    type: "ORDER_PAID",
    title: "결제가 완료되었습니다",
    body: "고객 물품 발송 안내를 확인해 주세요.",
    linkPath: "/orders/ord-001",
    isRead: false,
    createdAt: "2026.07.12 17:30",
  },
  {
    id: "notif-production-started",
    type: "PRODUCTION_STARTED",
    title: "제작이 시작되었습니다",
    body: "제작 진행 상황은 프로젝트에서 확인할 수 있습니다.",
    linkPath: "/project/prj-001",
    isRead: true,
    createdAt: "2026.07.15 10:00",
  },
  {
    id: "notif-shipped",
    type: "SHIPPED",
    title: "상품이 발송되었습니다",
    body: "운송장 정보를 주문 상세에서 확인해 주세요.",
    linkPath: "/orders/ord-001",
    isRead: false,
    createdAt: "2026.07.18 14:00",
  },
  {
    id: "notif-delivered",
    type: "DELIVERED",
    title: "배송이 완료되었습니다",
    body: "수령 확인과 리뷰를 남겨 주세요.",
    linkPath: "/orders/ord-001",
    isRead: true,
    createdAt: "2026.07.20 11:00",
  },
];

export function mapRowToNotification(row: NotificationRow): AppNotification {
  return {
    id: row.demo_key ?? row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    linkPath: row.link_path,
    isRead: row.is_read,
    createdAt: formatKoreanDateTime(row.created_at),
  };
}

/**
 * List notifications for a user. Authenticated calls with userId never
 * fall back to shared mock seed (isolation). Anonymous / missing userId
 * may use mock only when Supabase returns empty or errors.
 */
export async function listNotifications(options?: {
  userId?: string | null;
  unreadOnly?: boolean;
}): Promise<NotificationsResult> {
  const scopedUserId = options?.userId;

  try {
    const rows = await notificationRepository.listNotifications({
      userId: scopedUserId,
      unreadOnly: options?.unreadOnly,
    });

    if (rows.length === 0) {
      if (scopedUserId) {
        return { notifications: [], source: "supabase" };
      }
      const mock = options?.unreadOnly
        ? MOCK_NOTIFICATIONS.filter((n) => !n.isRead)
        : MOCK_NOTIFICATIONS;
      return { notifications: mock, source: "mock" };
    }

    return {
      notifications: rows.map(mapRowToNotification),
      source: "supabase",
    };
  } catch {
    if (scopedUserId) {
      return { notifications: [], source: "mock" };
    }
    const mock = options?.unreadOnly
      ? MOCK_NOTIFICATIONS.filter((n) => !n.isRead)
      : MOCK_NOTIFICATIONS;
    return { notifications: mock, source: "mock" };
  }
}

export async function getUnreadNotificationCount(options?: {
  userId?: string | null;
}): Promise<UnreadCountResult> {
  try {
    const { notifications, source } = await listNotifications({
      userId: options?.userId,
      unreadOnly: true,
    });
    return { count: notifications.length, source };
  } catch {
    return {
      count: MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,
      source: "mock",
    };
  }
}

export async function markNotificationRead(
  identifier: string,
): Promise<{ ok: boolean; source: NotificationDataSource }> {
  try {
    const row = await notificationRepository.markNotificationRead(identifier);
    return { ok: Boolean(row), source: "supabase" };
  } catch {
    return { ok: false, source: "mock" };
  }
}

export async function markAllNotificationsRead(options?: {
  userId?: string | null;
}): Promise<{ count: number; source: NotificationDataSource }> {
  try {
    const count = await notificationRepository.markAllNotificationsRead(
      options?.userId,
    );
    return { count, source: "supabase" };
  } catch {
    return { count: 0, source: "mock" };
  }
}

export type CreateNotificationInput = {
  userId?: string | null;
  type: NotificationTypeCode | string;
  title: string;
  body?: string;
  linkPath?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  demoKey?: string | null;
};

export async function createNotification(
  input: CreateNotificationInput,
): Promise<{ notification: AppNotification | null; source: NotificationDataSource }> {
  try {
    const row = await notificationRepository.createNotification({
      user_id: input.userId ?? null,
      type: input.type,
      title: input.title,
      body: input.body ?? "",
      link_path: input.linkPath ?? null,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      demo_key: input.demoKey ?? null,
    });
    return { notification: mapRowToNotification(row), source: "supabase" };
  } catch {
    return { notification: null, source: "mock" };
  }
}
