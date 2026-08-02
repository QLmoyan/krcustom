import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  OrderInsert,
  OrderItemInsert,
  OrderItemRow,
  OrderRow,
  OrderUpdate,
  PaymentRecordInsert,
  PaymentRecordRow,
} from "@/types/database";

export { isProjectUuid as isOrderUuid };

export type OrderWithRelations = OrderRow & {
  order_items: OrderItemRow[];
  payment_records: PaymentRecordRow[];
  projects: { id: string; demo_key: string | null; project_number: string } | null;
  quotes: { id: string; demo_key: string | null; version: number } | null;
};

const ORDER_SELECT = `
  *,
  order_items (*),
  payment_records (*),
  projects ( id, demo_key, project_number ),
  quotes ( id, demo_key, version )
`;

async function resolveProjectUuid(identifier: string): Promise<string | null> {
  const supabase = await createClient();
  if (isProjectUuid(identifier)) {
    return identifier;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("demo_key", identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

/**
 * Load an order by UUID primary key, demo_key (ord-001), or order_number.
 */
export async function getById(
  identifier: string,
): Promise<OrderWithRelations | null> {
  const supabase = await createClient();

  if (isProjectUuid(identifier)) {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("id", identifier)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as OrderWithRelations | null;
  }

  const { data: byDemoKey, error: demoError } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("demo_key", identifier)
    .maybeSingle();

  if (demoError) {
    throw demoError;
  }

  if (byDemoKey) {
    return byDemoKey as OrderWithRelations;
  }

  const { data: byNumber, error: numberError } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("order_number", identifier)
    .maybeSingle();

  if (numberError) {
    throw numberError;
  }

  return (byNumber as OrderWithRelations | null) ?? null;
}

/**
 * Order for a project (UUID id or demo_key like prj-001).
 */
export async function getByProject(
  projectIdentifier: string,
): Promise<OrderWithRelations | null> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as OrderWithRelations | null;
}

export async function listByProject(
  projectIdentifier: string,
): Promise<OrderWithRelations[]> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as OrderWithRelations[];
}

/** Seller / customer list — all orders, newest updated first. */
export type OrderListFilter = {
  sellerId?: string;
  customerId?: string;
};

export async function listOrders(
  filter?: OrderListFilter,
): Promise<OrderWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("updated_at", { ascending: false });

  if (filter?.sellerId) {
    query = query.eq("seller_id", filter.sellerId);
  }
  if (filter?.customerId) {
    query = query.eq("customer_id", filter.customerId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as OrderWithRelations[];
}

export async function getOrderItems(
  orderIdentifier: string,
): Promise<OrderItemRow[]> {
  const order = await getById(orderIdentifier);
  if (!order) {
    return [];
  }
  return order.order_items ?? [];
}

export async function getPaymentRecords(
  orderIdentifier: string,
): Promise<PaymentRecordRow[]> {
  const order = await getById(orderIdentifier);
  if (!order) {
    return [];
  }
  return order.payment_records ?? [];
}

export async function getPaymentStatus(
  orderIdentifier: string,
): Promise<string | null> {
  const order = await getById(orderIdentifier);
  return order?.payment_status ?? null;
}

export async function updateStatus(
  identifier: string,
  status: string,
): Promise<OrderWithRelations> {
  const existing = await getById(identifier);
  if (!existing) {
    throw new Error(`Order not found: ${identifier}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status } satisfies OrderUpdate)
    .eq("id", existing.id);

  if (error) {
    throw error;
  }

  const updated = await getById(existing.id);
  if (!updated) {
    throw new Error("Updated order could not be reloaded");
  }
  return updated;
}

type OrderItemInput = {
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  demoKey?: string | null;
};

type PaymentInput = {
  method: string;
  status: string;
  amount: number;
  transactionNo?: string;
  paidAt?: string | null;
  demoKey?: string | null;
};

type OrderCreateInput = {
  projectId: string;
  quoteId?: string | null;
  sellerId: string;
  customerId: string;
  orderNumber: string;
  status: string;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  tax?: number;
  total?: number;
  currency?: string;
  paymentStatus?: string;
  productionStatus?: string;
  shippingStatus?: string;
  demoKey?: string | null;
  items?: OrderItemInput[];
  payment?: PaymentInput;
};

export async function create(
  input: OrderCreateInput,
): Promise<OrderWithRelations> {
  const projectId = await resolveProjectUuid(input.projectId);
  if (!projectId) {
    throw new Error(`Project not found: ${input.projectId}`);
  }

  let quoteId = input.quoteId ?? null;
  if (quoteId && !isProjectUuid(quoteId)) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quotes")
      .select("id")
      .eq("demo_key", quoteId)
      .maybeSingle();
    if (error) {
      throw error;
    }
    quoteId = data?.id ?? null;
  }

  const supabase = await createClient();
  const row: OrderInsert = {
    project_id: projectId,
    quote_id: quoteId,
    seller_id: input.sellerId,
    customer_id: input.customerId,
    order_number: input.orderNumber,
    status: input.status,
    subtotal: input.subtotal ?? 0,
    shipping_fee: input.shippingFee ?? 0,
    discount: input.discount ?? 0,
    tax: input.tax ?? 0,
    total: input.total ?? 0,
    currency: input.currency ?? "KRW",
    payment_status: input.paymentStatus ?? "PENDING",
    production_status: input.productionStatus ?? "PENDING",
    shipping_status: input.shippingStatus ?? "PENDING",
    demo_key: input.demoKey ?? null,
  };

  const { data: created, error } = await supabase
    .from("orders")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  if (input.items && input.items.length > 0) {
    const items: OrderItemInsert[] = input.items.map((item) => ({
      order_id: created.id,
      item_name: item.itemName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      demo_key: item.demoKey ?? null,
    }));
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items);
    if (itemsError) {
      throw itemsError;
    }
  }

  if (input.payment) {
    const payment: PaymentRecordInsert = {
      order_id: created.id,
      method: input.payment.method,
      status: input.payment.status,
      amount: input.payment.amount,
      transaction_no: input.payment.transactionNo ?? "",
      paid_at: input.payment.paidAt ?? null,
      demo_key: input.payment.demoKey ?? null,
    };
    const { error: payError } = await supabase
      .from("payment_records")
      .insert(payment);
    if (payError) {
      throw payError;
    }
  }

  const full = await getById(created.id);
  if (!full) {
    throw new Error("Created order could not be reloaded");
  }
  return full;
}
