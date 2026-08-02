import Link from "next/link";
import {
  StatusBadge,
  inferStatusToneFromKoreanLabel,
} from "@/components/ui/StatusBadge";
import { DEMO } from "@/data/demoFlow";
import { ko } from "@/messages";
import type { ProjectLogisticsInfo } from "@/types/Project";

type ProjectLogisticsModuleProps = {
  logistics: ProjectLogisticsInfo;
};

export function ProjectLogisticsModule({
  logistics,
}: ProjectLogisticsModuleProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">
        {ko.project.logisticsModule}
      </h2>
      <div className="mt-3 space-y-3">
        {logistics.outbound ? (
          <div className="rounded-lg bg-[#F8FAFC] px-3 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-[#0F172A]">
                {ko.project.outbound}
              </p>
              <StatusBadge
                label={logistics.outbound.status}
                tone={inferStatusToneFromKoreanLabel(logistics.outbound.status)}
              />
            </div>
            <p className="mt-1.5 text-[13px] text-[#0F172A]">
              {logistics.outbound.company}
            </p>
            <p className="mt-0.5 text-[13px] tabular-nums text-[#64748B]">
              {ko.project.tracking} {logistics.outbound.trackingNumber}
            </p>
            <p className="mt-0.5 text-[12px] text-[#94A3B8]">
              {logistics.outbound.shippedAt}
            </p>
            <Link
              href={`/orders/${DEMO.orderId}#owned`}
              className="mt-2 inline-flex text-[12px] font-semibold text-[#0369A1] hover:underline"
            >
              {ko.order.openOrder}
            </Link>
          </div>
        ) : null}

        {logistics.inbound ? (
          <div className="rounded-lg bg-[#F8FAFC] px-3 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-[#0F172A]">
                {ko.project.returnShipment}
              </p>
              <StatusBadge
                label={logistics.inbound.status}
                tone={inferStatusToneFromKoreanLabel(logistics.inbound.status)}
              />
            </div>
            <p className="mt-1.5 text-[13px] text-[#0F172A]">
              {logistics.inbound.company}
            </p>
            <p className="mt-0.5 text-[13px] tabular-nums text-[#64748B]">
              {ko.project.tracking} {logistics.inbound.trackingNumber}
            </p>
            <p className="mt-0.5 text-[12px] text-[#94A3B8]">
              {logistics.inbound.shippedAt}
            </p>
          </div>
        ) : (
          <p className="text-[13px] text-[#64748B]">{ko.project.noReturnYet}</p>
        )}
      </div>
    </section>
  );
}
