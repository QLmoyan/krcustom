import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CustomerOrderDetailView } from "@/components/order/CustomerOrderDetailView";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import {
  getOrderById,
  getPaymentByOrderId,
} from "@/lib/providers/orderProvider";
import { ko } from "@/messages";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const { order } = await getOrderById(id);

  if (!order) {
    return (
      <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
        <Header />
        <Container className="py-16 text-center">
          <h1 className="text-[20px] font-semibold">{ko.order.notFound}</h1>
          <div className="mt-6 flex justify-center">
            <Button href="/orders" variant="primary">
              {ko.order.backToList}
            </Button>
          </div>
        </Container>
        <MobileBottomNav />
      </div>
    );
  }

  const { payment } = await getPaymentByOrderId(id);

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-4 md:py-5">
          <CustomerOrderDetailView order={order} payment={payment} />
        </Container>
      </main>
      {id === DEMO.orderId ? <DemoFlowHint step={6} /> : null}
      <MobileBottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [{ id: "ord-001" }, { id: "ord-002" }, { id: "ord-004" }];
}
