import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PaymentResultView } from "@/components/payment/PaymentResultView";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import {
  getOrderById,
  getPaymentByOrderId,
} from "@/lib/providers/orderProvider";
import { ko } from "@/messages";

type SuccessPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function CheckoutSuccessPage({ params }: SuccessPageProps) {
  const { orderId } = await params;
  const { order } = await getOrderById(orderId);

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

  const { payment } = await getPaymentByOrderId(orderId);

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-8 md:py-10">
          <PaymentResultView
            variant="success"
            order={order}
            payment={payment}
          />
        </Container>
      </main>
      {orderId === DEMO.orderId ? <DemoFlowHint step={7} /> : null}
      <MobileBottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [{ orderId: "ord-001" }, { orderId: "ord-002" }];
}
