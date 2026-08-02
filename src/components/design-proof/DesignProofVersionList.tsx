import { StatusBadge } from "@/components/ui/StatusBadge";
import { ko } from "@/messages";
import type { DesignProof } from "@/types/DesignProof";

const copy = ko.designProof;

type DesignProofVersionListProps = {
  versions: DesignProof[];
  activeId?: string;
  onSelect?: (id: string) => void;
};

export function DesignProofVersionList({
  versions,
  activeId,
  onSelect,
}: DesignProofVersionListProps) {
  const sorted = [...versions].sort((a, b) => b.version - a.version);

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">
        {copy.versionHistory}
      </h2>
      <ul className="mt-3 divide-y divide-[#E2E8F0]">
        {sorted.map((proof) => {
          const active = proof.id === activeId;
          return (
            <li key={proof.id} className="py-2.5 first:pt-0 last:pb-0">
              <button
                type="button"
                className={[
                  "w-full rounded-lg px-2 py-2 text-left transition-colors",
                  active ? "bg-[#F0FDFA]" : "hover:bg-[#F8FAFC]",
                  onSelect ? "cursor-pointer" : "cursor-default",
                ].join(" ")}
                onClick={() => onSelect?.(proof.id)}
                disabled={!onSelect}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-semibold text-[#0F172A]">
                    V{proof.version}
                  </p>
                  <StatusBadge domain="designProof" status={proof.status} />
                  {proof.isCurrentConfirmed ? (
                    <span className="text-[11px] font-medium text-[#0F766E]">
                      {copy.confirmedBadge}
                    </span>
                  ) : null}
                  {proof.status === "LOCKED" ? (
                    <span className="text-[11px] font-medium text-[#64748B]">
                      {copy.lockedBadge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 break-keep text-[12px] text-[#64748B]">
                  {proof.changeSummary}
                </p>
                <p className="mt-1 text-[11px] text-[#94A3B8]">
                  {proof.createdAt}
                  {proof.customerNote
                    ? ` · ${proof.customerNote}`
                    : proof.revisionReason
                      ? ` · ${proof.revisionReason}`
                      : ""}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
