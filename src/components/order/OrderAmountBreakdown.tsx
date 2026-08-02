import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";

const copy = ko.order;

type OrderAmountBreakdownProps = {
  order: Order;
};

export function OrderAmountBreakdown({ order }: OrderAmountBreakdownProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-[15px] font-semibold text-[#0F172A]">
        {copy.amountBreakdown}
      </h3>
      <ul className="mt-3 space-y-1.5 text-[13px]">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 text-[#0F172A]"
          >
            <span className="min-w-0 break-keep">
              {item.name}
              <span className="mt-0.5 block text-[11px] text-[#64748B]">
                {item.quantity} × {formatKRW(item.unitPrice)}
              </span>
            </span>
            <span className="shrink-0 tabular-nums">{formatKRW(item.amount)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-1.5 border-t border-[#E2E8F0] pt-3 text-[13px]">
        <Row label={copy.subtotal} value={formatKRW(order.subtotal)} />
        <Row label={copy.discount} value={`-${formatKRW(order.discount)}`} />
        <Row label={copy.shipping} value={formatKRW(order.shippingFee)} />
        <Row label={copy.extra} value={formatKRW(order.extraFee)} />
        <Row label={copy.tax} value={formatKRW(order.tax)} />
        <div className="flex items-center justify-between pt-1">
          <dt className="text-[14px] font-semibold">{copy.total}</dt>
          <dd className="text-[18px] font-bold tabular-nums">
            {formatKRW(order.total)}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[#64748B]">{label}</dt>
      <dd className="tabular-nums text-[#0F172A]">{value}</dd>
    </div>
  );
}
