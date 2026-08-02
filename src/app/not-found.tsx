import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ko } from "@/messages";

export default function NotFound() {
  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-[12px] font-semibold tracking-wide text-[#0F766E]">
          404
        </p>
        <h1 className="mt-2 text-[22px] font-bold text-[#0F172A]">
          {ko.system.notFoundTitle}
        </h1>
        <p className="mt-3 max-w-md break-keep text-[14px] leading-relaxed text-[#64748B]">
          {ko.system.notFoundDescription}
        </p>
        <div className="mt-6">
          <Button href="/" variant="primary">
            {ko.system.notFoundAction}
          </Button>
        </div>
        <Link
          href="/search"
          className="mt-4 text-[13px] font-semibold text-[#0369A1] hover:underline"
        >
          {ko.nav.categories}
        </Link>
      </Container>
      <MobileBottomNav />
    </div>
  );
}
