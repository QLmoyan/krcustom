import type { ReactNode } from "react";
import { AdminAccessBanner } from "@/components/admin/AdminAccessBanner";
import { getCurrentUser } from "@/lib/providers/authProvider";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 md:px-6">
        <div className="mx-auto max-w-[1200px]">
          <AdminAccessBanner
            signedIn={Boolean(user)}
            role={user?.profile.role ?? null}
          />
        </div>
      </div>
      {children}
    </>
  );
}
