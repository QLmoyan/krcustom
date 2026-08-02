import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type {
  SellerTaskPriority,
  SellerTodoItem,
} from "@/data/mockSellerDashboard";
import { ko } from "@/messages";

const priorityOrder: Record<SellerTaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

type SellerTaskListProps = {
  todos: SellerTodoItem[];
};

export function SellerTaskList({ todos }: SellerTaskListProps) {
  const sorted = [...todos].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="border-b border-[#E2E8F0] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">
          {ko.seller.todayTodos}
        </h2>
      </div>
      <ul className="divide-y divide-[#E2E8F0]">
        {sorted.map((todo) => (
          <li
            key={todo.id}
            className={[
              "px-4 py-3",
              todo.priority === "high" ? "bg-[#FFFBEB]/50" : "",
            ].join(" ")}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <PriorityBadge priority={todo.priority} />
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">
                    {todo.title}
                  </h3>
                </div>
                <p className="mt-1 text-[12px] text-[#64748B]">
                  {ko.seller.orderNumber} {todo.orderNumber} ·{" "}
                  {todo.customerName} · {todo.status}
                </p>
                <p className="mt-1 text-[12px] text-[#0369A1]">
                  {ko.seller.dueLabel} {todo.dueTime}
                </p>
              </div>
              <Link
                href="/seller/orders"
                className="inline-flex h-8 shrink-0 items-center rounded-lg border border-[#CBD5E1] bg-white px-2.5 text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                {todo.nextAction}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PriorityBadge({ priority }: { priority: SellerTaskPriority }) {
  if (priority === "high") {
    return <Badge tone="warning">{ko.seller.priorityHigh}</Badge>;
  }
  if (priority === "medium") {
    return <Badge tone="accent">{ko.seller.priorityMedium}</Badge>;
  }
  return <Badge tone="neutral">{ko.seller.priorityLow}</Badge>;
}
