"use client";

import { Button } from "@/components/ui/Button";
import { ko } from "@/messages";

type CustomerOwnedItemCalloutProps = {
  visible?: boolean;
};

export function CustomerOwnedItemCallout({
  visible = true,
}: CustomerOwnedItemCalloutProps) {
  if (!visible) return null;

  return (
    <section
      id="owned"
      className="scroll-mt-24 rounded-xl border border-[#F5E6C8] bg-[#FFFBF0] px-3.5 py-3.5"
    >
      <h2 className="break-keep text-[15px] font-semibold text-[#0F172A]">
        {ko.service.ownedItemTitle}
      </h2>
      <p className="mt-1.5 break-keep text-[13px] leading-relaxed text-[#78716C]">
        {ko.service.ownedItemDescription}
      </p>
      <p className="mt-2.5 break-keep text-[12px] font-medium leading-relaxed text-[#92400E]">
        {ko.service.ownedItemFlowSteps.join(" → ")}
      </p>
      <Button
        href="/messages"
        variant="outline"
        size="md"
        className="mt-3 w-full border-[#E7D3A8] bg-white text-[#92400E] hover:bg-[#FFF8EB]"
      >
        {ko.service.ownedItemCta}
      </Button>
    </section>
  );
}
