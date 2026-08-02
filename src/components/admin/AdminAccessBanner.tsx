import { ko } from "@/messages";
import type { UserRole } from "@/types/Role";

type AdminAccessBannerProps = {
  role: UserRole | null;
  signedIn: boolean;
};

export function AdminAccessBanner({ role, signedIn }: AdminAccessBannerProps) {
  if (role === "ADMIN") {
    return (
      <p className="rounded-lg border border-[#99F6E4] bg-[#F0FDFA] px-3 py-2 text-[12px] text-[#0F766E]">
        {ko.admin.accessHintAdmin}
      </p>
    );
  }

  if (signedIn) {
    return (
      <p className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[12px] text-[#92400E]">
        {ko.admin.accessHintNonAdmin}
      </p>
    );
  }

  return (
    <p className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[12px] text-[#92400E]">
      {ko.admin.accessHintGuest}
    </p>
  );
}
