import type { StatusCategory, StatusDomain } from "@/constants/status";
import {
  getStatusCategory,
  getStatusDefinition,
  getStatusLabel,
} from "@/constants/status";

export type StatusBadgeTone = StatusCategory;

type StatusBadgeSize = "sm" | "md";

type StatusBadgeByKeyProps = {
  domain: StatusDomain;
  status: string;
  size?: StatusBadgeSize;
  className?: string;
};

type StatusBadgeExplicitProps = {
  label: string;
  tone: StatusBadgeTone;
  size?: StatusBadgeSize;
  className?: string;
  /** Screen-reader / title hint; Korean preferred. */
  description?: string;
};

export type StatusBadgeProps = StatusBadgeByKeyProps | StatusBadgeExplicitProps;

const toneClass: Record<StatusBadgeTone, string> = {
  neutral: "bg-[#F1F5F9] text-[#475569] ring-[#E2E8F0]",
  info: "bg-[#F0F9FF] text-[#0369A1] ring-[#BAE6FD]",
  success: "bg-[#F0FDF4] text-[#15803D] ring-[#BBF7D0]",
  warning: "bg-[#FEFCE8] text-[#A16207] ring-[#FDE68A]",
  danger: "bg-[#FEF2F2] text-[#DC2626] ring-[#FECACA]",
};

const sizeClass: Record<StatusBadgeSize, string> = {
  sm: "h-[20px] px-1.5 text-[11px]",
  md: "h-[22px] px-2 text-[12px]",
};

function isByKeyProps(props: StatusBadgeProps): props is StatusBadgeByKeyProps {
  return "domain" in props && "status" in props;
}

/**
 * Unified status chip. Always renders Korean (or provided) text —
 * color is never the only cue.
 */
export function StatusBadge(props: StatusBadgeProps) {
  const size = props.size ?? "md";
  let label: string;
  let tone: StatusBadgeTone;
  let description: string | undefined;

  if (isByKeyProps(props)) {
    const meta = getStatusDefinition(props.domain, props.status);
    label = getStatusLabel(props.domain, props.status);
    tone = getStatusCategory(props.domain, props.status);
    description = meta?.description;
  } else {
    label = props.label;
    tone = props.tone;
    description = props.description;
  }

  return (
    <span
      role="status"
      title={description}
      aria-label={description ? `${label}. ${description}` : label}
      className={[
        "inline-flex items-center whitespace-nowrap rounded-md font-medium ring-1 ring-inset",
        sizeClass[size],
        toneClass[tone],
        props.className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}

export function inferStatusToneFromKoreanLabel(label: string): StatusBadgeTone {
  if (
    label.includes("분쟁") ||
    label.includes("환불") ||
    label.includes("불가") ||
    label.includes("거절") ||
    label.includes("불일치")
  ) {
    return "danger";
  }
  if (
    label.includes("대기") ||
    label.includes("요청") ||
    label.includes("지연") ||
    label.includes("수정")
  ) {
    return "warning";
  }
  if (
    label.includes("완료") ||
    label.includes("확정") ||
    label.includes("수락") ||
    label.includes("확인")
  ) {
    return "success";
  }
  if (
    label.includes("중") ||
    label.includes("발송") ||
    label.includes("제작") ||
    label.includes("검수") ||
    label.includes("배송")
  ) {
    return "info";
  }
  return "neutral";
}
