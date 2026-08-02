import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { orderTypeLabel } from "@/data/mockOrders";
import { formatKRW, formatOrderNumber } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";

const copy = ko.order;

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <article className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-semibold tabular-nums text-[#0F172A]">
            {formatOrderNumber(order.orderNumber)}
          </p>
          <p className="mt-1 text-[13px] text-[#0F172A]">{order.serviceName}</p>
          <p className="mt-0.5 text-[12px] text-[#64748B]">
            {order.storeName} · {orderTypeLabel(order.orderType)}
          </p>
        </div>
        <StatusBadge domain="order" status={order.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[16px] font-bold tabular-nums text-[#0F172A]">
            {formatKRW(order.total)}
          </p>
          <p className="mt-1 text-[12px] text-[#64748B]">
            {copy.nextAction}: {order.nextAction}
          </p>
          <p className="mt-0.5 text-[11px] text-[#94A3B8]">{order.updatedAt}</p>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className="text-[13px] font-semibold text-[#0369A1] hover:underline"
        >
          {copy.viewDetail}
        </Link>
      </div>
    </article>
  );
}
