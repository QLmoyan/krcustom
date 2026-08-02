import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  StatusBadge,
  inferStatusToneFromKoreanLabel,
} from "@/components/ui/StatusBadge";
import { DEMO } from "@/data/demoFlow";
import { ko } from "@/messages";
import type { ProjectOwnedItemInfo } from "@/types/Project";

type ProjectOwnedItemModuleProps = {
  ownedItem: ProjectOwnedItemInfo;
};

export function ProjectOwnedItemModule({
  ownedItem,
}: ProjectOwnedItemModuleProps) {
  return (
    <section className="rounded-xl border border-[#F5E6C8] bg-[#FFFBF0] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.project.ownedItemModule}
        </h2>
        <StatusBadge
          label={ownedItem.status}
          tone={inferStatusToneFromKoreanLabel(ownedItem.status)}
        />
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="text-[11px] text-[#78716C]">{ko.project.itemCode}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-[#0F172A]">
            {ownedItem.itemCode}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#78716C]">{ko.project.itemName}</dt>
          <dd className="mt-0.5 font-medium text-[#0F172A]">
            {ownedItem.itemName}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#78716C]">{ko.seller.customer}</dt>
          <dd className="mt-0.5 text-[#0F172A]">{ownedItem.customerName}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#78716C]">{ko.project.phone}</dt>
          <dd className="mt-0.5 tabular-nums text-[#0F172A]">
            {ownedItem.phoneMasked}
          </dd>
        </div>
      </dl>
      <p className="mt-3 break-keep text-[13px] leading-relaxed text-[#78716C]">
        <span className="font-semibold text-[#92400E]">
          {ko.project.condition}:{" "}
        </span>
        {ownedItem.conditionNote}
      </p>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {ownedItem.photoUrls.map((url, index) => (
          <div
            key={url}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E7D3A8] bg-white"
          >
            <Image
              src={url}
              alt={`${ownedItem.itemName} ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          href={`/orders/${DEMO.orderId}#owned`}
          variant="outline"
          size="sm"
        >
          주문에서 보기
        </Button>
        <Button
          href={`/seller/customer-items/${DEMO.ownedItemId}`}
          variant="secondary"
          size="sm"
        >
          판매자 물품 상세
        </Button>
      </div>
    </section>
  );
}
