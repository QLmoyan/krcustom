import { OrderStatus } from "@/constants/status";
import {
  getOrderById as getMockOrderById,
  getOrderByProjectId as getMockOrderByProjectId,
  getOrdersByCustomer as getMockOrdersByCustomer,
  mockOrders,
} from "@/data/mockOrders";
import {
  getPaymentById as getMockPaymentById,
  getPaymentByOrderId as getMockPaymentByOrderId,
  mockPayments,
} from "@/data/mockPayments";
import { formatKoreanDateTime } from "@/lib/format";
import * as orderRepository from "@/repositories/order";
import type { OrderWithRelations } from "@/repositories/order";
import type { Order, OrderItem, PaymentStatusValue } from "@/types/Order";
import type { Payment, PaymentMethod } from "@/types/Payment";
import type { PaymentStatus } from "@/types/Payment";
import type { PaymentRecordRow } from "@/types/database";

export type OrderDataSource = "supabase" | "mock";

export type OrdersResult = {
  orders: Order[];
  source: OrderDataSource;
};

export type OrderResult = {
  order: Order | undefined;
  source: OrderDataSource;
};

export type PaymentResult = {
  payment: Payment | undefined;
  source: OrderDataSource;
};

/** DB order.status → frontend OrderStatus (UI constants unchanged). */
function mapDbOrderStatus(value: string): Order["status"] {
  switch (value) {
    case "DRAFT":
      return OrderStatus.DRAFT;
    case "CONFIRMED":
      return OrderStatus.ORDER_CONFIRMED;
    case "IN_PRODUCTION":
      return OrderStatus.IN_PRODUCTION;
    case "READY_TO_SHIP":
      return OrderStatus.SHIPPING_PENDING;
    case "COMPLETED":
      return OrderStatus.COMPLETED;
    case "CANCELLED":
      return OrderStatus.CANCELLED;
    default:
      return (value as Order["status"]) || OrderStatus.DRAFT;
  }
}

/** DB payment_status PENDING|PAID|REFUNDED → frontend PaymentStatusValue. */
function mapDbPaymentStatus(value: string): PaymentStatusValue {
  switch (value) {
    case "PENDING":
      return "READY";
    case "PAID":
      return "PAID";
    case "REFUNDED":
      return "REFUNDED";
    default:
      return (value as PaymentStatusValue) || "READY";
  }
}

function mapDbPaymentRecordStatus(value: string): PaymentStatus {
  switch (value) {
    case "PENDING":
      return "READY";
    case "PAID":
      return "PAID";
    case "REFUNDED":
      return "REFUNDED";
    default:
      return (value as PaymentStatus) || "READY";
  }
}

function displayOrEmpty(value: string | null | undefined): string {
  if (!value) return "";
  return formatKoreanDateTime(value);
}

function mapItems(
  rows: OrderWithRelations["order_items"],
  mock?: Order,
): OrderItem[] {
  if (!rows || rows.length === 0) {
    return mock?.items ?? [];
  }

  return rows.map((row, index) => {
    const mockItem = mock?.items?.[index];
    return {
      id: row.demo_key ?? row.id,
      name: row.item_name,
      description: mockItem?.description ?? "",
      quantity: row.quantity,
      unitPrice: row.unit_price,
      amount: row.total_price,
    };
  });
}

function pickLatestPayment(
  rows: PaymentRecordRow[] | undefined,
): PaymentRecordRow | undefined {
  if (!rows || rows.length === 0) return undefined;
  return rows
    .slice()
    .sort((a, b) => {
      const aTime = a.paid_at ?? a.created_at;
      const bTime = b.paid_at ?? b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    })[0];
}

/**
 * Map DB order (+ relations) to frontend Order.
 * Keeps demo_key as Order.id / project demo_key as projectId for routes.
 * Enriches UI-only fields (addresses, timeline, production) from mock when present.
 */
export function mapOrderRowToOrder(row: OrderWithRelations): Order {
  const demoId = row.demo_key ?? row.id;
  const mock = getMockOrderById(demoId);
  const projectDemoKey = row.projects?.demo_key ?? null;
  const quoteDemoKey = row.quotes?.demo_key ?? null;
  const payment = pickLatestPayment(row.payment_records);

  return {
    id: demoId,
    orderNumber: row.order_number,
    projectId: projectDemoKey ?? row.project_id,
    quoteId: quoteDemoKey ?? row.quote_id ?? mock?.quoteId ?? "",
    designProofId: mock?.designProofId ?? "",
    customerId: mock?.customerId ?? row.customer_id,
    sellerId: mock?.sellerId ?? row.seller_id,
    storeId: mock?.storeId ?? "",
    serviceId: mock?.serviceId ?? "",
    orderType: mock?.orderType ?? "QUOTE_BASED",
    status: mapDbOrderStatus(row.status),
    paymentStatus: mapDbPaymentStatus(row.payment_status),
    items: mapItems(row.order_items, mock),
    subtotal: row.subtotal,
    discount: row.discount,
    shippingFee: row.shipping_fee,
    extraFee: mock?.extraFee ?? 0,
    tax: row.tax,
    total: row.total,
    currency: "KRW",
    customerNote: mock?.customerNote ?? "",
    sellerNote: mock?.sellerNote ?? "",
    shippingAddress: mock?.shippingAddress ?? {
      name: "",
      phone: "",
      postalCode: "",
      address1: "",
      address2: "",
    },
    returnAddress: mock?.returnAddress ?? {
      name: "",
      phone: "",
      postalCode: "",
      address1: "",
      address2: "",
    },
    serviceName: mock?.serviceName ?? "",
    storeName: mock?.storeName ?? "",
    customerName: mock?.customerName ?? "",
    nextAction: mock?.nextAction ?? "",
    quoteVersion: row.quotes?.version ?? mock?.quoteVersion ?? 0,
    designProofVersion: mock?.designProofVersion ?? 0,
    designProofStatusLabel: mock?.designProofStatusLabel ?? "-",
    ownedItem: mock?.ownedItem,
    outboundShipment: mock?.outboundShipment,
    returnShipment: mock?.returnShipment,
    productionSteps: mock?.productionSteps ?? [],
    timeline: mock?.timeline ?? [],
    paymentId: payment?.demo_key ?? payment?.id ?? mock?.paymentId ?? "",
    createdAt: displayOrEmpty(row.created_at),
    paidAt: displayOrEmpty(payment?.paid_at) || (mock?.paidAt ?? ""),
    completedAt: mock?.completedAt ?? "",
    updatedAt: displayOrEmpty(row.updated_at),
  };
}

