import type { ReactNode } from "react";
import Link from "next/link";
import { AdminAccessBanner } from "@/components/admin/AdminAccessBanner";
import { getCurrentUser } from "@/lib/providers/authProvider";
import { ko } from "@/messages";

function isAdminDemoBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.ADMIN_DEMO_BYPASS === "true"
  );
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.profile.role === "ADMIN";
  const demoBypass = isAdminDemoBypassEnabled();
  const allowed = isAdmin || demoBypass;

  if (!allowed) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-16 text-center">
        <h1 className="text-[20px] font-bold text-[#0F172A]">
          {ko.admin.accessDeniedTitle}
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[#64748B]">
          {ko.admin.accessDeniedBody}
        </p>
        {process.env.NODE_ENV === "development" ? (
          <p className="mt-2 text-[12px] text-[#94A3B8]">
            {ko.admin.accessDeniedDevHint}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg bg-[#0F766E] px-4 text-[14px] font-semibold text-white hover:bg-[#0D5F59]"
          >
            {ko.nav.login}
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg border border-[#CBD5E1] bg-white px-4 text-[14px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            {ko.admin.backHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 md:px-6">
        <div className="mx-auto max-w-[1200px]">
          <AdminAccessBanner
            signedIn={Boolean(user)}
            role={user?.profile.role ?? null}
            demoBypass={demoBypass && !isAdmin}
          />
        </div>
      </div>
      {children}
    </>
  );
}
