import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminDashboardSnapshot } from "@/lib/providers/adminProvider";
import { ko } from "@/messages";

export default async function AdminHomePage() {
  const snapshot = await getAdminDashboardSnapshot();

  const cards = [
    {
      href: "/admin/users",
      title: ko.admin.nav.users,
      count: snapshot.users.length,
    },
    {
      href: "/admin/sellers",
      title: ko.admin.nav.sellers,
      count: snapshot.sellers.length,
    },
    {
      href: "/admin/projects",
      title: ko.admin.nav.projects,
      count: snapshot.projects.length,
    },
    {
      href: "/admin/announcements",
      title: ko.admin.nav.announcements,
      count: snapshot.announcements.length,
    },
  ];

  return (
    <AdminShell title={ko.admin.title} subtitle={ko.admin.subtitle}>
      <p className="break-keep text-[13px] text-[#64748B]">{ko.admin.demoNote}</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-[#E2E8F0] bg-white p-4 hover:border-[#99F6E4]"
          >
            <p className="text-[12px] font-medium text-[#64748B]">{card.title}</p>
            <p className="mt-1 text-[26px] font-bold tabular-nums text-[#0F766E]">
              {card.count}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
