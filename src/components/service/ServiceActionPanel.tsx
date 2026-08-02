"use client";

import { Button } from "@/components/ui/Button";
import { DEMO } from "@/data/demoFlow";
import { ko } from "@/messages";
import type { Service } from "@/types";

type ServiceActionPanelProps = {
  service: Service;
  layout?: "stack" | "mobile-bar";
};

export function ServiceActionPanel({
  service,
  layout = "stack",
}: ServiceActionPanelProps) {
  if (layout === "mobile-bar") {
    return (
      <div className="border-t border-[#E2E8F0] bg-white px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-2 gap-2">
          <Button
            href={`/project/${DEMO.projectId}`}
            variant="primary"
            size="md"
            className="whitespace-nowrap"
          >
            {ko.service.chatInquiry}
          </Button>
          <Button
            href={`/project/${DEMO.projectId}/quote`}
            size="md"
            className="whitespace-nowrap border border-[#0F766E]/25 bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]"
          >
            {ko.service.requestQuote}
          </Button>
        </div>
        {service.supportsDirectPurchase ? (
          <Button
            href={`/checkout/${DEMO.paymentPendingOrderId}`}
            variant="outline"
            size="sm"
            className="mt-2 w-full whitespace-nowrap text-[#475569]"
          >
            {ko.service.buyNow}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          href={`/project/${DEMO.projectId}`}
          variant="primary"
          size="lg"
          className="w-full whitespace-nowrap shadow-sm"
        >
          {ko.service.chatInquiry}
        </Button>
        <Button
          href={`/project/${DEMO.projectId}/quote`}
          size="lg"
          className="w-full whitespace-nowrap border border-[#0F766E]/30 bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4] focus-visible:ring-[#0F766E]/25"
        >
          {ko.service.requestQuote}
        </Button>
      </div>

      {service.supportsDirectPurchase ? (
        <Button
          href={`/checkout/${DEMO.paymentPendingOrderId}`}
          variant="outline"
          size="md"
          className="w-full whitespace-nowrap text-[#475569]"
        >
          {ko.service.buyNow}
        </Button>
      ) : null}

      <p className="text-[11px] text-[#94A3B8]">{ko.service.demoAction}</p>
    </div>
  );
}
