import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatKoreanDateTime } from "@/lib/format";
import { listProjects } from "@/lib/providers/projectProvider";
import { ko } from "@/messages";

export default async function AdminProjectsPage() {
  const { projects } = await listProjects();

  return (
    <AdminShell
      title={ko.admin.projectsTitle}
      subtitle={ko.admin.projectsSubtitle}
    >
      {projects.length === 0 ? (
        <EmptyState title={ko.admin.empty} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[12px] text-[#64748B]">
              <tr>
                <th className="px-3 py-2.5 font-medium">
                  {ko.admin.colProjectNumber}
                </th>
                <th className="px-3 py-2.5 font-medium">{ko.admin.colTitle}</th>
                <th className="px-3 py-2.5 font-medium">{ko.admin.colStatus}</th>
                <th className="px-3 py-2.5 font-medium">{ko.admin.colDemoKey}</th>
                <th className="px-3 py-2.5 font-medium">{ko.admin.colUpdated}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {projects.map((project) => {
                const key = project.demo_key ?? project.id;
                return (
                  <tr key={project.id}>
                    <td className="px-3 py-2.5 font-medium text-[#0F172A]">
                      <Link
                        href={`/project/${key}`}
                        className="text-[#0369A1] hover:underline"
                      >
                        {project.project_number || key}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5">{project.title || "—"}</td>
                    <td className="px-3 py-2.5">{project.status || "—"}</td>
                    <td className="px-3 py-2.5 text-[#64748B]">
                      {project.demo_key || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-[#64748B]">
                      {formatKoreanDateTime(project.updated_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
