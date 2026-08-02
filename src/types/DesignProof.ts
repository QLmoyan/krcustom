import type { DesignProofStatus } from "@/constants/status";
import type { TimelineEvent } from "./TimelineEvent";
import type { UploadedFile } from "./UploadedFile";

export type { DesignProofStatus };

export interface DesignProof {
  id: string;
  proofNumber: string;
  projectId: string;
  projectNumber: string;
  quoteId: string;
  version: number;
  status: DesignProofStatus;
  title: string;
  description: string;
  /** Change summary shown in version history */
  changeSummary: string;
  files: UploadedFile[];
  previewImages: UploadedFile[];
  sellerNote: string;
  customerNote: string;
  revisionReason: string;
  createdBy: string;
  confirmedBy: string;
  sentAt: string;
  confirmedAt: string;
  lockedAt: string;
  createdAt: string;
  updatedAt: string;
  serviceName: string;
  customerName: string;
  storeName: string;
  /** Only one confirmed / production-current version per project */
  isCurrentConfirmed: boolean;
}

export type DesignProofListItem = {
  id: string;
  projectId: string;
  projectNumber: string;
  serviceName: string;
  customerName: string;
  storeName: string;
  latestVersion: number;
  latestProofId: string;
  status: DesignProofStatus;
  recentFeedback: string;
  updatedAt: string;
  thumbnailUrl: string;
};

export type DesignProofTimeline = TimelineEvent[];
