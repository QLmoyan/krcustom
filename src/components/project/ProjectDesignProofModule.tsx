import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";

const copy = ko.designProof;

type ProjectDesignProofModuleProps = {
  proofs: DesignProof[];
};

export function ProjectDesignProofModule({
  proofs,
}: ProjectDesignProofModuleProps) {
  if (proofs.length === 0) return null;

  const current =
    proofs.find((proof) => proof.isCurrentConfirmed) ?? proofs[0];
  if (!current) return null;

  const sorted = [...proofs].sort((a, b) => b.version - a.version);
  const thumb = current.previewImages[0];

  return (
    <section className="rounded-xl border border-[#99F6E4] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.project.designProofModule}
        </h2>
        <StatusBadge domain="designProof" status={current.status} />
      </div>

      <p className="mt-2 text-[13px] text-[#64748B]">
        {copy.currentVersion} V{current.version} · {current.updatedAt}
      </p>

      {thumb ? (
        <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]">
          <Image
            src={thumb.url}
            alt={`${current.title} V${current.version}`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}

      <p className="mt-2 break-keep text-[13px] leading-relaxed text-[#64748B]">
        {current.sellerNote}
      </p>

      {(current.customerNote || current.revisionReason) && (
        <p className="mt-2 break-keep rounded-lg bg-[#F8FAFC] px-3 py-2 text-[12px] text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">
            {copy.recentFeedback}:{" "}
          </span>
          {current.customerNote || current.revisionReason}
        </p>
      )}

      <div className="mt-3">
        <p className="text-[12px] font-medium text-[#64748B]">
          {copy.versionSummary}
        </p>
        <ul className="mt-1.5 space-y-1 text-[12px] text-[#475569]">
          {sorted.slice(0, 4).map((proof) => (
            <li key={proof.id} className="flex items-center gap-2">
              <span className="font-semibold">V{proof.version}</span>
              <StatusBadge
                domain="designProof"
                status={proof.status}
                size="sm"
              />
              <span className="truncate text-[#94A3B8]">
                {proof.changeSummary}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {current.status === "LOCKED" ? (
        <p className="mt-3 text-[12px] text-[#15803D]">{copy.lockedHint}</p>
      ) : current.status === "REVISION_REQUESTED" ? (
        <p className="mt-3 text-[12px] text-[#A16207]">
          {copy.revisionRequestedHint}
        </p>
      ) : current.status !== "CONFIRMED" ? (
        <p className="mt-3 text-[12px] text-[#A16207]">{copy.cannotProduce}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          href={`/design-proofs/${current.id}`}
          className="text-[13px] font-semibold text-[#0F766E] hover:underline"
        >
          {copy.viewCustomerProof}
        </Link>
        <Link
          href={`/seller/design-proofs/${current.id}`}
          className="text-[13px] font-semibold text-[#0369A1] hover:underline"
        >
          {copy.viewSellerProof}
        </Link>
        {current.status === "LOCKED" ? (
          <>
            <span className="text-[12px] font-medium text-[#15803D]">
              {copy.finalConfirmed}
            </span>
            <Link
              href="/checkout/ord-001"
              className="text-[13px] font-semibold text-[#0F766E] hover:underline"
            >
              {copy.checkoutPay}
            </Link>
          </>
        ) : null}
      </div>
    </section>
  );
}
