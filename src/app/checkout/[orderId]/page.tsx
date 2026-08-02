import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CheckoutView } from "@/components/payment/CheckoutView";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import { getOrderById } from "@/data/mockOrders";
import { ko } from "@/messages";

type CheckoutPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

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

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-4 md:py-5">
          <CheckoutView order={order} />
        </Container>
      </main>
      {orderId === DEMO.orderId ? <DemoFlowHint step={5} /> : null}
      <MobileBottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [{ orderId: "ord-001" }, { orderId: "ord-002" }, { orderId: "ord-004" }];
}
