"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  QuoteStatusBadge,
  quoteStatusLabel,
} from "@/components/quote/QuoteCard";
import { QuoteStatus } from "@/constants/status";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Quote, QuoteStatus as QuoteStatusCode } from "@/types/Quote";

const copy = ko.quote;

type TabKey =
  | "all"
  | "DRAFT"
  | "SENT"
  | "REVISION_REQUESTED"
  | "ACCEPTED"
  | "EXPIRED"
  | "REJECTED"
  | "CANCELLED";

const tabs: { key: TabKey; label: string; status?: QuoteStatusCode }[] = [
  { key: "all", label: copy.filterAll },
  { key: "DRAFT", label: quoteStatusLabel(QuoteStatus.DRAFT), status: QuoteStatus.DRAFT },
  { key: "SENT", label: quoteStatusLabel(QuoteStatus.SENT), status: QuoteStatus.SENT },
  {
    key: "REVISION_REQUESTED",
    label: quoteStatusLabel(QuoteStatus.REVISION_REQUESTED),
    status: QuoteStatus.REVISION_REQUESTED,
  },
  {
    key: "ACCEPTED",
    label: quoteStatusLabel(QuoteStatus.ACCEPTED),
    status: QuoteStatus.ACCEPTED,
  },
  {
    key: "EXPIRED",
    label: quoteStatusLabel(QuoteStatus.EXPIRED),
    status: QuoteStatus.EXPIRED,
  },
  {
    key: "REJECTED",
    label: quoteStatusLabel(QuoteStatus.REJECTED),
    status: QuoteStatus.REJECTED,
  },
  {
    key: "CANCELLED",
    label: quoteStatusLabel(QuoteStatus.CANCELLED),
    status: QuoteStatus.CANCELLED,
  },
];

type SellerQuoteListViewProps = {
  quotes: Quote[];
};

export function SellerQuoteListView({ quotes }: SellerQuoteListViewProps) {
  const [tab, setTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return quotes;
    return quotes.filter((quote) => quote.status === tab);
  }, [quotes, tab]);

  const counts = useMemo(() => {
    return {
      all: quotes.length,
      DRAFT: quotes.filter((q) => q.status === QuoteStatus.DRAFT).length,
      SENT: quotes.filter((q) => q.status === QuoteStatus.SENT).length,
      REVISION_REQUESTED: quotes.filter(
        (q) => q.status === QuoteStatus.REVISION_REQUESTED,
      ).length,
      ACCEPTED: quotes.filter((q) => q.status === QuoteStatus.ACCEPTED)
        .length,
      EXPIRED: quotes.filter((q) => q.status === QuoteStatus.EXPIRED)
        .length,
      REJECTED: quotes.filter((q) => q.status === QuoteStatus.REJECTED)
        .length,
      CANCELLED: quotes.filter((q) => q.status === QuoteStatus.CANCELLED)
        .length,
    };
  }, [quotes]);

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-4">
      <p className="text-[13px] text-[#64748B]">{copy.listSubtitle}</p>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((item) => {
          const active = tab === item.key;
          const count = counts[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={[
                "shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap",
                active
                  ? "bg-[#0F766E] text-white"
                  : "border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]",
              ].join(" ")}
            >
              {item.label} {count}
            </button>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-[#E2E8F0] bg-white md:block">
        <table className="w-full min-w-[880px] text-left text-[13px]">
          <thead className="bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-3 py-2.5 font-medium">{copy.colProject}</th>
              <th className="px-3 py-2.5 font-medium">
                {ko.project.versionLabel}
              </th>
              <th className="px-3 py-2.5 font-medium">{copy.total}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colStatus}</th>
              <th className="px-3 py-2.5 font-medium">{ko.project.sentAt}</th>
              <th className="px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((quote) => (
              <tr key={quote.id}>
                <td className="px-3 py-2.5 font-medium tabular-nums">
                  {quote.projectId}
                </td>
                <td className="px-3 py-2.5">V{quote.version}</td>
                <td className="px-3 py-2.5 font-semibold tabular-nums">
                  {formatKRW(quote.total)}
                </td>
                <td className="px-3 py-2.5">
                  <QuoteStatusBadge status={quote.status} />
                </td>
                <td className="px-3 py-2.5 text-[#64748B]">
                  {quote.sentAt || "-"}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/project/${quote.projectId}`}
                      className="font-semibold text-[#0F766E] hover:underline"
                    >
                      {ko.order.openWorkspace}
                    </Link>
                    <Link
                      href={`/project/${quote.projectId}/quote`}
                      className="font-semibold text-[#0369A1] hover:underline"
                    >
                      {copy.openBuilder}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-[#64748B]">
            {copy.empty}
          </p>
        ) : null}
      </div>

      <ul className="space-y-2 md:hidden">
        {filtered.map((quote) => (
          <li
            key={quote.id}
            className="rounded-xl border border-[#E2E8F0] bg-white p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold tabular-nums">
                  {quote.projectId} · V{quote.version}
                </p>
                <p className="mt-1 text-[16px] font-bold tabular-nums">
                  {formatKRW(quote.total)}
                </p>
                <p className="mt-1 text-[12px] text-[#64748B]">
                  {quoteStatusLabel(quote.status)}
                  {quote.sentAt ? ` · ${quote.sentAt}` : ""}
                </p>
              </div>
              <QuoteStatusBadge status={quote.status} />
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                href={`/project/${quote.projectId}`}
                className="inline-flex text-[12px] font-semibold text-[#0F766E]"
              >
                {ko.order.openWorkspace}
              </Link>
              <Link
                href={`/project/${quote.projectId}/quote`}
                className="inline-flex text-[12px] font-semibold text-[#0369A1]"
              >
                {copy.openBuilder}
              </Link>
            </div>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[#E2E8F0] px-4 py-8 text-center text-[13px] text-[#64748B]">
            {copy.empty}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
