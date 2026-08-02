"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OrderCard } from "@/components/order/OrderCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderStatus, getStatusLabel } from "@/constants/status";
import {
  orderTypeLabel,
  getSellerOrderStats,
} from "@/data/mockOrders";
import { formatKRW, formatOrderNumber } from "@/lib/format";
import { ko } from "@/messages";
import type { Order, OrderType } from "@/types/Order";
import type { OrderStatus as OrderStatusCode } from "@/types/Order";

const copy = ko.order;

const typeOptions: { value: "" | OrderType; label: string }[] = [
  { value: "", label: copy.filterAll },
  { value: "DIRECT_PURCHASE", label: orderTypeLabel("DIRECT_PURCHASE") },
  { value: "QUOTE_BASED", label: orderTypeLabel("QUOTE_BASED") },
  {
    value: "CUSTOMER_OWNED_ITEM",
    label: orderTypeLabel("CUSTOMER_OWNED_ITEM"),
  },
];

const statusFilters: Array<"all" | OrderStatusCode> = [
  "all",
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.PAYMENT_PROCESSING,
  OrderStatus.PAID,
  OrderStatus.CUSTOMER_SHIPMENT_PENDING,
  OrderStatus.CUSTOMER_SHIPPED,
  OrderStatus.IN_PRODUCTION,
  OrderStatus.SHIPPED,
  OrderStatus.COMPLETED,
  OrderStatus.REFUND_PROCESSING,
  OrderStatus.PAYMENT_FAILED,
];

type CustomerOrderListViewProps = {
  orders: Order[];
};

