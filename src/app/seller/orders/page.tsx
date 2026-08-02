import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerOrderListView } from "@/components/order/SellerOrderListView";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { listForSeller } from "@/lib/providers/orderProvider";
import { ko } from "@/messages";

export default async function SellerOrdersPage() {
  const { orders } = await listForSeller();

  return (
    <SellerLayout
      title={ko.order.sellerListTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerOrderListView orders={orders} />
    </SellerLayout>
  );
}
