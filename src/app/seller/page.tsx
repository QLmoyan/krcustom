import { ProductionBoard } from "@/components/seller/ProductionBoard";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerOrderTable } from "@/components/seller/SellerOrderTable";
import { SellerQuickActions } from "@/components/seller/SellerQuickActions";
import { SellerRecentMessages } from "@/components/seller/SellerRecentMessages";
import { SellerStatCard } from "@/components/seller/SellerStatCard";
import { SellerTaskList } from "@/components/seller/SellerTaskList";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

export default function SellerDashboardPage() {
  const data = mockSellerDashboard;

  return (
    <SellerLayout
      title={ko.seller.dashboardTitle}
      storeName={data.storeName}
      sellerName={data.sellerName}
    >
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
          <SellerRecentMessages messages={data.recentMessages} />
        </div>

        <ProductionBoard columns={data.productionBoard} />

        <SellerOrderTable orders={data.recentOrders} />
      </div>
    </SellerLayout>
  );
}
