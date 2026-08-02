import { CustomerOwnedItemListView } from "@/components/seller/CustomerOwnedItemListView";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { listCustomerOwnedItems } from "@/lib/providers/customerOwnedItemProvider";
import { ko } from "@/messages";

export default async function SellerCustomerItemsPage() {
  const { items } = await listCustomerOwnedItems();

  return (
    <SellerLayout
      title={ko.seller.ownedItems.title}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <CustomerOwnedItemListView items={items} />
    </SellerLayout>
  );
}
