"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { DesignProofStatus } from "@/constants/status";
import {
  confirmDesignProofAction,
  lockDesignProofAction,
  requestDesignProofConfirmAction,
  requestDesignProofRevisionAction,
  uploadDesignProofVersionAction,
} from "@/lib/actions/designProof";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";

const copy = ko.designProof;

type DesignProofActionPanelProps = {
  proof: DesignProof;
  mode: "seller" | "customer";
};

export function DesignProofActionPanel({
  proof,
  mode,
}: DesignProofActionPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionFields, setRevisionFields] = useState({
    reason: "",
    position: "",
    size: "",
    color: "",
    text: "",
    other: "",
  });
  const [notes, setNotes] = useState("");
  const [changeContent, setChangeContent] = useState("");
  const [sellerComment, setSellerComment] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const locked = proof.status === DesignProofStatus.LOCKED;

  function refresh() {
    router.refresh();
  }

  function handleError(result: {
    ok: false;
    needAuth?: boolean;
    error: string;
  }) {
    setError(
      result.needAuth ? ko.project.chatLoginRequired : result.error || copy.actionFailed,
    );
  }

  if (mode === "seller") {
    function runSeller(kind: "confirm" | "lock" | "upload") {
      setError(null);
      setSuccess(null);
      startTransition(async () => {
        if (kind === "confirm") {
          const result = await requestDesignProofConfirmAction({
            proofId: proof.id,
            projectId: proof.projectId,
          });
          if (!result.ok) {
            handleError(result);
            return;
          }
          setSuccess(copy.confirmRequested);
          refresh();
          return;
        }

        if (kind === "lock") {
          const result = await lockDesignProofAction({
            proofId: proof.id,
            projectId: proof.projectId,
          });
          if (!result.ok) {
            handleError(result);
            return;
          }
          setSuccess(copy.lockSaved);
          refresh();
          return;
        }

        const file = imageInputRef.current?.files?.[0];
        if (!file) {
          setError(copy.imageRequired);
          return;
        }

        const formData = new FormData();
        formData.set("proofId", proof.id);
        formData.set("projectId", proof.projectId);
        formData.set("notes", notes);
        formData.set("changeContent", changeContent);
        formData.set("sellerComment", sellerComment);
        formData.set("image", file);

        const result = await uploadDesignProofVersionAction(formData);
        if (!result.ok) {
          handleError(result);
          return;
        }
        setSuccess(copy.uploadSaved);
        if (imageInputRef.current) imageInputRef.current.value = "";
        refresh();
      });
    }

    return (
      <section className="space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
        {locked ? (
          <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[13px] text-[#15803D]">
            {copy.lockedBanner}
            <p className="mt-1 text-[12px] text-[#64748B]">
              {copy.lockedAt} {proof.lockedAt}
              {proof.confirmedBy
                ? ` · ${copy.confirmedBy} ${proof.confirmedBy}`
                : ""}
            </p>
            <p className="mt-1 text-[12px] text-[#64748B]">
              {copy.createNewToEdit}
            </p>
          </div>
        ) : null}

        {proof.status === DesignProofStatus.REVISION_REQUESTED ? (
          <div className="rounded-lg border border-[#FDE68A] bg-[#FEFCE8] px-3 py-2 text-[13px] text-[#A16207]">
            {copy.revisionRequestedHint}
          </div>
        ) : null}

        {!locked &&
        proof.status !== DesignProofStatus.CONFIRMED &&
        proof.status !== DesignProofStatus.LOCKED ? (
          <div className="rounded-lg border border-[#FDE68A] bg-[#FEFCE8] px-3 py-2 text-[13px] text-[#A16207]">
            {copy.cannotProduce}
          </div>
        ) : null}

        <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3">
          <h3 className="text-[14px] font-semibold text-[#0F172A]">
            {copy.uploadArea}
          </h3>
          <div className="mt-3">
            <label className="flex h-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#CBD5E1] bg-white px-2 text-center text-[12px] font-medium text-[#64748B] hover:border-[#0F766E] hover:text-[#0F766E]">
              {copy.uploadImage}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={locked || pending}
              />
            </label>
          </div>
          <label className="mt-3 block text-[12px] text-[#64748B]">
            {copy.versionDescription}
            <textarea
              rows={2}
              disabled={locked || pending}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#0F766E] disabled:opacity-50"
              placeholder={copy.versionDescription}
            />
          </label>
          <label className="mt-2 block text-[12px] text-[#64748B]">
            {copy.changeContent}
            <textarea
              rows={2}
              disabled={locked || pending}
              value={changeContent}
              onChange={(e) => setChangeContent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#0F766E] disabled:opacity-50"
              placeholder={copy.changeContent}
            />
          </label>
          <label className="mt-2 block text-[12px] text-[#64748B]">
            {copy.messageToCustomer}
            <textarea
              rows={2}
              disabled={locked || pending}
              value={sellerComment}
              onChange={(e) => setSellerComment(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#0F766E] disabled:opacity-50"
              placeholder={copy.messageToCustomer}
            />
          </label>
        </div>

        {error ? (
          <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] text-[#B91C1C]">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[12px] text-[#15803D]">
            {success}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={locked || pending}
            onClick={() => runSeller("confirm")}
          >
            {copy.requestConfirm}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={locked || pending}
            onClick={() => runSeller("upload")}
          >
            {pending ? copy.saving : copy.uploadVersion}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              locked ||
              pending ||
              proof.status !== DesignProofStatus.CONFIRMED
            }
            onClick={() => runSeller("lock")}
          >
            {copy.lockFinal}
          </Button>
        </div>
        <p className="text-[11px] text-[#94A3B8]">{copy.writeHint}</p>
        <p className="text-[12px] text-[#64748B]">{copy.afterProductionHint}</p>
        <p className="text-[12px] text-[#64748B]">{copy.quoteMayChange}</p>
      </section>
    );
  }

  const canConfirm =
    !locked &&
    (proof.status === DesignProofStatus.SENT ||
      proof.status === DesignProofStatus.CONFIRMATION_PENDING);

  function runCustomerConfirm() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await confirmDesignProofAction({
        proofId: proof.id,
        projectId: proof.projectId,
      });
      if (!result.ok) {
        handleError(result);
        return;
      }
      setSuccess(copy.confirmedSaved);
      refresh();
    });
  }

  function runCustomerRevision() {
    setError(null);
    setSuccess(null);
    const comment = [
      revisionFields.reason && `${copy.revisionReason}: ${revisionFields.reason}`,
      revisionFields.position &&
        `${copy.revisionPosition}: ${revisionFields.position}`,
      revisionFields.size && `${copy.revisionSize}: ${revisionFields.size}`,
      revisionFields.color && `${copy.revisionColor}: ${revisionFields.color}`,
      revisionFields.text && `${copy.revisionText}: ${revisionFields.text}`,
      revisionFields.other && `${copy.revisionOther}: ${revisionFields.other}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (!comment.trim()) {
      setError(copy.revisionRequired);
      return;
    }

    startTransition(async () => {
      const result = await requestDesignProofRevisionAction({
        proofId: proof.id,
        projectId: proof.projectId,
        comment,
      });
      if (!result.ok) {
        handleError(result);
        return;
      }
      setSuccess(copy.revisionSaved);
      setShowRevisionForm(false);
      refresh();
    });
  }

  return (
    <section className="space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-2 text-[13px] leading-relaxed text-[#0369A1]">
        {copy.confirmNotice}
      </div>

      {locked ? (
        <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[13px] text-[#15803D]">
          {copy.lockedBanner}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] text-[#B91C1C]">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[12px] text-[#15803D]">
          {success}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={pending || !canConfirm}
          onClick={runCustomerConfirm}
        >
          {pending ? copy.saving : copy.confirmDone}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          disabled={locked || pending}
          onClick={() => setShowRevisionForm((value) => !value)}
        >
          {copy.requestRevision}
        </Button>
      </div>

      {showRevisionForm && !locked ? (
        <div className="space-y-2 rounded-xl border border-[#FDE68A] bg-[#FEFCE8] p-3">
          <h3 className="text-[14px] font-semibold text-[#92400E]">
            {copy.revisionFormTitle}
          </h3>
          {(
            [
              ["reason", copy.revisionReason],
              ["position", copy.revisionPosition],
              ["size", copy.revisionSize],
              ["color", copy.revisionColor],
              ["text", copy.revisionText],
              ["other", copy.revisionOther],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-[12px] text-[#78716C]">
              {label}
              <input
                value={revisionFields[key]}
                onChange={(e) =>
                  setRevisionFields((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                className="mt-1 h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] outline-none focus:border-[#0F766E]"
              />
            </label>
          ))}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={pending}
              onClick={runCustomerRevision}
            >
              {copy.submitRevision}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRevisionForm(false)}
            >
              {copy.cancelRevision}
            </Button>
          </div>
          <p className="text-[12px] text-[#A16207]">{copy.quoteMayChange}</p>
        </div>
      ) : null}

      <p className="text-[11px] text-[#94A3B8]">{copy.writeHint}</p>
    </section>
  );
}
