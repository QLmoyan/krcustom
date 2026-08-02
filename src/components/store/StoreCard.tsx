import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatCount } from "@/lib/format";
import { ko } from "@/messages";
import type { Store } from "@/types";

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/store/${store.id}`}
      className="flex h-full gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F1F5F9]">
        <Image
          src={store.logo}
          alt={`${store.name} 로고`}
          fill
          sizes="56px"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="truncate text-[15px] font-semibold text-[#0F172A]">
            {store.name}
          </h3>
          {store.verified ? (
            <Badge tone="success">{ko.store.verified}</Badge>
          ) : null}
        </div>
        <p className="mt-1 text-[13px] text-[#64748B]">
          ★ {store.rating.toFixed(1)} · {ko.store.reviews}{" "}
          {formatCount(store.reviewCount)}
        </p>
        <p className="mt-0.5 text-[13px] text-[#64748B]">
          {ko.store.response} {store.responseTime} · {ko.store.completedOrders}{" "}
          {formatCount(store.completedOrders)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {store.categories.map((category) => (
            <Badge key={category} tone="neutral">
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
