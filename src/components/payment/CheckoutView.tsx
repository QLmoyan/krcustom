"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderAmountBreakdown } from "@/components/order/OrderAmountBreakdown";
import { OrderRiskNotices } from "@/components/order/OrderRiskNotices";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { Button } from "@/components/ui/Button";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";
import type { PaymentMethod } from "@/types/Payment";

const copy = ko.payment;

type CheckoutViewProps = {
  order: Order;
};

export function CheckoutView({ order }: CheckoutViewProps) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="mx-auto max-w-[720px] space-y-4">
      <h1 className="text-[20px] font-bold text-[#0F172A] md:text-[22px]">
        {copy.checkoutTitle}
      </h1>

      <div className="rounded-xl border-2 border-[#7DD3FC] bg-[#E0F2FE] px-4 py-3 text-[13px] text-[#0369A1]">
        <p className="font-semibold text-[#0C4A6E]">{copy.demoHint}</p>
        <p className="mt-1">{copy.afterPay}</p>
        {order.orderType === "CUSTOMER_OWNED_ITEM" ? (
          <p className="mt-1">{copy.ownedNext}</p>
        ) : null}
      </div>

      <PaymentSummary order={order} />
      <OrderAmountBreakdown order={order} />
      <PaymentMethodSelector value={method} onChange={setMethod} />

      <label className="flex items-start gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-[13px]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 accent-[#0F766E]"
        />
        {copy.agree}
      </label>

      <OrderRiskNotices />

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!agreed}
        onClick={() => router.push(`/checkout/${order.id}/success`)}
      >
        {formatKRW(order.total)} {copy.payButton}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => router.push(`/checkout/${order.id}/failure`)}
      >
        {ko.payment.failureTitle} (데모)
      </Button>
    </div>
  );
}
