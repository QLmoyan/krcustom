import Link from "next/link";
import { OrderAmountBreakdown } from "@/components/order/OrderAmountBreakdown";
import { OrderSummary } from "@/components/order/OrderSummary";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { OrderRiskNotices } from "@/components/order/OrderRiskNotices";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPaymentByOrderId, paymentMethodLabel } from "@/data/mockPayments";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";

const copy = ko.order;

type SellerOrderDetailViewProps = {
  order: Order;
};

export function SellerOrderDetailView({ order }: SellerOrderDetailViewProps) {
  const payment = getPaymentByOrderId(order.id);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-4">
      <Link
        href="/seller/orders"
        className="text-[13px] font-medium text-[#0369A1] hover:underline"
      >
        {copy.backToList}
      </Link>

      <OrderSummary order={order} />

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">고객 · 서비스</h3>
        <p className="mt-2 text-[13px]">
          {order.customerName} · {order.serviceName}
        </p>
        <p className="mt-1 text-[13px] text-[#64748B]">{order.storeName}</p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.paymentInfo}</h3>
        {payment ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
            <StatusBadge domain="payment" status={payment.status} />
            <span>{paymentMethodLabel(payment.method)}</span>
            <span className="font-semibold tabular-nums">
              {formatKRW(payment.amount)}
            </span>
          </div>
        ) : null}
      </section>

      {order.quoteId ? (
        <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4 text-[13px]">
          <h3 className="font-semibold">{copy.quoteSummary}</h3>
          <p className="mt-1">
            V{order.quoteVersion} · {formatKRW(order.total)}
          </p>
        </section>
      ) : null}

      {order.designProofId ? (
        <section className="rounded-xl border border-[#99F6E4] bg-white p-4 text-[13px]">
          <h3 className="font-semibold">{copy.proofSummary}</h3>
          <p className="mt-1">
            V{order.designProofVersion} · {order.designProofStatusLabel}
          </p>
          <Link
            href={`/seller/design-proofs/${order.designProofId}`}
            className="mt-2 inline-flex font-semibold text-[#0F766E]"
          >
            {ko.designProof.viewSellerProof}
          </Link>
        </section>
      ) : null}

      {order.ownedItem ? (
        <section className="rounded-xl border border-[#F5E6C8] bg-[#FFFBF0] p-4 text-[13px]">
          <h3 className="font-semibold">{copy.ownedItemInfo}</h3>
          <p className="mt-1 tabular-nums">{order.ownedItem.itemNumber}</p>
          <p className="mt-1">
            {order.ownedItem.itemName} · {order.ownedItem.lifecycleLabel}
          </p>
          {order.id === "ord-001" ? (
            <Link
              href="/seller/customer-items/coi-003"
              className="mt-2 inline-flex font-semibold text-[#0369A1]"
            >
              물품 상세
            </Link>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.production}</h3>
        <ol className="mt-3 space-y-2">
          {order.productionSteps.map((step) => (
            <li key={step.id} className="text-[13px]">
              {step.status === "done"
                ? "✓"
                : step.status === "current"
                  ? "→"
                  : "○"}{" "}
              {step.label}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.logistics}</h3>
        <p className="mt-2 text-[13px] text-[#64748B]">
          {order.outboundShipment
            ? `${order.outboundShipment.company} · ${order.outboundShipment.trackingNumber}`
            : "-"}
        </p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold">{copy.notes}</h3>
        <p className="mt-2 text-[13px] text-[#64748B]">
          고객: {order.customerNote || "-"}
        </p>
        <p className="mt-1 text-[13px] text-[#64748B]">
          판매자: {order.sellerNote || "-"}
        </p>
      </section>

      <OrderAmountBreakdown order={order} />
      <OrderTimeline events={order.timeline} />
      <OrderRiskNotices />

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionConfirmPay}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionWaitShip}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionReceive}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionStartProd}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionInspect}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionProdDone}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionShip}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.actionRefund}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled>
          {copy.actionAsk}
        </Button>
        {order.projectId.startsWith("prj-00") ? (
          <Button
            href={`/project/${order.projectId}`}
            variant="secondary"
            size="sm"
          >
            {copy.actionOpenProject}
          </Button>
        ) : null}
        {order.quoteId && order.projectId ? (
          <Button
            href={`/project/${order.projectId}/quote`}
            variant="outline"
            size="sm"
          >
            {copy.quoteSummary}
          </Button>
        ) : null}
        {order.id === "ord-001" ? (
          <Button
            href="/seller/customer-items/coi-003"
            variant="outline"
            size="sm"
          >
            {copy.ownedItemInfo}
          </Button>
        ) : null}
      </div>
      <p className="text-[11px] text-[#94A3B8]">{copy.demoNote}</p>
    </div>
  );
}
