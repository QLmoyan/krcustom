import { DEMO } from "@/data/demoFlow";
import {
  getProjectById as getMockProjectById,
} from "@/data/mockProject";
import type { SellerRecentMessage } from "@/data/mockSellerDashboard";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { formatKoreanDateTime } from "@/lib/format";
import * as chatRepository from "@/repositories/chat";
import type { ConversationWithLastMessage } from "@/repositories/chat";
import type { MessageRow } from "@/types/database";
import type { ProjectChatMessage, ProjectChatSender } from "@/types/Project";

export type ChatDataSource = "supabase" | "mock";

export type ProjectMessagesResult = {
  messages: ProjectChatMessage[];
  conversationId: string | null;
  source: ChatDataSource;
};

export type ConversationsResult = {
  conversations: SellerRecentMessage[];
  source: ChatDataSource;
};

const DEFAULT_NAMES: Record<ProjectChatSender, string> = {
  customer: "이서연",
  seller: "스티치하우스",
  system: "시스템",
};

function mapSenderRole(role: string): ProjectChatSender {
  switch (role) {
    case "CUSTOMER":
      return "customer";
    case "SELLER":
      return "seller";
    case "ADMIN":
      return "system";
    default:
      return "system";
  }
}

/**
 * Map DB message row → ProjectChatMessage (text|image only from DB).
 * demo_key preferred as stable UI id when present.
 */
export function mapRowToChatMessage(row: MessageRow): ProjectChatMessage {
  const sender = mapSenderRole(row.sender_role);
  const contentType = row.content_type === "image" ? "image" : "text";

  return {
    id: row.demo_key ?? row.id,
    type: contentType,
    sender,
    senderName: DEFAULT_NAMES[sender],
    createdAt: formatKoreanDateTime(row.created_at),
    text: row.body || undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

function mockMessagesForProject(projectIdentifier: string): ProjectChatMessage[] {
  const project =
    getMockProjectById(projectIdentifier) ??
    getMockProjectById(DEMO.projectId);
  return project?.messages ?? [];
}

/**
 * Project Workspace chat messages (UUID or demo_key).
 * Falls back to mockProject.messages when empty / error.
 */
export async function listMessagesByProjectId(
  projectIdentifier: string,
): Promise<ProjectMessagesResult> {
  try {
    const { conversation, messages } =
      await chatRepository.listMessagesByProject(projectIdentifier);

    if (!conversation || messages.length === 0) {
      return {
        messages: mockMessagesForProject(projectIdentifier),
        conversationId: conversation?.id ?? null,
        source: "mock",
      };
    }

    return {
      messages: messages.map(mapRowToChatMessage),
      conversationId: conversation.id,
      source: "supabase",
    };
  } catch {
    return {
      messages: mockMessagesForProject(projectIdentifier),
      conversationId: null,
      source: "mock",
    };
  }
}

function mapConversationToSellerRecent(
  row: ConversationWithLastMessage,
): SellerRecentMessage {
  const msgs = [...(row.messages ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const last = msgs[0];
  const unreadCount = msgs.filter((m) => !m.is_read).length;

  return {
    id: row.demo_key ?? row.id,
    customerName: DEFAULT_NAMES.customer,
    lastMessage: last?.body || "",
    time: last ? formatKoreanDateTime(last.created_at) : "",
    unreadCount,
    serviceTitle: row.projects?.title ?? "",
    conversationId: row.projects?.demo_key ?? row.demo_key ?? row.id,
  };
}

/**
 * Seller recent conversations list. Falls back to mock dashboard messages.
 */
export async function listConversations(): Promise<ConversationsResult> {
  try {
    const { getCurrentActorContext } = await import(
      "@/lib/providers/authProvider"
    );
    const actor = await getCurrentActorContext();
    const filter =
      actor?.role === "SELLER"
        ? { sellerId: actor.profileId }
        : actor?.role === "CUSTOMER"
          ? { customerId: actor.profileId }
          : undefined;

    const rows = await chatRepository.listConversations(filter);
    if (rows.length === 0) {
      return {
        conversations: mockSellerDashboard.recentMessages,
        source: "mock",
      };
    }

    return {
      conversations: rows.map(mapConversationToSellerRecent),
      source: "supabase",
    };
  } catch {
    return {
      conversations: mockSellerDashboard.recentMessages,
      source: "mock",
    };
  }
}

export async function sendMessage(input: {
  conversationId: string;
  body: string;
  senderRole?: "CUSTOMER" | "SELLER" | "ADMIN";
  contentType?: "text" | "image";
  imageUrl?: string | null;
}): Promise<{ message: ProjectChatMessage | null; source: ChatDataSource }> {
  try {
    const row = await chatRepository.sendMessage({
      conversationId: input.conversationId,
      senderRole: input.senderRole ?? "CUSTOMER",
      contentType: input.contentType ?? "text",
      body: input.body,
      imageUrl: input.imageUrl ?? null,
    });
    return { message: mapRowToChatMessage(row), source: "supabase" };
  } catch {
    return { message: null, source: "mock" };
  }
}

export async function markRead(
  conversationId: string,
): Promise<{ count: number; source: ChatDataSource }> {
  try {
    const count = await chatRepository.markMessagesRead(conversationId);
    return { count, source: "supabase" };
  } catch {
    return { count: 0, source: "mock" };
  }
}
