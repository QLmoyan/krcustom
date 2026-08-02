"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ko } from "@/messages";

type ServiceActionPanelProps = {
  layout?: "stack" | "mobile-bar";
  pending?: boolean;
  onStartChat?: () => void;
};

export function ServiceActionPanel({
  layout = "stack",
  pending = false,
  onStartChat,
}: ServiceActionPanelProps) {
  if (layout === "mobile-bar") {
    return (
      <div className="border-t border-[#E2E8F0] bg-white px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full whitespace-nowrap"
          disabled={pending}
          onClick={onStartChat}
        >
          {pending ? ko.service.creatingProject : ko.service.chatInquiry}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full whitespace-nowrap shadow-sm"
        disabled={pending}
        onClick={onStartChat}
      >
        {pending ? ko.service.creatingProject : ko.service.chatInquiry}
      </Button>

      <p className="text-[11px] text-[#94A3B8]">
        {ko.service.loginRequiredForInquiry}{" "}
        <Link
          href="/messages"
          className="font-semibold text-[#0F766E] hover:underline"
        >
          {ko.service.demoFallback}
        </Link>
      </p>
    </div>
  );
}
