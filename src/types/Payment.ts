import type { PaymentStatus } from "@/constants/status";

export type { PaymentStatus };

export type PaymentMethod =
  | "CREDIT_CARD"
  | "BANK_TRANSFER"
  | "NAVER_PAY"
  | "KAKAO_PAY"
  | "TOSS_PAY"
  | "VIRTUAL_ACCOUNT";

export interface Payment {
  id: string;
  orderId: string;
  paymentNumber: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number;
  currency: "KRW";
  payerName: string;
  provider: string;
  transactionReference: string;
  requestedAt: string;
  approvedAt: string;
  failedAt: string;
  refundedAt: string;
  failureReason: string;
}
