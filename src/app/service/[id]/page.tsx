import Link from "next/link";
import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CustomerOwnedItemCallout } from "@/components/service/CustomerOwnedItemCallout";
import { ServiceCapabilities } from "@/components/service/ServiceCapabilities";
import { ServiceDetailBlocks } from "@/components/service/ServiceDetailBlocks";
import { ServiceFaq } from "@/components/service/ServiceFaq";
import { ServiceGallery } from "@/components/service/ServiceGallery";
import { ServiceInquirySection } from "@/components/service/ServiceInquirySection";
import { ServicePortfolio } from "@/components/service/ServicePortfolio";
import { ServiceProcess } from "@/components/service/ServiceProcess";
import { ServiceTrustPoints } from "@/components/service/ServiceTrustPoints";
import { StoreInfoCard } from "@/components/store/StoreInfoCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import { getServiceById } from "@/data/mockServices";
import { getStoreById } from "@/data/mockStores";
import { formatCount, formatWon } from "@/lib/format";
import { ko } from "@/messages";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    return (
      <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
        <Header />
        <Container className="py-16 text-center">
          <h1 className="text-[20px] font-semibold text-[#0F172A]">
            {ko.service.notFoundTitle}
          </h1>
          <div className="mt-6 flex justify-center">
            <Button href="/" variant="primary">
              {ko.service.notFoundAction}
            </Button>
          </div>
        </Container>
        <MobileBottomNav />
      </div>
    );
  }

  const store = getStoreById(service.storeId);
  const galleryImages =
    service.galleryImages && service.galleryImages.length > 0
      ? service.galleryImages
      : [service.coverImage];
  const categoryHref = service.categorySlug
    ? `/category/${service.categorySlug}`
    : "/category/all";
  const reviewHighlights = service.reviewSummary?.highlights.slice(0, 2) ?? [];

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-32 md:pb-8">
      <Header />

      <main>
        <Container className="py-3 md:py-5">
          <nav
            aria-label="breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-1.5 text-[12px] text-[#64748B]"
          >
            <Link href="/" className="hover:text-[#0F766E]">
              {ko.service.breadcrumbHome}
            </Link>
            <span aria-hidden>/</span>
            {service.category ? (
              <>
                <Link href={categoryHref} className="hover:text-[#0F766E]">
                  {service.category}
                </Link>
                <span aria-hidden>/</span>
              </>
            ) : null}
            <span className="truncate text-[#0F172A]">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-start lg:gap-6">
            <ServiceGallery title={service.title} images={galleryImages} />

            <div className="min-w-0 space-y-3.5">
              <div>
                <h1 className="break-keep text-[20px] font-bold leading-tight text-[#0F172A] md:text-[24px]">
                  {service.title}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                  <Link
                    href={`/store/${service.storeId}`}
                    className="font-medium text-[#0369A1] hover:underline"
                  >
                    {service.storeName}
                  </Link>
                  <span className="text-[#64748B]">
                    ★ {service.rating.toFixed(1)} ·{" "}
                    {formatCount(service.reviewCount)} {ko.store.reviews}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#F8FAFC] px-3.5 py-3">
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <dt className="text-[11px] text-[#64748B]">
                      {ko.service.minimumPrice}
                    </dt>
                    <dd className="mt-0.5 text-[18px] font-bold tabular-nums text-[#0F172A]">
                      {formatWon(service.minimumPrice)}~
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#64748B]">
                      {ko.service.minQuantity}
                    </dt>
                    <dd className="mt-0.5 text-[14px] font-semibold text-[#0F172A]">
                      {service.minimumOrderQuantity ?? 1}개
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#64748B]">
                      {ko.service.productionDays}
                    </dt>
                    <dd className="mt-0.5 text-[14px] font-semibold text-[#0F172A]">
                      {service.productionDays}
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-[11px] text-[#64748B]">
                      {ko.service.tradeMethods}
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1">
                      {service.supportsQuote ? (
                        <Badge tone="accent">{ko.service.quoteAvailable}</Badge>
                      ) : null}
                      {service.supportsDirectPurchase ? (
                        <Badge tone="brand">
                          {ko.service.directPurchaseAvailable}
                        </Badge>
                      ) : null}
                      {service.supportsCustomerOwnedItem ? (
                        <Badge tone="warning">
                          {ko.service.customerOwnedAvailable}
                        </Badge>
                      ) : null}
                    </dd>
                  </div>
                </dl>
              </div>

              <ServiceCapabilities />

              <ServiceInquirySection service={service} />

              <CustomerOwnedItemCallout
                visible={service.supportsCustomerOwnedItem}
              />

              {store ? <StoreInfoCard store={store} /> : null}
            </div>
          </div>

          <div className="mt-8 space-y-7 md:mt-10 md:space-y-8">
            <ServiceProcess />
            <ServiceTrustPoints />
            <ServiceDetailBlocks blocks={service.detailBlocks ?? []} />
            <ServicePortfolio items={service.portfolioItems ?? []} />

            {service.reviewSummary ? (
              <section>
                <h2 className="text-[17px] font-semibold text-[#0F172A] md:text-[18px]">
                  {ko.service.reviewSection}
                </h2>
                <div className="mt-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                  <div className="flex flex-wrap items-end gap-2">
                    <p className="text-[24px] font-bold tabular-nums text-[#0F172A]">
                      {service.reviewSummary.averageRating.toFixed(1)}
                    </p>
                    <p className="pb-0.5 text-[13px] text-[#64748B]">
                      ★ · {formatCount(service.reviewSummary.totalCount)}{" "}
                      {ko.store.reviews}
                    </p>
                  </div>
                  <p className="mt-1.5 break-keep text-[13px] leading-relaxed text-[#64748B]">
                    {service.reviewSummary.summaryText}
                  </p>

                  <ul className="mt-3 space-y-1">
                    {service.reviewSummary.scoreBreakdown
                      .slice(0, 3)
                      .map((row) => {
                        const max = service.reviewSummary?.totalCount || 1;
                        const width = Math.round((row.count / max) * 100);
                        return (
                          <li
                            key={row.stars}
                            className="flex items-center gap-2 text-[11px] text-[#64748B]"
                          >
                            <span className="w-7 shrink-0">{row.stars}점</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1F5F9]">
                              <div
                                className="h-full rounded-full bg-[#0F766E]"
                                style={{ width: `${width}%` }}
                              />
                            </div>
                            <span className="w-8 shrink-0 text-right tabular-nums">
                              {formatCount(row.count)}
                            </span>
                          </li>
                        );
                      })}
                  </ul>

                  <ul className="mt-3 space-y-2">
                    {reviewHighlights.map((review) => (
                      <li
                        key={review.id}
                        className="rounded-lg bg-[#F8FAFC] px-3 py-2.5"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]">
                          <span className="font-medium text-[#0F172A]">
                            {review.author}
                          </span>
                          <span>★ {review.rating.toFixed(1)}</span>
                          <span>{review.date}</span>
                        </div>
                        <p className="mt-1 break-keep text-[13px] leading-relaxed text-[#0F172A]">
                          {review.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            <ServiceFaq items={service.faqItems ?? []} />
          </div>
        </Container>
      </main>

      {id === DEMO.serviceId ? <DemoFlowHint step={1} /> : null}
      <MobileBottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [{ id: "svc-001" }];
}
