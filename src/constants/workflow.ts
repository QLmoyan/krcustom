/**
 * Shared workflow transition tables for Project / Quote / Design Proof / Order.
 * Status codes must match `src/constants/status.ts`.
 */

import {
  DesignProofStatus,
  OrderStatus,
  ProjectStatus,
  QuoteStatus,
} from "@/constants/status";

export type WorkflowDomain = "project" | "quote" | "designProof" | "order";

/** Allowed next statuses keyed by current status. Terminal states map to []. */
export type TransitionMap = Record<string, readonly string[]>;

export const PROJECT_TRANSITIONS: TransitionMap = {
  [ProjectStatus.INQUIRY]: [
    ProjectStatus.QUOTE_PENDING,
    ProjectStatus.DESIGN_PROOF_PENDING,
    ProjectStatus.CANCELLED,
  ],
  [ProjectStatus.QUOTE_PENDING]: [
    ProjectStatus.QUOTE_SENT,
    ProjectStatus.CANCELLED,
  ],
  [ProjectStatus.QUOTE_SENT]: [
    ProjectStatus.QUOTE_ACCEPTED,
    ProjectStatus.QUOTE_PENDING,
    ProjectStatus.CANCELLED,
  ],
  [ProjectStatus.QUOTE_ACCEPTED]: [
    ProjectStatus.DESIGN_PROOF_PENDING,
    ProjectStatus.PAYMENT_PENDING,
    ProjectStatus.CANCELLED,
  ],
  [ProjectStatus.DESIGN_PROOF_PENDING]: [
    ProjectStatus.DESIGN_PROOF_CONFIRMED,
    ProjectStatus.QUOTE_PENDING,
    ProjectStatus.CANCELLED,
  ],
  [ProjectStatus.DESIGN_PROOF_CONFIRMED]: [
    ProjectStatus.PAYMENT_PENDING,
    ProjectStatus.PAID,
    ProjectStatus.CANCELLED,
  ],
  [ProjectStatus.PAYMENT_PENDING]: [
    ProjectStatus.PAID,
    ProjectStatus.CANCELLED,
    ProjectStatus.DISPUTED,
  ],
  [ProjectStatus.PAID]: [
    ProjectStatus.CUSTOMER_SHIPMENT_PENDING,
    ProjectStatus.IN_PRODUCTION,
    ProjectStatus.DISPUTED,
  ],
  [ProjectStatus.CUSTOMER_SHIPMENT_PENDING]: [
    ProjectStatus.CUSTOMER_SHIPPED,
    ProjectStatus.CANCELLED,
    ProjectStatus.DISPUTED,
  ],
  [ProjectStatus.CUSTOMER_SHIPPED]: [
    ProjectStatus.SELLER_RECEIVED,
    ProjectStatus.DISPUTED,
  ],
  [ProjectStatus.SELLER_RECEIVED]: [
    ProjectStatus.IN_PRODUCTION,
    ProjectStatus.DISPUTED,
  ],
  [ProjectStatus.IN_PRODUCTION]: [
    ProjectStatus.INSPECTION,
    ProjectStatus.PRODUCTION_COMPLETED,
    ProjectStatus.DISPUTED,
  ],
  [ProjectStatus.INSPECTION]: [
    ProjectStatus.PRODUCTION_COMPLETED,
    ProjectStatus.IN_PRODUCTION,
    ProjectStatus.DISPUTED,
  ],
  [ProjectStatus.PRODUCTION_COMPLETED]: [
    ProjectStatus.RETURN_SHIPPED,
    ProjectStatus.COMPLETED,
  ],
  [ProjectStatus.RETURN_SHIPPED]: [ProjectStatus.COMPLETED],
  [ProjectStatus.COMPLETED]: [],
  [ProjectStatus.CANCELLED]: [],
  [ProjectStatus.DISPUTED]: [
    ProjectStatus.IN_PRODUCTION,
    ProjectStatus.CANCELLED,
    ProjectStatus.COMPLETED,
  ],
};

export const QUOTE_TRANSITIONS: TransitionMap = {
  [QuoteStatus.DRAFT]: [QuoteStatus.SENT, QuoteStatus.CANCELLED],
  [QuoteStatus.SENT]: [
    QuoteStatus.ACCEPTED,
    QuoteStatus.REJECTED,
    QuoteStatus.REVISION_REQUESTED,
    QuoteStatus.EXPIRED,
    QuoteStatus.CANCELLED,
  ],
  [QuoteStatus.REVISION_REQUESTED]: [
    QuoteStatus.DRAFT,
    QuoteStatus.SENT,
    QuoteStatus.CANCELLED,
  ],
  [QuoteStatus.ACCEPTED]: [],
  [QuoteStatus.REJECTED]: [QuoteStatus.DRAFT, QuoteStatus.CANCELLED],
  [QuoteStatus.EXPIRED]: [QuoteStatus.DRAFT, QuoteStatus.CANCELLED],
  [QuoteStatus.CANCELLED]: [],
};

