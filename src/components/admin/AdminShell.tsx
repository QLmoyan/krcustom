import Link from "next/link";
import type { ReactNode } from "react";
import { ko } from "@/messages";

const NAV = [
  { href: "/admin", label: ko.admin.nav.dashboard },
  { href: "/admin/users", label: ko.admin.nav.users },
  { href: "/admin/sellers", label: ko.admin.nav.sellers },
  { href: "/admin/projects", label: ko.admin.nav.projects },
  { href: "/admin/announcements", label: ko.admin.nav.announcements },
] as const;

type AdminLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AdminShell({ title, subtitle, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div>
            <p className="text-[12px] font-medium text-[#0F766E]">
              {ko.admin.workspace}
            </p>
            <h1 className="text-[18px] font-bold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-0.5 break-keep text-[13px] text-[#64748B]">
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center rounded-lg border border-[#CBD5E1] bg-white px-3 text-[13px] font-semibold hover:bg-[#F8FAFC]"
            >
              {ko.admin.backHome}
            </Link>
            <Link
              href="/seller"
              className="inline-flex h-9 items-center rounded-lg bg-[#0F766E] px-3 text-[13px] font-semibold text-white hover:bg-[#0D5F59]"
            >
              {ko.admin.openSeller}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-4 md:flex-row md:px-6 md:py-5">
        <nav className="w-full shrink-0 md:w-48">
          <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 flex-1 space-y-4">{children}</main>
      </div>
    </div>
  );
}
