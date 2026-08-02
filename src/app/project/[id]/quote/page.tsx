import Link from "next/link";
import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getProjectById } from "@/lib/providers/projectProvider";
import {
  getLatestQuote,
  getQuotesByProjectId,
} from "@/lib/providers/quoteProvider";
import { ko } from "@/messages";
import type { Quote } from "@/types/Quote";

type QuoteBuilderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuoteBuilderPage({
  params,
}: QuoteBuilderPageProps) {
  const { id } = await params;
  const { project } = await getProjectById(id);
  const { quotes } = await getQuotesByProjectId(id);
  const { quote: latest } = await getLatestQuote(id);

  const builderQuote: Quote | undefined =
    latest ??
    (quotes.length > 0
      ? quotes[0]
      : undefined);

  if (!project || !builderQuote) {
    return (
      <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
        <Header />
        <Container className="py-16 text-center">
          <h1 className="text-[20px] font-semibold text-[#0F172A]">
            {ko.project.notFound}
          </h1>
          <div className="mt-6 flex justify-center">
            <Button href="/" variant="primary">
              {ko.project.backHome}
            </Button>
          </div>
        </Container>
        <MobileBottomNav />
      </div>
    );
  }

  // Builder always edits a new draft version slot based on latest snapshot
  // without overwriting historical versions in mock data.
  const draftSeed: Quote = {
    ...builderQuote,
    id: `${builderQuote.id}-draft-edit`,
    version: Math.max(...quotes.map((q) => q.version), 0) + 1,
    status: "DRAFT",
    customerConfirmed: false,
    approvedBy: "",
    approvedAt: "",
    sentAt: "",
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-4 md:py-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[12px] font-medium text-[#0F766E]">
                {ko.quote.builderTitle}
              </p>
              <h1 className="mt-1 text-[20px] font-bold text-[#0F172A] md:text-[22px]">
                {project.status.title}
              </h1>
              <p className="mt-1 text-[13px] text-[#64748B]">
                {ko.quote.builderSubtitle}
              </p>
            </div>
            <Link
              href={`/project/${id}`}
              className="text-[13px] font-medium text-[#0369A1] hover:underline"
            >
              {ko.project.workspace}
            </Link>
          </div>

          <QuoteBuilder
            projectId={id}
            initialQuote={draftSeed}
            baseQuoteId={builderQuote.id}
            previousQuote={
              quotes.find((q) => q.version === builderQuote.version - 1) ?? null
            }
          />
        </Container>
      </main>
      {id === "prj-001" ? <DemoFlowHint step={3} /> : null}
      <MobileBottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [{ id: "prj-001" }];
}
