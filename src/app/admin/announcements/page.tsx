import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { listAnnouncements } from "@/lib/providers/announcementProvider";
import { ko } from "@/messages";

export default async function AdminAnnouncementsPage() {
  const { announcements } = await listAnnouncements();

  return (
    <AdminShell
      title={ko.admin.announcementsTitle}
      subtitle={ko.admin.announcementsSubtitle}
    >
      {announcements.length === 0 ? (
        <EmptyState title={ko.admin.empty} />
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[15px] font-semibold text-[#0F172A]">
                  {item.title}
                </h2>
                <p className="text-[12px] text-[#94A3B8]">
                  {item.publishedAt || item.createdAt}
                </p>
              </div>
              <p className="mt-2 break-keep text-[13px] leading-relaxed text-[#475569]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
