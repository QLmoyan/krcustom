import Link from "next/link";
import { OrderAmountBreakdown } from "@/components/order/OrderAmountBreakdown";
import { OrderStatusPanel } from "@/components/order/OrderStatusPanel";
import { OrderSummary } from "@/components/order/OrderSummary";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPaymentByOrderId, paymentMethodLabel } from "@/data/mockPayments";
import { formatKRW, formatKoreanPhone } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";

const copy = ko.order;

type CustomerOrderDetailViewProps = {
  order: Order;
};

export function CustomerOrderDetailView({ order }: CustomerOrderDetailViewProps) {
  const payment = getPaymentByOrderId(order.id);
  const needPay =
    order.status === "PAYMENT_PENDING" || order.status === "PAYMENT_FAILED";

  return (
    <div className="space-y-4">
      <Link
        href="/orders"
        className="text-[13px] font-medium text-[#0369A1] hover:underline"
      >
        {copy.backToList}
      </Link>

      <OrderSummary order={order} />
      <OrderStatusPanel nextAction={order.nextAction}>
        {needPay ? (
          <Button
            href={`/checkout/${order.id}`}
            variant="primary"
            size="sm"
            className="mt-3"
          >
            {copy.openCheckout}
          </Button>
        ) : null}
        {order.paymentStatus === "PAID" ? (
          <p className="mt-2 text-[12px] text-[#15803D]">{copy.paidBanner}</p>
        ) : null}
      </OrderStatusPanel>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.service}</h3>
        <p className="mt-2 text-[13px]">{order.serviceName}</p>
        <p className="mt-1 text-[13px] text-[#64748B]">{order.storeName}</p>
      </section>

      {order.quoteId ? (
        <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
          <h3 className="text-[15px] font-semibold">{copy.quoteSummary}</h3>
          <p className="mt-2 text-[13px]">
            V{order.quoteVersion} · {formatKRW(order.total)}
          </p>
          <Link
            href={`/project/${order.projectId}/quote`}
            className="mt-2 inline-flex text-[12px] font-semibold text-[#0369A1]"
          >
            {copy.quoteSummary} 보기
          </Link>
        </section>
      ) : null}

      {order.designProofId ? (
        <section className="rounded-xl border border-[#99F6E4] bg-white p-4">
          <h3 className="text-[15px] font-semibold">{copy.proofSummary}</h3>
          <p className="mt-2 text-[13px]">
            V{order.designProofVersion} · {order.designProofStatusLabel}
          </p>
          <Link
            href={`/design-proofs/${order.designProofId}`}
            className="mt-2 inline-flex text-[12px] font-semibold text-[#0F766E]"
          >
            {ko.designProof.viewCustomerProof}
          </Link>
        </section>
      ) : null}

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.paymentInfo}</h3>
        {payment ? (
          <dl className="mt-2 space-y-1 text-[13px]">
            <div className="flex justify-between gap-2">
              <dt className="text-[#64748B]">{ko.payment.method}</dt>
              <dd>{paymentMethodLabel(payment.method)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#64748B]">{copy.payStatus}</dt>
              <dd>
                <StatusBadge domain="payment" status={payment.status} size="sm" />
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#64748B]">{ko.payment.amount}</dt>
              <dd className="font-semibold tabular-nums">
                {formatKRW(payment.amount)}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-[13px] text-[#64748B]">-</p>
        )}
      </section>

      {order.ownedItem ? (
        <section
          id="owned"
          className="scroll-mt-24 rounded-xl border border-[#F5E6C8] bg-[#FFFBF0] p-4"
        >
          <h3 className="text-[15px] font-semibold">{copy.ownedItemInfo}</h3>
          <p className="mt-2 text-[13px] font-medium tabular-nums">
            {order.ownedItem.itemNumber}
          </p>
          <p className="mt-1 text-[13px]">{order.ownedItem.itemName}</p>
          <OwnedStages current={order.ownedItem.stage} />
        </section>
      ) : null}

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.logistics}</h3>
        {order.outboundShipment ? (
          <p className="mt-2 text-[13px]">
            {order.outboundShipment.company} ·{" "}
            {order.outboundShipment.trackingNumber} ·{" "}
            {order.outboundShipment.status}
          </p>
        ) : (
          <p className="mt-2 text-[13px] text-[#64748B]">-</p>
        )}
        {order.returnShipment ? (
          <p className="mt-1 text-[13px]">
            {copy.returnAddress}: {order.returnShipment.company} ·{" "}
            {order.returnShipment.trackingNumber}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.production}</h3>
        <ol className="mt-3 space-y-2">
          {order.productionSteps.map((step) => (
            <li key={step.id} className="flex items-center gap-2 text-[13px]">
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full",
                  step.status === "done"
                    ? "bg-[#15803D]"
                    : step.status === "current"
                      ? "bg-[#0F766E]"
                      : "bg-[#CBD5E1]",
                ].join(" ")}
              />
              {step.label}
            </li>
          ))}
        </ol>
      </section>

      <OrderAmountBreakdown order={order} />
      <OrderTimeline events={order.timeline} />

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.cancel}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.refund}
        </Button>
        {order.projectId ? (
          <Button
            href={`/project/${order.projectId}`}
            variant="ghost"
            size="sm"
          >
            {copy.contactSeller}
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" disabled>
            {copy.contactSeller}
          </Button>
        )}
        {order.paymentStatus !== "PAID" || order.id === "ord-001" ? (
          <Button href={`/checkout/${order.id}`} variant="primary" size="sm">
            {copy.openCheckout}
          </Button>
        ) : null}
        {order.projectId ? (
          <Button href={`/project/${order.projectId}`} variant="secondary" size="sm">
            {copy.openWorkspace}
          </Button>
        ) : null}
      </div>

      <AddressBlock
        title={copy.shippingAddress}
        name={order.shippingAddress.name}
        phone={order.shippingAddress.phone}
        line={`${order.shippingAddress.address1} ${order.shippingAddress.address2}`}
      />
      <p className="text-[11px] text-[#94A3B8]">{copy.demoNote}</p>
    </div>
  );
}

function OwnedStages({
  current,
}: {
  current: NonNullable<Order["ownedItem"]>["stage"];
}) {
  const stages = [
    { key: "WAITING_SHIPMENT", label: copy.stageWaiting },
    { key: "CUSTOMER_SHIPPED", label: copy.stageShipped },
    { key: "SELLER_RECEIVED", label: copy.stageReceived },
    { key: "IN_PRODUCTION", label: copy.stageProduction },
    { key: "RETURN_SHIPPING", label: copy.stageReturn },
  ] as const;
  const currentIndex = stages.findIndex((s) => s.key === current);
  return (
    <ol className="mt-3 space-y-1.5">
      {stages.map((stage, index) => (
        <li
          key={stage.key}
          className={[
            "text-[13px]",
            index <= currentIndex ? "font-semibold text-[#0F172A]" : "text-[#94A3B8]",
          ].join(" ")}
        >
          {index <= currentIndex ? "●" : "○"} {stage.label}
        </li>
      ))}
    </ol>
  );
}

function AddressBlock({
  title,
  name,
  phone,
  line,
}: {
  title: string;
  name: string;
  phone: string;
  line: string;
}) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h3 className="text-[14px] font-semibold">{title}</h3>
      <p className="mt-2 text-[13px]">
        {name} · {formatKoreanPhone(phone)}
      </p>
      <p className="mt-1 text-[13px] text-[#64748B]">{line}</p>
    </section>
  );
}
