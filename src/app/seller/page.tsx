import { ProductionBoard } from "@/components/seller/ProductionBoard";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerOrderTable } from "@/components/seller/SellerOrderTable";
import { SellerQuickActions } from "@/components/seller/SellerQuickActions";
import { SellerRecentMessages } from "@/components/seller/SellerRecentMessages";
import { SellerStatCard } from "@/components/seller/SellerStatCard";
import { SellerTaskList } from "@/components/seller/SellerTaskList";
import { NotificationRealtimeRefresh } from "@/components/realtime/NotificationRealtimeRefresh";
import {
  mockSellerDashboard,
  type SellerRecentOrder,
} from "@/data/mockSellerDashboard";
import { DEMO } from "@/data/demoFlow";
import { listConversations } from "@/lib/providers/chatProvider";
import { getUnreadNotificationCount } from "@/lib/providers/notificationProvider";
import { listProjects } from "@/lib/providers/projectProvider";
import type { ProjectRow } from "@/types/database";
import { ko } from "@/messages";

function mapProjectToRecentOrder(project: ProjectRow): SellerRecentOrder {
  return {
    id: project.demo_key ?? project.id,
    orderNumber: project.project_number,
    customerName: project.customer_id,
    serviceTitle: project.title,
    amount: 0,
    orderType: "quote",
    status: project.status,
    updatedAt: project.updated_at,
  };
}

export default async function SellerDashboardPage() {
  const data = mockSellerDashboard;
  const { projects, source } = await listProjects();
  const { conversations, source: chatSource } = await listConversations();
  const { count: unreadNotificationCount } =
    await getUnreadNotificationCount();

  const onlyDemoSeed =
    source === "supabase" &&
    projects.length === 1 &&
    projects[0]?.demo_key === DEMO.projectId;

  // Provider-backed list; keep Alpha Demo table when only seeded prj-001 exists.
  const recentOrders =
    source === "supabase" && !onlyDemoSeed
      ? projects.map(mapProjectToRecentOrder)
      : data.recentOrders;

  // Prefer Supabase conversation list; keep multi-row mock when only demo seed.
  const recentMessages =
    chatSource === "supabase" && conversations.length > 1
      ? conversations
      : chatSource === "supabase" && conversations.length === 1
        ? conversations
        : data.recentMessages;

  return (
    <SellerLayout
      title={ko.seller.dashboardTitle}
      storeName={data.storeName}
      sellerName={data.sellerName}
      unreadNotificationCount={unreadNotificationCount}
    >
      <NotificationRealtimeRefresh channelKey="seller-notifications" />
      <div className="mx-auto w-full max-w-[1280px] space-y-5">
        <div>
          <p className="break-keep text-[14px] text-[#64748B]">
            {ko.seller.dashboardSubtitle}
          </p>
        </div>

        <section>
          <h2 className="mb-2.5 text-[15px] font-semibold text-[#0F172A]">
            {ko.seller.statsSection}
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {data.stats.map((stat) => (
              <SellerStatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </section>

        <SellerQuickActions />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SellerTaskList todos={data.todos} />
          <SellerRecentMessages messages={recentMessages} />
        </div>

        <ProductionBoard columns={data.productionBoard} />

        <SellerOrderTable orders={recentOrders} />
      </div>
    </SellerLayout>
  );
}
