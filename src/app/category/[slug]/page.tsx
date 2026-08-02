import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import { mockServices } from "@/data/mockServices";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const services =
    slug === "all"
      ? mockServices
      : mockServices.filter((service) => service.categorySlug === slug);

  const title =
    services[0]?.category ||
    (slug === "owned-item" ? "고객 소지품 커스텀" : "카테고리");

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <Container className="py-6 md:py-8">
        <p className="text-[12px] font-medium text-[#0F766E]">카테고리</p>
        <h1 className="mt-1 text-[22px] font-bold text-[#0F172A]">{title}</h1>
        <p className="mt-2 break-keep text-[13px] text-[#64748B]">
          데모용 목록입니다. 전체 검색·필터는 준비 중입니다.
        </p>

        {slug === "owned-item" || services.some((s) => s.id === DEMO.serviceId) ? (
          <div className="mt-4">
            <Button href={`/service/${DEMO.serviceId}`} variant="secondary" size="sm">
              데모 서비스 바로가기
            </Button>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {services.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-[14px] text-[#64748B]">해당 카테고리 서비스가 없습니다.</p>
            <Link
              href={`/service/${DEMO.serviceId}`}
              className="mt-3 inline-flex text-[13px] font-semibold text-[#0F766E] hover:underline"
            >
              서비스 데모 보기
            </Link>
          </div>
        ) : null}
      </Container>
      <MobileBottomNav />
    </div>
  );
}
