import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerDesignProofListView } from "@/components/design-proof/SellerDesignProofListView";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

export default function SellerDesignProofsPage() {
  return (
    <SellerLayout
      title={ko.designProof.listTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerDesignProofListView />
    </SellerLayout>
  );
}
