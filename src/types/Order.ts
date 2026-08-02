import type { OrderStatus } from "@/constants/status";
import type { TimelineEvent } from "./TimelineEvent";

export type { OrderStatus };

export type OrderType =
  | "DIRECT_PURCHASE"
  | "QUOTE_BASED"
  | "CUSTOMER_OWNED_ITEM";

export type PaymentStatusValue =
  | "READY"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface OrderAddress {
  name: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
}

export interface OrderShipmentInfo {
  company: string;
  trackingNumber: string;
  status: string;
  shippedAt: string;
}

export interface OrderOwnedItemInfo {
  itemNumber: string;
  itemName: string;
  lifecycleLabel: string;
  stage:
    | "WAITING_SHIPMENT"
    | "CUSTOMER_SHIPPED"
    | "SELLER_RECEIVED"
    | "IN_PRODUCTION"
    | "RETURN_SHIPPING";
}

export interface OrderProductionStep {
  id: string;
  label: string;
  status: "done" | "current" | "upcoming";
}

export interface Order {
  id: string;
  orderNumber: string;
  projectId: string;
  quoteId: string;
  designProofId: string;
  customerId: string;
  sellerId: string;
  storeId: string;
  serviceId: string;
  orderType: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatusValue;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  extraFee: number;
  tax: number;
  total: number;
  currency: "KRW";
  customerNote: string;
  sellerNote: string;
  shippingAddress: OrderAddress;
  returnAddress: OrderAddress;
  serviceName: string;
  storeName: string;
  customerName: string;
  nextAction: string;
  quoteVersion: number;
  designProofVersion: number;
  designProofStatusLabel: string;
  ownedItem?: OrderOwnedItemInfo;
  outboundShipment?: OrderShipmentInfo;
  returnShipment?: OrderShipmentInfo;
  productionSteps: OrderProductionStep[];
  timeline: TimelineEvent[];
  paymentId: string;
  createdAt: string;
  paidAt: string;
  completedAt: string;
  updatedAt: string;
}
