import Link from "next/link";
import { ko } from "@/messages";

const actions = [
  {
    href: "/seller/services/new",
    label: ko.seller.quick.newService,
    className: "bg-[#0F766E] text-white hover:bg-[#0D5F59]",
  },
  {
    href: "/seller/quotes",
    label: ko.seller.quick.createQuote,
    className: "bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]",
  },
  {
    href: "/seller/design-proofs",
    label: ko.seller.quick.uploadProof,
    className:
      "border border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE]",
  },
  {
    href: "/seller/customer-items",
    label: ko.seller.quick.confirmReceipt,
    className:
      "border border-[#FDE68A] bg-[#FEFCE8] text-[#A16207] hover:bg-[#FEF9C3]",
  },
  {
    href: "/seller/orders",
    label: ko.seller.quick.registerReturn,
    className:
      "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]",
  },
] as const;

export function SellerQuickActions() {
  return (
    <section>
      <h2 className="mb-2.5 text-[15px] font-semibold text-[#0F172A]">
        {ko.seller.quickActions}
      </h2>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            className={[
              "inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-semibold whitespace-nowrap transition",
              action.className,
            ].join(" ")}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
