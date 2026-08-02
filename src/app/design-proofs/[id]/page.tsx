import { DemoFlowHint } from "@/components/demo/DemoFlowHint";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CustomerDesignProofView } from "@/components/design-proof/CustomerDesignProofView";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DEMO } from "@/data/demoFlow";
import {
  getDesignProofById,
  getDesignProofsByProjectId,
} from "@/lib/providers/designProofProvider";
import { ko } from "@/messages";

type CustomerDesignProofPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDesignProofPage({
  params,
}: CustomerDesignProofPageProps) {
  const { id } = await params;
  const { proof } = await getDesignProofById(id);

  if (!proof) {
    return (
      <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
        <Header />
        <Container className="py-16 text-center">
          <h1 className="text-[20px] font-semibold text-[#0F172A]">
            {ko.designProof.notFound}
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

  const { proofs: versions } = await getDesignProofsByProjectId(
    proof.projectId,
  );

  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-4 md:py-5">
          <CustomerDesignProofView proof={proof} versions={versions} />
        </Container>
      </main>
      {id === DEMO.designProofId ? <DemoFlowHint step={4} /> : null}
      <MobileBottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { id: "dp-prj001-v3" },
    { id: "dp-prj001-v4" },
    { id: "dp-prj002-v1" },
  ];
}
