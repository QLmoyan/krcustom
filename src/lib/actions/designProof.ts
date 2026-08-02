"use server";

import { revalidatePath } from "next/cache";
import { DesignProofStatus } from "@/constants/status";
import { getCurrentUser } from "@/lib/providers/authProvider";
import {
  createVersion,
  getDesignProofById,
} from "@/lib/providers/designProofProvider";
import { uploadDesignProofImage } from "@/lib/providers/storageProvider";
import { transitionDesignProof } from "@/lib/workflow/service";
import * as projectRepository from "@/repositories/project";

export type DesignProofActionResult =
  | { ok: true; proofId?: string; source: "supabase" | "mock" }
  | { ok: false; needAuth?: boolean; error: string };

async function requireUser(): Promise<
  | { ok: true; user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> }
  | { ok: false; result: DesignProofActionResult }
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

function revalidateProofPaths(projectId: string, proofId: string) {
  revalidatePath(`/design-proofs/${proofId}`);
  revalidatePath(`/seller/design-proofs/${proofId}`);
  revalidatePath(`/seller/design-proofs`);
  revalidatePath(`/project/${projectId}`);
}

export async function confirmDesignProofAction(input: {
  proofId: string;
  projectId: string;
}): Promise<DesignProofActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  const { proof } = await getDesignProofById(input.proofId);
  if (!proof) {
    return { ok: false, error: "Design proof not found" };
  }

  try {
    const result = await transitionDesignProof({
      entityId: input.proofId,
      fromStatus: proof.status,
      toStatus: DesignProofStatus.CONFIRMED,
      projectId: input.projectId,
      actorType: "CUSTOMER",
      actorId: auth.user.profile.id,
      actorName: auth.user.profile.nickname || "고객",
      notifyUserId: await resolveNotifyTarget(input.projectId, "CUSTOMER"),
      linkPath: `/seller/design-proofs/${input.proofId}`,
      note: "고객이 시안을 확인했습니다.",
    });

    if (!result.ok || result.source !== "supabase") {
      return {
        ok: false,
        error: result.error ?? "시안 확인을 저장하지 못했습니다.",
      };
    }

    revalidateProofPaths(input.projectId, input.proofId);
    return { ok: true, proofId: input.proofId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "시안 확인 실패",
    };
  }
}

export async function requestDesignProofRevisionAction(input: {
  proofId: string;
  projectId: string;
  comment: string;
}): Promise<DesignProofActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  const { proof } = await getDesignProofById(input.proofId);
  if (!proof) {
    return { ok: false, error: "Design proof not found" };
  }

  const comment = input.comment.trim();
  if (!comment) {
    return { ok: false, error: "Revision comment required" };
  }

  try {
    const result = await transitionDesignProof({
      entityId: input.proofId,
      fromStatus: proof.status,
      toStatus: DesignProofStatus.REVISION_REQUESTED,
      projectId: input.projectId,
      actorType: "CUSTOMER",
      actorId: auth.user.profile.id,
      actorName: auth.user.profile.nickname || "고객",
      notifyUserId: await resolveNotifyTarget(input.projectId, "CUSTOMER"),
      linkPath: `/seller/design-proofs/${input.proofId}`,
      note: comment,
    });

    if (!result.ok || result.source !== "supabase") {
      return {
        ok: false,
        error: result.error ?? "수정 요청을 저장하지 못했습니다.",
      };
    }

    revalidateProofPaths(input.projectId, input.proofId);
    return { ok: true, proofId: input.proofId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "수정 요청 실패",
    };
  }
}

export async function requestDesignProofConfirmAction(input: {
  proofId: string;
  projectId: string;
}): Promise<DesignProofActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  if (auth.user.profile.role !== "SELLER" && auth.user.profile.role !== "ADMIN") {
    return { ok: false, error: "Seller role required" };
  }

  const { proof } = await getDesignProofById(input.proofId);
  if (!proof) {
    return { ok: false, error: "Design proof not found" };
  }

  try {
    const result = await transitionDesignProof({
      entityId: input.proofId,
      fromStatus: proof.status,
      toStatus: DesignProofStatus.CONFIRMATION_PENDING,
      projectId: input.projectId,
      actorType: "SELLER",
      actorId: auth.user.profile.id,
      actorName: auth.user.profile.nickname || "판매자",
      notifyUserId: await resolveNotifyTarget(input.projectId, "SELLER"),
      linkPath: `/design-proofs/${input.proofId}`,
    });

    if (!result.ok || result.source !== "supabase") {
      return {
        ok: false,
        error: result.error ?? "확인 요청을 저장하지 못했습니다.",
      };
    }

    revalidateProofPaths(input.projectId, input.proofId);
    return { ok: true, proofId: input.proofId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "확인 요청 실패",
    };
  }
}

