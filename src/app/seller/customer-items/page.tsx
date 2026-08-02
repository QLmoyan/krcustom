import { CustomerOwnedItemListView } from "@/components/seller/CustomerOwnedItemListView";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

export default function SellerCustomerItemsPage() {
  return (
    <SellerLayout
      title={ko.seller.ownedItems.title}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <CustomerOwnedItemListView />
    </SellerLayout>
  );
}
