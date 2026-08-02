import Link from "next/link";
import type { SellerRecentMessage } from "@/data/mockSellerDashboard";
import { DEMO } from "@/data/demoFlow";
import { ko } from "@/messages";

type SellerRecentMessagesProps = {
  messages: SellerRecentMessage[];
};

export function SellerRecentMessages({ messages }: SellerRecentMessagesProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.seller.recentMessages}
        </h2>
        <Link
          href={`/project/${DEMO.projectId}`}
          className="text-[12px] font-medium text-[#0369A1] hover:underline"
        >
          {ko.seller.nav.messages}
        </Link>
      </div>
      <ul className="divide-y divide-[#E2E8F0]">
        {messages.map((message) => (
          <li key={message.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-semibold text-[#0F172A]">
                    {message.customerName}
                  </p>
                  {message.unreadCount > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F766E] px-1.5 text-[11px] font-semibold text-white">
                      {message.unreadCount}
                      <span className="sr-only"> {ko.seller.unread}</span>
                    </span>
                  ) : null}
                  <span className="text-[11px] text-[#94A3B8]">
                    {message.time}
                  </span>
                </div>
                <p className="mt-1 truncate text-[13px] text-[#475569]">
                  {message.lastMessage}
                </p>
                <p className="mt-1 text-[12px] text-[#64748B]">
                  {message.serviceTitle}
                </p>
              </div>
              <Link
                href={`/project/${DEMO.projectId}`}
                className="inline-flex h-8 shrink-0 items-center rounded-lg bg-[#0F766E] px-2.5 text-[12px] font-semibold text-white hover:bg-[#0D5F59]"
              >
                {ko.seller.replyNow}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
