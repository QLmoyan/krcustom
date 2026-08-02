/**
 * Unified domain status codes, Korean labels, categories, and short descriptions.
 * No JSX in this module — UI components resolve presentation via StatusBadge.
 */

export type StatusCategory =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type StatusDefinition = {
  code: string;
  label: string;
  category: StatusCategory;
  description: string;
};

function def(
  code: string,
  label: string,
  category: StatusCategory,
  description: string,
): StatusDefinition {
  return { code, label, category, description };
}

/* -------------------------------------------------------------------------- */
/* Project                                                                    */
/* -------------------------------------------------------------------------- */

export const ProjectStatus = {
  INQUIRY: "INQUIRY",
  QUOTE_PENDING: "QUOTE_PENDING",
  QUOTE_SENT: "QUOTE_SENT",
  QUOTE_ACCEPTED: "QUOTE_ACCEPTED",
  DESIGN_PROOF_PENDING: "DESIGN_PROOF_PENDING",
  DESIGN_PROOF_CONFIRMED: "DESIGN_PROOF_CONFIRMED",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAID: "PAID",
  CUSTOMER_SHIPMENT_PENDING: "CUSTOMER_SHIPMENT_PENDING",
  CUSTOMER_SHIPPED: "CUSTOMER_SHIPPED",
  SELLER_RECEIVED: "SELLER_RECEIVED",
  IN_PRODUCTION: "IN_PRODUCTION",
  INSPECTION: "INSPECTION",
  PRODUCTION_COMPLETED: "PRODUCTION_COMPLETED",
  RETURN_SHIPPED: "RETURN_SHIPPED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  DISPUTED: "DISPUTED",
} as const;

