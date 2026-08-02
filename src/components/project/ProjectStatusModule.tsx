import {
  StatusBadge,
  inferStatusToneFromKoreanLabel,
} from "@/components/ui/StatusBadge";
import { ko } from "@/messages";
import type { ProjectStatusInfo } from "@/types/Project";

type ProjectStatusModuleProps = {
  status: ProjectStatusInfo;
};

export function ProjectStatusModule({ status }: ProjectStatusModuleProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.project.statusModule}
        </h2>
        <StatusBadge
          label={status.currentStatus}
          tone={inferStatusToneFromKoreanLabel(status.currentStatus)}
        />
      </div>
      <h3 className="mt-2 break-keep text-[16px] font-bold text-[#0F172A]">
        {status.title}
      </h3>
      <dl className="mt-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="text-[11px] text-[#64748B]">
            {ko.project.projectNumber}
          </dt>
          <dd className="mt-0.5 font-medium tabular-nums text-[#0F172A]">
            {status.projectNumber}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#64748B]">{ko.project.tradeMethod}</dt>
          <dd className="mt-0.5 font-medium text-[#0F172A]">
            {status.tradeMethod}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#64748B]">{ko.seller.service}</dt>
          <dd className="mt-0.5 font-medium text-[#0F172A]">
            {status.serviceTitle}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[#64748B]">{ko.seller.customer}</dt>
          <dd className="mt-0.5 font-medium text-[#0F172A]">
            {status.customerName} · {status.storeName}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[11px] text-[#64748B]">
            {ko.project.lastUpdated}
          </dt>
          <dd className="mt-0.5 text-[#64748B]">{status.updatedAt}</dd>
        </div>
      </dl>
    </section>
  );
}
