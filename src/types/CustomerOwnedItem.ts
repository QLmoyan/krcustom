import type { CustomerOwnedItemStatus } from "@/constants/status";
import type { TimelineEvent } from "./TimelineEvent";

export type OwnedItemLifecycleStatus = CustomerOwnedItemStatus;

export type OwnedItemType =
  | "tshirt"
  | "hoodie"
  | "ecoBag"
  | "cap"
  | "sneakers"
  | "jacket";

export type AnomalyReason =
  | "quantityMismatch"
  | "colorMismatch"
  | "sizeMismatch"
  | "existingStain"
  | "existingDamage"
  | "wrongItem"
  | "unworkableMaterial"
  | "other";

/** @deprecated Prefer TimelineEvent directly. */
export type OwnedItemActivity = TimelineEvent;

export interface CustomerOwnedItem {
  id: string;
  itemNumber: string;
  projectId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerPhoneLast4: string;
  serviceName: string;
  itemType: OwnedItemType;
  itemTypeLabel: string;
  brand: string;
  color: string;
  size: string;
  quantity: number;
  declaredValue: number;
  trackingCompany: string;
  trackingNumber: string;
  shipmentStatus: string;
  receivedStatus: string;
  conditionStatus: string;
  productionStatus: string;
  returnStatus: string;
  lifecycleStatus: OwnedItemLifecycleStatus;
  isAnomaly: boolean;
  anomalyReasons: AnomalyReason[];
  anomalyNote: string;
  packageNote: string;
  productionRequirement: string;
  customerPhotos: string[];
  receivedPhotos: string[];
  defectNotes: string;
  labelPrintCount: number;
  lastPrintedAt: string;
  lastPrintedBy: string;
  inspectedBy: string;
  matchesCustomerClaim: boolean | null;
  hasContamination: boolean | null;
  hasDamage: boolean | null;
  hasExistingDefect: boolean | null;
  canProduce: boolean | null;
  inspectorMemo: string;
  returnTrackingCompany: string;
  returnTrackingNumber: string;
  activityLog: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