export function mapPaymentRecordToPayment(
  row: PaymentRecordRow,
  orderDemoKey?: string | null,
): Payment {
  const demoId = row.demo_key ?? row.id;
  const mock = getMockPaymentById(demoId) ??
    (orderDemoKey ? getMockPaymentByOrderId(orderDemoKey) : undefined);

  return {
    id: demoId,
    orderId: orderDemoKey ?? mock?.orderId ?? row.order_id,
    paymentNumber: mock?.paymentNumber ?? `PAY-${row.id.slice(0, 8)}`,
    status: mapDbPaymentRecordStatus(row.status),
    method: row.method as PaymentMethod,
    amount: row.amount,
    currency: "KRW",
    payerName: mock?.payerName ?? "",
    provider: mock?.provider ?? "",
    transactionReference: row.transaction_no || (mock?.transactionReference ?? ""),
    requestedAt: mock?.requestedAt ?? displayOrEmpty(row.created_at),
    approvedAt: displayOrEmpty(row.paid_at) || (mock?.approvedAt ?? ""),
    failedAt: mock?.failedAt ?? "",
    refundedAt: mock?.refundedAt ?? "",
    failureReason: mock?.failureReason ?? "",
  };
}

function mergeList(fromDb: Order[]): Order[] {
  const keys = new Set(fromDb.map((o) => o.id));
  const extras = mockOrders.filter((o) => !keys.has(o.id));
  return [...fromDb, ...extras].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

/**
 * Single order by UUID / demo_key / order_number. Falls back to mockOrders.
 */
export async function getOrderById(identifier: string): Promise<OrderResult> {
  try {
    const row = await orderRepository.getById(identifier);
    if (row) {
      return { order: mapOrderRowToOrder(row), source: "supabase" };
    }
  } catch {
    // fall through
  }

  return {
    order: getMockOrderById(identifier),
    source: "mock",
  };
}

/**
 * Order for a project workspace (UUID or demo_key prj-001).
 */
export async function getOrderByProjectId(
  projectIdentifier: string,
): Promise<OrderResult> {
  try {
    const row = await orderRepository.getByProject(projectIdentifier);
    if (row) {
      return { order: mapOrderRowToOrder(row), source: "supabase" };
    }
  } catch {
    // fall through
  }

  return {
    order: getMockOrderByProjectId(projectIdentifier),
    source: "mock",
  };
}

/**
 * Customer / seller order lists. Prefers Supabase; merges remaining mock
 * orders so list pages keep the full demo catalog.
 */
export async function listOrders(): Promise<OrdersResult> {
  try {
    const rows = await orderRepository.listOrders();
    if (rows.length === 0) {
      return { orders: getMockOrdersByCustomer(), source: "mock" };
    }
    return {
      orders: mergeList(rows.map(mapOrderRowToOrder)),
      source: "supabase",
    };
  } catch {
    return { orders: getMockOrdersByCustomer(), source: "mock" };
  }
}

export async function listForSeller(): Promise<OrdersResult> {
  return listOrders();
}

export async function getOrdersByCustomer(): Promise<OrdersResult> {
  return listOrders();
}

/**
 * Payment for an order (UUID / demo_key). Falls back to mockPayments.
 */
export async function getPaymentByOrderId(
  orderIdentifier: string,
): Promise<PaymentResult> {
  try {
    const row = await orderRepository.getById(orderIdentifier);
    if (row) {
      const payment = pickLatestPayment(row.payment_records);
      if (payment) {
        return {
          payment: mapPaymentRecordToPayment(payment, row.demo_key),
          source: "supabase",
        };
      }
    }
  } catch {
    // fall through
  }

  return {
    payment: getMockPaymentByOrderId(orderIdentifier),
    source: "mock",
  };
}

export async function updateOrderStatus(identifier: string, status: string) {
  return orderRepository.updateStatus(identifier, status);
}

/** Re-export helper labels used by views (mock remains source of labels). */
export { mockPayments };
