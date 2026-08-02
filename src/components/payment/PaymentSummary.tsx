import { formatKRW, formatKoreanPhone } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";

const copy = ko.payment;
const orderCopy = ko.order;

type PaymentSummaryProps = {
  order: Order;
};

export function PaymentSummary({ order }: PaymentSummaryProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-[15px] font-semibold text-[#0F172A]">{copy.summary}</h3>
      <p className="mt-2 text-[13px] font-medium">{order.serviceName}</p>
      <p className="mt-1 text-[13px] text-[#64748B]">{order.storeName}</p>
      {order.quoteVersion > 0 ? (
        <p className="mt-2 text-[13px]">
          {copy.quoteVersion}: V{order.quoteVersion}
        </p>
      ) : null}
      {order.designProofVersion > 0 ? (
        <p className="mt-1 text-[13px]">
          {copy.proofStatus}: V{order.designProofVersion} ·{" "}
          {order.designProofStatusLabel}
        </p>
      ) : null}
      <div className="mt-3 rounded-lg bg-[#F8FAFC] px-3 py-2 text-[13px]">
        <p className="font-medium">{orderCopy.shippingAddress}</p>
        <p className="mt-1 text-[#64748B]">
          {order.shippingAddress.name} ·{" "}
          {formatKoreanPhone(order.shippingAddress.phone)}
        </p>
        <p className="mt-0.5 text-[#64748B]">
          {order.shippingAddress.address1} {order.shippingAddress.address2}
        </p>
      </div>
      {order.orderType === "CUSTOMER_OWNED_ITEM" ? (
        <div className="mt-2 rounded-lg bg-[#FFFBF0] px-3 py-2 text-[13px]">
          <p className="font-medium">{orderCopy.returnAddress}</p>
          <p className="mt-1 text-[#64748B]">
            {order.returnAddress.name} ·{" "}
            {formatKoreanPhone(order.returnAddress.phone)}
          </p>
          <p className="mt-0.5 text-[#64748B]">
            {order.returnAddress.address1} {order.returnAddress.address2}
          </p>
        </div>
      ) : null}
      <p className="mt-3 text-[22px] font-bold tabular-nums text-[#0F172A]">
        {formatKRW(order.total)}
      </p>
    </section>
  );
}
