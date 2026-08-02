"use client";

import Link from "next/link";
import { useState } from "react";
import { HeaderAuthNav } from "@/components/layout/HeaderAuthNav";
import { Container } from "@/components/ui/Container";
import { ko } from "@/messages";

const categoryLinks = [
  { href: "/category/apparel", label: "의류 인쇄" },
  { href: "/category/goods", label: "굿즈 제작" },
  { href: "/category/acrylic", label: "아크릴 제작" },
  { href: "/category/signage", label: "간판 및 조명" },
  { href: "/category/print", label: "인쇄 및 포장" },
  { href: "/category/business", label: "기업 주문" },
  { href: "/category/event", label: "행사 용품" },
  { href: "/category/owned-item", label: "고객 소지품 커스텀" },
] as const;

const popularKeywords = [
  "티셔츠",
  "머그컵",
  "아크릴",
  "간판",
  "스티커",
  "기업 판촉물",
] as const;

type HeaderProps = {
  showPopularSearches?: boolean;
};

export function Header({ showPopularSearches = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white">
      <Container className="flex h-14 items-center gap-3 md:h-16 md:gap-5">
        <Link href="/" className="shrink-0" aria-label={ko.a11y.logo}>
          <span className="block text-[15px] font-bold leading-tight text-[#0F766E] md:text-base">
            {ko.brand.name}
          </span>
          <span className="block text-[11px] font-medium text-[#64748B]">
            {ko.brand.nameEn}
          </span>
        </Link>

        <form
          action="/search"
          method="get"
          className="hidden min-w-0 flex-1 md:flex"
          role="search"
        >
          <label htmlFor="header-search" className="sr-only">
            {ko.a11y.search}
          </label>
          <div className="flex w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-[#E2E8F0] focus-within:border-[#0F766E] focus-within:ring-4 focus-within:ring-[#0F766E]/15">
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder={ko.home.searchPlaceholder}
              className="h-10 min-w-0 flex-1 bg-white px-3 text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
            />
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap bg-[#0F766E] px-4 text-[14px] font-semibold text-white hover:bg-[#0D5F59] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0F766E]/30"
            >
              {ko.home.searchButton}
            </button>
          </div>
        </form>

        <nav className="ml-auto hidden shrink-0 items-center gap-1 lg:flex">
          <div className="relative group">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-[15px] font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
            >
              {ko.nav.categories}
            </button>
            <div className="invisible absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-[#E2E8F0] bg-white p-2 opacity-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {categoryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-[14px] text-[#0F172A] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/custom-request/new"
            className="rounded-lg px-3 py-2 text-[15px] font-semibold text-[#0F766E] hover:bg-[#F0FDFA]"
          >
            {ko.nav.customRequest}
          </Link>
          <Link
            href="/project/prj-001"
            className="rounded-lg px-3 py-2 text-[15px] font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            {ko.nav.messages}
          </Link>
          <Link
            href="/orders"
            className="rounded-lg px-3 py-2 text-[15px] font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            {ko.nav.orders}
          </Link>
          <div className="ml-1 flex items-center gap-1.5">
            <HeaderAuthNav />
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0 lg:hidden">
          <Link
            href="/custom-request/new"
            className="rounded-lg bg-[#F0FDFA] px-3 py-2 text-[13px] font-semibold text-[#0F766E]"
          >
            {ko.nav.customRequest}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A]"
            aria-expanded={menuOpen}
            aria-label={ko.a11y.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{ko.a11y.openMenu}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </Container>

      {showPopularSearches ? (
        <div className="border-t border-[#E2E8F0] bg-white">
          <Container className="flex flex-wrap items-center gap-x-2 gap-y-1.5 py-2">
            <span className="shrink-0 text-[12px] font-semibold text-[#0F766E]">
              {ko.home.popularSearches}
            </span>
            {popularKeywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="rounded-md bg-[#F8FAFC] px-2 py-0.5 text-[12px] text-[#475569] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
              >
                {keyword}
              </Link>
            ))}
          </Container>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="border-t border-[#E2E8F0] bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <form action="/search" method="get" className="mb-2 md:hidden">
              <label htmlFor="mobile-header-search" className="sr-only">
                {ko.a11y.search}
              </label>
              <div className="flex overflow-hidden rounded-lg border border-[#E2E8F0] focus-within:border-[#0F766E] focus-within:ring-4 focus-within:ring-[#0F766E]/15">
                <input
                  id="mobile-header-search"
                  name="q"
                  type="search"
                  placeholder={ko.home.searchPlaceholder}
                  className="h-11 min-w-0 flex-1 px-3 text-[15px] outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center whitespace-nowrap bg-[#0F766E] px-3 text-[13px] font-semibold text-white"
                >
                  {ko.home.searchButton}
                </button>
              </div>
            </form>
            <p className="px-1 pb-1 text-[12px] font-medium text-[#64748B]">
              {ko.nav.categories}
            </p>
            {categoryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-[15px] text-[#0F172A] hover:bg-[#F8FAFC]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/project/prj-001"
              className="rounded-lg px-3 py-2.5 text-[15px] text-[#0F172A] hover:bg-[#F8FAFC]"
              onClick={() => setMenuOpen(false)}
            >
              {ko.nav.messages}
            </Link>
            <Link
              href="/orders"
              className="rounded-lg px-3 py-2.5 text-[15px] text-[#0F172A] hover:bg-[#F8FAFC]"
              onClick={() => setMenuOpen(false)}
            >
              {ko.nav.orders}
            </Link>
            <HeaderAuthNav
              compact
              onNavigate={() => setMenuOpen(false)}
            />
          </Container>
        </div>
      ) : null}
    </header>
  );
}
