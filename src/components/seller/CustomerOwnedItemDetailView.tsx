"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { lifecycleStatusLabel } from "@/data/mockCustomerOwnedItems";
import { formatKRW, formatItemNumber } from "@/lib/format";
import { ko } from "@/messages";
import type {
  AnomalyReason,
  CustomerOwnedItem,
} from "@/types/CustomerOwnedItem";

const copy = ko.seller.ownedItems;

const anomalyReasonLabel: Record<AnomalyReason, string> = {
  quantityMismatch: "수량 불일치",
  colorMismatch: "색상 불일치",
  sizeMismatch: "사이즈 불일치",
  existingStain: "기존 오염",
  existingDamage: "기존 파손",
  wrongItem: "오배송·다른 물품",
  unworkableMaterial: "제작 불가 소재",
  other: "기타",
};

type CustomerOwnedItemDetailViewProps = {
  item: CustomerOwnedItem;
};

export function CustomerOwnedItemDetailView({
  item,
}: CustomerOwnedItemDetailViewProps) {
  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/seller/customer-items"
            className="text-[13px] font-medium text-[#0369A1] hover:underline"
          >
            {copy.backToList}
          </Link>
          <h2 className="mt-2 text-[20px] font-bold tabular-nums text-[#0F172A]">
            {formatItemNumber(item.itemNumber)}
          </h2>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {item.itemTypeLabel} · {item.serviceName}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {item.orderNumber === "ORD-20260714-014" ? (
              <Link
                href="/seller/orders/ord-001"
                className="text-[12px] font-semibold text-[#0369A1] hover:underline"
              >
                {ko.order.openOrder}
              </Link>
            ) : null}
            <Link
              href={`/project/${item.projectId}`}
              className="text-[12px] font-semibold text-[#0F766E] hover:underline"
            >
              {ko.order.openWorkspace}
            </Link>
          </div>
        </div>
        {item.isAnomaly ? (
          <StatusBadge
            label={lifecycleStatusLabel[item.lifecycleStatus]}
            tone="warning"
            size="md"
          />
        ) : (
          <StatusBadge
            domain="customerOwnedItem"
            status={item.lifecycleStatus}
          />
        )}
      </div>

      {item.isAnomaly ? (
        <section className="rounded-xl border border-[#F5E6C8] bg-[#FFFBF0] p-4">
          <h3 className="text-[15px] font-semibold text-[#92400E]">
            {copy.anomalyTitle}
          </h3>
          <p className="mt-1 break-keep text-[13px] leading-relaxed text-[#78716C]">
            {copy.anomalyBody}
          </p>
          {item.anomalyReasons.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-[12px] font-medium text-[#92400E]">
                {copy.anomalyReasons}:
              </span>
              {item.anomalyReasons.map((reason) => (
                <Badge key={reason} tone="warning">
                  {anomalyReasonLabel[reason]}
                </Badge>
              ))}
            </div>
          ) : null}
          {item.anomalyNote ? (
            <p className="mt-2 break-keep text-[13px] text-[#0F172A]">
              {item.anomalyNote}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.verifyTitle}
        </h3>
        <p className="mt-1 break-keep text-[13px] leading-relaxed text-[#0369A1]">
          {copy.verifyHint}
        </p>
        <dl className="mt-3 grid grid-cols-1 gap-2.5 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
          <Info label={copy.colItemNumber} value={item.itemNumber} mono />
          <Info label={ko.seller.orderNumber} value={item.orderNumber} mono />
          <Info label={ko.seller.customer} value={item.customerName} />
          <Info
            label={copy.phoneLast4}
            value={`****${item.customerPhoneLast4}`}
            mono
          />
          <Info
            label={copy.colTracking}
            value={
              item.trackingNumber
                ? `${item.trackingCompany} ${item.trackingNumber}`
                : "-"
            }
          />
          <Info label={copy.packageInfo} value={item.packageNote || "-"} />
        </dl>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PhotoBlock title={copy.customerPhotos} urls={item.customerPhotos} />
        <PhotoBlock title={copy.receivedPhotos} urls={item.receivedPhotos} />
      </div>

      <section
        id="receive"
        className="scroll-mt-20 rounded-xl border border-[#E2E8F0] bg-white p-4"
      >
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.seller.customer} / {ko.seller.orderNumber}
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
          <Info label={ko.seller.customer} value={item.customerName} />
          <Info label={copy.contactPhone} value={item.customerPhone} mono />
          <Info label={ko.seller.orderNumber} value={item.orderNumber} mono />
          <Info label={copy.projectId} value={item.projectId} mono />
          <Info label={ko.seller.service} value={item.serviceName} />
          <Info
            label={copy.declaredValue}
            value={formatKRW(item.declaredValue)}
            mono
          />
        </dl>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.logistics}
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
          <Info label={copy.carrier} value={item.trackingCompany || "-"} />
          <Info label={copy.colTracking} value={item.trackingNumber || "-"} mono />
          <Info label={copy.shipmentStatus} value={item.shipmentStatus} />
          <Info label={copy.receiveStatus} value={item.receivedStatus} />
        </dl>
      </section>

      <section
        id="inspection"
        className="scroll-mt-20 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4"
      >
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.inspectionTitle}
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
          <Info label={copy.inspectionItemType} value={item.itemTypeLabel} />
          <Info label={copy.inspectionBrand} value={item.brand} />
          <Info label={copy.inspectionColor} value={item.color} />
          <Info label={copy.inspectionSize} value={item.size} />
          <Info
            label={copy.inspectionQty}
            value={String(item.quantity)}
            mono
          />
          <Info
            label={copy.inspectionMatch}
            value={boolLabel(item.matchesCustomerClaim)}
          />
          <Info
            label={copy.inspectionStain}
            value={boolLabel(item.hasContamination)}
          />
          <Info
            label={copy.inspectionDamage}
            value={boolLabel(item.hasDamage)}
          />
          <Info
            label={copy.inspectionDefect}
            value={boolLabel(item.hasExistingDefect)}
          />
          <Info
            label={copy.inspectionCanProduce}
            value={boolLabel(item.canProduce)}
          />
        </dl>
        <p className="mt-3 break-keep text-[13px] text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">
            {copy.inspectionMemo}:{" "}
          </span>
          {item.inspectorMemo || item.defectNotes || "-"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="primary" size="sm" disabled>
            {copy.confirmNormal}
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            {copy.confirmMismatch}
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            {copy.confirmCannotMake}
          </Button>
          <Button type="button" variant="secondary" size="sm" disabled>
            {copy.askCustomer}
          </Button>
        </div>
      </section>

      <section
        id="label"
        className="scroll-mt-20 rounded-xl border border-[#E2E8F0] bg-white p-4"
      >
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.labelArea}
        </h3>
        <div className="mt-3 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4">
          <p className="text-[13px] font-bold text-[#0F766E]">
            {ko.brand.name} / {ko.brand.nameEn}
          </p>
          <p className="mt-2 text-[16px] font-bold tabular-nums text-[#0F172A]">
            {item.itemNumber}
          </p>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {item.orderNumber} · {item.customerName} · ****
            {item.customerPhoneLast4}
          </p>
          <p className="mt-1 text-[13px] text-[#0F172A]">{item.serviceName}</p>
          <p className="mt-1 break-keep text-[12px] text-[#64748B]">
            {item.productionRequirement}
          </p>
          <div className="mt-4 flex gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[11px] font-semibold text-[#94A3B8]">
              {copy.qrPlaceholder}
            </div>
            <div className="flex h-16 flex-1 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[11px] font-semibold tracking-[0.2em] text-[#94A3B8]">
              {copy.barcodePlaceholder}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="primary" size="sm" disabled>
            {copy.labelPrint}
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            {copy.labelReprint}
          </Button>
        </div>
        <p className="mt-2 text-[12px] text-[#64748B]">
          {copy.labelPrintCount} {item.labelPrintCount}회
          {item.lastPrintedAt
            ? ` · ${copy.labelLastPrint} ${item.lastPrintedAt}`
            : ""}
          {item.lastPrintedBy
            ? ` · ${copy.labelOperator} ${item.lastPrintedBy}`
            : ""}
        </p>
      </section>

      <section
        id="production"
        className="scroll-mt-20 rounded-xl border border-[#E2E8F0] bg-white p-4"
      >
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.productionInfo}
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
          <Info label={copy.productionStatus} value={item.productionStatus} />
          <Info label={copy.conditionStatus} value={item.conditionStatus} />
          <Info
            label={copy.productionRequirement}
            value={item.productionRequirement}
            className="sm:col-span-2"
          />
        </dl>
        <div className="mt-3">
          <Button type="button" variant="secondary" size="sm" disabled>
            {copy.actionStart}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.returnInfo}
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
          <Info label={copy.returnStatus} value={item.returnStatus} />
          <Info
            label={copy.returnTracking}
            value={
              item.returnTrackingNumber
                ? `${item.returnTrackingCompany} ${item.returnTrackingNumber}`
                : "-"
            }
          />
        </dl>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold text-[#0F172A]">
          {copy.activityLog}
        </h3>
        <ol className="mt-3 space-y-3">
          {item.activityLog.map((event, index) => (
            <li key={event.id} className="relative flex gap-3">
              {index < item.activityLog.length - 1 ? (
                <span
                  className="absolute left-[5px] top-4 h-[calc(100%-4px)] w-px bg-[#E2E8F0]"
                  aria-hidden
                />
              ) : null}
              <span
                className="relative z-[1] mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0F766E]"
                aria-hidden
              />
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[#0F172A]">
                    {event.title}
                  </p>
                  <time className="text-[11px] text-[#94A3B8]">
                    {event.occurredAt}
                  </time>
                </div>
                <p className="mt-0.5 break-keep text-[12px] text-[#64748B]">
                  {event.description}
                </p>
                <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                  {event.actorName}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-[11px] text-[#94A3B8]">{ko.seller.demoNote}</p>
    </div>
  );
}

function PhotoBlock({ title, urls }: { title: string; urls: string[] }) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-[15px] font-semibold text-[#0F172A]">{title}</h3>
      {urls.length === 0 ? (
        <p className="mt-3 text-[13px] text-[#94A3B8]">-</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {urls.map((url, index) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]"
            >
              <Image
                src={url}
                alt={`${title} ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Info({
  label,
  value,
  mono = false,
  className = "",
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] text-[#64748B]">{label}</dt>
      <dd
        className={[
          "mt-0.5 break-keep text-[#0F172A]",
          mono ? "font-medium tabular-nums" : "font-medium",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function boolLabel(value: boolean | null): string {
  if (value === true) return copy.yes;
  if (value === false) return copy.no;
  return copy.unknown;
}
