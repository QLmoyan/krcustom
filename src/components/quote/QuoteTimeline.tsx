import { ko } from "@/messages";
import type { QuoteTimelineStep } from "@/types/Quote";

type QuoteTimelineProps = {
  steps: QuoteTimelineStep[];
};

export function QuoteTimeline({ steps }: QuoteTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">
        {ko.project.quoteTimeline}
      </h2>
      <ol className="mt-3 space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-px bg-[#E2E8F0]"
                  aria-hidden
                />
              ) : null}
              <span
                className={[
                  "relative z-[1] mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2",
                  step.status === "COMPLETED"
                    ? "border-[#15803D] bg-[#15803D]"
                    : step.status === "CURRENT"
                      ? "border-[#0F766E] bg-white ring-2 ring-[#99F6E4]"
                      : "border-[#CBD5E1] bg-white",
                ].join(" ")}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-semibold text-[#0F172A]">
                    {step.title}
                  </h3>
                  {step.occurredAt ? (
                    <time className="text-[11px] tabular-nums text-[#94A3B8]">
                      {step.occurredAt}
                    </time>
                  ) : null}
                </div>
                <p className="mt-0.5 break-keep text-[12px] leading-relaxed text-[#64748B]">
                  {step.description}
                </p>
                {!isLast ? (
                  <p className="mt-1 text-[11px] text-[#CBD5E1]" aria-hidden>
                    ↓
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
