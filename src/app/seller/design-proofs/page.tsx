import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerDesignProofListView } from "@/components/design-proof/SellerDesignProofListView";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import {
  getDesignProofStats,
  listForSeller,
} from "@/lib/providers/designProofProvider";
import { ko } from "@/messages";

export default async function SellerDesignProofsPage() {
  const { items } = await listForSeller();
  const stats = getDesignProofStats(items);

  return (
    <SellerLayout
      title={ko.designProof.listTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerDesignProofListView items={items} stats={stats} />
    </SellerLayout>
  );
}
