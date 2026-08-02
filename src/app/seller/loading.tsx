import { Container } from "@/components/ui/Container";
import { ko } from "@/messages";

export default function SellerLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="h-14 border-b border-[#E2E8F0] bg-white" />
      <Container className="py-6">
        <p className="sr-only">{ko.system.loading}</p>
        <div className="space-y-4" aria-hidden>
          <div className="h-7 w-52 animate-pulse rounded bg-[#E2E8F0]" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="h-28 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="h-28 animate-pulse rounded-xl bg-[#E2E8F0]" />
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-[#E2E8F0]" />
        </div>
      </Container>
    </div>
  );
}
