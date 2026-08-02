import type { TimelineEvent } from "./TimelineEvent";

export type ProjectChatMessageType =
  | "text"
  | "image"
  | "file"
  | "psd"
  | "quote"
  | "designProof"
  | "order"
  | "system"
  | "shipping";

export type ProjectChatSender = "customer" | "seller" | "system";

export interface ProjectChatMessage {
  id: string;
  type: ProjectChatMessageType;
  sender: ProjectChatSender;
  senderName: string;
  createdAt: string;
  text?: string;
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
  quoteId?: string;
  quoteAmount?: number;
  quoteStatus?: string;
  designProofId?: string;
  designProofVersion?: string;
  designProofImageUrl?: string;
  designProofStatus?: string;
  orderId?: string;
  orderNumber?: string;
  orderAmount?: number;
  orderStatus?: string;
  trackingCompany?: string;
  trackingNumber?: string;
  shippingDirection?: "outbound" | "return";
}

export interface ProjectStatusInfo {
  projectNumber: string;
  title: string;
  serviceTitle: string;
  storeName: string;
  customerName: string;
  currentStatus: string;
  tradeMethod: string;
  updatedAt: string;
}

export interface ProjectQuoteInfo {
  quoteNumber: string;
  amount: number;
  status: string;
  validUntil: string;
  items: { label: string; amount: number }[];
  note: string;
}

export interface ProjectDesignProofInfo {
  version: string;
  status: string;
  imageUrl: string;
  sellerNote: string;
  requestedAt: string;
}

export interface ProjectOwnedItemInfo {
  itemCode: string;
  itemName: string;
  customerName: string;
  phoneMasked: string;
  status: string;
  conditionNote: string;
  photoUrls: string[];
}

export interface ProjectLogisticsInfo {
  outbound?: {
    company: string;
    trackingNumber: string;
    status: string;
    shippedAt: string;
  };
  inbound?: {
    company: string;
    trackingNumber: string;
    status: string;
    shippedAt: string;
  };
}

export interface ProjectProductionStep {
  id: string;
  label: string;
  status: "done" | "current" | "upcoming";
}

/** Project workspace timeline uses the shared TimelineEvent shape. */
export type ProjectTimelineEvent = TimelineEvent;

export interface ProjectWorkspace {
  id: string;
  status: ProjectStatusInfo;
  quote: ProjectQuoteInfo;
  designProof: ProjectDesignProofInfo;
  ownedItem: ProjectOwnedItemInfo;
  logistics: ProjectLogisticsInfo;
  productionSteps: ProjectProductionStep[];
  timeline: ProjectTimelineEvent[];
  messages: ProjectChatMessage[];
}