export type ProjectStatus =
  (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const PROJECT_STATUS_META: Record<ProjectStatus, StatusDefinition> = {
  INQUIRY: def(
    ProjectStatus.INQUIRY,
    "문의",
    "info",
    "고객이 서비스를 문의했습니다.",
  ),
  QUOTE_PENDING: def(
    ProjectStatus.QUOTE_PENDING,
    "견적 작성 대기",
    "warning",
    "판매자가 견적을 작성해야 합니다.",
  ),
  QUOTE_SENT: def(
    ProjectStatus.QUOTE_SENT,
    "견적 발송",
    "info",
    "견적이 고객에게 발송되었습니다.",
  ),
  QUOTE_ACCEPTED: def(
    ProjectStatus.QUOTE_ACCEPTED,
    "견적 수락",
    "success",
    "고객이 견적을 수락했습니다.",
  ),
  DESIGN_PROOF_PENDING: def(
    ProjectStatus.DESIGN_PROOF_PENDING,
    "시안 확인 대기",
    "warning",
    "고객의 시안 확인이 필요합니다.",
  ),
  DESIGN_PROOF_CONFIRMED: def(
    ProjectStatus.DESIGN_PROOF_CONFIRMED,
    "시안 확정",
    "success",
    "시안이 확정되었습니다.",
  ),
  PAYMENT_PENDING: def(
    ProjectStatus.PAYMENT_PENDING,
    "결제 대기",
    "warning",
    "고객 결제를 기다리는 중입니다.",
  ),
  PAID: def(ProjectStatus.PAID, "결제 완료", "success", "결제가 완료되었습니다."),
  CUSTOMER_SHIPMENT_PENDING: def(
    ProjectStatus.CUSTOMER_SHIPMENT_PENDING,
    "고객 발송 대기",
    "warning",
    "고객 소지품 발송을 기다리는 중입니다.",
  ),
  CUSTOMER_SHIPPED: def(
    ProjectStatus.CUSTOMER_SHIPPED,
    "고객 발송 완료",
    "info",
    "고객이 물품을 발송했습니다.",
  ),
  SELLER_RECEIVED: def(
    ProjectStatus.SELLER_RECEIVED,
    "판매자 수령 완료",
    "success",
    "판매자가 물품 수령을 확인했습니다.",
  ),
  IN_PRODUCTION: def(
    ProjectStatus.IN_PRODUCTION,
    "제작 중",
    "info",
    "제작이 진행 중입니다.",
  ),
  INSPECTION: def(
    ProjectStatus.INSPECTION,
    "검수 중",
    "info",
    "제작물 검수가 진행 중입니다.",
  ),
  PRODUCTION_COMPLETED: def(
    ProjectStatus.PRODUCTION_COMPLETED,
    "제작 완료",
    "success",
    "제작이 완료되었습니다.",
  ),
  RETURN_SHIPPED: def(
    ProjectStatus.RETURN_SHIPPED,
    "반송 배송 중",
    "info",
    "완성품을 고객에게 반송 중입니다.",
  ),
  COMPLETED: def(
    ProjectStatus.COMPLETED,
    "완료",
    "success",
    "프로젝트가 완료되었습니다.",
  ),
  CANCELLED: def(
    ProjectStatus.CANCELLED,
    "취소",
    "neutral",
    "프로젝트가 취소되었습니다.",
  ),
  DISPUTED: def(
    ProjectStatus.DISPUTED,
    "분쟁 처리 중",
    "danger",
    "분쟁 처리가 진행 중입니다.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Quote                                                                      */
/* -------------------------------------------------------------------------- */

export const QuoteStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  REVISION_REQUESTED: "REVISION_REQUESTED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export const QUOTE_STATUS_META: Record<QuoteStatus, StatusDefinition> = {
  DRAFT: def(QuoteStatus.DRAFT, "초안", "neutral", "견적 초안 상태입니다."),
  SENT: def(
    QuoteStatus.SENT,
    "고객 확인 대기",
    "info",
    "견적이 발송되어 고객 확인을 기다립니다.",
  ),
  REVISION_REQUESTED: def(
    QuoteStatus.REVISION_REQUESTED,
    "수정 요청",
    "warning",
    "고객이 견적 수정을 요청했습니다.",
  ),
  ACCEPTED: def(
    QuoteStatus.ACCEPTED,
    "수락됨",
    "success",
    "고객이 견적을 수락했습니다.",
  ),
  REJECTED: def(
    QuoteStatus.REJECTED,
    "거절됨",
    "danger",
    "견적이 거절되었습니다.",
  ),
  EXPIRED: def(
    QuoteStatus.EXPIRED,
    "만료됨",
    "neutral",
    "견적 유효기간이 만료되었습니다.",
  ),
  CANCELLED: def(
    QuoteStatus.CANCELLED,
    "취소됨",
    "neutral",
    "견적이 취소되었습니다.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Customer owned item                                                        */
/* -------------------------------------------------------------------------- */

export const CustomerOwnedItemStatus = {
  WAITING_CUSTOMER_SHIPMENT: "WAITING_CUSTOMER_SHIPMENT",
  CUSTOMER_SHIPPED: "CUSTOMER_SHIPPED",
  DELIVERY_COMPLETED: "DELIVERY_COMPLETED",
  RECEIPT_CONFIRMATION_REQUIRED: "RECEIPT_CONFIRMATION_REQUIRED",
  RECEIVED: "RECEIVED",
  INFORMATION_MISMATCH: "INFORMATION_MISMATCH",
  PRODUCTION_UNAVAILABLE: "PRODUCTION_UNAVAILABLE",
  LABEL_PENDING: "LABEL_PENDING",
  READY_FOR_PRODUCTION: "READY_FOR_PRODUCTION",
  IN_PRODUCTION: "IN_PRODUCTION",
  INSPECTION: "INSPECTION",
  PRODUCTION_COMPLETED: "PRODUCTION_COMPLETED",
  RETURN_PENDING: "RETURN_PENDING",
  RETURN_SHIPPED: "RETURN_SHIPPED",
  RETURN_COMPLETED: "RETURN_COMPLETED",
} as const;

export type CustomerOwnedItemStatus =
  (typeof CustomerOwnedItemStatus)[keyof typeof CustomerOwnedItemStatus];

export const CUSTOMER_OWNED_ITEM_STATUS_META: Record<
  CustomerOwnedItemStatus,
  StatusDefinition
> = {
  WAITING_CUSTOMER_SHIPMENT: def(
    CustomerOwnedItemStatus.WAITING_CUSTOMER_SHIPMENT,
    "고객 발송 대기",
    "warning",
    "고객의 물품 발송을 기다리는 중입니다.",
  ),
  CUSTOMER_SHIPPED: def(
    CustomerOwnedItemStatus.CUSTOMER_SHIPPED,
    "고객 발송 완료",
    "info",
    "고객이 물품을 발송했습니다.",
  ),
  DELIVERY_COMPLETED: def(
    CustomerOwnedItemStatus.DELIVERY_COMPLETED,
    "배송 완료",
    "info",
    "택배사 배송이 완료되었습니다.",
  ),
  RECEIPT_CONFIRMATION_REQUIRED: def(
    CustomerOwnedItemStatus.RECEIPT_CONFIRMATION_REQUIRED,
    "수령 확인 필요",
    "warning",
    "판매자의 수령 확인이 필요합니다.",
  ),
  RECEIVED: def(
    CustomerOwnedItemStatus.RECEIVED,
    "수령 확인",
    "success",
    "판매자가 수령을 확인했습니다.",
  ),
  INFORMATION_MISMATCH: def(
    CustomerOwnedItemStatus.INFORMATION_MISMATCH,
    "정보 불일치",
    "danger",
    "접수 정보가 고객 주장과 일치하지 않습니다.",
  ),
  PRODUCTION_UNAVAILABLE: def(
    CustomerOwnedItemStatus.PRODUCTION_UNAVAILABLE,
    "제작 불가",
    "danger",
    "현재 상태로 제작이 어렵습니다.",
  ),
  LABEL_PENDING: def(
    CustomerOwnedItemStatus.LABEL_PENDING,
    "라벨 출력 대기",
    "warning",
    "물품 라벨 출력이 필요합니다.",
  ),
  READY_FOR_PRODUCTION: def(
    CustomerOwnedItemStatus.READY_FOR_PRODUCTION,
    "제작 준비 완료",
    "info",
    "제작 투입 준비가 완료되었습니다.",
  ),
  IN_PRODUCTION: def(
    CustomerOwnedItemStatus.IN_PRODUCTION,
    "제작 중",
    "info",
    "소지품 커스텀 제작이 진행 중입니다.",
  ),
  INSPECTION: def(
    CustomerOwnedItemStatus.INSPECTION,
    "검수 중",
    "info",
    "제작 후 검수가 진행 중입니다.",
  ),
  PRODUCTION_COMPLETED: def(
    CustomerOwnedItemStatus.PRODUCTION_COMPLETED,
    "제작 완료",
    "success",
    "제작이 완료되었습니다.",
  ),
  RETURN_PENDING: def(
    CustomerOwnedItemStatus.RETURN_PENDING,
    "반송 대기",
    "warning",
    "고객 반송 준비를 기다리는 중입니다.",
  ),
  RETURN_SHIPPED: def(
    CustomerOwnedItemStatus.RETURN_SHIPPED,
    "반송 중",
    "info",
    "완성품을 반송 배송 중입니다.",
  ),
  RETURN_COMPLETED: def(
    CustomerOwnedItemStatus.RETURN_COMPLETED,
    "반송 완료",
    "success",
    "반송이 완료되었습니다.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Shipment                                                                   */
/* -------------------------------------------------------------------------- */

export const ShipmentStatus = {
  PENDING: "PENDING",
  READY: "READY",
  SHIPPED: "SHIPPED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  DELAYED: "DELAYED",
  LOST: "LOST",
  RETURNED: "RETURNED",
} as const;

export type ShipmentStatus =
  (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export const SHIPMENT_STATUS_META: Record<ShipmentStatus, StatusDefinition> = {
  PENDING: def(
    ShipmentStatus.PENDING,
    "대기",
    "neutral",
    "배송 준비가 아직 시작되지 않았습니다.",
  ),
  READY: def(
    ShipmentStatus.READY,
    "출고 준비",
    "info",
    "출고 준비가 완료되었습니다.",
  ),
  SHIPPED: def(
    ShipmentStatus.SHIPPED,
    "발송 완료",
    "info",
    "택배사에 인계되었습니다.",
  ),
  IN_TRANSIT: def(
    ShipmentStatus.IN_TRANSIT,
    "배송 중",
    "info",
    "배송이 진행 중입니다.",
  ),
  DELIVERED: def(
    ShipmentStatus.DELIVERED,
    "배송 완료",
    "success",
    "배송이 완료되었습니다.",
  ),
  DELAYED: def(
    ShipmentStatus.DELAYED,
    "배송 지연",
    "warning",
    "배송이 지연되고 있습니다.",
  ),
  LOST: def(
    ShipmentStatus.LOST,
    "분실",
    "danger",
    "배송 사고(분실)가 접수되었습니다.",
  ),
  RETURNED: def(
    ShipmentStatus.RETURNED,
    "반송됨",
    "neutral",
    "배송물이 반송되었습니다.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Design proof                                                               */
/* -------------------------------------------------------------------------- */

export const DesignProofStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  CONFIRMATION_PENDING: "CONFIRMATION_PENDING",
  REVISION_REQUESTED: "REVISION_REQUESTED",
  CONFIRMED: "CONFIRMED",
  LOCKED: "LOCKED",
} as const;

export type DesignProofStatus =
  (typeof DesignProofStatus)[keyof typeof DesignProofStatus];

export const DESIGN_PROOF_STATUS_META: Record<
  DesignProofStatus,
  StatusDefinition
> = {
  DRAFT: def(
    DesignProofStatus.DRAFT,
    "초안",
    "neutral",
    "시안 초안 상태입니다.",
  ),
  SENT: def(
    DesignProofStatus.SENT,
    "발송됨",
    "info",
    "시안이 고객에게 발송되었습니다.",
  ),
  CONFIRMATION_PENDING: def(
    DesignProofStatus.CONFIRMATION_PENDING,
    "확인 대기",
    "warning",
    "고객의 시안 확인을 기다리는 중입니다.",
  ),
  REVISION_REQUESTED: def(
    DesignProofStatus.REVISION_REQUESTED,
    "수정 요청",
    "warning",
    "고객이 시안 수정을 요청했습니다.",
  ),
  CONFIRMED: def(
    DesignProofStatus.CONFIRMED,
    "확정",
    "success",
    "시안이 확정되었습니다.",
  ),
  LOCKED: def(
    DesignProofStatus.LOCKED,
    "잠금",
    "neutral",
    "확정 후 시안이 잠겼습니다.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Order                                                                      */
/* -------------------------------------------------------------------------- */

export const OrderStatus = {
  DRAFT: "DRAFT",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
  PAID: "PAID",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  ORDER_CONFIRMED: "ORDER_CONFIRMED",
  CUSTOMER_SHIPMENT_PENDING: "CUSTOMER_SHIPMENT_PENDING",
  CUSTOMER_SHIPPED: "CUSTOMER_SHIPPED",
  SELLER_RECEIVED: "SELLER_RECEIVED",
  DESIGN_PROOF_PENDING: "DESIGN_PROOF_PENDING",
  DESIGN_PROOF_CONFIRMED: "DESIGN_PROOF_CONFIRMED",
  IN_PRODUCTION: "IN_PRODUCTION",
  INSPECTION: "INSPECTION",
  PRODUCTION_COMPLETED: "PRODUCTION_COMPLETED",
  SHIPPING_PENDING: "SHIPPING_PENDING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLATION_REQUESTED: "CANCELLATION_REQUESTED",
  CANCELLED: "CANCELLED",
  REFUND_REQUESTED: "REFUND_REQUESTED",
  REFUND_PROCESSING: "REFUND_PROCESSING",
  REFUNDED: "REFUNDED",
  DISPUTED: "DISPUTED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_META: Record<OrderStatus, StatusDefinition> = {
  DRAFT: def(OrderStatus.DRAFT, "초안", "neutral", "주문 초안 상태입니다."),
  PAYMENT_PENDING: def(
    OrderStatus.PAYMENT_PENDING,
    "결제 대기",
    "warning",
    "고객 결제를 기다리는 중입니다.",
  ),
  PAYMENT_PROCESSING: def(
    OrderStatus.PAYMENT_PROCESSING,
    "결제 처리 중",
    "info",
    "결제가 처리되고 있습니다.",
  ),
  PAID: def(OrderStatus.PAID, "결제 완료", "success", "결제가 완료되었습니다."),
  PAYMENT_FAILED: def(
    OrderStatus.PAYMENT_FAILED,
    "결제 실패",
    "danger",
    "결제에 실패했습니다.",
  ),
  ORDER_CONFIRMED: def(
    OrderStatus.ORDER_CONFIRMED,
    "주문 확정",
    "success",
    "주문이 확정되었습니다.",
  ),
  CUSTOMER_SHIPMENT_PENDING: def(
    OrderStatus.CUSTOMER_SHIPMENT_PENDING,
    "고객 발송 대기",
    "warning",
    "고객 소지품 발송을 기다리는 중입니다.",
  ),
  CUSTOMER_SHIPPED: def(
    OrderStatus.CUSTOMER_SHIPPED,
    "고객 발송 완료",
    "info",
    "고객이 물품을 발송했습니다.",
  ),
  SELLER_RECEIVED: def(
    OrderStatus.SELLER_RECEIVED,
    "판매자 수령 완료",
    "success",
    "판매자가 물품 수령을 확인했습니다.",
  ),
  DESIGN_PROOF_PENDING: def(
    OrderStatus.DESIGN_PROOF_PENDING,
    "시안 확인 대기",
    "warning",
    "시안 확인이 필요합니다.",
  ),
  DESIGN_PROOF_CONFIRMED: def(
    OrderStatus.DESIGN_PROOF_CONFIRMED,
    "시안 확정",
    "success",
    "시안이 확정되었습니다.",
  ),
  IN_PRODUCTION: def(
    OrderStatus.IN_PRODUCTION,
    "제작 중",
    "info",
    "제작이 진행 중입니다.",
  ),
  INSPECTION: def(
    OrderStatus.INSPECTION,
    "검수 중",
    "info",
    "검수가 진행 중입니다.",
  ),
  PRODUCTION_COMPLETED: def(
    OrderStatus.PRODUCTION_COMPLETED,
    "제작 완료",
    "success",
    "제작이 완료되었습니다.",
  ),
  SHIPPING_PENDING: def(
    OrderStatus.SHIPPING_PENDING,
    "배송 대기",
    "warning",
    "배송 준비를 기다리는 중입니다.",
  ),
  SHIPPED: def(OrderStatus.SHIPPED, "배송 중", "info", "배송이 시작되었습니다."),
  DELIVERED: def(
    OrderStatus.DELIVERED,
    "배송 완료",
    "success",
    "배송이 완료되었습니다.",
  ),
  COMPLETED: def(
    OrderStatus.COMPLETED,
    "주문 완료",
    "success",
    "주문이 완료되었습니다.",
  ),
  CANCELLATION_REQUESTED: def(
    OrderStatus.CANCELLATION_REQUESTED,
    "취소 요청",
    "warning",
    "주문 취소가 요청되었습니다.",
  ),
  CANCELLED: def(
    OrderStatus.CANCELLED,
    "취소됨",
    "neutral",
    "주문이 취소되었습니다.",
  ),
  REFUND_REQUESTED: def(
    OrderStatus.REFUND_REQUESTED,
    "환불 요청",
    "warning",
    "환불이 요청되었습니다.",
  ),
  REFUND_PROCESSING: def(
    OrderStatus.REFUND_PROCESSING,
    "환불 처리 중",
    "danger",
    "환불이 처리되고 있습니다.",
  ),
  REFUNDED: def(
    OrderStatus.REFUNDED,
    "환불 완료",
    "neutral",
    "환불이 완료되었습니다.",
  ),
  DISPUTED: def(
    OrderStatus.DISPUTED,
    "분쟁 처리 중",
    "danger",
    "분쟁 처리가 진행 중입니다.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */

export const PaymentStatus = {
  READY: "READY",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusDefinition> = {
  READY: def(
    PaymentStatus.READY,
    "결제 준비",
    "neutral",
    "결제 준비가 되었습니다.",
  ),
  PROCESSING: def(
    PaymentStatus.PROCESSING,
    "결제 처리 중",
    "info",
    "결제가 처리되고 있습니다.",
  ),
  PAID: def(PaymentStatus.PAID, "결제 완료", "success", "결제가 완료되었습니다."),
  FAILED: def(
    PaymentStatus.FAILED,
    "결제 실패",
    "danger",
    "결제에 실패했습니다.",
  ),
  CANCELLED: def(
    PaymentStatus.CANCELLED,
    "결제 취소",
    "neutral",
    "결제가 취소되었습니다.",
  ),
  PARTIALLY_REFUNDED: def(
    PaymentStatus.PARTIALLY_REFUNDED,
    "부분 환불",
    "warning",
    "부분 환불이 완료되었습니다.",
  ),
  REFUNDED: def(
    PaymentStatus.REFUNDED,
    "환불 완료",
    "neutral",
    "전액 환불이 완료되었습니다.",
  ),
};

/* -------------------------------------------------------------------------- */
/* Lookups                                                                    */
/* -------------------------------------------------------------------------- */

export type StatusDomain =
  | "project"
  | "quote"
  | "customerOwnedItem"
  | "shipment"
  | "designProof"
  | "order"
  | "payment";

const DOMAIN_META: Record<StatusDomain, Record<string, StatusDefinition>> = {
  project: PROJECT_STATUS_META,
  quote: QUOTE_STATUS_META,
  customerOwnedItem: CUSTOMER_OWNED_ITEM_STATUS_META,
  shipment: SHIPMENT_STATUS_META,
  designProof: DESIGN_PROOF_STATUS_META,
  order: ORDER_STATUS_META,
  payment: PAYMENT_STATUS_META,
};

export function getStatusDefinition(
  domain: StatusDomain,
  status: string,
): StatusDefinition | undefined {
  return DOMAIN_META[domain][status];
}

export function getStatusLabel(
  domain: StatusDomain,
  status: string,
  fallback = status,
): string {
  return getStatusDefinition(domain, status)?.label ?? fallback;
}

export function getStatusCategory(
  domain: StatusDomain,
  status: string,
  fallback: StatusCategory = "neutral",
): StatusCategory {
  return getStatusDefinition(domain, status)?.category ?? fallback;
}
