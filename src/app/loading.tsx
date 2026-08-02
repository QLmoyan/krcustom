import { Container } from "@/components/ui/Container";
import { ko } from "@/messages";

export default function Loading() {
  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <div className="h-14 border-b border-[#E2E8F0] bg-white md:h-16" />
      <Container className="py-8 md:py-10">
        <p className="sr-only">{ko.system.loading}</p>
        <div className="space-y-4" aria-hidden>
          <div className="h-7 w-48 animate-pulse rounded-md bg-[#E2E8F0]" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-[#E2E8F0]" />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-40 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="h-40 animate-pulse rounded-xl bg-[#E2E8F0]" />
            <div className="h-40 animate-pulse rounded-xl bg-[#E2E8F0]" />
          </div>
          <div className="h-56 animate-pulse rounded-xl bg-[#E2E8F0]" />
        </div>
      </Container>
    </div>
  );
}
