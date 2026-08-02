"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DEMO } from "@/data/demoFlow";
import { ko } from "@/messages";
import type { Service } from "@/types";

type ServiceActionPanelProps = {
  service: Service;
  layout?: "stack" | "mobile-bar";
  pending?: boolean;
  onChatInquiry?: () => void;
  onRequestQuote?: () => void;
};

export function ServiceActionPanel({
  service,
  layout = "stack",
  pending = false,
  onChatInquiry,
  onRequestQuote,
}: ServiceActionPanelProps) {
  if (layout === "mobile-bar") {
    return (
      <div className="border-t border-[#E2E8F0] bg-white px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            className="whitespace-nowrap"
            disabled={pending}
            onClick={onChatInquiry}
          >
            {pending ? ko.service.creatingProject : ko.service.chatInquiry}
          </Button>
          <Button
            type="button"
            size="md"
            className="whitespace-nowrap border border-[#0F766E]/25 bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]"
            disabled={pending}
            onClick={onRequestQuote}
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
          type="button"
          variant="primary"
          size="lg"
          className="w-full whitespace-nowrap shadow-sm"
          disabled={pending}
          onClick={onChatInquiry}
        >
          {pending ? ko.service.creatingProject : ko.service.chatInquiry}
        </Button>
        <Button
          type="button"
          size="lg"
          className="w-full whitespace-nowrap border border-[#0F766E]/30 bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4] focus-visible:ring-[#0F766E]/25"
          disabled={pending}
          onClick={onRequestQuote}
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

      <p className="text-[11px] text-[#94A3B8]">
        {ko.service.loginRequiredForInquiry}{" "}
        <Link
          href={`/project/${DEMO.projectId}`}
          className="font-semibold text-[#0F766E] hover:underline"
        >
          {ko.service.demoFallback}
        </Link>
      </p>
    </div>
  );
}