export const DESIGN_PROOF_TRANSITIONS: TransitionMap = {
  [DesignProofStatus.DRAFT]: [
    DesignProofStatus.SENT,
    DesignProofStatus.CONFIRMATION_PENDING,
  ],
  [DesignProofStatus.SENT]: [
    DesignProofStatus.CONFIRMATION_PENDING,
    DesignProofStatus.REVISION_REQUESTED,
    DesignProofStatus.CONFIRMED,
  ],
  [DesignProofStatus.CONFIRMATION_PENDING]: [
    DesignProofStatus.CONFIRMED,
    DesignProofStatus.REVISION_REQUESTED,
  ],
  [DesignProofStatus.REVISION_REQUESTED]: [
    DesignProofStatus.DRAFT,
    DesignProofStatus.SENT,
    DesignProofStatus.CONFIRMATION_PENDING,
  ],
  [DesignProofStatus.CONFIRMED]: [DesignProofStatus.LOCKED],
  [DesignProofStatus.LOCKED]: [],
};

/**
 * Order transitions use frontend OrderStatus codes.
 * DB may store READY_TO_SHIP for SHIPPING_PENDING — mapped in orderProvider.
 */
export const ORDER_TRANSITIONS: TransitionMap = {
  [OrderStatus.DRAFT]: [
    OrderStatus.PAYMENT_PENDING,
    OrderStatus.ORDER_CONFIRMED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PAYMENT_PENDING]: [
    OrderStatus.PAYMENT_PROCESSING,
    OrderStatus.PAID,
    OrderStatus.PAYMENT_FAILED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PAYMENT_PROCESSING]: [
    OrderStatus.PAID,
    OrderStatus.PAYMENT_FAILED,
  ],
  [OrderStatus.PAID]: [
    OrderStatus.ORDER_CONFIRMED,
    OrderStatus.CUSTOMER_SHIPMENT_PENDING,
    OrderStatus.IN_PRODUCTION,
    OrderStatus.DESIGN_PROOF_PENDING,
  ],
  [OrderStatus.PAYMENT_FAILED]: [
    OrderStatus.PAYMENT_PENDING,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.ORDER_CONFIRMED]: [
    OrderStatus.CUSTOMER_SHIPMENT_PENDING,
    OrderStatus.DESIGN_PROOF_PENDING,
    OrderStatus.IN_PRODUCTION,
    OrderStatus.CANCELLATION_REQUESTED,
  ],
  [OrderStatus.CUSTOMER_SHIPMENT_PENDING]: [
    OrderStatus.CUSTOMER_SHIPPED,
    OrderStatus.CANCELLATION_REQUESTED,
  ],
  [OrderStatus.CUSTOMER_SHIPPED]: [OrderStatus.SELLER_RECEIVED],
  [OrderStatus.SELLER_RECEIVED]: [
    OrderStatus.IN_PRODUCTION,
    OrderStatus.DESIGN_PROOF_PENDING,
  ],
  [OrderStatus.DESIGN_PROOF_PENDING]: [
    OrderStatus.DESIGN_PROOF_CONFIRMED,
    OrderStatus.IN_PRODUCTION,
  ],
  [OrderStatus.DESIGN_PROOF_CONFIRMED]: [OrderStatus.IN_PRODUCTION],
  [OrderStatus.IN_PRODUCTION]: [
    OrderStatus.INSPECTION,
    OrderStatus.PRODUCTION_COMPLETED,
  ],
  [OrderStatus.INSPECTION]: [
    OrderStatus.PRODUCTION_COMPLETED,
    OrderStatus.IN_PRODUCTION,
  ],
  [OrderStatus.PRODUCTION_COMPLETED]: [OrderStatus.SHIPPING_PENDING],
  [OrderStatus.SHIPPING_PENDING]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLATION_REQUESTED]: [
    OrderStatus.CANCELLED,
    OrderStatus.IN_PRODUCTION,
  ],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUND_REQUESTED]: [OrderStatus.REFUND_PROCESSING],
  [OrderStatus.REFUND_PROCESSING]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.DISPUTED]: [
    OrderStatus.IN_PRODUCTION,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
    OrderStatus.COMPLETED,
  ],
};

export const WORKFLOW_TRANSITIONS: Record<WorkflowDomain, TransitionMap> = {
  project: PROJECT_TRANSITIONS,
  quote: QUOTE_TRANSITIONS,
  designProof: DESIGN_PROOF_TRANSITIONS,
  order: ORDER_TRANSITIONS,
};

export function getAllowedTransitions(
  domain: WorkflowDomain,
  fromStatus: string,
): readonly string[] {
  return WORKFLOW_TRANSITIONS[domain][fromStatus] ?? [];
}

export function canTransition(
  domain: WorkflowDomain,
  fromStatus: string,
  toStatus: string,
): boolean {
  if (fromStatus === toStatus) return false;
  return getAllowedTransitions(domain, fromStatus).includes(toStatus);
}
