import { ko } from "@/messages";
import type { TimelineEvent } from "@/types/TimelineEvent";

const copy = ko.order;

type OrderTimelineProps = {
  events: TimelineEvent[];
  /** Customer shows progress language; seller keeps operational titles. */
  variant?: "customer" | "seller";
};

export function OrderTimeline({
  events,
  variant = "seller",
}: OrderTimelineProps) {
  if (events.length === 0) return null;

  const title =
    variant === "customer" ? copy.progressTitle : copy.timeline;

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-[15px] font-semibold text-[#0F172A]">{title}</h3>
      <ol className="mt-3 space-y-0">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const displayTitle =
            variant === "customer"
              ? customerizeOrderTitle(event.title)
              : event.title;
          return (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-px bg-[#E2E8F0]"
                  aria-hidden
                />
              ) : null}
              <span
                className={[
                  "relative z-[1] mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2",
                  event.status === "COMPLETED"
                    ? "border-[#15803D] bg-[#15803D]"
                    : event.status === "CURRENT"
                      ? "border-[#0F766E] bg-white ring-2 ring-[#99F6E4]"
                      : event.status === "ERROR"
                        ? "border-[#DC2626] bg-[#FEF2F2]"
                        : "border-[#CBD5E1] bg-white",
                ].join(" ")}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-[13px] font-semibold text-[#0F172A]">
                    {displayTitle}
                  </h4>
                  {event.occurredAt ? (
                    <time className="text-[11px] text-[#94A3B8]">
                      {event.occurredAt}
                    </time>
                  ) : null}
                </div>
                {event.description &&
                !/status changed|workflow|project updated/i.test(
                  event.description,
                ) ? (
                  <p className="mt-0.5 break-keep text-[12px] text-[#64748B]">
                    {event.description}
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

function customerizeOrderTitle(title: string): string {
  const t = title.toLowerCase();
  if (/상태 변경|status changed|workflow|project updated|updated/.test(t)) {
    if (/완료|completed/.test(t)) return ko.project.customerTimelineSteps.completed;
    if (/배송|ship/.test(t)) return ko.project.customerTimelineSteps.shipping;
    if (/제작|production/.test(t))
      return ko.project.customerTimelineSteps.productionStarted;
    if (/결제|paid|order/.test(t))
      return ko.project.customerTimelineSteps.quoteApproved;
  }
  if (/결제|paid|payment/.test(t)) return "결제 완료";
  if (/제작 시작|제작 중|production/.test(t))
    return ko.project.customerTimelineSteps.productionStarted;
  if (/배송|ship|반송|deliver/.test(t))
    return ko.project.customerTimelineSteps.shipping;
  if (/완료|complete|delivered/.test(t))
    return ko.project.customerTimelineSteps.completed;
  if (/주문 생성|created|상담/.test(t))
    return ko.project.customerTimelineSteps.consultStarted;
  return title;
}
