"use server";

import { ProjectStatus, PROJECT_STATUS_META } from "@/constants/status";
import { DEMO, DEMO_UUIDS } from "@/data/demoFlow";
import { getCurrentUser } from "@/lib/providers/authProvider";
import { createProject as createProjectViaProvider } from "@/lib/providers/projectProvider";
import * as chatRepository from "@/repositories/chat";
import type { ProjectRow } from "@/types/database";

export type CreateInquiryProjectResult =
  | {
      ok: true;
      projectId: string;
      project: ProjectRow;
      source: "supabase";
    }
  | {
      ok: false;
      needAuth?: boolean;
      error: string;
    };

function buildProjectNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `PRJ-${y}${m}${d}-${seq}`;
}

function resolveServiceUuid(serviceId: string): string {
  if (serviceId === DEMO.serviceId || serviceId === DEMO_UUIDS.service) {
    return DEMO_UUIDS.service;
  }
  return DEMO_UUIDS.service;
}

/**
 * Silently create a Project (+ conversation) when a customer starts chat.
 * Reference images are sent inside chat, not at service-page inquiry time.
 */
export async function createInquiryProject(
  formData: FormData,
): Promise<CreateInquiryProjectResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      needAuth: true,
      error: "Authentication required",
    };
  }

  const serviceId = String(formData.get("serviceId") ?? "");
  const serviceTitle = String(formData.get("serviceTitle") ?? "");
  const storeName = String(formData.get("storeName") ?? "");

  if (!serviceId || !serviceTitle) {
    return { ok: false, error: "Missing service fields" };
  }

  try {
    const projectNumber = buildProjectNumber();
    const statusLabel =
      PROJECT_STATUS_META[ProjectStatus.INQUIRY]?.label ?? "문의";
    const description = storeName ? `상점: ${storeName}` : null;

    const project = await createProjectViaProvider({
      service_id: resolveServiceUuid(serviceId),
      customer_id: user.profile.id,
      seller_id: DEMO_UUIDS.seller,
      status: ProjectStatus.INQUIRY,
      title: serviceTitle || statusLabel,
      description,
      project_number: projectNumber,
      demo_key: null,
    });

    try {
      await chatRepository.createConversation({
        project_id: project.id,
        customer_id: user.profile.id,
        seller_id: DEMO_UUIDS.seller,
        demo_key: null,
      });
    } catch {
      // Conversation is best-effort; project remains usable.
    }

    return {
      ok: true,
      projectId: project.demo_key ?? project.id,
      project,
      source: "supabase",
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Create project failed",
    };
  }
}
