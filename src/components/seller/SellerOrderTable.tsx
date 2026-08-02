import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  StatusBadge,
  inferStatusToneFromKoreanLabel,
} from "@/components/ui/StatusBadge";
import type {
  SellerOrderType,
  SellerRecentOrder,
} from "@/data/mockSellerDashboard";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";

type SellerOrderTableProps = {
  orders: SellerRecentOrder[];
};

export function SellerOrderTable({ orders }: SellerOrderTableProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="border-b border-[#E2E8F0] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.seller.recentOrders}
        </h2>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-4 py-2.5 font-medium">{ko.seller.orderNumber}</th>
              <th className="px-4 py-2.5 font-medium">{ko.seller.customer}</th>
              <th className="px-4 py-2.5 font-medium">{ko.seller.service}</th>
              <th className="px-4 py-2.5 font-medium">{ko.seller.amount}</th>
              <th className="px-4 py-2.5 font-medium">{ko.seller.orderType}</th>
              <th className="px-4 py-2.5 font-medium">{ko.seller.status}</th>
              <th className="px-4 py-2.5 font-medium">{ko.seller.updatedAt}</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {orders.map((order) => (
              <tr key={order.id} className="text-[#0F172A]">
                <td className="px-4 py-3 font-medium tabular-nums">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="max-w-[180px] truncate px-4 py-3">
                  {order.serviceTitle}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {formatKRW(order.amount)}
                </td>
                <td className="px-4 py-3">
                  <OrderTypeBadge type={order.orderType} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={order.status}
                    tone={inferStatusToneFromKoreanLabel(order.status)}
                  />
                </td>
                <td className="px-4 py-3 text-[#64748B]">{order.updatedAt}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/seller/orders/${order.id}`}
                    className="font-semibold text-[#0369A1] hover:underline"
                  >
                    {ko.seller.viewDetail}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-[#E2E8F0] md:hidden">
        {orders.map((order) => (
          <li key={order.id} className="space-y-2 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold tabular-nums text-[#0F172A]">
                  {order.orderNumber}
                </p>
                <p className="mt-0.5 text-[12px] text-[#64748B]">
                  {order.customerName} · {order.updatedAt}
                </p>
              </div>
              <StatusBadge
                label={order.status}
                tone={inferStatusToneFromKoreanLabel(order.status)}
              />
            </div>
            <p className="truncate text-[13px] text-[#0F172A]">
              {order.serviceTitle}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <OrderTypeBadge type={order.orderType} />
                <span className="text-[13px] font-semibold tabular-nums">
                  {formatKRW(order.amount)}
                </span>
              </div>
              <Link
                href={`/seller/orders/${order.id}`}
                className="text-[12px] font-semibold text-[#0369A1]"
              >
                {ko.seller.viewDetail}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OrderTypeBadge({ type }: { type: SellerOrderType }) {
  if (type === "quote") {
    return <Badge tone="accent">{ko.seller.orderTypeQuote}</Badge>;
  }
  if (type === "customerOwnedItem") {
    return <Badge tone="warning">{ko.seller.orderTypeOwned}</Badge>;
  }
  return <Badge tone="brand">{ko.seller.orderTypeDirect}</Badge>;
}
