"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCount } from "@/lib/format";
import { ko } from "@/messages";
import type { Store } from "@/types";

type StoreInfoCardProps = {
  store: Store;
};

export function StoreInfoCard({ store }: StoreInfoCardProps) {
  const responseLabel = formatResponseLabel(store.responseTime);
  const completedLabel = `${ko.store.completedOrdersShort} ${formatCount(store.completedOrders)}${ko.store.orderUnit}`;

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F1F5F9]">
          <Image
            src={store.logo}
            alt={`${store.name} 로고`}
            fill
            sizes="48px"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="truncate text-[15px] font-semibold text-[#0F172A]">
              {store.name}
            </h2>
            {store.verified ? (
              <Badge tone="success">{ko.store.verified}</Badge>
            ) : null}
          </div>
          <p className="mt-1 text-[13px] text-[#0F172A]">
            ★ {store.rating.toFixed(1)} · {formatCount(store.reviewCount)}{" "}
            {ko.store.reviews}
          </p>
          <ul className="mt-2 space-y-1 text-[12px] text-[#64748B]">
            <li>{responseLabel}</li>
            <li>{completedLabel}</li>
            {store.verified ? (
              <li className="font-medium text-[#15803D]">
                {ko.store.recentActivity}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          href={`/store/${store.id}`}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-[#CBD5E1] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
        >
          {ko.service.visitStore}
        </Link>
        <Button
          href="/messages"
          variant="secondary"
          size="sm"
          className="h-9 border border-[#BAE6FD]"
        >
          {ko.store.startChat}
        </Button>
      </div>
    </section>
  );
}

function formatResponseLabel(responseTime: string): string {
  const minutes = responseTime.match(/\d+/);
  if (minutes?.[0]) {
    return `${ko.store.avgResponsePrefix} ${minutes[0]}${ko.store.avgResponseSuffix}`;
  }
  return `${ko.store.response} ${responseTime}`;
}
