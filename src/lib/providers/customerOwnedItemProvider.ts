import {
  CUSTOMER_OWNED_ITEM_STATUS_META,
  CustomerOwnedItemStatus,
} from "@/constants/status";
import {
  getCustomerOwnedItemById as getMockCustomerOwnedItemById,
  mockCustomerOwnedItems,
} from "@/data/mockCustomerOwnedItems";
import { formatKoreanDateTime } from "@/lib/format";
import { resolveCustomerItemPhotoUrls } from "@/lib/providers/storageProvider";
import * as customerOwnedItemRepository from "@/repositories/customerOwnedItem";
import type { CustomerOwnedItemWithProject } from "@/repositories/customerOwnedItem";
import type {
  AnomalyReason,
  CustomerOwnedItem,
  OwnedItemType,
} from "@/types/CustomerOwnedItem";
import type { ProjectOwnedItemInfo } from "@/types/Project";
import type { TimelineEvent } from "@/types/TimelineEvent";

export type CustomerOwnedItemDataSource = "supabase" | "mock";

export type CustomerOwnedItemResult = {
  item: CustomerOwnedItem | undefined;
  source: CustomerOwnedItemDataSource;
};

export type CustomerOwnedItemsResult = {
  items: CustomerOwnedItem[];
  source: CustomerOwnedItemDataSource;
};

function displayOrEmpty(value: string | null | undefined): string {
  if (!value) return "";
  return formatKoreanDateTime(value);
}

