import Link from "next/link";
import { QuoteStatusBadge } from "@/components/quote/QuoteCard";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Quote } from "@/types/Quote";

type QuoteHistoryModuleProps = {
  projectId: string;
  quotes: Quote[];
};

export function QuoteHistoryModule({
  projectId,
  quotes,
}: QuoteHistoryModuleProps) {
  const sorted = [...quotes].sort((a, b) => b.version - a.version);

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.project.quoteHistory}
        </h2>
        <Link
          href={`/project/${projectId}/quote`}
          className="text-[12px] font-semibold text-[#0F766E] hover:underline"
        >
          {ko.project.openQuoteBuilder}
        </Link>
      </div>

      <ul className="mt-3 divide-y divide-[#E2E8F0]">
        {sorted.map((quote) => (
          <li
            key={quote.id}
            className="flex flex-wrap items-start justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold text-[#0F172A]">
                  V{quote.version}
                </p>
                <QuoteStatusBadge status={quote.status} />
              </div>
              <p className="mt-1 text-[16px] font-bold tabular-nums text-[#0F172A]">
                {formatKRW(quote.total)}
              </p>
              <p className="mt-1 text-[12px] text-[#64748B]">
                {quote.sentAt
                  ? `${ko.project.sentAt} ${quote.sentAt}`
                  : ko.quote.statusDraft}
                {" · "}
                {quote.customerConfirmed
                  ? ko.project.customerConfirmedYes
                  : ko.project.customerConfirmedNo}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
