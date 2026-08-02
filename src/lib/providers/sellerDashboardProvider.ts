import { DesignProofStatus, OrderStatus, QuoteStatus } from "@/constants/status";
import { DEMO } from "@/data/demoFlow";
import {
  mockSellerDashboard,
  type SellerDashboardStat,
  type SellerRecentMessage,
  type SellerTodoItem,
} from "@/data/mockSellerDashboard";
import { listConversations } from "@/lib/providers/chatProvider";
import { listForSeller as listDesignProofsForSeller } from "@/lib/providers/designProofProvider";
import {
  listNotifications,
  type AppNotification,
} from "@/lib/providers/notificationProvider";
import { listForSeller as listOrdersForSeller } from "@/lib/providers/orderProvider";
import { listForSeller as listQuotesForSeller } from "@/lib/providers/quoteProvider";
import { ko } from "@/messages";

export type SellerDashboardDataSource = "supabase" | "mock" | "mixed";

export type SellerDashboardSnapshot = {
  storeName: string;
  sellerName: string;
  stats: SellerDashboardStat[];
  todos: SellerTodoItem[];
  recentMessages: SellerRecentMessage[];
  recentNotifications: AppNotification[];
  pendingQuoteCount: number;
  pendingDesignCount: number;
  pendingProductionCount: number;
  pendingShipmentCount: number;
  source: SellerDashboardDataSource;
};

const PENDING_QUOTE_STATUSES = new Set<string>([
  QuoteStatus.DRAFT,
  QuoteStatus.REVISION_REQUESTED,
]);

const PENDING_DESIGN_STATUSES = new Set<string>([
  DesignProofStatus.DRAFT,
  DesignProofStatus.REVISION_REQUESTED,
  DesignProofStatus.SENT,
  DesignProofStatus.CONFIRMATION_PENDING,
]);

const PENDING_PRODUCTION_STATUSES = new Set<string>([
  OrderStatus.IN_PRODUCTION,
  OrderStatus.INSPECTION,
  "IN_PRODUCTION",
]);

const PENDING_SHIPMENT_STATUSES = new Set<string>([
  OrderStatus.SHIPPING_PENDING,
  OrderStatus.PRODUCTION_COMPLETED,
  "READY_TO_SHIP",
]);

function buildStats(counts: {
  quotes: number;
  design: number;
  production: number;
  shipment: number;
  messages: number;
  notifications: number;
}): SellerDashboardStat[] {
  const base = mockSellerDashboard.stats;
  const byId = Object.fromEntries(base.map((s) => [s.id, s]));

  return [
    {
      ...(byId["stat-messages"] ?? base[0]),
      id: "stat-messages",
      title: ko.seller.workflowStats.pendingMessages,
      count: counts.messages,
      description: ko.seller.workflowStats.pendingMessagesDesc,
      href: `/project/${DEMO.projectId}`,
    },
    {
      ...(byId["stat-quotes"] ?? base[1]),
      id: "stat-quotes",
      title: ko.seller.workflowStats.pendingQuotes,
      count: counts.quotes,
      description: ko.seller.workflowStats.pendingQuotesDesc,
      href: "/seller/quotes",
    },
    {
      ...(byId["stat-proofs"] ?? base[2]),
      id: "stat-proofs",
      title: ko.seller.workflowStats.pendingDesign,
      count: counts.design,
      description: ko.seller.workflowStats.pendingDesignDesc,
      href: "/seller/design-proofs",
    },
    {
      ...(byId["stat-production"] ?? base[4]),
      id: "stat-production",
      title: ko.seller.workflowStats.pendingProduction,
      count: counts.production,
      description: ko.seller.workflowStats.pendingProductionDesc,
      href: "/seller/orders",
    },
    {
      ...(byId["stat-return"] ?? base[5]),
      id: "stat-shipment",
      title: ko.seller.workflowStats.pendingShipment,
      count: counts.shipment,
      description: ko.seller.workflowStats.pendingShipmentDesc,
      href: "/seller/shipments",
    },
    {
      ...(byId["stat-owned"] ?? base[3]),
      id: "stat-notifications",
      title: ko.seller.workflowStats.latestNotifications,
      count: counts.notifications,
      description: ko.seller.workflowStats.latestNotificationsDesc,
      href: "/seller/messages",
    },
  ];
}

function deriveTodos(input: {
  quoteCount: number;
  designCount: number;
  productionCount: number;
  shipmentCount: number;
}): SellerTodoItem[] {
  const items: SellerTodoItem[] = [];

  if (input.quoteCount > 0) {
    items.push({
      id: "todo-workflow-quote",
      type: "quote",
      title: ko.seller.workflowTodos.quoteTitle,
      orderNumber: "—",
      customerName: "—",
      dueTime: ko.seller.workflowTodos.today,
      priority: "high",
      status: ko.seller.workflowStats.pendingQuotes,
      nextAction: ko.seller.workflowTodos.openQuotes,
    });
  }
  if (input.designCount > 0) {
    items.push({
      id: "todo-workflow-design",
      type: "designProof",
      title: ko.seller.workflowTodos.designTitle,
      orderNumber: "—",
      customerName: "—",
      dueTime: ko.seller.workflowTodos.today,
      priority: "high",
      status: ko.seller.workflowStats.pendingDesign,
      nextAction: ko.seller.workflowTodos.openDesign,
    });
  }
  if (input.productionCount > 0) {
    items.push({
      id: "todo-workflow-production",
      type: "production",
      title: ko.seller.workflowTodos.productionTitle,
      orderNumber: "—",
      customerName: "—",
      dueTime: ko.seller.workflowTodos.today,
      priority: "medium",
      status: ko.seller.workflowStats.pendingProduction,
      nextAction: ko.seller.workflowTodos.openOrders,
    });
  }
  if (input.shipmentCount > 0) {
    items.push({
      id: "todo-workflow-shipment",
      type: "returnShipment",
      title: ko.seller.workflowTodos.shipmentTitle,
      orderNumber: "—",
      customerName: "—",
      dueTime: ko.seller.workflowTodos.today,
      priority: "medium",
      status: ko.seller.workflowStats.pendingShipment,
      nextAction: ko.seller.workflowTodos.openShipments,
    });
  }

  return items.length > 0 ? items : mockSellerDashboard.todos;
}