function photosFromJson(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function mapCategory(value: string): OwnedItemType {
  const allowed: OwnedItemType[] = [
    "tshirt",
    "hoodie",
    "ecoBag",
    "cap",
    "sneakers",
    "jacket",
  ];
  return (allowed.includes(value as OwnedItemType)
    ? value
    : "tshirt") as OwnedItemType;
}

function mapLifecycleStatus(value: string): CustomerOwnedItem["lifecycleStatus"] {
  const codes = Object.values(CustomerOwnedItemStatus);
  if (codes.includes(value as CustomerOwnedItem["lifecycleStatus"])) {
    return value as CustomerOwnedItem["lifecycleStatus"];
  }
  return CustomerOwnedItemStatus.WAITING_CUSTOMER_SHIPMENT;
}

function itemTypeLabelFrom(
  category: OwnedItemType,
  name: string,
  mockLabel?: string,
): string {
  if (name) return name;
  if (mockLabel) return mockLabel;
  switch (category) {
    case "sneakers":
      return "운동화";
    case "hoodie":
      return "후드티";
    case "ecoBag":
      return "에코백";
    case "cap":
      return "모자";
    case "jacket":
      return "자켓";
    default:
      return "흰색 티셔츠";
  }
}

/**
 * Map DB row to frontend CustomerOwnedItem.
 * Keeps demo_key as id / project demo_key as projectId for routes.
 * Enriches UI-only fields from mock when present.
 */
export function mapRowToCustomerOwnedItem(
  row: CustomerOwnedItemWithProject,
): CustomerOwnedItem {
  const demoId = row.demo_key ?? row.id;
  const mock = getMockCustomerOwnedItemById(demoId);
  const projectDemoKey = row.projects?.demo_key ?? null;
  const category = mapCategory(row.category);
  const lifecycleStatus = mapLifecycleStatus(row.status);
  const photos = photosFromJson(row.photos);
  const statusLabel =
    CUSTOMER_OWNED_ITEM_STATUS_META[lifecycleStatus]?.label ?? row.status;

  return {
    id: demoId,
    itemNumber: row.item_number,
    projectId: projectDemoKey ?? row.project_id,
    orderNumber: mock?.orderNumber ?? "",
    customerName: mock?.customerName ?? "",
    customerPhone: mock?.customerPhone ?? "",
    customerPhoneLast4: mock?.customerPhoneLast4 ?? "",
    serviceName: mock?.serviceName ?? "",
    itemType: category,
    itemTypeLabel: itemTypeLabelFrom(category, row.name, mock?.itemTypeLabel),
    brand: row.brand || (mock?.brand ?? ""),
    color: row.color || (mock?.color ?? ""),
    size: row.size || (mock?.size ?? ""),
    quantity: row.quantity,
    declaredValue: mock?.declaredValue ?? 0,
    trackingCompany: row.tracking_company || (mock?.trackingCompany ?? ""),
    trackingNumber: row.tracking_number || (mock?.trackingNumber ?? ""),
    shipmentStatus: mock?.shipmentStatus ?? statusLabel,
    receivedStatus: row.received_at
      ? (mock?.receivedStatus ?? "수령 확인")
      : (mock?.receivedStatus ?? "미수령"),
    conditionStatus: row.condition || (mock?.conditionStatus ?? "기록 전"),
    productionStatus: mock?.productionStatus ?? "대기",
    returnStatus: mock?.returnStatus ?? "해당 없음",
    lifecycleStatus,
    isAnomaly: mock?.isAnomaly ?? false,
    anomalyReasons: (mock?.anomalyReasons ?? []) as AnomalyReason[],
    anomalyNote: mock?.anomalyNote ?? "",
    packageNote: row.notes || (mock?.packageNote ?? ""),
    productionRequirement: mock?.productionRequirement ?? "",
    customerPhotos: photos.length > 0 ? photos : (mock?.customerPhotos ?? []),
    receivedPhotos: mock?.receivedPhotos ?? [],
    defectNotes: mock?.defectNotes ?? "",
    labelPrintCount: mock?.labelPrintCount ?? 0,
    lastPrintedAt: mock?.lastPrintedAt ?? "",
    lastPrintedBy: mock?.lastPrintedBy ?? "",
    inspectedBy: mock?.inspectedBy ?? "",
    matchesCustomerClaim: mock?.matchesCustomerClaim ?? null,
    hasContamination: mock?.hasContamination ?? null,
    hasDamage: mock?.hasDamage ?? null,
    hasExistingDefect: mock?.hasExistingDefect ?? null,
    canProduce: mock?.canProduce ?? null,
    inspectorMemo: mock?.inspectorMemo ?? "",
    returnTrackingCompany: mock?.returnTrackingCompany ?? "",
    returnTrackingNumber: mock?.returnTrackingNumber ?? "",
    activityLog: (mock?.activityLog ?? []) as TimelineEvent[],
    createdAt: displayOrEmpty(row.created_at),
    updatedAt: displayOrEmpty(row.updated_at),
  };
}

/**
 * Prefer Storage photo objects when present; otherwise keep DB / mock picsum.
 */
async function withResolvedItemPhotos(
  item: CustomerOwnedItem,
): Promise<CustomerOwnedItem> {
  const [customerPhotos, receivedPhotos] = await Promise.all([
    resolveCustomerItemPhotoUrls(item.customerPhotos, {
      itemId: item.id,
      fallbackPhotos: item.customerPhotos,
    }),
    resolveCustomerItemPhotoUrls(item.receivedPhotos, {
      itemId: item.id,
      fallbackPhotos: item.receivedPhotos,
    }),
  ]);
  return { ...item, customerPhotos, receivedPhotos };
}

/** Compact shape for Project workspace owned-item module. */
export function toProjectOwnedItemInfo(
  item: CustomerOwnedItem,
): ProjectOwnedItemInfo {
  const statusLabel =
    CUSTOMER_OWNED_ITEM_STATUS_META[item.lifecycleStatus]?.label ??
    item.shipmentStatus;

  return {
    itemCode: item.itemNumber,
    itemName: item.itemTypeLabel || `${item.brand} ${item.color}`.trim(),
    customerName: item.customerName,
    phoneMasked: item.customerPhoneLast4
      ? `****${item.customerPhoneLast4}`
      : item.customerPhone
        ? `****${item.customerPhone.replace(/\D/g, "").slice(-4)}`
        : "",
    status: statusLabel,
    conditionNote:
      item.packageNote ||
      item.inspectorMemo ||
      item.defectNotes ||
      "판매자 수령 대기 중입니다. 수령 후 개봉 사진을 등록합니다.",
    photoUrls:
      item.customerPhotos.length > 0
        ? item.customerPhotos
        : item.receivedPhotos,
  };
}

function mergeList(fromDb: CustomerOwnedItem[]): CustomerOwnedItem[] {
  const keys = new Set(fromDb.map((item) => item.id));
  const extras = mockCustomerOwnedItems.filter((item) => !keys.has(item.id));
  return [...fromDb, ...extras].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

/**
 * Single item by UUID / demo_key / item_number. Falls back to mock.
 */
export async function getCustomerOwnedItemById(
  identifier: string,
): Promise<CustomerOwnedItemResult> {
  try {
    const row = await customerOwnedItemRepository.getById(identifier);
    if (row) {
      return {
        item: await withResolvedItemPhotos(mapRowToCustomerOwnedItem(row)),
        source: "supabase",
      };
    }
  } catch {
    // fall through
  }

  const mock = getMockCustomerOwnedItemById(identifier);
  return {
    item: mock ? await withResolvedItemPhotos(mock) : undefined,
    source: "mock",
  };
}

/**
 * Owned item for a project workspace (UUID or demo_key prj-001).
 */
export async function getCustomerOwnedItemByProjectId(
  projectIdentifier: string,
): Promise<CustomerOwnedItemResult> {
  try {
    const row = await customerOwnedItemRepository.getByProject(projectIdentifier);
    if (row) {
      return {
        item: await withResolvedItemPhotos(mapRowToCustomerOwnedItem(row)),
        source: "supabase",
      };
    }
  } catch {
    // fall through
  }

  const mock = mockCustomerOwnedItems.find(
    (item) => item.projectId === projectIdentifier,
  );
  return {
    item: mock ? await withResolvedItemPhotos(mock) : undefined,
    source: "mock",
  };
}

/**
 * Seller list. Prefers Supabase; merges remaining mock items.
 */
export async function listCustomerOwnedItems(): Promise<CustomerOwnedItemsResult> {
  try {
    const rows = await customerOwnedItemRepository.listItems();
    if (rows.length === 0) {
      const items = await Promise.all(
        mockCustomerOwnedItems.map(withResolvedItemPhotos),
      );
      return { items, source: "mock" };
    }
    return {
      items: await Promise.all(
        mergeList(rows.map(mapRowToCustomerOwnedItem)).map(
          withResolvedItemPhotos,
        ),
      ),
      source: "supabase",
    };
  } catch {
    const items = await Promise.all(
      mockCustomerOwnedItems.map(withResolvedItemPhotos),
    );
    return { items, source: "mock" };
  }
}

export async function confirmReceipt(
  identifier: string,
  input?: Parameters<typeof customerOwnedItemRepository.confirmReceipt>[1],
) {
  return customerOwnedItemRepository.confirmReceipt(identifier, input);
}

export async function updateOwnedItemStatus(
  identifier: string,
  status: string,
) {
  return customerOwnedItemRepository.updateStatus(identifier, status);
}
