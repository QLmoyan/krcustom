import Image from "next/image";
import type { ServicePortfolioItem } from "@/types";
import { ko } from "@/messages";

type ServicePortfolioProps = {
  items: ServicePortfolioItem[];
};

export function ServicePortfolio({ items }: ServicePortfolioProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-[17px] font-semibold text-[#0F172A] md:text-[18px]">
        {ko.service.portfolioSection}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
          >
            <div className="grid grid-cols-2 gap-px bg-[#E2E8F0]">
              <div className="relative aspect-square bg-[#F8FAFC]">
                <Image
                  src={item.beforeImage}
                  alt={`${item.title} ${item.beforeLabel}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-medium text-[#475569]">
                  {item.beforeLabel}
                </span>
              </div>
              <div className="relative aspect-square bg-[#F8FAFC]">
                <Image
                  src={item.afterImage}
                  alt={`${item.title} ${item.afterLabel}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute left-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-medium text-[#0F766E]">
                  {item.afterLabel}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-[14px] font-semibold text-[#0F172A]">
                {item.title}
              </h3>
              <p className="mt-1 text-[12px] text-[#64748B]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
