"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO } from "@/data/demoFlow";

type StepLink = { href: string; label: string };

type StepDef = {
  id: number;
  label: string;
  prev: StepLink | null;
  next: StepLink | null;
};

const STEPS: StepDef[] = [
  {
    id: 1,
    label: "서비스 탐색",
    prev: null,
    next: { href: `/project/${DEMO.projectId}`, label: "판매자 상담" },
  },
  {
    id: 2,
    label: "판매자 상담",
    prev: { href: `/service/${DEMO.serviceId}`, label: "서비스 탐색" },
    next: { href: `/project/${DEMO.projectId}/quote`, label: "견적 확인" },
  },
  {
    id: 3,
    label: "견적 확인",
    prev: { href: `/project/${DEMO.projectId}`, label: "판매자 상담" },
    next: {
      href: `/design-proofs/${DEMO.designProofId}`,
      label: "시안 확인",
    },
  },
  {
    id: 4,
    label: "시안 확인",
    prev: { href: `/project/${DEMO.projectId}/quote`, label: "견적 확인" },
    next: { href: `/checkout/${DEMO.orderId}`, label: "결제" },
  },
  {
    id: 5,
    label: "결제",
    prev: {
      href: `/design-proofs/${DEMO.designProofId}`,
      label: "시안 확인",
    },
    next: { href: `/orders/${DEMO.orderId}`, label: "주문 확인" },
  },
  {
    id: 6,
    label: "주문 확인",
    prev: { href: `/checkout/${DEMO.orderId}`, label: "결제" },
    next: {
      href: `/orders/${DEMO.orderId}#owned`,
      label: "고객 물품 발송",
    },
  },
  {
    id: 7,
    label: "고객 물품 발송",
    prev: { href: `/orders/${DEMO.orderId}`, label: "주문 확인" },
    next: {
      href: `/seller/customer-items/${DEMO.ownedItemId}`,
      label: "제작 및 반송",
    },
  },
  {
    id: 8,
    label: "제작 및 반송",
    prev: {
      href: `/orders/${DEMO.orderId}#owned`,
      label: "고객 물품 발송",
    },
    next: null,
  },
];

type DemoFlowHintProps = {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

export function DemoFlowHint({ step }: DemoFlowHintProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const current = STEPS[step - 1];

  function dismiss() {
    setHidden(true);
  }

  return (
    <>
      <aside
        className="pointer-events-auto fixed bottom-20 right-4 z-30 hidden w-[260px] rounded-xl border border-[#99F6E4] bg-white/95 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur md:bottom-6 md:block"
        aria-label="데모 흐름 안내"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-wide text-[#0F766E]">
              DEMO · {step}/8
            </p>
            <p className="mt-0.5 text-[13px] font-semibold text-[#0F172A]">
              {current.label}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="rounded px-1.5 py-0.5 text-[11px] font-medium text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#475569]"
          >
            닫기
          </button>
        </div>
        <div className="mt-2 space-y-1 text-[11px] text-[#64748B]">
          {current.prev ? (
            <p>
              이전:{" "}
              <Link
                href={current.prev.href}
                className="font-semibold text-[#0369A1] hover:underline"
              >
                {current.prev.label}
              </Link>
            </p>
          ) : (
            <p>이전: —</p>
          )}
          {current.next ? (
            <p>
              다음:{" "}
              <Link
                href={current.next.href}
                className="font-semibold text-[#0F766E] hover:underline"
              >
                {current.next.label}
              </Link>
            </p>
          ) : (
            <p>다음: 데모 종료</p>
          )}
        </div>
      </aside>

      <aside
        className="pointer-events-auto fixed inset-x-0 bottom-[3.75rem] z-30 border-t border-[#99F6E4] bg-white/95 px-3 py-2 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
        aria-label="데모 흐름 안내"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#0F766E]">
              DEMO {step}/8 · {current.label}
            </p>
            <p className="truncate text-[11px] text-[#64748B]">
              {current.next ? (
                <>
                  다음{" "}
                  <Link
                    href={current.next.href}
                    className="font-semibold text-[#0F766E]"
                  >
                    {current.next.label}
                  </Link>
                </>
              ) : (
                "데모 종료"
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-lg border border-[#E2E8F0] px-2 py-1 text-[11px] font-semibold text-[#475569]"
          >
            닫기
          </button>
        </div>
      </aside>
    </>
  );
}
