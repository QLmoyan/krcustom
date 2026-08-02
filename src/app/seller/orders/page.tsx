import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerOrderListView } from "@/components/order/SellerOrderListView";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

export default function SellerOrdersPage() {
  return (
    <SellerLayout
      title={ko.order.sellerListTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerOrderListView />
    </SellerLayout>
  );
}
