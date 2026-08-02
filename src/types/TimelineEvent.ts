import type { UploadedFile } from "./UploadedFile";

export type TimelineEventStatus =
  | "COMPLETED"
  | "CURRENT"
  | "UPCOMING"
  | "ERROR"
  | "CANCELLED";

export type TimelineActorType =
  | "CUSTOMER"
  | "SELLER"
  | "SYSTEM"
  | "ADMIN";

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  status: TimelineEventStatus;
  actorType: TimelineActorType;
  actorName: string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
  evidenceFiles?: UploadedFile[];
}
