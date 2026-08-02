import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  QuoteInsert,
  QuoteItemInsert,
  QuoteItemRow,
  QuoteRevisionInsert,
  QuoteRevisionRow,
  QuoteRow,
} from "@/types/database";

export { isProjectUuid as isQuoteUuid };

type QuoteItemInput = {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  editable?: boolean;
  sortOrder?: number;
  demoKey?: string | null;
};

type QuoteCreateInput = {
  projectId: string;
  version?: number;
  status: string;
  items?: QuoteItemInput[];
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  extraFee?: number;
  tax?: number;
  total?: number;
  currency?: string;
  note?: string;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string | null;
  sentAt?: string | null;
  expiresAt?: string | null;
  customerConfirmed?: boolean;
  demoKey?: string | null;
  revisionSummary?: string;
  revisionActor?: string;
};

export type QuoteWithRelations = QuoteRow & {
  quote_items: QuoteItemRow[];
  quote_revisions: QuoteRevisionRow[];
  projects: { id: string; demo_key: string | null } | null;
};

const QUOTE_SELECT = `
  *,
  quote_items (*),
  quote_revisions (*),
  projects ( id, demo_key )
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
 * Load a quote by UUID primary key, or by demo_key (e.g. quote-prj001-v3).
 */
export async function getById(
  identifier: string,
): Promise<QuoteWithRelations | null> {
  const supabase = await createClient();
  const column = isProjectUuid(identifier) ? "id" : "demo_key";

  const { data, error } = await supabase
    .from("quotes")
    .select(QUOTE_SELECT)
    .eq(column, identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as QuoteWithRelations | null;
}

/**
 * List quotes for a project (UUID id or demo_key like prj-001), newest version first.
 */
export async function listByProject(
  projectIdentifier: string,
): Promise<QuoteWithRelations[]> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select(QUOTE_SELECT)
    .eq("project_id", projectId)
    .order("version", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as QuoteWithRelations[];
}

export type QuoteSellerFilter = {
  sellerId?: string;
};

/** Seller quote list — newest updated first; optional seller via project ids. */
export async function listForSeller(
  filter?: QuoteSellerFilter,
): Promise<QuoteWithRelations[]> {
  const supabase = await createClient();

  let projectIds: string[] | null = null;
  if (filter?.sellerId) {
    const { data: projects, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("seller_id", filter.sellerId);

    if (projectError) {
      throw projectError;
    }

    projectIds = (projects ?? []).map((p) => p.id);
    if (projectIds.length === 0) {
      return [];
    }
  }

  let query = supabase
    .from("quotes")
    .select(QUOTE_SELECT)
    .order("updated_at", { ascending: false });

  if (projectIds) {
    query = query.in("project_id", projectIds);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as QuoteWithRelations[];
}

async function insertItems(
  quoteId: string,
  items: QuoteItemInput[],
): Promise<QuoteItemRow[]> {
  if (items.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const rows: QuoteItemInsert[] = items.map((item, index) => ({
    quote_id: quoteId,
    name: item.name,
    description: item.description ?? "",
    quantity: item.quantity,
    unit_price: item.unitPrice,
    amount: item.amount,
    editable: item.editable ?? true,
    sort_order: item.sortOrder ?? index + 1,
    demo_key: item.demoKey ?? null,
  }));

  const { data, error } = await supabase
    .from("quote_items")
    .insert(rows)
    .select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function insertRevision(
  input: QuoteRevisionInsert,
): Promise<QuoteRevisionRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_revisions")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create a new quote version (append). Does not overwrite existing versions.
 */
export async function create(
  input: QuoteCreateInput,
): Promise<QuoteWithRelations> {
  const projectId = await resolveProjectUuid(input.projectId);
  if (!projectId) {
    throw new Error(`Project not found: ${input.projectId}`);
  }

  const supabase = await createClient();

  let version = input.version;
  if (version == null) {
    const { data: latest, error: latestError } = await supabase
      .from("quotes")
      .select("version")
      .eq("project_id", projectId)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) {
      throw latestError;
    }

    version = (latest?.version ?? 0) + 1;
  }

  const row: QuoteInsert = {
    project_id: projectId,
    version,
    status: input.status,
    subtotal: input.subtotal ?? 0,
    discount: input.discount ?? 0,
    shipping_fee: input.shippingFee ?? 0,
    extra_fee: input.extraFee ?? 0,
    tax: input.tax ?? 0,
    total: input.total ?? 0,
    currency: input.currency ?? "KRW",
    note: input.note ?? "",
    created_by: input.createdBy ?? "",
    approved_by: input.approvedBy ?? "",
    approved_at: input.approvedAt ?? null,
    sent_at: input.sentAt ?? null,
    expires_at: input.expiresAt ?? null,
    customer_confirmed: input.customerConfirmed ?? false,
    demo_key: input.demoKey ?? null,
  };

  const { data: created, error } = await supabase
    .from("quotes")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  await insertItems(created.id, input.items ?? []);
  await insertRevision({
    quote_id: created.id,
    version: created.version,
    summary: input.revisionSummary ?? `견적 V${created.version} 생성`,
    actor: input.revisionActor ?? input.createdBy ?? "",
    occurred_at: new Date().toISOString(),
  });

  const full = await getById(created.id);
  if (!full) {
    throw new Error("Created quote could not be reloaded");
  }
  return full;
}

/**
 * Append-only update: creates a new version from the source quote + patch.
 * Historical quote rows are never overwritten.
 */
export async function update(
  identifier: string,
  patch: Partial<QuoteCreateInput>,
): Promise<QuoteWithRelations> {
  const existing = await getById(identifier);
  if (!existing) {
    throw new Error(`Quote not found: ${identifier}`);
  }

  const itemsFromExisting: QuoteItemInput[] = existing.quote_items
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      amount: item.amount,
      editable: item.editable,
      sortOrder: item.sort_order,
    }));

  return create({
    projectId: existing.project_id,
    status: patch.status ?? existing.status,
    items: patch.items ?? itemsFromExisting,
    subtotal: patch.subtotal ?? existing.subtotal,
    discount: patch.discount ?? existing.discount,
    shippingFee: patch.shippingFee ?? existing.shipping_fee,
    extraFee: patch.extraFee ?? existing.extra_fee,
    tax: patch.tax ?? existing.tax,
    total: patch.total ?? existing.total,
    currency: patch.currency ?? existing.currency,
    note: patch.note ?? existing.note,
    createdBy: patch.createdBy ?? existing.created_by,
    approvedBy: patch.approvedBy ?? existing.approved_by,
    approvedAt:
      patch.approvedAt !== undefined
        ? patch.approvedAt
        : existing.approved_at,
    sentAt: patch.sentAt !== undefined ? patch.sentAt : existing.sent_at,
    expiresAt:
      patch.expiresAt !== undefined ? patch.expiresAt : existing.expires_at,
    customerConfirmed:
      patch.customerConfirmed ?? existing.customer_confirmed,
    demoKey: patch.demoKey ?? null,
    revisionSummary:
      patch.revisionSummary ?? `견적 V${existing.version} 기반 새 버전`,
    revisionActor: patch.revisionActor ?? patch.createdBy ?? existing.created_by,
  });
}
