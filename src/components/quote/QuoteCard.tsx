import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { QuoteStatus, getStatusLabel } from "@/constants/status";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Quote, QuoteStatus as QuoteStatusCode } from "@/types/Quote";

const copy = ko.quote;

type QuoteCardProps = {
  quote: Quote;
  showActions?: boolean;
  checkoutOrderId?: string;
};

export function QuoteCard({
  quote,
  showActions = true,
  checkoutOrderId = "ord-001",
}: QuoteCardProps) {
  const accepted = quote.status === QuoteStatus.ACCEPTED;

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

      {showActions ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {accepted ? (
            <>
              <Button
                href={`/orders/${checkoutOrderId}`}
                variant="secondary"
                size="sm"
              >
                {ko.order.openOrder}
              </Button>
              <Button
                href={`/checkout/${checkoutOrderId}`}
                variant="primary"
                size="sm"
              >
                {ko.order.proceedPayment}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="primary" size="sm" disabled>
                {copy.accept}
              </Button>
              <Button type="button" variant="outline" size="sm" disabled>
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
