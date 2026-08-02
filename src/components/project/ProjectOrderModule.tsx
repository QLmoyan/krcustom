import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatKRW, formatOrderNumber } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";

const copy = ko.order;

type ProjectOrderModuleProps = {
  order: Order;
};

export function ProjectOrderModule({ order }: ProjectOrderModuleProps) {
  const needPay =
    order.status === "PAYMENT_PENDING" || order.status === "PAYMENT_FAILED";
  const paid = order.paymentStatus === "PAID";

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.moduleTitle}
        </h2>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge domain="order" status={order.status} size="sm" />
          <StatusBadge domain="payment" status={order.paymentStatus} size="sm" />
        </div>
      </div>
      <p className="mt-2 text-[13px] font-medium tabular-nums text-[#0F172A]">
        {formatOrderNumber(order.orderNumber)}
      </p>
      <p className="mt-1 text-[18px] font-bold tabular-nums">
        {formatKRW(order.total)}
      </p>
      {paid ? (
        <p className="mt-2 break-keep text-[12px] text-[#15803D]">
          {copy.paidBanner}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/orders/${order.id}`}
          className="text-[13px] font-semibold text-[#0369A1] hover:underline"
        >
          {copy.openOrder}
        </Link>
        {needPay ? (
          <Button href={`/checkout/${order.id}`} variant="primary" size="sm">
            {copy.openCheckout}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
