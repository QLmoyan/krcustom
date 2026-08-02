"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DesignProofStatus } from "@/constants/status";
import { getStatusLabel } from "@/constants/status";
import { ko } from "@/messages";
import type {
  DesignProofListItem,
  DesignProofStatus as DesignProofStatusCode,
} from "@/types/DesignProof";

const copy = ko.designProof;

type DesignProofStats = {
  drafting: number;
  awaitingCustomer: number;
  revisionRequested: number;
  confirmed: number;
  locked: number;
  projects: number;
};

type SellerDesignProofListViewProps = {
  items: DesignProofListItem[];
  stats: DesignProofStats;
};

const statusTabs: {
  key: "all" | DesignProofStatusCode;
  label: string;
}[] = [
  { key: "all", label: copy.filterAll },
  {
    key: DesignProofStatus.DRAFT,
    label: getStatusLabel("designProof", DesignProofStatus.DRAFT),
  },
  {
    key: DesignProofStatus.CONFIRMATION_PENDING,
    label: getStatusLabel(
      "designProof",
      DesignProofStatus.CONFIRMATION_PENDING,
    ),
  },
  {
    key: DesignProofStatus.REVISION_REQUESTED,
    label: getStatusLabel("designProof", DesignProofStatus.REVISION_REQUESTED),
  },
  {
    key: DesignProofStatus.CONFIRMED,
    label: getStatusLabel("designProof", DesignProofStatus.CONFIRMED),
  },
  {
    key: DesignProofStatus.LOCKED,
    label: getStatusLabel("designProof", DesignProofStatus.LOCKED),
  },
];

export function SellerDesignProofListView({
  items,
  stats,
}: SellerDesignProofListViewProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | DesignProofStatusCode>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return (
        item.projectNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.serviceName.toLowerCase().includes(q) ||
        item.latestProofId.toLowerCase().includes(q) ||
        item.projectId.toLowerCase().includes(q)
      );
    });
  }, [items, query, status]);

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-4">
      <p className="text-[13px] text-[#64748B]">{copy.listSubtitle}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatChip label={copy.statsDrafting} count={stats.drafting} />
        <StatChip label={copy.statsAwaiting} count={stats.awaitingCustomer} />
        <StatChip label={copy.statsRevision} count={stats.revisionRequested} />
        <StatChip label={copy.statsConfirmed} count={stats.confirmed} />
        <StatChip label={copy.statsLocked} count={stats.locked} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-10 w-full flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 text-[13px] outline-none focus:border-[#0F766E]"
        />
        <label className="flex items-center gap-2 text-[12px] text-[#64748B]">
          {copy.filterStatus}
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | DesignProofStatusCode)
            }
            className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-2 text-[13px] text-[#0F172A]"
          >
            {statusTabs.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-[#E2E8F0] bg-white md:block">
        <table className="w-full min-w-[980px] text-left text-[13px]">
          <thead className="bg-[#F8FAFC] text-[12px] text-[#64748B]">
            <tr>
              <th className="px-3 py-2.5 font-medium">{copy.colProject}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colService}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colCustomer}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colVersion}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colStatus}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colFeedback}</th>
              <th className="px-3 py-2.5 font-medium">{copy.colUpdated}</th>
              <th className="px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2.5 font-medium tabular-nums">
                  {item.projectNumber}
                </td>
                <td className="max-w-[160px] truncate px-3 py-2.5">
                  {item.serviceName}
                </td>
                <td className="px-3 py-2.5">{item.customerName}</td>
                <td className="px-3 py-2.5">V{item.latestVersion}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge domain="designProof" status={item.status} />
                </td>
                <td className="max-w-[180px] truncate px-3 py-2.5 text-[#64748B]">
                  {item.recentFeedback}
                </td>
                <td className="px-3 py-2.5 text-[#64748B]">{item.updatedAt}</td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/seller/design-proofs/${item.latestProofId}`}
                      className="font-semibold text-[#0369A1] hover:underline"
                    >
                      {copy.viewDetail}
                    </Link>
                    <Link
                      href={`/seller/design-proofs/${item.latestProofId}#upload`}
                      className="font-semibold text-[#0F766E] hover:underline"
                    >
                      {copy.uploadNew}
                    </Link>
                  </div>
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
            className="rounded-xl border border-[#E2E8F0] bg-white p-3"
          >
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#F1F5F9]">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13px] font-semibold tabular-nums">
                    {item.projectNumber}
                  </p>
                  <StatusBadge domain="designProof" status={item.status} />
                </div>
                <p className="mt-1 truncate text-[13px] text-[#0F172A]">
                  {item.serviceName} · {item.customerName}
                </p>
                <p className="mt-1 text-[12px] text-[#64748B]">
                  V{item.latestVersion} · {item.updatedAt}
                </p>
                <p className="mt-1 truncate text-[12px] text-[#64748B]">
                  {item.recentFeedback}
                </p>
                <div className="mt-2 flex gap-3">
                  <Link
                    href={`/seller/design-proofs/${item.latestProofId}`}
                    className="text-[12px] font-semibold text-[#0369A1]"
                  >
                    {copy.viewDetail}
                  </Link>
                  <Link
                    href={`/seller/design-proofs/${item.latestProofId}#upload`}
                    className="text-[12px] font-semibold text-[#0F766E]"
                  >
                    {copy.uploadNew}
                  </Link>
                </div>
              </div>
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

function StatChip({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5">
      <p className="text-[11px] text-[#64748B]">{label}</p>
      <p className="mt-1 text-[20px] font-bold tabular-nums text-[#0F172A]">
        {count}
      </p>
    </div>
  );
}
