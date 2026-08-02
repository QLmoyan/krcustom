import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";

const copy = ko.designProof;

type DesignProofFeedbackProps = {
  proof: DesignProof;
};

export function DesignProofFeedback({ proof }: DesignProofFeedbackProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[14px] font-semibold text-[#0F172A]">
          {copy.sellerNote}
        </h3>
        <p className="mt-2 break-keep text-[13px] leading-relaxed text-[#64748B]">
          {proof.sellerNote || "-"}
        </p>
        {proof.changeSummary ? (
          <p className="mt-3 break-keep rounded-lg bg-[#F8FAFC] px-3 py-2 text-[12px] text-[#475569]">
            <span className="font-semibold text-[#0F172A]">
              {copy.thisChange}:{" "}
            </span>
            {proof.changeSummary}
          </p>
        ) : null}
      </section>
      <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
        <h3 className="text-[14px] font-semibold text-[#0F172A]">
          {copy.customerFeedback}
        </h3>
        <p className="mt-2 break-keep text-[13px] leading-relaxed text-[#64748B]">
          {proof.customerNote || proof.revisionReason || "-"}
        </p>
        {proof.revisionReason ? (
          <p className="mt-2 text-[12px] font-medium text-[#A16207]">
            {proof.revisionReason}
          </p>
        ) : null}
      </section>
    </div>
  );
}
