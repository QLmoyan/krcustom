import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import { mockServices } from "@/data/mockServices";
import { getStoreById } from "@/data/mockStores";
import { formatCount } from "@/lib/format";
import { ko } from "@/messages";

type StorePageProps = {
  params: Promise<{ id: string }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params;
  const store = getStoreById(id);

  if (!store) {
    return (
      <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
        <Header />
        <Container className="py-16 text-center">
          <h1 className="text-[20px] font-semibold text-[#0F172A]">
            상점을 찾을 수 없습니다
          </h1>
          <div className="mt-6 flex justify-center">
            <Button href="/" variant="primary">
              홈으로
            </Button>
          </div>
        </Container>
        <MobileBottomNav />
      </div>
    );
  }

  const services = mockServices.filter((service) => service.storeId === id);

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <Container className="py-6 md:py-8">
        <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F1F5F9]">
            <Image
              src={store.logo}
              alt={`${store.name} 로고`}
              fill
              sizes="64px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0F172A]">
                {store.name}
              </h1>
              {store.verified ? (
                <Badge tone="success">{ko.store.verified}</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-[13px] text-[#64748B]">
              ★ {store.rating.toFixed(1)} · {formatCount(store.reviewCount)}{" "}
              {ko.store.reviews}
            </p>
            <p className="mt-1 text-[13px] text-[#64748B]">
              {ko.store.response} {store.responseTime}
            </p>
            {id === DEMO.storeId ? (
              <Link
                href={`/project/${DEMO.projectId}`}
                className="mt-3 inline-flex text-[13px] font-semibold text-[#0F766E] hover:underline"
              >
                데모 상담으로 이동
              </Link>
            ) : null}
          </div>
        </div>

        <h2 className="mt-8 mb-4 text-[18px] font-semibold text-[#0F172A]">
          이 상점의 서비스
        </h2>
        {services.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#64748B]">등록된 서비스가 없습니다.</p>
        )}
      </Container>
      <MobileBottomNav />
    </div>
  );
}
