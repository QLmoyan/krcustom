import type { ReactNode } from "react";
import { ko } from "@/messages";

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title = ko.system.emptyTitle,
  description = ko.system.emptyDescription,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-white px-6 py-12 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-[15px] font-semibold text-[#0F172A]">{title}</p>
      <p className="mt-2 max-w-sm break-keep text-[13px] leading-relaxed text-[#64748B]">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
