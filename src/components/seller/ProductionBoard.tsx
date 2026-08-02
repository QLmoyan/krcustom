import type { ProductionColumn } from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

type ProductionBoardProps = {
  columns: ProductionColumn[];
};

export function ProductionBoard({ columns }: ProductionBoardProps) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.seller.productionBoard}
        </h2>
        <p className="text-[11px] text-[#94A3B8]">{ko.seller.demoNote}</p>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="flex min-w-max gap-3 pb-1">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex w-64 shrink-0 flex-col rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-3 py-2.5">
                <h3 className="text-[13px] font-semibold text-[#0F172A]">
                  {column.title}
                </h3>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#64748B]">
                  {column.cards.length}
                </span>
              </div>
              <ul className="flex flex-col gap-2 p-2.5">
                {column.cards.map((card) => (
                  <li
                    key={card.id}
                    className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  >
                    <p className="text-[12px] font-semibold tabular-nums text-[#0F172A]">
                      {card.orderNumber}
                    </p>
                    <p className="mt-1 text-[12px] text-[#64748B]">
                      {card.customerName}
                    </p>
                    <p className="mt-0.5 truncate text-[13px] font-medium text-[#0F172A]">
                      {card.serviceTitle}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="rounded-md bg-[#F0F9FF] px-1.5 py-0.5 text-[#0369A1]">
                        {ko.seller.dueLabel} {card.dueDate}
                      </span>
                      <span className="rounded-md bg-[#F1F5F9] px-1.5 py-0.5 text-[#475569]">
                        {card.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
