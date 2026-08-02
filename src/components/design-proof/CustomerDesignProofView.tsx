"use client";

import Link from "next/link";
import { DesignProofActionPanel } from "@/components/design-proof/DesignProofActionPanel";
import { DesignProofFeedback } from "@/components/design-proof/DesignProofFeedback";
import { DesignProofPreview } from "@/components/design-proof/DesignProofPreview";
import { DesignProofVersionList } from "@/components/design-proof/DesignProofVersionList";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DesignProofStatus, getStatusLabel } from "@/constants/status";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";
import type { Quote } from "@/types/Quote";

const copy = ko.designProof;

type CustomerDesignProofViewProps = {
  proof: DesignProof;
  versions: DesignProof[];
  quote?: Quote | null;
  checkoutOrderId?: string | null;
};

export function CustomerDesignProofView({
  proof,
  versions,
  quote = null,
  checkoutOrderId = null,
}: CustomerDesignProofViewProps) {
  const confirmed =
    proof.status === DesignProofStatus.CONFIRMED ||
    proof.status === DesignProofStatus.LOCKED;

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
        <StatusBadge domain="designProof" status={proof.status} />
      </div>

      {confirmed ? (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#15803D]">
          {proof.status === DesignProofStatus.LOCKED
            ? copy.lockedBanner
            : copy.confirmedSaved}
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
        <DesignProofPreview proof={proof} large />
      </section>

      <DesignProofFeedback proof={proof} />

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

      <DesignProofActionPanel proof={proof} mode="customer" />

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
        {confirmed && checkoutOrderId ? (
          <>
            <Link
              href={`/checkout/${checkoutOrderId}`}
              className="text-[13px] font-semibold text-[#0369A1] hover:underline"
            >
              {copy.checkoutPay}
            </Link>
            <Link
              href={`/orders/${checkoutOrderId}`}
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
