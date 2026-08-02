import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CustomerOrderListView } from "@/components/order/SellerOrderListView";
import { Container } from "@/components/ui/Container";

export default function OrdersPage() {
  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-4 md:py-5">
          <CustomerOrderListView />
        </Container>
      </main>
      <MobileBottomNav />
    </div>
  );
}
