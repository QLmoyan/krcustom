import Link from "next/link";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { SellerOrderDetailView } from "@/components/order/SellerOrderDetailView";
import { Button } from "@/components/ui/Button";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import {
  getOrderById,
  getPaymentByOrderId,
} from "@/lib/providers/orderProvider";
import { ko } from "@/messages";

type SellerOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerOrderDetailPage({
  params,
}: SellerOrderDetailPageProps) {
  const { id } = await params;
  const { order } = await getOrderById(id);

  if (!order) {
    return (
      <SellerLayout
        title={ko.order.detailTitle}
        storeName={mockSellerDashboard.storeName}
        sellerName={mockSellerDashboard.sellerName}
      >
        <div className="mx-auto max-w-[640px] py-16 text-center">
          <h2 className="text-[18px] font-semibold">{ko.order.notFound}</h2>
          <div className="mt-6 flex justify-center">
            <Button href="/seller/orders" variant="primary">
              {ko.order.backToList}
            </Button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  const { payment } = await getPaymentByOrderId(id);

  return (
    <SellerLayout
      title={ko.order.detailTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerOrderDetailView order={order} payment={payment} />
      <p className="mx-auto mt-4 max-w-[1100px] text-[13px]">
        <Link href="/seller/orders" className="hover:underline">
          {ko.order.backToList}
        </Link>
      </p>
    </SellerLayout>
  );
}

export function generateStaticParams() {
  return [{ id: "ord-001" }, { id: "ord-002" }, { id: "ord-006" }];
}
