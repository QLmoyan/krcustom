import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatWon } from "@/lib/format";
import { ko } from "@/messages";
import type { Service } from "@/types";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/service/${service.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F1F5F9]">
        <Image
          src={service.coverImage}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"
          unoptimized
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 break-keep text-[15px] font-semibold leading-snug text-[#0F172A]">
            {service.title}
          </h3>
          <p className="mt-1 truncate text-[13px] text-[#64748B]">
            {service.storeName}
          </p>
        </div>

        <p className="text-[16px] font-bold tabular-nums text-[#0F172A]">
          {formatWon(service.minimumPrice)}~
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#64748B]">
          <span aria-label={`${ko.service.rating} ${service.rating}`}>
            ★ {service.rating.toFixed(1)}
          </span>
          <span>({service.reviewCount.toLocaleString("ko-KR")})</span>
          <span>
            {ko.service.production} {service.productionDays}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {service.supportsQuote ? (
            <Badge tone="accent">{ko.service.quoteAvailable}</Badge>
          ) : null}
          {service.supportsDirectPurchase ? (
            <Badge tone="brand">{ko.service.directPurchaseAvailable}</Badge>
          ) : null}
          {service.supportsCustomerOwnedItem ? (
            <Badge tone="warning">{ko.service.customerOwnedAvailable}</Badge>
          ) : null}
          {service.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
