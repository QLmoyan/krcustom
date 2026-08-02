import Link from "next/link";
import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ServiceCard } from "@/components/service/ServiceCard";
import { StoreCard } from "@/components/store/StoreCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { mockServices } from "@/data/mockServices";
import { mockStores } from "@/data/mockStores";
import { ko } from "@/messages";

const categories = [
  { href: "/category/apparel", label: "의류 인쇄", hint: "티셔츠·후드" },
  { href: "/category/goods", label: "굿즈 제작", hint: "머그·문구" },
  { href: "/category/acrylic", label: "아크릴 제작", hint: "키링·스탠드" },
  { href: "/category/signage", label: "간판 및 조명", hint: "LED·네온" },
  { href: "/category/print", label: "인쇄 및 포장", hint: "스티커·박스" },
  { href: "/category/business", label: "기업 주문", hint: "판촉물" },
  { href: "/category/event", label: "행사 용품", hint: "현수막" },
  {
    href: "/category/owned-item",
    label: "고객 소지품 커스텀",
    hint: "자수·인쇄",
  },
] as const;

const recentCases = [
  {
    id: "case-1",
    title: "동아리 티셔츠",
    requestLabel: "스케치 시안",
    resultLabel: "인쇄 완성",
    requestTone: "from-slate-200 to-slate-300",
    resultTone: "from-teal-100 to-teal-200",
  },
  {
    id: "case-2",
    title: "카페 머그컵",
    requestLabel: "로고 파일",
    resultLabel: "머그 완성",
    requestTone: "from-sky-100 to-sky-200",
    resultTone: "from-amber-100 to-orange-100",
  },
  {
    id: "case-3",
    title: "소지품 자수",
    requestLabel: "옷 사진",
    resultLabel: "자수 완성",
    requestTone: "from-stone-200 to-stone-300",
    resultTone: "from-emerald-100 to-teal-100",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      {/*
        Future layout hook: a desktop right-rail ad region may wrap beside
        `data-layout="page-main"` later. Not rendered in the current MVP.
      */}
      <div data-layout="page-main" className="w-full">
        <Header showPopularSearches />

        <main>
          <section className="border-b border-[#E2E8F0] bg-white">
            <Container className="py-7 md:py-11">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="min-w-0 max-w-2xl">
                  <h1 className="break-keep text-[22px] font-bold leading-tight text-[#0F172A] md:text-[26px]">
                    {ko.home.heroTitle}
                  </h1>
                  <p className="mt-2 break-keep text-[14px] leading-snug text-[#64748B] md:text-[15px]">
                    {ko.home.heroSubtitle}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <Button
                    href="/custom-request/new"
                    variant="primary"
                    size="md"
                    className="w-full whitespace-nowrap sm:w-auto"
                  >
                    {ko.home.ctaButton}
                  </Button>
                  <Button
                    href="/service/svc-001#owned"
                    variant="outline"
                    size="md"
                    className="w-full whitespace-nowrap sm:w-auto"
                  >
                    {ko.home.customOwnedEntry}
                  </Button>
                </div>
              </div>
            </Container>
          </section>

          <section className="py-8 md:py-10">
            <Container>
              <h2 className="text-[18px] font-semibold text-[#0F172A] md:text-[22px]">
                {ko.home.categoriesTitle}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition hover:border-[#99F6E4] hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
                  >
                    <p className="break-keep text-[15px] font-semibold text-[#0F172A]">
                      {category.label}
                    </p>
                    <p className="mt-1 text-[12px] text-[#64748B]">
                      {category.hint}
                    </p>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          <section className="pb-8 md:pb-10">
            <Container>
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-[18px] font-semibold text-[#0F172A] md:text-[22px]">
                  {ko.home.recommendedServices}
                </h2>
                <Link
                  href="/search"
                  className="shrink-0 text-[13px] font-medium text-[#0369A1] hover:underline"
                >
                  {ko.home.viewAll}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {mockServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </Container>
          </section>

          <section className="pb-8 md:pb-10">
            <Container>
              <h2 className="mb-4 text-[18px] font-semibold text-[#0F172A] md:text-[22px]">
                {ko.home.recommendedStores}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 md:gap-4">
                {mockStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            </Container>
          </section>

          <section className="pb-8 md:pb-10">
            <Container>
              <h2 className="mb-4 text-[18px] font-semibold text-[#0F172A] md:text-[22px]">
                {ko.home.recentCases}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
                {recentCases.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                  >
                    <div className="grid grid-cols-2 gap-px bg-[#E2E8F0]">
                      <div
                        className={`flex aspect-square flex-col items-center justify-center bg-gradient-to-br ${item.requestTone} p-3 text-center`}
                      >
                        <span className="text-[11px] font-medium text-[#475569]">
                          {ko.home.caseRequest}
                        </span>
                        <span className="mt-1 text-[13px] font-semibold text-[#0F172A]">
                          {item.requestLabel}
                        </span>
                      </div>
                      <div
                        className={`flex aspect-square flex-col items-center justify-center bg-gradient-to-br ${item.resultTone} p-3 text-center`}
                      >
                        <span className="text-[11px] font-medium text-[#475569]">
                          {ko.home.caseResult}
                        </span>
                        <span className="mt-1 text-[13px] font-semibold text-[#0F172A]">
                          {item.resultLabel}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="text-[14px] font-medium text-[#0F172A]">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-[#64748B]">
                        {ko.home.caseFlow}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </Container>
          </section>

          <section className="pb-10">
            <Container>
              <div className="rounded-xl border border-[#CCFBF1] bg-[#F0FDFA] px-5 py-8 text-center md:px-10">
                <h2 className="break-keep text-[18px] font-bold text-[#0F172A] md:text-[22px]">
                  {ko.home.ctaTitle}
                </h2>
                <p className="mx-auto mt-2 max-w-xl break-keep text-[15px] leading-relaxed text-[#64748B]">
                  {ko.home.ctaDescription}
                </p>
                <div className="mt-5 flex justify-center">
                  <Button href="/custom-request/new" size="lg">
                    {ko.home.ctaButton}
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        </main>
      </div>

      <footer className="border-t border-[#E2E8F0] bg-white py-6">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#94A3B8]">
            <p>© 커스텀코리아 · Alpha Demo</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/service/svc-001"
                className="font-medium text-[#64748B] hover:text-[#0F766E] hover:underline"
              >
                서비스 데모 보기
              </Link>
              <Link
                href="/seller"
                className="font-medium text-[#64748B] hover:text-[#0F766E] hover:underline"
              >
                판매자 데모
              </Link>
            </div>
          </div>
        </Container>
      </footer>

      <DemoFlowHint step={1} />
      <MobileBottomNav />
    </div>
  );
}
