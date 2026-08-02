import {
  canTransition,
  type WorkflowDomain,
} from "@/constants/workflow";
import {
  defaultLinkPath,
  resolveNotificationType,
  workflowChatBody,
  workflowNotificationBody,
  workflowNotificationTitle,
  workflowTimelineDescription,
  workflowTimelineTitle,
} from "@/lib/workflow/messages";
import type { TimelineActorType } from "@/types/TimelineEvent";

export type WorkflowDataSource = "supabase" | "mock";

export type WorkflowTransitionInput = {
  entityId: string;
  fromStatus: string;
  toStatus: string;
  /** Project UUID or demo_key for timeline / chat linkage */
  projectId?: string | null;
  actorType?: TimelineActorType;
  actorId?: string | null;
  actorName?: string;
  notifyUserId?: string | null;
  linkPath?: string | null;
  /** Skip optional chat system message */
  skipChat?: boolean;
  note?: string;
};

export type WorkflowTransitionResult = {
  ok: boolean;
  domain: WorkflowDomain;
  fromStatus: string;
  toStatus: string;
  source: WorkflowDataSource;
  error?: string;
  timelineAppended?: boolean;
  notificationCreated?: boolean;
  chatNotified?: boolean;
};

export type WorkflowEventInput = WorkflowTransitionInput & {
  domain: WorkflowDomain;
};

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

async function persistStatus(
  domain: WorkflowDomain,
  entityId: string,
  toStatus: string,
  note?: string,
): Promise<boolean> {
  switch (domain) {
    case "project": {
      const projectRepository = await import("@/repositories/project");
      await projectRepository.updateProject(entityId, { status: toStatus });
      return true;
    }
    case "quote": {
      const quoteRepository = await import("@/repositories/quote");
      await quoteRepository.updateStatus(entityId, toStatus);
      return true;
    }
    case "designProof": {
      const designProofRepository = await import("@/repositories/designProof");
      if (toStatus === "CONFIRMED") {
        await designProofRepository.approve(entityId, note);
      } else if (toStatus === "REVISION_REQUESTED") {
        await designProofRepository.reject(entityId, note);
      } else {
        await designProofRepository.updateStatus(entityId, toStatus);
      }
      return true;
    }
    case "order": {
      const orderRepository = await import("@/repositories/order");
      // Persist DB-friendly codes where the schema uses READY_TO_SHIP
      const dbStatus =
        toStatus === "SHIPPING_PENDING" ? "READY_TO_SHIP" : toStatus;
      await orderRepository.updateStatus(entityId, dbStatus);
      return true;
    }
  }
}

async function appendTimelineSideEffect(
  input: WorkflowEventInput,
): Promise<boolean> {
  const projectId = input.projectId;
  if (!projectId) return false;

  try {
    const { appendTimelineEvent } = await import(
      "@/lib/providers/timelineProvider"
    );
    await appendTimelineEvent({
      projectId,
      eventType: `WORKFLOW_${input.domain.toUpperCase()}`,
      title: workflowTimelineTitle(input.domain, input.toStatus),
      description:
        input.note ??
        workflowTimelineDescription(
          input.domain,
          input.fromStatus,
          input.toStatus,
        ),
      status: "COMPLETED",
      actorType: input.actorType ?? "SYSTEM",
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? "시스템",
      metadata: {
        domain: input.domain,
        entityId: input.entityId,
        fromStatus: input.fromStatus,
        toStatus: input.toStatus,
      },
    });
    return true;
  } catch {
    return false;
  }
}

async function createNotificationSideEffect(
  input: WorkflowEventInput,
): Promise<boolean> {
  try {
    const { createNotification } = await import(
      "@/lib/providers/notificationProvider"
    );
    const result = await createNotification({
      userId: input.notifyUserId ?? null,
      type: resolveNotificationType(input.domain, input.toStatus),
      title: workflowNotificationTitle(input.domain, input.toStatus),
      body: workflowNotificationBody(
        input.domain,
        input.fromStatus,
        input.toStatus,
      ),
      linkPath:
        input.linkPath ??
        defaultLinkPath(input.domain, input.entityId, input.projectId),
      entityType: input.domain,
      entityId: null,
    });
    return result.source === "supabase" && result.notification !== null;
  } catch {
    return false;
  }
}

async function chatSideEffect(input: WorkflowEventInput): Promise<boolean> {
  if (input.skipChat || !input.projectId) return false;

  try {
    const chatRepository = await import("@/repositories/chat");
    const conversation = await chatRepository.getConversationByProject(
      input.projectId,
    );
    if (!conversation) return false;

    await chatRepository.sendMessage({
      conversationId: conversation.id,
      senderRole: "ADMIN",
      contentType: "text",
      body: workflowChatBody(
        input.domain,
        input.fromStatus,
        input.toStatus,
      ),
    });
    return true;
  } catch {
    // Chat failure must not block the workflow transition
    return false;
  }
}

/**
 * Core workflow applicator: validate → persist → timeline → notification → chat.
 * Missing Supabase config: returns mock (no write). Persist failure: ok=false
 * (no silent Demo success for write paths).
 */
export async function applyWorkflowEvent(
  input: WorkflowEventInput,
): Promise<WorkflowTransitionResult> {
  const { domain, fromStatus, toStatus } = input;

  if (!canTransition(domain, fromStatus, toStatus)) {
    return {
      ok: false,
      domain,
      fromStatus,
      toStatus,
      source: "mock",
      error: `Illegal transition: ${domain} ${fromStatus} → ${toStatus}`,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      domain,
      fromStatus,
      toStatus,
      source: "mock",
      error: "Supabase is not configured",
      timelineAppended: false,
      notificationCreated: false,
      chatNotified: false,
    };
  }

  try {
    await persistStatus(domain, input.entityId, toStatus, input.note);
  } catch (error) {
    return {
      ok: false,
      domain,
      fromStatus,
      toStatus,
      source: "mock",
      error:
        error instanceof Error
          ? error.message
          : "Failed to persist workflow status",
      timelineAppended: false,
      notificationCreated: false,
      chatNotified: false,
    };
  }

  const timelineAppended = await appendTimelineSideEffect(input);
  const notificationCreated = await createNotificationSideEffect(input);
  const chatNotified = await chatSideEffect(input);

  return {
    ok: true,
    domain,
    fromStatus,
    toStatus,
    source: "supabase",
    timelineAppended,
    notificationCreated,
    chatNotified,
  };
}

export async function transitionProject(
  input: WorkflowTransitionInput,
): Promise<WorkflowTransitionResult> {
  return applyWorkflowEvent({ ...input, domain: "project" });
}

export async function transitionQuote(
  input: WorkflowTransitionInput,
): Promise<WorkflowTransitionResult> {
  return applyWorkflowEvent({ ...input, domain: "quote" });
}

export async function transitionDesignProof(
  input: WorkflowTransitionInput,
): Promise<WorkflowTransitionResult> {
  return applyWorkflowEvent({ ...input, domain: "designProof" });
}

export async function transitionOrder(
  input: WorkflowTransitionInput,
): Promise<WorkflowTransitionResult> {
  return applyWorkflowEvent({ ...input, domain: "order" });
}