export async function lockDesignProofAction(input: {
  proofId: string;
  projectId: string;
}): Promise<DesignProofActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  if (auth.user.profile.role !== "SELLER" && auth.user.profile.role !== "ADMIN") {
    return { ok: false, error: "Seller role required" };
  }

  const { proof } = await getDesignProofById(input.proofId);
  if (!proof) {
    return { ok: false, error: "Design proof not found" };
  }

  try {
    const result = await transitionDesignProof({
      entityId: input.proofId,
      fromStatus: proof.status,
      toStatus: DesignProofStatus.LOCKED,
      projectId: input.projectId,
      actorType: "SELLER",
      actorId: auth.user.profile.id,
      actorName: auth.user.profile.nickname || "판매자",
      notifyUserId: await resolveNotifyTarget(input.projectId, "SELLER"),
      linkPath: `/design-proofs/${input.proofId}`,
      note: "최종 시안이 잠금 처리되었습니다.",
    });

    if (!result.ok || result.source !== "supabase") {
      return {
        ok: false,
        error: result.error ?? "시안 잠금을 저장하지 못했습니다.",
      };
    }

    revalidateProofPaths(input.projectId, input.proofId);
    return { ok: true, proofId: input.proofId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "시안 잠금 실패",
    };
  }
}

/**
 * Upload image to Storage and append a new design-proof version in DB.
 * Requires authenticated seller; rejects mock-only upload fallback.
 */
export async function uploadDesignProofVersionAction(
  formData: FormData,
): Promise<DesignProofActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth.result;

  if (auth.user.profile.role !== "SELLER" && auth.user.profile.role !== "ADMIN") {
    return { ok: false, error: "Seller role required" };
  }

  const proofId = String(formData.get("proofId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const changeContent = String(formData.get("changeContent") ?? "").trim();
  const sellerComment = String(formData.get("sellerComment") ?? "").trim();
  const file = formData.get("image");

  if (!proofId || !projectId) {
    return { ok: false, error: "Missing proof or project id" };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Image file required" };
  }

  try {
    const upload = await uploadDesignProofImage(proofId, file, {
      filename: file.name,
    });

    if (upload.source !== "storage" || !upload.url) {
      return {
        ok: false,
        error: "시안 이미지를 Storage에 업로드하지 못했습니다. 로그인을 확인해 주세요.",
      };
    }

    const combinedNotes = [notes, changeContent].filter(Boolean).join("\n");

    const created = await createVersion({
      projectId,
      imageUrl: upload.url,
      thumbnailUrl: upload.url,
      notes: combinedNotes,
      sellerComment,
      status: DesignProofStatus.SENT,
    });

    const newProofId = created.demo_key ?? created.id;

    await transitionDesignProof({
      entityId: newProofId,
      fromStatus: DesignProofStatus.DRAFT,
      toStatus: DesignProofStatus.SENT,
      projectId,
      actorType: "SELLER",
      actorId: auth.user.profile.id,
      actorName: auth.user.profile.nickname || "판매자",
      notifyUserId: await resolveNotifyTarget(projectId, "SELLER"),
      linkPath: `/design-proofs/${newProofId}`,
      note: combinedNotes || "새 시안 버전이 업로드되었습니다.",
    }).catch(() => null);

    // Notify even if transition skipped (already SENT)
    const { createNotification } = await import(
      "@/lib/providers/notificationProvider"
    );
    await createNotification({
      userId: await resolveNotifyTarget(projectId, "SELLER"),
      type: "DESIGN_UPLOADED",
      title: "새 시안이 업로드되었습니다",
      body: "시안 확인 후 승인하거나 수정 요청을 남겨 주세요.",
      linkPath: `/design-proofs/${newProofId}`,
      entityType: "designProof",
    });

    revalidateProofPaths(projectId, proofId);
    revalidateProofPaths(projectId, newProofId);
    return { ok: true, proofId: newProofId, source: "supabase" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "시안 업로드 실패",
    };
  }
}
