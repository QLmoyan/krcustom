"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  lifecycleStatusLabel,
  mockCustomerOwnedItems,
  getOwnedItemStats,
} from "@/data/mockCustomerOwnedItems";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type {
  CustomerOwnedItem,
  OwnedItemLifecycleStatus,
  OwnedItemType,
} from "@/types/CustomerOwnedItem";

const copy = ko.seller.ownedItems;

const itemTypeOptions: { value: "" | OwnedItemType; label: string }[] = [
  { value: "", label: copy.filterAll },
  { value: "tshirt", label: "흰색 티셔츠" },
  { value: "hoodie", label: "후드티" },
  { value: "ecoBag", label: "에코백" },
  { value: "cap", label: "모자" },
  { value: "sneakers", label: "운동화" },
  { value: "jacket", label: "자켓" },
];

const statusOptions: { value: "" | OwnedItemLifecycleStatus; label: string }[] =
  [
    { value: "", label: copy.filterAll },
    ...Object.entries(lifecycleStatusLabel).map(([value, label]) => ({
      value: value as OwnedItemLifecycleStatus,
      label,
    })),
  ];

export function CustomerOwnedItemListView() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | OwnedItemLifecycleStatus>("");
  const [itemType, setItemType] = useState<"" | OwnedItemType>("");
  const [anomaly, setAnomaly] = useState<"all" | "yes" | "no">("all");

  const stats = getOwnedItemStats(mockCustomerOwnedItems);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockCustomerOwnedItems.filter((item) => {
      if (status && item.lifecycleStatus !== status) return false;
      if (itemType && item.itemType !== itemType) return false;
      if (anomaly === "yes" && !item.isAnomaly) return false;
      if (anomaly === "no" && item.isAnomaly) return false;
      if (!q) return true;
      return (
        item.itemNumber.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.customerPhoneLast4.includes(q) ||
        item.trackingNumber.toLowerCase().includes(q)
      );
    });
  }, [anomaly, itemType, query, status]);

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-[#64748B]">{copy.subtitle}</p>
        </div>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.scanButton} · 준비 중
        </Button>
      </div>
      <p className="text-[11px] text-[#94A3B8]">{copy.scanHint}</p>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <StatChip label={copy.statsInbound} count={stats.awaitingInbound} />
        <StatChip
          label={copy.statsNeedConfirm}
          count={stats.needReceiveConfirm}
          tone="warning"
        />
        <StatChip label={copy.statsAnomaly} count={stats.anomaly} tone="warning" />
        <StatChip label={copy.statsLabel} count={stats.awaitingLabel} />
        <StatChip
          label={copy.statsProduction}
          count={stats.inProduction}
          tone="brand"
        />
        <StatChip label={copy.statsReturn} count={stats.awaitingReturn} />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
        <label htmlFor="owned-search" className="sr-only">
          {copy.searchPlaceholder}
        </label>
        <input
          id="owned-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-10 w-full rounded-lg border border-[#E2E8F0] px-3 text-[14px] outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/15"
        />
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "" | OwnedItemLifecycleStatus)
            }
            className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px]"
            aria-label={copy.filterStatus}
          >
            {statusOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {copy.filterStatus}: {option.label}
              </option>
            ))}
          </select>
          <select
            value={itemType}
            onChange={(event) =>
              setItemType(event.target.value as "" | OwnedItemType)
            }
            className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px]"
            aria-label={copy.filterType}
          >
            {itemTypeOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {copy.filterType}: {option.label}
              </option>
            ))}
          </select>
          <select
            value={anomaly}
            onChange={(event) =>
              setAnomaly(event.target.value as "all" | "yes" | "no")
            }
            className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px]"
            aria-label={copy.filterAnomaly}
          >
            <option value="all">
              {copy.filterAnomaly}: {copy.filterAll}
            </option>
            <option value="yes">{copy.anomalyOnly}</option>
            <option value="no">{copy.normalOnly}</option>
          </select>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-[#E2E8F0] bg-white md:block">
        <table className="w-full min-w-[960px] text-left text-[13px]">
          <thead className="bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-3 py-2.5 font-medium">{copy.colItemNumber}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colOrder}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colCustomer}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colItem}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colTracking}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colStatus}</th>
              <th className="px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((item) => (
              <tr key={item.id} className={item.isAnomaly ? "bg-[#FFFBEB]/70" : ""}>
                <td className="px-3 py-2.5 font-semibold tabular-nums">
                  {item.itemNumber}
                </td>
                <td className="px-3 py-2.5 tabular-nums">{item.orderNumber}</td>
                <td className="px-3 py-2.5">
                  {item.customerName}
                  <span className="block text-[11px] text-[#64748B]">
                    ****{item.customerPhoneLast4}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  {item.itemTypeLabel}
                  <span className="block text-[11px] text-[#64748B]">
                    {item.brand} · {item.color} · {item.size}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[12px] text-[#64748B]">
                  {item.trackingNumber || "-"}
                </td>
                <td className="px-3 py-2.5">
                  <OwnedItemStatusBadge item={item} />
                </td>
                <td className="px-3 py-2.5">
                  <RowActions item={item} />
                </td>
              </tr>
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
        {filtered.map((item) => (
          <li
            key={item.id}
            className={[
              "rounded-xl border border-[#E2E8F0] bg-white p-3",
              item.isAnomaly ? "border-[#F5E6C8] bg-[#FFFBF0]" : "",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold tabular-nums">
                  {item.itemNumber}
                </p>
                <p className="mt-0.5 text-[12px] text-[#64748B]">
                  {item.orderNumber} · {item.customerName} · ****
                  {item.customerPhoneLast4}
                </p>
              </div>
              <OwnedItemStatusBadge item={item} />
            </div>
            <p className="mt-2 text-[13px]">
              {item.itemTypeLabel} · {item.brand} · {formatKRW(item.declaredValue)}
            </p>
            <p className="mt-1 text-[12px] text-[#64748B]">
              {item.trackingCompany} {item.trackingNumber || "-"}
            </p>
            <div className="mt-2">
              <RowActions item={item} />
            </div>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[#E2E8F0] px-4 py-8 text-center text-[13px] text-[#64748B]">
            {copy.empty}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function StatChip({
  label,
  count,
  tone = "neutral",
}: {
  label: string;
  count: number;
  tone?: "neutral" | "warning" | "brand";
}) {
  const toneClass =
    tone === "warning"
      ? "border-[#FDE68A] bg-[#FEFCE8]"
      : tone === "brand"
        ? "border-[#99F6E4] bg-[#F0FDFA]"
        : "border-[#E2E8F0] bg-white";
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${toneClass}`}>
      <p className="text-[11px] text-[#64748B]">{label}</p>
      <p className="mt-1 text-[20px] font-bold tabular-nums text-[#0F172A]">
        {count}
      </p>
    </div>
  );
}

function OwnedItemStatusBadge({ item }: { item: CustomerOwnedItem }) {
  if (item.isAnomaly) {
    return (
      <StatusBadge
        label={lifecycleStatusLabel[item.lifecycleStatus]}
        tone="warning"
      />
    );
  }
  return (
    <StatusBadge
      domain="customerOwnedItem"
      status={item.lifecycleStatus}
    />
  );
}

function RowActions({ item }: { item: CustomerOwnedItem }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <ActionLink
        href={`/seller/customer-items/${item.id}#receive`}
        label={copy.actionReceive}
      />
      <ActionLink
        href={`/seller/customer-items/${item.id}#inspection`}
        label={copy.actionRecord}
      />
      <ActionLink
        href={`/seller/customer-items/${item.id}#label`}
        label={copy.actionPrint}
      />
      <ActionLink
        href={`/seller/customer-items/${item.id}#production`}
        label={copy.actionStart}
      />
      <Link
        href={`/seller/customer-items/${item.id}`}
        className="inline-flex h-7 items-center rounded-md bg-[#0F766E] px-2 text-[11px] font-semibold text-white"
      >
        {copy.actionDetail}
      </Link>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-7 items-center rounded-md border border-[#E2E8F0] bg-white px-2 text-[11px] font-medium text-[#334155] hover:bg-[#F8FAFC]"
    >
      {label}
    </Link>
  );
}