/**
 * Aggregate seller dashboard metrics from Quote / DesignProof / Order /
 * Notification / Chat providers. Empty or error → mock fallback.
 */
export async function getSellerDashboardSnapshot(): Promise<SellerDashboardSnapshot> {
  const { getCurrentUser } = await import("@/lib/providers/authProvider");
  const user = await getCurrentUser();
  const userId = user?.profile.id ?? null;

  const [quotesResult, proofsResult, ordersResult, notifResult, chatResult] =
    await Promise.all([
      listQuotesForSeller(),
      listDesignProofsForSeller(),
      listOrdersForSeller(),
      listNotifications({ userId, unreadOnly: false }),
      listConversations(),
    ]);

  const sources = [
    quotesResult.source,
    proofsResult.source,
    ordersResult.source,
    notifResult.source,
    chatResult.source,
  ];
  const allMock = sources.every((s) => s === "mock");
  const allSupabase = sources.every((s) => s === "supabase");
  const source: SellerDashboardDataSource = allMock
    ? "mock"
    : allSupabase
      ? "supabase"
      : "mixed";

  const pendingQuoteCount = quotesResult.quotes.filter((q) =>
    PENDING_QUOTE_STATUSES.has(q.status),
  ).length;

  const pendingDesignCount = proofsResult.items.filter((item) =>
    PENDING_DESIGN_STATUSES.has(item.status),
  ).length;

  const pendingProductionCount = ordersResult.orders.filter((o) =>
    PENDING_PRODUCTION_STATUSES.has(o.status),
  ).length;

  const pendingShipmentCount = ordersResult.orders.filter((o) =>
    PENDING_SHIPMENT_STATUSES.has(o.status),
  ).length;

  const unreadMessages = chatResult.conversations.reduce(
    (sum, m) => sum + m.unreadCount,
    0,
  );
  const unreadNotifications = notifResult.notifications.filter(
    (n) => !n.isRead,
  ).length;

  // Prefer live counts; if everything is mock empty, use mock dashboard numbers
  const useMockCounts =
    allMock ||
    (pendingQuoteCount === 0 &&
      pendingDesignCount === 0 &&
      pendingProductionCount === 0 &&
      pendingShipmentCount === 0 &&
      quotesResult.quotes.length === 0);

  if (useMockCounts && allMock) {
    return {
      storeName: mockSellerDashboard.storeName,
      sellerName: mockSellerDashboard.sellerName,
      stats: mockSellerDashboard.stats,
      todos: mockSellerDashboard.todos,
      recentMessages: chatResult.conversations.length
        ? chatResult.conversations
        : mockSellerDashboard.recentMessages,
      recentNotifications: notifResult.notifications.slice(0, 5),
      pendingQuoteCount: mockSellerDashboard.stats.find((s) => s.id === "stat-quotes")
        ?.count ?? 0,
      pendingDesignCount: mockSellerDashboard.stats.find((s) => s.id === "stat-proofs")
        ?.count ?? 0,
      pendingProductionCount: mockSellerDashboard.stats.find(
        (s) => s.id === "stat-production",
      )?.count ?? 0,
      pendingShipmentCount: mockSellerDashboard.stats.find((s) => s.id === "stat-return")
        ?.count ?? 0,
      source: "mock",
    };
  }

  const stats = buildStats({
    quotes: pendingQuoteCount || (byMockStat("stat-quotes") ?? 0),
    design: pendingDesignCount || (byMockStat("stat-proofs") ?? 0),
    production: pendingProductionCount,
    shipment: pendingShipmentCount || (byMockStat("stat-return") ?? 0),
    messages: unreadMessages || (byMockStat("stat-messages") ?? 0),
    notifications: unreadNotifications,
  });

  return {
    storeName: mockSellerDashboard.storeName,
    sellerName: mockSellerDashboard.sellerName,
    stats,
    todos: deriveTodos({
      quoteCount: pendingQuoteCount,
      designCount: pendingDesignCount,
      productionCount: pendingProductionCount,
      shipmentCount: pendingShipmentCount,
    }),
    recentMessages:
      chatResult.conversations.length > 0
        ? chatResult.conversations
        : mockSellerDashboard.recentMessages,
    recentNotifications: notifResult.notifications.slice(0, 5),
    pendingQuoteCount,
    pendingDesignCount,
    pendingProductionCount,
    pendingShipmentCount,
    source,
  };
}

function byMockStat(id: string): number | undefined {
  return mockSellerDashboard.stats.find((s) => s.id === id)?.count;
}
