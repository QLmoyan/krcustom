"use client";

import Link from "next/link";
import { ko } from "@/messages";

type SellerTopbarProps = {
  title: string;
  storeName: string;
  sellerName: string;
  onOpenMenu?: () => void;
};

export function SellerTopbar({
  title,
  storeName,
  sellerName,
  onOpenMenu,
}: SellerTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A] lg:hidden"
          aria-label={ko.seller.openMenu}
          onClick={onOpenMenu}
        >
          <span aria-hidden>☰</span>
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[16px] font-semibold text-[#0F172A] md:text-[18px]">
            {title}
          </h1>
          <p className="truncate text-[12px] text-[#64748B]">{storeName}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-[12px] font-medium text-[#0F766E] hover:bg-[#F0FDFA] sm:inline-flex"
          >
            {ko.seller.switchToCustomer}
          </Link>
          <button
            type="button"
            disabled
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[14px] text-[#0F172A] disabled:opacity-50"
            aria-label={`${ko.seller.notifications} (준비 중)`}
            title="준비 중"
          >
            <span aria-hidden>◔</span>
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] py-1 pl-1 pr-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#134E4A] text-[11px] font-semibold text-white">
              {sellerName.slice(0, 1)}
            </span>
            <span className="hidden text-[12px] font-medium text-[#0F172A] md:inline">
              {sellerName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-[#E2E8F0] px-3 py-2 lg:hidden">
        <Link
          href="/"
          className="shrink-0 rounded-md bg-[#F0FDFA] px-2.5 py-1 text-[12px] font-medium text-[#0F766E]"
        >
          {ko.seller.switchToCustomer}
        </Link>
      </div>
    </header>
  );
}
