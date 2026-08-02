import { ko } from "@/messages";

const copy = ko.order;

export function OrderRiskNotices() {
  return (
    <section className="rounded-xl border border-[#FDE68A] bg-[#FEFCE8] p-4">
      <ul className="space-y-1.5 text-[12px] leading-relaxed text-[#92400E]">
        <li>· {copy.riskProof}</li>
        <li>· {copy.riskOwned}</li>
        <li>· {copy.riskCancel}</li>
        <li>· {copy.riskRefund}</li>
        <li>· {copy.riskRevision}</li>
      </ul>
    </section>
  );
}
