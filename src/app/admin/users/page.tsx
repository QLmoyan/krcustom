import { AdminShell } from "@/components/admin/AdminShell";
import { listAdminUsers } from "@/lib/providers/adminProvider";
import { formatKoreanDateTime } from "@/lib/format";
import { ko } from "@/messages";

function roleLabel(role: string): string {
  if (role === "SELLER") return ko.admin.roleSeller;
  if (role === "ADMIN") return ko.admin.roleAdmin;
  return ko.admin.roleCustomer;
}

export default async function AdminUsersPage() {
  const { users } = await listAdminUsers();

  return (
    <AdminShell title={ko.admin.usersTitle} subtitle={ko.admin.usersSubtitle}>
      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colNickname}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colRole}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colPhone}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colDemoKey}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colUpdated}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-[#64748B]">
                  {ko.admin.empty}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-3 py-2.5 font-medium text-[#0F172A]">
                    {user.nickname || "—"}
                  </td>
                  <td className="px-3 py-2.5">{roleLabel(user.role)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{user.phone || "—"}</td>
                  <td className="px-3 py-2.5 text-[#64748B]">
                    {user.demoKey || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-[#64748B]">
                    {formatKoreanDateTime(user.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
