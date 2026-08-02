import { Button } from "@/components/ui/Button";
import { paymentMethodLabel } from "@/data/mockPayments";
import { formatKRW, formatOrderNumber } from "@/lib/format";
import { ko } from "@/messages";
import type { Order } from "@/types/Order";
import type { Payment } from "@/types/Payment";

const copy = ko.payment;

type PaymentResultViewProps = {
  variant: "success" | "failure";
  order: Order;
  payment?: Payment;
};

export function PaymentResultView({
  variant,
  order,
  payment,
}: PaymentResultViewProps) {
  if (variant === "success") {
    return (
      <div className="mx-auto max-w-[640px] space-y-4 text-center">
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-6">
          <h1 className="text-[20px] font-bold text-[#15803D]">
            {copy.successTitle}
          </h1>
          <p className="mt-3 text-[13px] text-[#64748B]">
            {formatOrderNumber(order.orderNumber)}
          </p>
          <p className="mt-2 text-[22px] font-bold tabular-nums text-[#0F172A]">
            {formatKRW(order.total)}
          </p>
          {payment ? (
            <p className="mt-1 text-[13px] text-[#64748B]">
              {copy.method}: {paymentMethodLabel(payment.method)}
            </p>
          ) : null}
        </div>
        <p className="text-[14px] font-medium text-[#0F172A]">
          {copy.nextStep}
        </p>
        <p className="break-keep text-[13px] text-[#0369A1]">
          {order.orderType === "CUSTOMER_OWNED_ITEM"
            ? copy.ownedShipHint
            : ko.order.paidBanner}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button href={`/orders/${order.id}`} variant="primary">
            {ko.order.openOrder}
          </Button>
          {order.orderType === "CUSTOMER_OWNED_ITEM" ? (
            <Button href={`/orders/${order.id}#owned`} variant="secondary">
              물품 발송 안내
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] space-y-4 text-center">
      <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-6">
        <h1 className="text-[20px] font-bold text-[#DC2626]">
          {copy.failureTitle}
        </h1>
        <p className="mt-3 text-[13px] text-[#64748B]">
          {formatOrderNumber(order.orderNumber)}
        </p>
        <p className="mt-3 break-keep text-[13px] text-[#7F1D1D]">
          {copy.failureReason}:{" "}
          {payment?.failureReason || "결제 승인에 실패했습니다."}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button href="/checkout/ord-002" variant="primary">
          {copy.payAgain}
        </Button>
        <Button href={`/checkout/${order.id}`} variant="outline">
          {copy.otherMethod}
        </Button>
        <Button href="/messages" variant="ghost">
          {copy.askSeller}
        </Button>
      </div>
    </div>
  );
}
