import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import { mockServices } from "@/data/mockServices";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const services = query
    ? mockServices.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.storeName.toLowerCase().includes(query) ||
          service.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    : mockServices;

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <Container className="py-6 md:py-8">
        <h1 className="text-[20px] font-bold text-[#0F172A]">검색</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">
          {query ? `"${q}" 검색 결과` : "전체 서비스"}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {(services.length > 0 ? services : mockServices.filter((s) => s.id === DEMO.serviceId)).map(
            (service) => (
              <ServiceCard key={service.id} service={service} />
            ),
          )}
        </div>
      </Container>
      <MobileBottomNav />
    </div>
  );
}
