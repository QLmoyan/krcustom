import type { ReactNode } from "react";
import { OrderRiskNotices } from "@/components/order/OrderRiskNotices";
import { ko } from "@/messages";

const copy = ko.order;

type OrderStatusPanelProps = {
  nextAction: string;
  children?: ReactNode;
};

export function OrderStatusPanel({
  nextAction,
  children,
}: OrderStatusPanelProps) {
  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
        <p className="text-[12px] font-medium text-[#0369A1]">
          {copy.currentNext}
        </p>
        <p className="mt-1 text-[15px] font-semibold text-[#0F172A]">
          {nextAction}
        </p>
        {children}
      </section>
      <OrderRiskNotices />
    </div>
  );
}
