"use client";

import { useState } from "react";
import type { PaymentMethod } from "@/types/Payment";
import { paymentMethodLabel } from "@/data/mockPayments";
import { ko } from "@/messages";

const copy = ko.payment;

const METHODS: PaymentMethod[] = [
  "CREDIT_CARD",
  "BANK_TRANSFER",
  "NAVER_PAY",
  "KAKAO_PAY",
  "TOSS_PAY",
  "VIRTUAL_ACCOUNT",
];

type PaymentMethodSelectorProps = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-[15px] font-semibold text-[#0F172A]">{copy.methods}</h3>
      <ul className="mt-3 space-y-2">
        {METHODS.map((method) => {
          const selected = method === value;
          return (
            <li key={method}>
              <label
                className={[
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-[13px]",
                  selected
                    ? "border-[#0F766E] bg-[#F0FDFA]"
                    : "border-[#E2E8F0] bg-white",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="payment-method"
                  checked={selected}
                  onChange={() => onChange(method)}
                  className="accent-[#0F766E]"
                />
                {paymentMethodLabel(method)}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function usePaymentMethod(initial: PaymentMethod = "CREDIT_CARD") {
  return useState<PaymentMethod>(initial);
}
