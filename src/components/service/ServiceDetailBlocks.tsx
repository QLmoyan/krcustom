import type { ServiceDetailBlock } from "@/types";
import { ko } from "@/messages";

type ServiceDetailBlocksProps = {
  blocks: ServiceDetailBlock[];
};

export function ServiceDetailBlocks({ blocks }: ServiceDetailBlocksProps) {
  if (blocks.length === 0) return null;

  return (
    <section>
      <h2 className="text-[17px] font-semibold text-[#0F172A] md:text-[18px]">
        {ko.service.detailSection}
      </h2>
      <div className="mt-3 divide-y divide-[#E2E8F0] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        {blocks.map((block) => (
          <article key={block.id} className="px-3.5 py-3">
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              {block.title}
            </h3>
            <p className="mt-1 break-keep text-[13px] leading-relaxed text-[#64748B]">
              {block.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
