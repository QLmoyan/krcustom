import { AdminShell } from "@/components/admin/AdminShell";
import { listAdminSellers } from "@/lib/providers/adminProvider";
import { ko } from "@/messages";

export default async function AdminSellersPage() {
  const { sellers } = await listAdminSellers();

  return (
    <AdminShell
      title={ko.admin.sellersTitle}
      subtitle={ko.admin.sellersSubtitle}
    >
      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colTitle}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colNickname}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colPhone}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colDemoKey}</th>
              <th className="px-3 py-2.5 font-medium">{ko.admin.colUpdated}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {sellers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-[#64748B]">
                  {ko.admin.empty}
                </td>
              </tr>
            ) : (
              sellers.map((seller) => (
                <tr key={seller.id}>
                  <td className="px-3 py-2.5 font-medium text-[#0F172A]">
                    {seller.storeName}
                  </td>
                  <td className="px-3 py-2.5">{seller.nickname}</td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {seller.phone || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-[#64748B]">
                    {seller.demoKey || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-[#64748B]">
                    {seller.updatedAt}
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
