"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DesignProofStatus } from "@/constants/status";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";

const copy = ko.designProof;

type DesignProofActionPanelProps = {
  proof: DesignProof;
  mode: "seller" | "customer";
  onConfirm?: () => void;
  onLock?: () => void;
};

export function DesignProofActionPanel({
  proof,
  mode,
  onConfirm,
  onLock,
}: DesignProofActionPanelProps) {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const locked = proof.status === DesignProofStatus.LOCKED;

  if (mode === "seller") {
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
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <UploadPlaceholder label={copy.uploadImage} />
            <UploadPlaceholder label={copy.uploadPdf} />
            <UploadPlaceholder label={copy.uploadSource} />
          </div>
          <label className="mt-3 block text-[12px] text-[#64748B]">
            {copy.versionDescription}
            <textarea
              rows={2}
              disabled={locked}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#0F766E] disabled:opacity-50"
              placeholder={copy.versionDescription}
            />
          </label>
          <label className="mt-2 block text-[12px] text-[#64748B]">
            {copy.changeContent}
            <textarea
              rows={2}
              disabled={locked}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#0F766E] disabled:opacity-50"
              placeholder={copy.changeContent}
            />
          </label>
          <label className="mt-2 block text-[12px] text-[#64748B]">
            {copy.messageToCustomer}
            <textarea
              rows={2}
              disabled={locked}
              className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#0F766E] disabled:opacity-50"
              placeholder={copy.messageToCustomer}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" disabled>
            {copy.saveDraft}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={locked}
          >
            {copy.requestConfirm}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={locked}
          >
            {copy.uploadVersion}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              locked || proof.status !== DesignProofStatus.CONFIRMED
            }
            onClick={onLock}
          >
            {copy.lockFinal}
          </Button>
        </div>
        <p className="text-[11px] text-[#94A3B8]">{copy.demoNote}</p>
        <p className="text-[12px] text-[#64748B]">{copy.afterProductionHint}</p>
        <p className="text-[12px] text-[#64748B]">{copy.quoteMayChange}</p>
      </section>
    );
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

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={locked || proof.status === DesignProofStatus.CONFIRMED}
          onClick={onConfirm}
        >
          {copy.confirmDone}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          disabled={locked}
          onClick={() => setShowRevisionForm((value) => !value)}
        >
          {copy.requestRevision}
        </Button>
        <Button type="button" variant="ghost" size="md" disabled>
          {copy.askSeller}
        </Button>
      </div>

      {showRevisionForm && !locked ? (
        <div className="space-y-2 rounded-xl border border-[#FDE68A] bg-[#FEFCE8] p-3">
          <h3 className="text-[14px] font-semibold text-[#92400E]">
            {copy.revisionFormTitle}
          </h3>
          {(
            [
              copy.revisionReason,
              copy.revisionPosition,
              copy.revisionSize,
              copy.revisionColor,
              copy.revisionText,
              copy.revisionOther,
            ] as const
          ).map((label) => (
            <label key={label} className="block text-[12px] text-[#78716C]">
              {label}
              <input
                className="mt-1 h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] outline-none focus:border-[#0F766E]"
              />
            </label>
          ))}
          <UploadPlaceholder label={copy.revisionReference} />
          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="button" variant="primary" size="sm" disabled>
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

      <p className="text-[11px] text-[#94A3B8]">{copy.demoNote}</p>
    </section>
  );
}

function UploadPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-[#CBD5E1] bg-white px-2 text-center text-[12px] font-medium text-[#64748B]">
      {label}
    </div>
  );
}
