import type { ReactNode } from "react";

type BadgeTone =
  | "neutral"
  | "brand"
  | "accent"
  | "success"
  | "warning";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-[#F1F5F9] text-[#475569]",
  brand: "bg-[#F0FDFA] text-[#0F766E]",
  accent: "bg-[#F0F9FF] text-[#0369A1]",
  success: "bg-[#F0FDF4] text-[#15803D]",
  warning: "bg-[#FEFCE8] text-[#A16207]",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-[22px] items-center whitespace-nowrap rounded-md px-2 text-[12px] font-medium",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