export function CustomerOrderListView({ orders }: CustomerOrderListViewProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatusCode>("all");
  const [type, setType] = useState<"" | OrderType>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (type && order.orderType !== type) return false;
      if (!q) return true;
      return order.orderNumber.toLowerCase().includes(q);
    });
  }, [orders, query, status, type]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[20px] font-bold text-[#0F172A] md:text-[22px]">
          {copy.listTitle}
        </h1>
        <p className="mt-1 text-[13px] text-[#64748B]">{copy.listSubtitle}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-10 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] outline-none focus:border-[#0F766E]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | OrderStatusCode)}
          className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px]"
        >
          {statusFilters.map((key) => (
            <option key={key} value={key}>
              {key === "all"
                ? copy.filterAll
                : getStatusLabel("order", key)}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "" | OrderType)}
          className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px]"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-3">
        {filtered.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[#E2E8F0] px-4 py-10 text-center text-[13px] text-[#64748B]">
            {copy.empty}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

type SellerOrderListViewProps = {
  orders: Order[];
};

export function SellerOrderListView({ orders }: SellerOrderListViewProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatusCode>("all");
  const [type, setType] = useState<"" | OrderType>("");
  const stats = getSellerOrderStats(orders);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (type && order.orderType !== type) return false;
      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.serviceName.toLowerCase().includes(q)
      );
    });
  }, [orders, query, status, type]);

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-4">
      <p className="text-[13px] text-[#64748B]">{copy.sellerSubtitle}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label={copy.statsPaymentPending} count={stats.paymentPending} />
        <Stat label={copy.statsNew} count={stats.newPaid} />
        <Stat label={copy.statsCustomerShip} count={stats.customerShipment} />
        <Stat label={copy.statsProduction} count={stats.inProduction} />
        <Stat label={copy.statsShipPending} count={stats.shippingPending} />
        <Stat label={copy.statsRefund} count={stats.refund} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-10 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] outline-none focus:border-[#0F766E]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | OrderStatusCode)}
          className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px]"
        >
          {statusFilters.map((key) => (
            <option key={key} value={key}>
              {key === "all"
                ? copy.filterAll
                : getStatusLabel("order", key)}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "" | OrderType)}
          className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px]"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-[#E2E8F0] bg-white md:block">
        <table className="w-full min-w-[980px] text-left text-[13px]">
          <thead className="bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-3 py-2.5 font-medium">{copy.orderNumber}</th>
              <th className="px-3 py-2.5 font-medium">{ko.seller.customer}</th>
              <th className="px-3 py-2.5 font-medium">{copy.service}</th>
              <th className="px-3 py-2.5 font-medium">{copy.type}</th>
              <th className="px-3 py-2.5 font-medium">{copy.amount}</th>
              <th className="px-3 py-2.5 font-medium">{copy.payStatus}</th>
              <th className="px-3 py-2.5 font-medium">{copy.orderStatus}</th>
              <th className="px-3 py-2.5 font-medium">{copy.nextAction}</th>
              <th className="px-3 py-2.5 font-medium">{copy.updatedAt}</th>
              <th className="px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((order) => (
              <SellerRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-[#64748B]">
            {copy.empty}
          </p>
        ) : null}
      </div>

      <ul className="space-y-2 md:hidden">
        {filtered.map((order) => (
          <li
            key={order.id}
            className="rounded-xl border border-[#E2E8F0] bg-white p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold tabular-nums">
                  {formatOrderNumber(order.orderNumber)}
                </p>
                <p className="mt-1 text-[13px]">{order.customerName}</p>
                <p className="mt-1 text-[16px] font-bold tabular-nums">
                  {formatKRW(order.total)}
                </p>
              </div>
              <StatusBadge domain="order" status={order.status} size="sm" />
            </div>
            <Link
              href={`/seller/orders/${order.id}`}
              className="mt-2 inline-flex text-[12px] font-semibold text-[#0369A1]"
            >
              {copy.viewDetail}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SellerRow({ order }: { order: Order }) {
  return (
    <tr>
      <td className="px-3 py-2.5 font-medium tabular-nums">
        {formatOrderNumber(order.orderNumber)}
      </td>
      <td className="px-3 py-2.5">{order.customerName}</td>
      <td className="max-w-[140px] truncate px-3 py-2.5">{order.serviceName}</td>
      <td className="px-3 py-2.5">{orderTypeLabel(order.orderType)}</td>
      <td className="px-3 py-2.5 tabular-nums">{formatKRW(order.total)}</td>
      <td className="px-3 py-2.5">
        <StatusBadge domain="payment" status={order.paymentStatus} size="sm" />
      </td>
      <td className="px-3 py-2.5">
        <StatusBadge domain="order" status={order.status} size="sm" />
      </td>
      <td className="max-w-[140px] truncate px-3 py-2.5 text-[#64748B]">
        {order.nextAction}
      </td>
      <td className="px-3 py-2.5 text-[#64748B]">{order.updatedAt}</td>
      <td className="px-3 py-2.5 text-right">
        <div className="flex flex-col items-end gap-1">
          <Link
            href={`/seller/orders/${order.id}`}
            className="font-semibold text-[#0369A1] hover:underline"
          >
            {copy.viewDetail}
          </Link>
          {order.id === "ord-001" ? (
            <>
              <Link
                href={`/project/${order.projectId}`}
                className="text-[11px] font-medium text-[#0F766E] hover:underline"
              >
                {copy.actionOpenProject}
              </Link>
              <Link
                href={`/project/${order.projectId}/quote`}
                className="text-[11px] font-medium text-[#0369A1] hover:underline"
              >
                {copy.quoteSummary}
              </Link>
              <Link
                href={`/seller/design-proofs/${order.designProofId}`}
                className="text-[11px] font-medium text-[#0F766E] hover:underline"
              >
                {copy.proofSummary}
              </Link>
              <Link
                href="/seller/customer-items/coi-003"
                className="text-[11px] font-medium text-[#A16207] hover:underline"
              >
                {copy.ownedItemInfo}
              </Link>
            </>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

function Stat({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
      <p className="text-[11px] text-[#64748B]">{label}</p>
      <p className="mt-1 text-[18px] font-bold tabular-nums">{count}</p>
    </div>
  );
}
