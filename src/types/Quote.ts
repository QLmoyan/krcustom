import type { QuoteStatus } from "@/constants/status";
import type { TimelineEvent } from "./TimelineEvent";

export type { QuoteStatus };

export interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  editable: boolean;
}

export interface QuoteChangeLogEntry {
  id: string;
  version: number;
  summary: string;
  actor: string;
  occurredAt: string;
}

export interface Quote {
  id: string;
  projectId: string;
  version: number;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  extraFee: number;
  tax: number;
  total: number;
  currency: "KRW";
  note: string;
  createdBy: string;
  approvedBy: string;
  approvedAt: string;
  sentAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  customerConfirmed: boolean;
  changeLog: QuoteChangeLogEntry[];
}

/** Quote timeline steps use the shared TimelineEvent shape. */
export type QuoteTimelineStep = TimelineEvent;
