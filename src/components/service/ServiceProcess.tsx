import { ko } from "@/messages";

type ProcessFlow = {
  id: string;
  title: string;
  steps: readonly string[];
};

const FLOWS: ProcessFlow[] = [
  {
    id: "standard",
    title: ko.service.processStandardTitle,
    steps: ko.service.processStandardSteps,
  },
  {
    id: "owned",
    title: ko.service.processOwnedTitle,
    steps: ko.service.processOwnedSteps,
  },
];

export function ServiceProcess() {
  return (
    <section>
      <h2 className="text-[17px] font-semibold text-[#0F172A] md:text-[18px]">
        {ko.service.processSection}
      </h2>
      <div className="mt-3 space-y-3">
        {FLOWS.map((flow) => (
          <div
            key={flow.id}
            className="rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3"
          >
            <h3 className="text-[13px] font-semibold text-[#0F766E]">
              {flow.title}
            </h3>
            <ol className="mt-2.5 flex flex-wrap items-center gap-x-1 gap-y-2 md:flex-nowrap md:overflow-x-auto md:pb-0.5">
              {flow.steps.map((step, index) => (
                <li key={step} className="flex items-center gap-1">
                  <span className="inline-flex items-center rounded-md bg-[#F0FDFA] px-2 py-1 text-[12px] font-medium text-[#0F766E] whitespace-nowrap">
                    <span className="mr-1 text-[#94A3B8]">{index + 1}.</span>
                    {step}
                  </span>
                  {index < flow.steps.length - 1 ? (
                    <span
                      className="hidden text-[#CBD5E1] md:inline"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
