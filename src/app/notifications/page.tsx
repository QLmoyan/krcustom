import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Container } from "@/components/ui/Container";
import { getCurrentUser } from "@/lib/providers/authProvider";
import { listNotifications } from "@/lib/providers/notificationProvider";
import { ko } from "@/messages";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
        <Header />
        <Container className="py-16 text-center">
          <h1 className="text-[20px] font-semibold text-[#0F172A]">
            {ko.notifications.title}
          </h1>
          <p className="mt-3 text-[14px] text-[#64748B]">
            {ko.notifications.loginRequired}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#0F766E] px-4 text-[14px] font-semibold text-white hover:bg-[#0D5F59]"
          >
            {ko.notifications.goLogin}
          </Link>
        </Container>
        <MobileBottomNav />
      </div>
    );
  }

  const { notifications } = await listNotifications({
    userId: user.profile.id,
  });

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-4 md:py-5">
          <div className="mb-4">
            <h1 className="text-[20px] font-bold text-[#0F172A] md:text-[22px]">
              {ko.notifications.title}
            </h1>
            <p className="mt-1 text-[13px] text-[#64748B]">
              {ko.notifications.subtitle}
            </p>
          </div>

          {notifications.length === 0 ? (
            <p className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-8 text-center text-[13px] text-[#64748B]">
              {ko.notifications.empty}
            </p>
          ) : (
            <ul className="divide-y divide-[#E2E8F0] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
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
                            {ko.notifications.unread}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[13px] text-[#475569]">
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
                        {ko.notifications.openLink}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </main>
      <MobileBottomNav />
    </div>
  );
}
