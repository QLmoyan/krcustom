"use client";

import { useState } from "react";
import type { ServiceFaqItem } from "@/types";
import { ko } from "@/messages";

type ServiceFaqProps = {
  items: ServiceFaqItem[];
};

export function ServiceFaq({ items }: ServiceFaqProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-[17px] font-semibold text-[#0F172A] md:text-[18px]">
        {ko.service.faqSection}
      </h2>
      <div className="mt-3 divide-y divide-[#E2E8F0] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
              >
                <span className="break-keep text-[13px] font-semibold text-[#0F172A]">
                  {item.question}
                </span>
                <span className="shrink-0 text-[#64748B]" aria-hidden>
                  {open ? "−" : "+"}
                </span>
              </button>
              {open ? (
                <p className="break-keep px-3.5 pb-3 text-[13px] leading-relaxed text-[#64748B]">
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
