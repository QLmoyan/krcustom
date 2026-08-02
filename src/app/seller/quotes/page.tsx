import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerQuoteListView } from "@/components/quote/SellerQuoteListView";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { listForSeller } from "@/lib/providers/quoteProvider";
import { ko } from "@/messages";

export default async function SellerQuotesPage() {
  const { quotes } = await listForSeller();

  return (
    <SellerLayout
      title={ko.quote.listTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerQuoteListView quotes={quotes} />
    </SellerLayout>
  );
}
