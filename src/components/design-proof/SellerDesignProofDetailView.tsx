"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DesignProofActionPanel } from "@/components/design-proof/DesignProofActionPanel";
import { DesignProofFeedback } from "@/components/design-proof/DesignProofFeedback";
import { DesignProofPreview } from "@/components/design-proof/DesignProofPreview";
import { DesignProofTimeline } from "@/components/design-proof/DesignProofTimeline";
import { DesignProofVersionList } from "@/components/design-proof/DesignProofVersionList";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DesignProofStatus } from "@/constants/status";
import { formatFileSize } from "@/lib/file";
import { formatKRW } from "@/lib/format";
import { getQuoteById } from "@/data/mockQuotes";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";
import type { TimelineEvent } from "@/types/TimelineEvent";

const copy = ko.designProof;

type SellerDesignProofDetailViewProps = {
  initialProof: DesignProof;
  versions: DesignProof[];
  timeline: TimelineEvent[];
};

export function SellerDesignProofDetailView({
  initialProof,
  versions,
  timeline,
}: SellerDesignProofDetailViewProps) {
  const [activeId, setActiveId] = useState(initialProof.id);
  const [lockedLocally, setLockedLocally] = useState(
    initialProof.status === DesignProofStatus.LOCKED,
  );

  const active = useMemo(() => {
    const found = versions.find((proof) => proof.id === activeId);
    if (!found) return initialProof;
    if (lockedLocally && found.id === initialProof.id) {
      return {
        ...found,
        status: DesignProofStatus.LOCKED,
        lockedAt: found.lockedAt || "2026.07.15 03:50",
      };
    }
    return found;
  }, [activeId, initialProof, lockedLocally, versions]);

  const quote = active.quoteId ? getQuoteById(active.quoteId) : undefined;

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/seller/design-proofs"
            className="text-[13px] font-medium text-[#0369A1] hover:underline"
          >
            {copy.backToList}
          </Link>
          <h2 className="mt-2 text-[20px] font-bold text-[#0F172A]">
            {active.title}
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {active.proofNumber} · {active.projectNumber} · {active.serviceName}
          </p>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {active.customerName} · {active.storeName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge domain="designProof" status={active.status} />
          <Link
            href={`/project/${active.projectId}`}
            className="text-[12px] font-semibold text-[#0F766E] hover:underline"
          >
            {copy.backToWorkspace}
          </Link>
          {active.projectId === "prj-001" ? (
            <Link
              href="/seller/orders/ord-001"
              className="text-[12px] font-semibold text-[#0369A1] hover:underline"
            >
              {ko.order.openOrder}
            </Link>
          ) : null}
        </div>
      </div>

      {active.status === DesignProofStatus.LOCKED || lockedLocally ? (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#15803D]">
          {copy.lockedHint}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <DesignProofVersionList
          versions={versions}
          activeId={active.id}
          onSelect={setActiveId}
        />
        <div className="space-y-4">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <h3 className="mb-3 text-[15px] font-semibold text-[#0F172A]">
              {copy.currentPreview} · V{active.version}
            </h3>
            <DesignProofPreview proof={active} />
            {active.files.length > 0 ? (
              <ul className="mt-3 space-y-1 text-[12px] text-[#64748B]">
                <li className="font-medium text-[#0F172A]">{copy.filesLabel}</li>
                {active.files.map((file) => (
                  <li key={file.id}>
                    {file.name} · {formatFileSize(file.size)} · {file.category}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
          <DesignProofFeedback proof={active} />
        </div>
      </div>

      {quote ? (
        <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[#0F172A]">
                {copy.quoteSummary}
              </h3>
              <p className="mt-1 text-[13px] text-[#64748B]">
                V{quote.version} · {formatKRW(quote.total)}
              </p>
            </div>
            <Button
              href={`/project/${active.projectId}/quote`}
              variant="outline"
              size="sm"
            >
              {copy.viewQuote}
            </Button>
          </div>
        </section>
      ) : null}

      <div id="upload">
        <DesignProofActionPanel
          proof={active}
          mode="seller"
          onLock={() => setLockedLocally(true)}
        />
      </div>

      <DesignProofTimeline events={timeline} />
    </div>
  );
}
