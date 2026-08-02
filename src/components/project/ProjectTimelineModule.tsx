import { ko } from "@/messages";
import type { ProjectTimelineEvent } from "@/types/Project";
import type { TimelineEventStatus } from "@/types/TimelineEvent";

type ProjectTimelineModuleProps = {
  events: ProjectTimelineEvent[];
  /** Customer view uses fixed Korean progress steps; default keeps raw event titles. */
  variant?: "customer" | "default";
};

const CUSTOMER_STEP_KEYS = [
  "consultStarted",
  "quoteArrived",
  "quoteApproved",
  "designArrived",
  "designApproved",
  "productionStarted",
  "shipping",
  "completed",
] as const;

/** Map common event titles / keywords onto the customer progress step index. */
function matchCustomerStepIndex(title: string): number {
  const t = title.toLowerCase();
  if (/완료|completed|complete/.test(t) && /제작|배송|반송|deliver/.test(t)) {
    return 7;
  }
  if (/완료|completed/.test(t) && !/견적|시안|디자인|결제|발송|수령/.test(t)) {
    return 7;
  }
  if (/배송|shipping|ship|반송|deliver/.test(t)) return 6;
  if (/제작 시작|제작 중|production|in_production/.test(t)) return 5;
  if (/디자인 승인|시안 확정|시안 확인|design.*approv|proof.*confirm/.test(t)) {
    return 4;
  }
  if (/디자인 도착|시안|design|proof/.test(t)) return 3;
  if (/견적 승인|견적 확정|견적 수락|quote.*accept/.test(t)) return 2;
  if (/견적 도착|견적|quote/.test(t)) return 1;
  if (/상담|문의|요구사항|시작|created|consult/.test(t)) return 0;
  if (/결제|paid|payment/.test(t)) return 2;
  if (/발송|수령|shipped|received/.test(t)) return 6;
  return -1;
}

function buildCustomerSteps(events: ProjectTimelineEvent[]): Array<{
  id: string;
  title: string;
  description: string;
  status: TimelineEventStatus;
  occurredAt: string;
}> {
  const steps = CUSTOMER_STEP_KEYS.map((key, index) => ({
    id: `customer-tl-${index}`,
    title: ko.project.customerTimelineSteps[key],
    description: "",
    status: "UPCOMING" as TimelineEventStatus,
    occurredAt: "",
  }));

  let highestCompleted = -1;
  let currentIndex = -1;

  for (const event of events) {
    const index = matchCustomerStepIndex(event.title);
    if (index < 0) continue;
    if (event.status === "COMPLETED") {
      highestCompleted = Math.max(highestCompleted, index);
      if (event.occurredAt && !steps[index].occurredAt) {
        steps[index].occurredAt = event.occurredAt;
      }
      if (event.description) {
        steps[index].description = event.description;
      }
    } else if (event.status === "CURRENT") {
      currentIndex = Math.max(currentIndex, index);
      if (event.occurredAt) steps[index].occurredAt = event.occurredAt;
      if (event.description) steps[index].description = event.description;
    }
  }

  if (currentIndex < 0 && highestCompleted >= 0 && highestCompleted < steps.length - 1) {
    currentIndex = highestCompleted + 1;
  }
  if (currentIndex < 0 && events.length > 0) {
    currentIndex = 0;
  }

  return steps.map((step, index) => {
    if (index <= highestCompleted) {
      return { ...step, status: "COMPLETED" as const };
    }
    if (index === currentIndex) {
      return { ...step, status: "CURRENT" as const };
    }
    return step;
  });
}

export function ProjectTimelineModule({
  events,
  variant = "default",
}: ProjectTimelineModuleProps) {
  const displayEvents =
    variant === "customer" ? buildCustomerSteps(events) : events;
  const title =
    variant === "customer"
      ? ko.project.progressTitle
      : ko.project.timelineModule;

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
      <ol className="relative mt-4 space-y-0">
        {displayEvents.map((event, index) => {
          const isLast = index === displayEvents.length - 1;
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
                        ? "border-[#CA8A04] bg-[#FEFCE8]"
                        : "border-[#CBD5E1] bg-white",
                ].join(" ")}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3
                    className={[
                      "text-[13px] font-semibold",
                      event.status === "UPCOMING"
                        ? "text-[#94A3B8]"
                        : "text-[#0F172A]",
                    ].join(" ")}
                  >
                    {event.title}
                  </h3>
                  {event.occurredAt ? (
                    <time className="text-[11px] tabular-nums text-[#94A3B8]">
                      {event.occurredAt}
                    </time>
                  ) : null}
                </div>
                {event.description ? (
                  <p
                    className={[
                      "mt-0.5 break-keep text-[12px] leading-relaxed",
                      event.status === "UPCOMING"
                        ? "text-[#CBD5E1]"
                        : "text-[#64748B]",
                    ].join(" ")}
                  >
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
