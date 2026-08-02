import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { CustomerOwnedItemDetailView } from "@/components/seller/CustomerOwnedItemDetailView";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { Button } from "@/components/ui/Button";
import { DEMO } from "@/data/demoFlow";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { getCustomerOwnedItemById } from "@/lib/providers/customerOwnedItemProvider";
import { ko } from "@/messages";

type SellerCustomerItemDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerCustomerItemDetailPage({
  params,
}: SellerCustomerItemDetailPageProps) {
  const { id } = await params;
  const { item } = await getCustomerOwnedItemById(id);

  if (!item) {
    return (
      <SellerLayout
        title={ko.seller.ownedItems.title}
        storeName={mockSellerDashboard.storeName}
        sellerName={mockSellerDashboard.sellerName}
      >
        <div className="mx-auto max-w-lg py-16 text-center">
          <h2 className="text-[18px] font-semibold text-[#0F172A]">
            {ko.seller.ownedItems.notFound}
          </h2>
          <div className="mt-6 flex justify-center">
            <Button href="/seller/customer-items" variant="primary">
              {ko.seller.ownedItems.backToList}
            </Button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout
      title={item.itemNumber}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <CustomerOwnedItemDetailView item={item} />
      {id === DEMO.ownedItemId ? <DemoFlowHint step={8} /> : null}
    </SellerLayout>
  );
}

export function generateStaticParams() {
  return [
    { id: "coi-001" },
    { id: "coi-003" },
    { id: "coi-005" },
    { id: "coi-006" },
    { id: "coi-007" },
  ];
}
