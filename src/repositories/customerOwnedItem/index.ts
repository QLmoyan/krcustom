import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  CustomerOwnedItemInsert,
  CustomerOwnedItemRow,
  CustomerOwnedItemUpdate,
  Json,
} from "@/types/database";

export { isProjectUuid as isCustomerOwnedItemUuid };

export type CustomerOwnedItemWithProject = CustomerOwnedItemRow & {
  projects: { id: string; demo_key: string | null; project_number: string } | null;
};

const ITEM_SELECT = `
  *,
  projects ( id, demo_key, project_number )
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
 * Load by UUID primary key, demo_key (coi-003), or item_number.
 */
export async function getById(
  identifier: string,
): Promise<CustomerOwnedItemWithProject | null> {
  const supabase = await createClient();

  if (isProjectUuid(identifier)) {
    const { data, error } = await supabase
      .from("customer_owned_items")
      .select(ITEM_SELECT)
      .eq("id", identifier)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as CustomerOwnedItemWithProject | null;
  }

  const { data: byDemoKey, error: demoError } = await supabase
    .from("customer_owned_items")
    .select(ITEM_SELECT)
    .eq("demo_key", identifier)
    .maybeSingle();

  if (demoError) {
    throw demoError;
  }

  if (byDemoKey) {
    return byDemoKey as CustomerOwnedItemWithProject;
  }

  const { data: byNumber, error: numberError } = await supabase
    .from("customer_owned_items")
    .select(ITEM_SELECT)
    .eq("item_number", identifier)
    .maybeSingle();

  if (numberError) {
    throw numberError;
  }

  return (byNumber as CustomerOwnedItemWithProject | null) ?? null;
}

/**
 * Item for a project (UUID id or demo_key like prj-001).
 */
export async function getByProject(
  projectIdentifier: string,
): Promise<CustomerOwnedItemWithProject | null> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customer_owned_items")
    .select(ITEM_SELECT)
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as CustomerOwnedItemWithProject | null;
}

export async function listByProject(
  projectIdentifier: string,
): Promise<CustomerOwnedItemWithProject[]> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customer_owned_items")
    .select(ITEM_SELECT)
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as CustomerOwnedItemWithProject[];
}

/** Seller list — all items, newest updated first. */
export async function listItems(): Promise<CustomerOwnedItemWithProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customer_owned_items")
    .select(ITEM_SELECT)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as CustomerOwnedItemWithProject[];
}

type ConfirmReceiptInput = {
  receivedAt?: string | null;
  notes?: string;
  condition?: string;
  status?: string;
  photos?: string[];
};

/**
 * Seller confirms receipt of a customer-owned item.
 */
export async function confirmReceipt(
  identifier: string,
  input: ConfirmReceiptInput = {},
): Promise<CustomerOwnedItemWithProject> {
  const existing = await getById(identifier);
  if (!existing) {
    throw new Error(`Customer owned item not found: ${identifier}`);
  }

  const supabase = await createClient();
  const patch: CustomerOwnedItemUpdate = {
    received_at: input.receivedAt ?? new Date().toISOString(),
    status: input.status ?? "RECEIVED",
  };

  if (input.notes !== undefined) {
    patch.notes = input.notes;
  }
  if (input.condition !== undefined) {
    patch.condition = input.condition;
  }
  if (input.photos !== undefined) {
    patch.photos = input.photos as Json;
  }

  const { error } = await supabase
    .from("customer_owned_items")
    .update(patch)
    .eq("id", existing.id);

  if (error) {
    throw error;
  }

  const updated = await getById(existing.id);
  if (!updated) {
    throw new Error("Updated customer owned item could not be reloaded");
  }
  return updated;
}

export async function updateStatus(
  identifier: string,
  status: string,
): Promise<CustomerOwnedItemWithProject> {
  const existing = await getById(identifier);
  if (!existing) {
    throw new Error(`Customer owned item not found: ${identifier}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customer_owned_items")
    .update({ status } satisfies CustomerOwnedItemUpdate)
    .eq("id", existing.id);

  if (error) {
    throw error;
  }

  const updated = await getById(existing.id);
  if (!updated) {
    throw new Error("Updated customer owned item could not be reloaded");
  }
  return updated;
}

type CustomerOwnedItemCreateInput = {
  projectId: string;
  customerId: string;
  itemNumber: string;
  category: string;
  name: string;
  brand?: string;
  color?: string;
  size?: string;
  condition?: string;
  quantity?: number;
  trackingCompany?: string;
  trackingNumber?: string;
  receivedAt?: string | null;
  notes?: string;
  photos?: string[];
  status: string;
  demoKey?: string | null;
};

export async function create(
  input: CustomerOwnedItemCreateInput,
): Promise<CustomerOwnedItemWithProject> {
  const projectId = await resolveProjectUuid(input.projectId);
  if (!projectId) {
    throw new Error(`Project not found: ${input.projectId}`);
  }

  const supabase = await createClient();
  const row: CustomerOwnedItemInsert = {
    project_id: projectId,
    customer_id: input.customerId,
    item_number: input.itemNumber,
    category: input.category,
    name: input.name,
    brand: input.brand ?? "",
    color: input.color ?? "",
    size: input.size ?? "",
    condition: input.condition ?? "",
    quantity: input.quantity ?? 1,
    tracking_company: input.trackingCompany ?? "",
    tracking_number: input.trackingNumber ?? "",
    received_at: input.receivedAt ?? null,
    notes: input.notes ?? "",
    photos: (input.photos ?? []) as Json,
    status: input.status,
    demo_key: input.demoKey ?? null,
  };

  const { data: created, error } = await supabase
    .from("customer_owned_items")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const full = await getById(created.id);
  if (!full) {
    throw new Error("Created customer owned item could not be reloaded");
  }
  return full;
}
