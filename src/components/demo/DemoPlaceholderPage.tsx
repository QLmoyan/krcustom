import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";

type DemoPlaceholderPageProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function DemoPlaceholderPage({
  title,
  description,
  primaryHref = `/service/${DEMO.serviceId}`,
  primaryLabel = "서비스 데모로 이동",
}: DemoPlaceholderPageProps) {
  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <Container className="py-16 text-center">
        <p className="text-[11px] font-bold tracking-wide text-[#0F766E]">
          DEMO · 준비 중
        </p>
        <h1 className="mt-2 text-[20px] font-bold text-[#0F172A]">{title}</h1>
        <p className="mx-auto mt-3 max-w-md break-keep text-[14px] leading-relaxed text-[#64748B]">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button href={primaryHref} variant="primary">
            {primaryLabel}
          </Button>
          <Link
            href="/"
            className="inline-flex h-10 items-center px-3 text-[13px] font-semibold text-[#0369A1] hover:underline"
          >
            홈으로
          </Link>
        </div>
      </Container>
      <MobileBottomNav />
    </div>
  );
}
