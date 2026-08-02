"use server";

import { getCurrentUser } from "@/lib/providers/authProvider";
import { sendMessage } from "@/lib/providers/chatProvider";
import { uploadProjectImage } from "@/lib/providers/storageProvider";
import * as chatRepository from "@/repositories/chat";
import type { ProjectChatMessage } from "@/types/Project";

export type SendProjectChatResult =
  | {
      ok: true;
      message: ProjectChatMessage;
      source: "supabase" | "mock";
    }
  | {
      ok: false;
      needAuth?: boolean;
      error: string;
    };

async function ensureConversationId(
  projectId: string,
  conversationId: string | null,
): Promise<string | null> {
  if (conversationId) return conversationId;

  const existing = await chatRepository.getConversationByProject(projectId);
  if (existing?.id) return existing.id;

  const project = await (
    await import("@/repositories/project")
  ).getProjectById(projectId);
  if (!project) return null;

  const created = await chatRepository.createConversation({
    project_id: project.id,
    customer_id: project.customer_id,
    seller_id: project.seller_id,
  });
  return created.id;
}

export async function sendProjectChatMessage(input: {
  projectId: string;
  conversationId: string | null;
  body: string;
  imageUrl?: string | null;
}): Promise<SendProjectChatResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, needAuth: true, error: "Authentication required" };
  }

  const body = input.body.trim();
  const imageUrl = input.imageUrl?.trim() || null;
  if (!body && !imageUrl) {
    return { ok: false, error: "Empty message" };
  }

  try {
    const conversationId = await ensureConversationId(
      input.projectId,
      input.conversationId,
    );
    if (!conversationId) {
      return { ok: false, error: "Project not found" };
    }

    const senderRole =
      user.profile.role === "SELLER"
        ? "SELLER"
        : user.profile.role === "ADMIN"
          ? "ADMIN"
          : "CUSTOMER";

    const result = await sendMessage({
      conversationId,
      body: body,
      senderId: user.profile.id,
      senderRole,
      contentType: imageUrl ? "image" : "text",
      imageUrl,
    });

    if (!result.message) {
      return { ok: false, error: "Send failed" };
    }

    return {
      ok: true,
      message: {
        ...result.message,
        senderName: user.profile.nickname || result.message.senderName,
      },
      source: result.source,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Send failed",
    };
  }
}

export type UploadProjectImageResult =
  | {
      ok: true;
      url: string;
      path: string | null;
      source: "storage" | "mock";
    }
  | {
      ok: false;
      needAuth?: boolean;
      error: string;
    };

/** Upload a project reference/chat image (authenticated only). */
export async function uploadProjectReferenceImage(input: {
  projectId: string;
  formData: FormData;
}): Promise<UploadProjectImageResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, needAuth: true, error: "Authentication required" };
  }

  const file = input.formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file" };
  }

  try {
    const projectRepository = await import("@/repositories/project");
    const project = await projectRepository.getProjectById(input.projectId);
    const entityId = project?.id ?? input.projectId;

    const result = await uploadProjectImage(entityId, file, {
      filename: file.name,
    });

    if (result.source !== "storage") {
      return {
        ok: false,
        error: result.error ?? "Upload failed",
      };
    }

    return {
      ok: true,
      url: result.url,
      path: result.path,
      source: result.source,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
