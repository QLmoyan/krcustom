"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ko } from "@/messages";

export const sellerNavItems = [
  { href: "/seller", label: ko.seller.nav.dashboard, icon: "▣" },
  { href: "/seller/services", label: ko.seller.nav.services, icon: "☰" },
  { href: "/seller/orders", label: ko.seller.nav.orders, icon: "▢" },
  { href: "/seller/messages", label: ko.seller.nav.messages, icon: "✉" },
  { href: "/seller/quotes", label: ko.seller.nav.quotes, icon: "₩" },
  { href: "/seller/design-proofs", label: ko.seller.nav.designProofs, icon: "▣" },
  { href: "/seller/customer-items", label: ko.seller.nav.customerItems, icon: "◎" },
  { href: "/seller/production", label: ko.seller.nav.production, icon: "⚙" },
  { href: "/seller/shipments", label: ko.seller.nav.shipments, icon: "⇢" },
  { href: "/seller/reviews", label: ko.seller.nav.reviews, icon: "★" },
  { href: "/seller/settings", label: ko.seller.nav.settings, icon: "◍" },
] as const;

type SellerSidebarProps = {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

export function SellerSidebar({
  collapsed = false,
  mobileOpen = false,
  onNavigate,
}: SellerSidebarProps) {
  const pathname = usePathname();

  const nav = (
    <nav aria-label={ko.seller.workspace} className="flex flex-col gap-0.5 p-3">
      {sellerNavItems.map((item) => {
        const active =
          item.href === "/seller"
            ? pathname === "/seller"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={[
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition",
              active
                ? "bg-[#F0FDFA] text-[#0F766E]"
                : "text-[#334155] hover:bg-[#F8FAFC]",
              collapsed ? "justify-center px-2" : "",
            ].join(" ")}
            title={item.label}
          >
            <span className="w-4 shrink-0 text-center text-[13px]" aria-hidden>
              {item.icon}
            </span>
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside
        className={[
          "hidden h-screen w-60 shrink-0 flex-col border-r border-[#E2E8F0] bg-white lg:flex",
          "sticky top-0",
          collapsed ? "w-16" : "w-60",
        ].join(" ")}
        data-collapsed={collapsed ? "true" : "false"}
      >
        <div className="flex h-14 items-center border-b border-[#E2E8F0] px-4">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-[#0F766E]">
              {ko.brand.name}
            </p>
            {!collapsed ? (
              <p className="truncate text-[11px] text-[#64748B]">
                {ko.seller.workspace}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">{nav}</div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(15,23,42,0.45)]"
            aria-label={ko.seller.closeMenu}
            onClick={onNavigate}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
            <div className="flex h-14 items-center justify-between border-b border-[#E2E8F0] px-4">
              <div>
                <p className="text-[14px] font-bold text-[#0F766E]">
                  {ko.brand.name}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {ko.seller.workspace}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-[13px] text-[#64748B]"
                onClick={onNavigate}
              >
                {ko.seller.closeMenu}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
