import { Button } from "@/components/ui/Button";
import {
  StatusBadge,
  inferStatusToneFromKoreanLabel,
} from "@/components/ui/StatusBadge";
import { DEMO } from "@/data/demoFlow";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { ProjectQuoteInfo } from "@/types/Project";

type ProjectQuoteModuleProps = {
  quote: ProjectQuoteInfo;
};

export function ProjectQuoteModule({ quote }: ProjectQuoteModuleProps) {
  return (
    <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.project.quoteModule}
        </h2>
        <StatusBadge
          label={quote.status}
          tone={inferStatusToneFromKoreanLabel(quote.status)}
        />
      </div>
      <p className="mt-2 text-[13px] text-[#64748B]">
        {ko.project.quoteNumber} {quote.quoteNumber}
      </p>
      <ul className="mt-3 space-y-1.5 text-[13px]">
        {quote.items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3 text-[#0F172A]"
          >
            <span className="break-keep">{item.label}</span>
            <span className="shrink-0 tabular-nums">{formatKRW(item.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-[#BAE6FD] pt-3">
        <span className="text-[13px] font-semibold text-[#0F172A]">
          {ko.project.quoteTotal}
        </span>
        <span className="text-[18px] font-bold tabular-nums text-[#0F172A]">
          {formatKRW(quote.amount)}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-[#64748B]">
        {ko.project.validUntil} {quote.validUntil}
      </p>
      <p className="mt-1 break-keep text-[12px] text-[#0369A1]">{quote.note}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          href={`/project/${DEMO.projectId}/quote`}
          variant="outline"
          size="sm"
        >
          {ko.project.viewQuote}
        </Button>
        <Button href={`/checkout/${DEMO.orderId}`} variant="primary" size="sm">
          {ko.order.proceedPayment}
        </Button>
      </div>
    </section>
  );
}
