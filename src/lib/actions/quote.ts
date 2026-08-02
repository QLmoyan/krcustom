"use server";

import { revalidatePath } from "next/cache";
import { QuoteStatus } from "@/constants/status";
import { getCurrentUser } from "@/lib/providers/authProvider";
import {
  createQuote,
  getQuoteById,
  updateQuote,
} from "@/lib/providers/quoteProvider";
import { transitionQuote } from "@/lib/workflow/service";
import * as projectRepository from "@/repositories/project";
import type { QuoteItem } from "@/types/Quote";

export type QuoteActionResult =
  | { ok: true; quoteId?: string; source: "supabase" | "mock" }
  | { ok: false; needAuth?: boolean; error: string };

type QuotePayload = {
  projectId: string;
  baseQuoteId: string;
  items: QuoteItem[];
  discount: number;
  shippingFee: number;
  extraFee: number;
  tax: number;
  note: string;
  subtotal: number;
  total: number;
};

async function requireUser(): Promise<
  | { ok: true; user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> }
  | { ok: false; result: QuoteActionResult }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      result: {
        ok: false,
        needAuth: true,
        error: "Authentication required",
      },
    };
  }
  return { ok: true, user };
}

async function resolveNotifyTarget(
  projectId: string,
  actorRole: string,
): Promise<string | null> {
  try {
    const project = await projectRepository.getProjectById(projectId);
    if (!project) return null;
    if (actorRole === "SELLER") return project.customer_id;
    return project.seller_id;
  } catch {
    return null;
  }
}

function mapItemsForRepo(items: QuoteItem[]) {
  return items.map((item, index) => ({
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: item.amount,
    editable: item.editable,
    sortOrder: index + 1,
  }));
}

function revalidateQuotePaths(projectId: string) {
  revalidatePath(`/project/${projectId}`);
  revalidatePath(`/project/${projectId}/quote`);
  revalidatePath("/seller/quotes");
}

export async function confirmQuoteAction(input: {
  quoteId: string;
  projectId: string;
}): Promise<QuoteActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  const { quote } = await getQuoteById(input.quoteId);
  if (!quote) {
    return { ok: false, error: "Quote not found" };
  }

  try {
    const result = await transitionQuote({
      entityId: input.quoteId,
      fromStatus: quote.status,
      toStatus: QuoteStatus.ACCEPTED,
      projectId: input.projectId,
      actorType: "CUSTOMER",
      actorId: auth.user.profile.id,
      actorName: auth.user.profile.nickname || "고객",
      notifyUserId: await resolveNotifyTarget(input.projectId, "CUSTOMER"),
      linkPath: `/project/${input.projectId}`,
      note: "고객이 견적을 수락했습니다.",
    });

    if (!result.ok || result.source !== "supabase") {
      return {
        ok: false,
        error: result.error ?? "견적 수락을 저장하지 못했습니다.",
      };
    }

    revalidateQuotePaths(input.projectId);
    return { ok: true, quoteId: input.quoteId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "견적 수락 실패",
    };
  }
}

export async function requestQuoteRevisionAction(input: {
  quoteId: string;
  projectId: string;
}): Promise<QuoteActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  const { quote } = await getQuoteById(input.quoteId);
  if (!quote) {
    return { ok: false, error: "Quote not found" };
  }

  try {
    const result = await transitionQuote({
      entityId: input.quoteId,
      fromStatus: quote.status,
      toStatus: QuoteStatus.REVISION_REQUESTED,
      projectId: input.projectId,
      actorType: "CUSTOMER",
      actorId: auth.user.profile.id,
      actorName: auth.user.profile.nickname || "고객",
      notifyUserId: await resolveNotifyTarget(input.projectId, "CUSTOMER"),
      linkPath: `/project/${input.projectId}/quote`,
      note: "고객이 견적 수정을 요청했습니다.",
    });

    if (!result.ok || result.source !== "supabase") {
      return {
        ok: false,
        error: result.error ?? "수정 요청을 저장하지 못했습니다.",
      };
    }

    revalidateQuotePaths(input.projectId);
    return { ok: true, quoteId: input.quoteId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "수정 요청 실패",
    };
  }
}

