import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  ConversationInsert,
  ConversationRow,
  MessageInsert,
  MessageRow,
} from "@/types/database";

export { isProjectUuid as isConversationUuid };

export type ConversationWithLastMessage = ConversationRow & {
  messages?: MessageRow[] | null;
  projects?: {
    id: string;
    demo_key: string | null;
    title: string;
    project_number: string;
  } | null;
};

async function resolveProjectUuid(
  identifier: string,
): Promise<string | null> {
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
 * Conversation by UUID or demo_key.
 */
export async function getConversationById(
  identifier: string,
): Promise<ConversationRow | null> {
  const supabase = await createClient();

  if (isProjectUuid(identifier)) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", identifier)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("demo_key", identifier)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Conversation linked to a project (UUID or demo_key like prj-001).
 */
export async function getConversationByProject(
  projectIdentifier: string,
): Promise<ConversationRow | null> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export type ConversationListFilter = {
  sellerId?: string;
  customerId?: string;
  projectId?: string;
};

export async function listConversations(
  filter?: ConversationListFilter,
): Promise<ConversationWithLastMessage[]> {
  const supabase = await createClient();
  let query = supabase
    .from("conversations")
    .select(
      `
      *,
      projects ( id, demo_key, title, project_number ),
      messages ( id, body, content_type, sender_role, is_read, created_at, demo_key )
    `,
    )
    .order("updated_at", { ascending: false });

  if (filter?.sellerId) {
    query = query.eq("seller_id", filter.sellerId);
  }
  if (filter?.customerId) {
    query = query.eq("customer_id", filter.customerId);
  }
  if (filter?.projectId) {
    const projectId = await resolveProjectUuid(filter.projectId);
    if (!projectId) return [];
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []) as ConversationWithLastMessage[];
}

export async function listMessages(
  conversationIdentifier: string,
): Promise<MessageRow[]> {
  let conversationId = conversationIdentifier;

  if (!isProjectUuid(conversationIdentifier)) {
    const conversation = await getConversationById(conversationIdentifier);
    if (!conversation) {
      return [];
    }
    conversationId = conversation.id;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function listMessagesByProject(
  projectIdentifier: string,
): Promise<{ conversation: ConversationRow | null; messages: MessageRow[] }> {
  const conversation = await getConversationByProject(projectIdentifier);
  if (!conversation) {
    return { conversation: null, messages: [] };
  }
  const messages = await listMessages(conversation.id);
  return { conversation, messages };
}

export type SendMessageInput = {
  conversationId: string;
  senderId?: string | null;
  senderRole: "CUSTOMER" | "SELLER" | "ADMIN";
  contentType?: "text" | "image";
  body?: string;
  imageUrl?: string | null;
  imagePath?: string | null;
  demoKey?: string | null;
};

export async function sendMessage(
  input: SendMessageInput,
): Promise<MessageRow> {
  const supabase = await createClient();

  let conversationId = input.conversationId;
  if (!isProjectUuid(conversationId)) {
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${input.conversationId}`);
    }
    conversationId = conversation.id;
  }

  const row: MessageInsert = {
    conversation_id: conversationId,
    sender_id: input.senderId ?? null,
    sender_role: input.senderRole,
    content_type: input.contentType ?? "text",
    body: input.body ?? "",
    image_url: input.imageUrl ?? null,
    image_path: input.imagePath ?? null,
    demo_key: input.demoKey ?? null,
  };

  const { data, error } = await supabase
    .from("messages")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function markMessagesRead(
  conversationIdentifier: string,
): Promise<number> {
  let conversationId = conversationIdentifier;
  if (!isProjectUuid(conversationIdentifier)) {
    const conversation = await getConversationById(conversationIdentifier);
    if (!conversation) {
      return 0;
    }
    conversationId = conversation.id;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversationId)
    .eq("is_read", false)
    .select("id");

  if (error) {
    throw error;
  }

  return data?.length ?? 0;
}

export async function createConversation(
  input: ConversationInsert,
): Promise<ConversationRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
