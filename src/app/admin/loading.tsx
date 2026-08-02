import { Container } from "@/components/ui/Container";
import { ko } from "@/messages";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="h-16 border-b border-[#E2E8F0] bg-white" />
      <Container className="py-6">
        <p className="sr-only">{ko.system.loading}</p>
        <div className="space-y-3" aria-hidden>
          <div className="h-6 w-40 animate-pulse rounded bg-[#E2E8F0]" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="h-24 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="h-24 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="h-24 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="h-24 animate-pulse rounded-xl bg-[#E2E8F0]" />
          </div>
        </div>
      </Container>
    </div>
  );
}
