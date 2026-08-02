"use client";

import { useState, type ReactNode } from "react";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import { SellerTopbar } from "@/components/seller/SellerTopbar";

type SellerLayoutProps = {
  title: string;
  storeName: string;
  sellerName: string;
  children: ReactNode;
  unreadNotificationCount?: number;
};

export function SellerLayout({
  title,
  storeName,
  sellerName,
  children,
  unreadNotificationCount = 0,
}: SellerLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Reserved for future collapsed desktop sidebar
  const collapsed = false;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex min-h-screen">
        <SellerSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onNavigate={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <SellerTopbar
            title={title}
            storeName={storeName}
            sellerName={sellerName}
            onOpenMenu={() => setMobileOpen(true)}
            unreadNotificationCount={unreadNotificationCount}
          />
          <div className="flex-1 overflow-x-hidden px-4 py-4 md:px-6 md:py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
