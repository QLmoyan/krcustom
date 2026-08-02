"use client";

import Link from "next/link";
import { useState } from "react";
import { DesignProofActionPanel } from "@/components/design-proof/DesignProofActionPanel";
import { DesignProofFeedback } from "@/components/design-proof/DesignProofFeedback";
import { DesignProofPreview } from "@/components/design-proof/DesignProofPreview";
import { DesignProofVersionList } from "@/components/design-proof/DesignProofVersionList";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DesignProofStatus } from "@/constants/status";
import { getQuoteById } from "@/data/mockQuotes";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";
import { getStatusLabel } from "@/constants/status";

const copy = ko.designProof;

type CustomerDesignProofViewProps = {
  proof: DesignProof;
  versions: DesignProof[];
};

export function CustomerDesignProofView({
  proof,
  versions,
}: CustomerDesignProofViewProps) {
  const [uiStatus, setUiStatus] = useState(proof.status);
  const [confirmedLocal, setConfirmedLocal] = useState(
    proof.status === DesignProofStatus.CONFIRMED ||
      proof.status === DesignProofStatus.LOCKED,
  );

  const displayProof: DesignProof = {
    ...proof,
    status: uiStatus,
  };

  const quote = proof.quoteId ? getQuoteById(proof.quoteId) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium text-[#0F766E]">
            {copy.customerTitle}
          </p>
          <h1 className="mt-1 text-[20px] font-bold text-[#0F172A] md:text-[22px]">
            {proof.title} · V{proof.version}
          </h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {copy.serviceInfo}: {proof.serviceName} · {proof.storeName}
          </p>
        </div>
        <StatusBadge domain="designProof" status={uiStatus} />
      </div>

      {confirmedLocal ? (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#15803D]">
          {uiStatus === DesignProofStatus.LOCKED
            ? copy.lockedBanner
            : copy.confirmedLocal}
        </div>
      ) : (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FEFCE8] px-4 py-3 text-[13px] text-[#A16207]">
          {copy.cannotProduce}
        </div>
      )}

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h2 className="mb-3 text-[15px] font-semibold text-[#0F172A]">
          {copy.preview}
        </h2>
        <DesignProofPreview proof={displayProof} large />
      </section>

      <DesignProofFeedback proof={displayProof} />

      {quote ? (
        <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[14px] font-semibold text-[#0F172A]">
                {copy.quoteSummary}
              </h2>
              <p className="mt-1 text-[13px] text-[#64748B]">
                V{quote.version} · {formatKRW(quote.total)} ·{" "}
                {getStatusLabel("quote", quote.status)}
              </p>
            </div>
            <Button
              href={`/project/${proof.projectId}/quote`}
              variant="outline"
              size="sm"
            >
              {copy.viewQuote}
            </Button>
          </div>
        </section>
      ) : null}

      <DesignProofActionPanel
        proof={displayProof}
        mode="customer"
        onConfirm={() => {
          setUiStatus(DesignProofStatus.CONFIRMED);
          setConfirmedLocal(true);
        }}
      />

      <DesignProofVersionList versions={versions} activeId={proof.id} />

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/project/${proof.projectId}`}
          className="text-[13px] font-semibold text-[#0F766E] hover:underline"
        >
          {copy.openInWorkspace}
        </Link>
        <Link
          href={`/project/${proof.projectId}/quote`}
          className="text-[13px] font-semibold text-[#0369A1] hover:underline"
        >
          {copy.viewQuote}
        </Link>
        {confirmedLocal || uiStatus === DesignProofStatus.LOCKED ? (
          <>
            <Link
              href="/checkout/ord-001"
              className="text-[13px] font-semibold text-[#0369A1] hover:underline"
            >
              {copy.checkoutPay}
            </Link>
            <Link
              href="/orders/ord-001"
              className="text-[13px] font-semibold text-[#0F766E] hover:underline"
            >
              {ko.order.openOrder}
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
