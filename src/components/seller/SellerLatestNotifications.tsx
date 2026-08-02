import Link from "next/link";
import type { AppNotification } from "@/lib/providers/notificationProvider";
import { ko } from "@/messages";

type SellerLatestNotificationsProps = {
  notifications: AppNotification[];
};

export function SellerLatestNotifications({
  notifications,
}: SellerLatestNotificationsProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.seller.latestNotifications}
        </h2>
        <Link
          href="/seller/messages"
          className="text-[12px] font-medium text-[#0369A1] hover:underline"
        >
          {ko.seller.nav.messages}
        </Link>
      </div>
      {notifications.length === 0 ? (
        <p className="px-4 py-6 text-[13px] text-[#64748B]">{ko.admin.empty}</p>
      ) : (
        <ul className="divide-y divide-[#E2E8F0]">
          {notifications.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#0F172A]">
                      {item.title}
                    </p>
                    {!item.isRead ? (
                      <span className="inline-flex h-5 items-center rounded-full bg-[#0F766E] px-1.5 text-[11px] font-semibold text-white">
                        {ko.seller.unread}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] text-[#475569]">
                    {item.body}
                  </p>
                  <p className="mt-1 text-[12px] text-[#94A3B8]">
                    {item.createdAt}
                  </p>
                </div>
                {item.linkPath ? (
                  <Link
                    href={item.linkPath}
                    className="inline-flex h-8 shrink-0 items-center rounded-lg border border-[#CBD5E1] bg-white px-2.5 text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
                  >
                    {ko.seller.viewDetail}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
