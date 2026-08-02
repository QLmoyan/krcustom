import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerQuoteListView } from "@/components/quote/SellerQuoteListView";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

export default function SellerQuotesPage() {
  return (
    <SellerLayout
      title={ko.quote.listTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerQuoteListView />
    </SellerLayout>
  );
}
