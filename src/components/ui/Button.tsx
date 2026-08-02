import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0F766E] text-white hover:bg-[#0D5F59] focus-visible:ring-[#0F766E]/30",
  secondary:
    "bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE] focus-visible:ring-[#0369A1]/25",
  outline:
    "border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F8FAFC] focus-visible:ring-[#0F766E]/20",
  ghost:
    "bg-transparent text-[#0F766E] hover:bg-[#F0FDFA] focus-visible:ring-[#0F766E]/20",
  danger:
    "bg-[#DC2626] text-white hover:bg-[#B91C1C] focus-visible:ring-[#DC2626]/30",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-[15px]",
  lg: "h-12 px-5 text-[15px]",
};

function buildClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className: string,
) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-4",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClass[variant],
    sizeClass[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  href,
  ...props
}: ButtonProps) {
  const classes = buildClassName(variant, size, fullWidth, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