export async function saveQuoteDraftAction(
  payload: QuotePayload,
): Promise<QuoteActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  if (auth.user.profile.role !== "SELLER" && auth.user.profile.role !== "ADMIN") {
    return { ok: false, error: "Seller role required" };
  }

  try {
    const created = await updateQuote(payload.baseQuoteId, {
      status: QuoteStatus.DRAFT,
      items: mapItemsForRepo(payload.items),
      discount: payload.discount,
      shippingFee: payload.shippingFee,
      extraFee: payload.extraFee,
      tax: payload.tax,
      subtotal: payload.subtotal,
      total: payload.total,
      note: payload.note,
      createdBy: auth.user.profile.nickname || "판매자",
      revisionSummary: "견적 초안 저장",
      revisionActor: auth.user.profile.nickname || "판매자",
      sentAt: null,
      customerConfirmed: false,
    });

    revalidateQuotePaths(payload.projectId);
    return {
      ok: true,
      quoteId: created.demo_key ?? created.id,
      source: "supabase",
    };
  } catch (error) {
    // If base quote is mock-only, try create on the project
    try {
      const created = await createQuote({
        projectId: payload.projectId,
        status: QuoteStatus.DRAFT,
        items: mapItemsForRepo(payload.items),
        discount: payload.discount,
        shippingFee: payload.shippingFee,
        extraFee: payload.extraFee,
        tax: payload.tax,
        subtotal: payload.subtotal,
        total: payload.total,
        note: payload.note,
        createdBy: auth.user.profile.nickname || "판매자",
        revisionSummary: "견적 초안 생성",
        revisionActor: auth.user.profile.nickname || "판매자",
      });
      revalidateQuotePaths(payload.projectId);
      return {
        ok: true,
        quoteId: created.demo_key ?? created.id,
        source: "supabase",
      };
    } catch (createError) {
      return {
        ok: false,
        error:
          createError instanceof Error
            ? createError.message
            : error instanceof Error
              ? error.message
              : "초안 저장 실패",
      };
    }
  }
}

export async function sendQuoteAction(
  payload: QuotePayload,
): Promise<QuoteActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  if (auth.user.profile.role !== "SELLER" && auth.user.profile.role !== "ADMIN") {
    return { ok: false, error: "Seller role required" };
  }

  const nowIso = new Date().toISOString();
  const expires = new Date();
  expires.setDate(expires.getDate() + 14);
  const expiresAt = expires.toISOString().slice(0, 10);

  try {
    let quoteId = payload.baseQuoteId;
    try {
      const created = await updateQuote(payload.baseQuoteId, {
        status: QuoteStatus.SENT,
        items: mapItemsForRepo(payload.items),
        discount: payload.discount,
        shippingFee: payload.shippingFee,
        extraFee: payload.extraFee,
        tax: payload.tax,
        subtotal: payload.subtotal,
        total: payload.total,
        note: payload.note,
        createdBy: auth.user.profile.nickname || "판매자",
        sentAt: nowIso,
        expiresAt,
        customerConfirmed: false,
        revisionSummary: "견적 발송",
        revisionActor: auth.user.profile.nickname || "판매자",
      });
      quoteId = created.demo_key ?? created.id;
    } catch {
      const created = await createQuote({
        projectId: payload.projectId,
        status: QuoteStatus.SENT,
        items: mapItemsForRepo(payload.items),
        discount: payload.discount,
        shippingFee: payload.shippingFee,
        extraFee: payload.extraFee,
        tax: payload.tax,
        subtotal: payload.subtotal,
        total: payload.total,
        note: payload.note,
        createdBy: auth.user.profile.nickname || "판매자",
        sentAt: nowIso,
        expiresAt,
        revisionSummary: "견적 발송",
        revisionActor: auth.user.profile.nickname || "판매자",
      });
      quoteId = created.demo_key ?? created.id;
    }

    // Ensure workflow side-effects (timeline / notification / chat)
    const { quote: fresh } = await getQuoteById(quoteId);
    if (fresh && fresh.status === QuoteStatus.DRAFT) {
      const transition = await transitionQuote({
        entityId: quoteId,
        fromStatus: QuoteStatus.DRAFT,
        toStatus: QuoteStatus.SENT,
        projectId: payload.projectId,
        actorType: "SELLER",
        actorId: auth.user.profile.id,
        actorName: auth.user.profile.nickname || "판매자",
        notifyUserId: await resolveNotifyTarget(payload.projectId, "SELLER"),
        linkPath: `/project/${payload.projectId}`,
      });
      if (!transition.ok || transition.source !== "supabase") {
        return {
          ok: false,
          error: transition.error ?? "견적 발송 워크플로 실패",
        };
      }
    } else {
      // Already SENT — still notify customer
      const { createNotification } = await import(
        "@/lib/providers/notificationProvider"
      );
      await createNotification({
        userId: await resolveNotifyTarget(payload.projectId, "SELLER"),
        type: "QUOTE_UPDATED",
        title: "새 견적이 도착했습니다",
        body: "견적서를 확인하고 수락하거나 수정을 요청해 주세요.",
        linkPath: `/project/${payload.projectId}`,
        entityType: "quote",
      });
    }

    revalidateQuotePaths(payload.projectId);
    return { ok: true, quoteId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "견적 발송 실패",
    };
  }
}
