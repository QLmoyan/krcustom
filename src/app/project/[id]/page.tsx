import Link from "next/link";
import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ProjectChatPanel } from "@/components/project/ProjectChatPanel";
import { ProjectDesignProofModule } from "@/components/project/ProjectDesignProofModule";
import { ProjectLogisticsModule } from "@/components/project/ProjectLogisticsModule";
import { ProjectOrderModule } from "@/components/project/ProjectOrderModule";
import { ProjectOwnedItemModule } from "@/components/project/ProjectOwnedItemModule";
import { ProjectProductionModule } from "@/components/project/ProjectProductionModule";
import { ProjectReferenceImagesModule } from "@/components/project/ProjectReferenceImagesModule";
import { ProjectStatusModule } from "@/components/project/ProjectStatusModule";
import { ProjectTimelineModule } from "@/components/project/ProjectTimelineModule";
import { ProjectRealtimeRefresh } from "@/components/realtime/ProjectRealtimeRefresh";
import { QuoteCard } from "@/components/quote/QuoteCard";
import { QuoteHistoryModule } from "@/components/quote/QuoteHistoryModule";
import { QuoteTimeline } from "@/components/quote/QuoteTimeline";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import { listMessagesByProjectId } from "@/lib/providers/chatProvider";
import {
  getCustomerOwnedItemByProjectId,
  toProjectOwnedItemInfo,
} from "@/lib/providers/customerOwnedItemProvider";
import { getDesignProofsByProjectId } from "@/lib/providers/designProofProvider";
import { getOrderByProjectId } from "@/lib/providers/orderProvider";
import { getProjectById } from "@/lib/providers/projectProvider";
import {
  getQuotesByProjectId,
  getQuoteTimeline,
} from "@/lib/providers/quoteProvider";
import { listProjectImageUrls } from "@/lib/providers/storageProvider";
import { listTimelineEventsByProjectId } from "@/lib/providers/timelineProvider";
import { ko } from "@/messages";

type ProjectWorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { id } = await params;
  const { project, source } = await getProjectById(id);

  if (!project) {
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

  const [
    quotesResult,
    quoteTimeline,
    designProofsResult,
    orderResult,
    ownedItemResult,
    timelineResult,
    chatResult,
    projectImagesResult,
  ] = await Promise.all([
    getQuotesByProjectId(id),
    getQuoteTimeline(id),
    getDesignProofsByProjectId(id),
    getOrderByProjectId(id),
    getCustomerOwnedItemByProjectId(id),
    listTimelineEventsByProjectId(id),
    listMessagesByProjectId(id),
    listProjectImageUrls(id),
  ]);

  const { quotes, source: quoteSource } = quotesResult;
  const latestQuote = quotes[0];
  const { proofs: designProofs, source: designProofSource } =
    designProofsResult;
  const { order, source: orderSource } = orderResult;
  const { item: ownedItemDetail, source: ownedItemSource } = ownedItemResult;
  const { events: timelineEvents, source: timelineSource } = timelineResult;
  const {
    messages: chatMessages,
    conversationId,
    source: chatSource,
  } = chatResult;
  const { urls: referenceImageUrls, source: imagesSource } =
    projectImagesResult;
  const ownedItem = ownedItemDetail
    ? toProjectOwnedItemInfo(ownedItemDetail)
    : project.ownedItem;
  const timeline =
    timelineEvents.length > 0 ? timelineEvents : project.timeline;
  const dataSource =
    source === "supabase" ||
    quoteSource === "supabase" ||
    designProofSource === "supabase" ||
    orderSource === "supabase" ||
    ownedItemSource === "supabase" ||
    timelineSource === "supabase" ||
    chatSource === "supabase" ||
    imagesSource === "storage"
      ? "supabase"
      : "mock";

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <ProjectRealtimeRefresh projectKey={id} />

      <main>
        <Container className="py-4 md:py-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[12px] font-medium text-[#0F766E]">
                {ko.project.workspace}
              </p>
              <h1 className="mt-1 break-keep text-[20px] font-bold text-[#0F172A] md:text-[22px]">
                {project.status.title}
              </h1>
              <p className="mt-1 text-[13px] text-[#64748B]">
                {project.status.projectNumber} · {project.status.storeName}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/service/${DEMO.serviceId}`}
                className="text-[13px] font-semibold text-[#0F766E] hover:underline"
              >
                {ko.project.backToService}
              </Link>
              <Link
                href={`/project/${id}/quote`}
                className="text-[13px] font-semibold text-[#0F766E] hover:underline"
              >
                {ko.project.openQuoteBuilder}
              </Link>
              <Link
                href="/"
                className="text-[13px] font-medium text-[#0369A1] hover:underline"
              >
                {ko.project.backHome}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:items-start lg:gap-5">
            <div className="min-w-0 lg:sticky lg:top-[4.75rem] lg:h-[calc(100vh-6.5rem)]">
              <ProjectChatPanel
                projectId={id}
                conversationId={conversationId}
                messages={chatMessages}
              />
            </div>

            <div className="min-w-0 space-y-3.5">
              <ProjectStatusModule status={project.status} />
              <ProjectReferenceImagesModule urls={referenceImageUrls} />
              {latestQuote ? (
                <section>
                  <h2 className="mb-2 text-[15px] font-semibold text-[#0F172A]">
                    {ko.project.quoteCard}
                  </h2>
                  <QuoteCard
                    quote={latestQuote}
                    checkoutOrderId={order?.id ?? null}
                  />
                </section>
              ) : null}
              <QuoteHistoryModule projectId={id} quotes={quotes} />
              <QuoteTimeline steps={quoteTimeline} />
              {order ? <ProjectOrderModule order={order} /> : null}
              <ProjectDesignProofModule proofs={designProofs} />
              <ProjectOwnedItemModule ownedItem={ownedItem} />
              <ProjectLogisticsModule logistics={project.logistics} />
              <ProjectProductionModule steps={project.productionSteps} />
              <ProjectTimelineModule events={timeline} />
            </div>
          </div>
        </Container>
      </main>

      <DemoFlowHint step={2} />
      {process.env.NODE_ENV === "development" ? (
        <div className="pointer-events-none fixed bottom-20 right-3 z-40 rounded border border-[#CBD5E1] bg-white/95 px-2.5 py-1.5 shadow-sm md:bottom-4">
          <p className="text-[9px] font-medium tracking-wide text-[#94A3B8] uppercase">
            DATA SOURCE
          </p>
          <p className="text-[11px] font-semibold text-[#0F172A]">
            {dataSource === "supabase" ? "Supabase" : "Mock"}
          </p>
        </div>
      ) : null}
      <MobileBottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [{ id: "prj-001" }];
}
