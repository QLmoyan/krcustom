import { PaymentStatus } from "@/constants/status";
import type { Payment, PaymentMethod } from "@/types/Payment";

export const mockPayments: Payment[] = [
  {
    id: "pay-001",
    orderId: "ord-001",
    paymentNumber: "PAY-20260712-001",
    status: PaymentStatus.PAID,
    method: "CREDIT_CARD",
    amount: 64800,
    currency: "KRW",
    payerName: "이서연",
    provider: "Toss Payments",
    transactionReference: "TXN-64800-001",
    requestedAt: "2026.07.12 17:22",
    approvedAt: "2026.07.12 17:28",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-002",
    orderId: "ord-002",
    paymentNumber: "PAY-20260715-002",
    status: PaymentStatus.READY,
    method: "KAKAO_PAY",
    amount: 89000,
    currency: "KRW",
    payerName: "김하늘",
    provider: "Kakao Pay",
    transactionReference: "",
    requestedAt: "2026.07.15 10:00",
    approvedAt: "",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-003",
    orderId: "ord-003",
    paymentNumber: "PAY-20260715-003",
    status: PaymentStatus.PROCESSING,
    method: "NAVER_PAY",
    amount: 42000,
    currency: "KRW",
    payerName: "박민준",
    provider: "Naver Pay",
    transactionReference: "TXN-PROC-003",
    requestedAt: "2026.07.15 11:10",
    approvedAt: "",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-004",
    orderId: "ord-004",
    paymentNumber: "PAY-20260714-004",
    status: PaymentStatus.FAILED,
    method: "CREDIT_CARD",
    amount: 56000,
    currency: "KRW",
    payerName: "최유진",
    provider: "Toss Payments",
    transactionReference: "TXN-FAIL-004",
    requestedAt: "2026.07.14 19:00",
    approvedAt: "",
    failedAt: "2026.07.14 19:01",
    refundedAt: "",
    failureReason: "카드 한도 초과로 승인이 거절되었습니다.",
  },
  {
    id: "pay-005",
    orderId: "ord-005",
    paymentNumber: "PAY-20260713-005",
    status: PaymentStatus.PAID,
    method: "TOSS_PAY",
    amount: 128000,
    currency: "KRW",
    payerName: "정다은",
    provider: "Toss Payments",
    transactionReference: "TXN-128000-005",
    requestedAt: "2026.07.13 12:00",
    approvedAt: "2026.07.13 12:02",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-006",
    orderId: "ord-006",
    paymentNumber: "PAY-20260712-006",
    status: PaymentStatus.PAID,
    method: "BANK_TRANSFER",
    amount: 73000,
    currency: "KRW",
    payerName: "한지우",
    provider: "Virtual Bank",
    transactionReference: "TXN-BANK-006",
    requestedAt: "2026.07.12 09:30",
    approvedAt: "2026.07.12 10:15",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-007",
    orderId: "ord-007",
    paymentNumber: "PAY-20260711-007",
    status: PaymentStatus.PAID,
    method: "CREDIT_CARD",
    amount: 95000,
    currency: "KRW",
    payerName: "오세훈",
    provider: "Toss Payments",
    transactionReference: "TXN-95000-007",
    requestedAt: "2026.07.11 16:00",
    approvedAt: "2026.07.11 16:01",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-008",
    orderId: "ord-008",
    paymentNumber: "PAY-20260710-008",
    status: PaymentStatus.PAID,
    method: "VIRTUAL_ACCOUNT",
    amount: 48000,
    currency: "KRW",
    payerName: "윤서아",
    provider: "Virtual Account",
    transactionReference: "TXN-VA-008",
    requestedAt: "2026.07.10 14:20",
    approvedAt: "2026.07.10 15:00",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-009",
    orderId: "ord-009",
    paymentNumber: "PAY-20260708-009",
    status: PaymentStatus.PAID,
    method: "KAKAO_PAY",
    amount: 152000,
    currency: "KRW",
    payerName: "강민재",
    provider: "Kakao Pay",
    transactionReference: "TXN-152000-009",
    requestedAt: "2026.07.08 11:00",
    approvedAt: "2026.07.08 11:01",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
  {
    id: "pay-010",
    orderId: "ord-010",
    paymentNumber: "PAY-20260707-010",
    status: PaymentStatus.PROCESSING,
    method: "CREDIT_CARD",
    amount: 67000,
    currency: "KRW",
    payerName: "배소율",
    provider: "Toss Payments",
    transactionReference: "TXN-REF-010",
    requestedAt: "2026.07.14 18:00",
    approvedAt: "",
    failedAt: "",
    refundedAt: "",
    failureReason: "",
  },
];

export function getPaymentById(id: string): Payment | undefined {
  return mockPayments.find((payment) => payment.id === id);
}

export function getPaymentByOrderId(orderId: string): Payment | undefined {
  return mockPayments.find((payment) => payment.orderId === orderId);
}

export function paymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "CREDIT_CARD":
      return "신용·체크카드";
    case "BANK_TRANSFER":
      return "계좌이체";
    case "NAVER_PAY":
      return "네이버페이";
    case "KAKAO_PAY":
      return "카카오페이";
    case "TOSS_PAY":
      return "토스페이";
    case "VIRTUAL_ACCOUNT":
      return "가상계좌";
    default:
      return method;
  }
}
