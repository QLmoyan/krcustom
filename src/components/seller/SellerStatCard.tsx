import Link from "next/link";
import type { SellerDashboardStat } from "@/data/mockSellerDashboard";

const toneClass: Record<SellerDashboardStat["tone"], string> = {
  brand: "border-[#99F6E4] bg-[#F0FDFA]",
  accent: "border-[#BAE6FD] bg-[#F0F9FF]",
  warning: "border-[#FDE68A] bg-[#FEFCE8]",
  success: "border-[#BBF7D0] bg-[#F0FDF4]",
  neutral: "border-[#E2E8F0] bg-white",
};

const countClass: Record<SellerDashboardStat["tone"], string> = {
  brand: "text-[#0F766E]",
  accent: "text-[#0369A1]",
  warning: "text-[#A16207]",
  success: "text-[#15803D]",
  neutral: "text-[#0F172A]",
};

type SellerStatCardProps = {
  stat: SellerDashboardStat;
};

export function SellerStatCard({ stat }: SellerStatCardProps) {
  return (
    <Link
      href={stat.href}
      className={[
        "block rounded-xl border p-3.5 transition hover:shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
        toneClass[stat.tone],
      ].join(" ")}
    >
      <p className="text-[12px] font-medium text-[#64748B]">{stat.title}</p>
      <p
        className={[
          "mt-1 text-[26px] font-bold tabular-nums leading-none",
          countClass[stat.tone],
        ].join(" ")}
      >
        {stat.count}
      </p>
      <p className="mt-2 break-keep text-[12px] leading-snug text-[#64748B]">
        {stat.description}
      </p>
    </Link>
  );
}
