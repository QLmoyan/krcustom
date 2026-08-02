import Link from "next/link";
import { SellerDesignProofDetailView } from "@/components/design-proof/SellerDesignProofDetailView";
import { SellerLayout } from "@/components/seller/SellerLayout";
import { Button } from "@/components/ui/Button";
import {
  getDesignProofById,
  getDesignProofsByProjectId,
  getDesignProofTimeline,
} from "@/lib/providers/designProofProvider";
import { getLatestQuote } from "@/lib/providers/quoteProvider";
import { mockSellerDashboard } from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

type SellerDesignProofDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerDesignProofDetailPage({
  params,
}: SellerDesignProofDetailPageProps) {
  const { id } = await params;
  const { proof } = await getDesignProofById(id);

  if (!proof) {
    return (
      <SellerLayout
        title={ko.designProof.detailTitle}
        storeName={mockSellerDashboard.storeName}
        sellerName={mockSellerDashboard.sellerName}
      >
        <div className="mx-auto max-w-[640px] py-12 text-center">
          <h2 className="text-[18px] font-semibold text-[#0F172A]">
            {ko.designProof.notFound}
          </h2>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="/seller/design-proofs" variant="primary">
              {ko.designProof.backToList}
            </Button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  const { proofs: versions } = await getDesignProofsByProjectId(
    proof.projectId,
  );
  const timeline = await getDesignProofTimeline(proof.projectId);
  const { quote } = await getLatestQuote(proof.projectId);

  return (
    <SellerLayout
      title={ko.designProof.detailTitle}
      storeName={mockSellerDashboard.storeName}
      sellerName={mockSellerDashboard.sellerName}
    >
      <SellerDesignProofDetailView
        initialProof={proof}
        versions={versions}
        timeline={timeline}
        quote={quote}
      />
      <p className="mx-auto mt-4 max-w-[1100px] text-[12px] text-[#94A3B8]">
        <Link href={`/project/${proof.projectId}`} className="hover:underline">
          {ko.designProof.backToWorkspace}
        </Link>
      </p>
    </SellerLayout>
  );
}

export function generateStaticParams() {
  return [
    { id: "dp-prj001-v4" },
    { id: "dp-prj001-v3" },
    { id: "dp-prj002-v1" },
  ];
}
