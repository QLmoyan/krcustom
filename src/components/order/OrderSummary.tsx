import { StatusBadge } from "@/components/ui/StatusBadge";
import { orderTypeLabel } from "@/data/mockOrders";
import { formatKRW, formatOrderNumber } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";

const copy = ko.order;

type OrderSummaryProps = {
  order: Order;
};

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[12px] font-medium text-[#0F766E]">
            {copy.orderNumber}
          </p>
          <h2 className="mt-1 text-[18px] font-bold tabular-nums text-[#0F172A]">
            {formatOrderNumber(order.orderNumber)}
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {order.serviceName} · {order.storeName}
          </p>
          <p className="mt-1 text-[12px] text-[#64748B]">
            {orderTypeLabel(order.orderType)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge domain="order" status={order.status} />
          <StatusBadge domain="payment" status={order.paymentStatus} />
        </div>
      </div>
      <p className="mt-3 text-[20px] font-bold tabular-nums text-[#0F172A]">
        {formatKRW(order.total)}
      </p>
      <p className="mt-2 rounded-lg bg-[#F0F9FF] px-3 py-2 text-[13px] text-[#0369A1]">
        {copy.currentNext}: {order.nextAction}
      </p>
    </section>
  );
}
