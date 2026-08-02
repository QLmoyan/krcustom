"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { QuoteStatus, getStatusLabel } from "@/constants/status";
import { DEMO } from "@/data/demoFlow";
import {
  confirmQuoteAction,
  requestQuoteRevisionAction,
} from "@/lib/actions/quote";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Quote, QuoteStatus as QuoteStatusCode } from "@/types/Quote";

const copy = ko.quote;

type QuoteCardProps = {
  quote: Quote;
  showActions?: boolean;
  /** Reserved for post-design-confirm checkout; not shown on quote accept alone. */
  checkoutOrderId?: string | null;
};

export function QuoteCard({
  quote,
  showActions = true,
}: QuoteCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const accepted = quote.status === QuoteStatus.ACCEPTED;
  const canRespond = quote.status === QuoteStatus.SENT;

  function runAction(kind: "accept" | "revise") {
    setError(null);
    startTransition(async () => {
      const result =
        kind === "accept"
          ? await confirmQuoteAction({
              quoteId: quote.id,
              projectId: quote.projectId,
            })
          : await requestQuoteRevisionAction({
              quoteId: quote.id,
              projectId: quote.projectId,
            });

      if (!result.ok) {
        setError(
          result.needAuth
            ? ko.project.chatLoginRequired
            : result.error || copy.actionFailed,
        );
        return;
      }
      router.refresh();
    });
  }

  return (
    <article className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[12px] font-medium text-[#0369A1]">
            {ko.project.versionLabel} V{quote.version}
          </p>
          <h3 className="mt-0.5 text-[16px] font-bold tabular-nums text-[#0F172A]">
            {formatKRW(quote.total)}
          </h3>
        </div>
        <QuoteStatusBadge status={quote.status} />
      </div>

      <ul className="mt-3 space-y-1.5 text-[13px]">
        {quote.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 text-[#0F172A]"
          >
            <span className="min-w-0 break-keep">
              {item.name}
              <span className="mt-0.5 block text-[11px] text-[#64748B]">
                {item.quantity} × {formatKRW(item.unitPrice)}
              </span>
            </span>
            <span className="shrink-0 font-medium tabular-nums">
              {formatKRW(item.amount)}
            </span>
          </li>
        ))}
      </ul>

      {quote.note ? (
        <p className="mt-3 break-keep rounded-lg bg-white/70 px-3 py-2 text-[12px] leading-relaxed text-[#64748B]">
          {quote.note}
        </p>
      ) : null}

      <p className="mt-2 text-[11px] text-[#94A3B8]">
        {ko.project.validUntil} {quote.expiresAt}
        {quote.sentAt ? ` · ${ko.project.sentAt} ${quote.sentAt}` : ""}
      </p>

      {error ? (
        <p className="mt-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] text-[#B91C1C]">
          {error}
        </p>
      ) : null}

      {showActions ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {accepted ? (
            <Button
              href={`/design-proofs/${DEMO.designProofId}`}
              variant="primary"
              size="sm"
            >
              {ko.designProof.viewCustomerProof}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={pending || !canRespond}
                onClick={() => runAction("accept")}
              >
                {pending ? copy.saving : copy.accept}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending || !canRespond}
                onClick={() => runAction("revise")}
              >
                {copy.requestChange}
              </Button>
            </>
          )}
        </div>
      ) : null}
    </article>
  );
}

export function quoteStatusLabel(status: QuoteStatusCode): string {
  return getStatusLabel("quote", status);
}

export function QuoteStatusBadge({ status }: { status: QuoteStatusCode }) {
  return <StatusBadge domain="quote" status={status} />;
}
