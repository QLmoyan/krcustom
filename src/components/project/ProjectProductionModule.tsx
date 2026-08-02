import { ko } from "@/messages";
import type { ProjectProductionStep } from "@/types/Project";

type ProjectProductionModuleProps = {
  steps: ProjectProductionStep[];
};

export function ProjectProductionModule({
  steps,
}: ProjectProductionModuleProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">
        {ko.project.productionModule}
      </h2>
      <ol className="mt-3 flex flex-wrap items-center gap-1.5 md:flex-nowrap md:overflow-x-auto md:pb-1">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center gap-1.5">
            <span
              className={[
                "inline-flex items-center rounded-md px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap",
                step.status === "done"
                  ? "bg-[#F0FDF4] text-[#15803D]"
                  : step.status === "current"
                    ? "bg-[#F0FDFA] text-[#0F766E] ring-1 ring-[#99F6E4]"
                    : "bg-[#F1F5F9] text-[#94A3B8]",
              ].join(" ")}
            >
              <span className="mr-1 opacity-70">{index + 1}.</span>
              {step.label}
              <span className="sr-only">
                {step.status === "done"
                  ? ko.project.done
                  : step.status === "current"
                    ? ko.project.current
                    : ko.project.upcoming}
              </span>
            </span>
            {index < steps.length - 1 ? (
              <span className="hidden text-[#CBD5E1] md:inline" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
