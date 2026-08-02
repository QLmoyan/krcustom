import {
  getLatestQuote as getMockLatestQuote,
  getQuoteById as getMockQuoteById,
  getQuoteTimeline as getMockQuoteTimeline,
  getQuotesByProjectId as getMockQuotesByProjectId,
  mockQuotes,
} from "@/data/mockQuotes";
import { formatKoreanDate, formatKoreanDateTime } from "@/lib/format";
import * as quoteRepository from "@/repositories/quote";
import type { QuoteWithRelations } from "@/repositories/quote";
import type { Quote, QuoteChangeLogEntry, QuoteItem, QuoteTimelineStep } from "@/types/Quote";

export type QuoteDataSource = "supabase" | "mock";

export type QuotesResult = {
  quotes: Quote[];
  source: QuoteDataSource;
};

export type QuoteResult = {
  quote: Quote | undefined;
  source: QuoteDataSource;
};

function displayOrEmpty(value: string | null | undefined): string {
  if (!value) return "";
  return formatKoreanDateTime(value);
}

function displayDateOrEmpty(value: string | null | undefined): string {
  if (!value) return "";
  return formatKoreanDate(value);
}

function mapItem(row: QuoteWithRelations["quote_items"][number]): QuoteItem {
  return {
    id: row.demo_key ?? row.id,
    name: row.name,
    description: row.description,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    amount: row.amount,
    editable: row.editable,
  };
}

function mapChangeLog(
  rows: QuoteWithRelations["quote_revisions"],
): QuoteChangeLogEntry[] {
  return rows
    .slice()
    .sort(
      (a, b) =>
        new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime(),
    )
    .map((row) => ({
      id: row.demo_key ?? row.id,
      version: row.version,
      summary: row.summary,
      actor: row.actor,
      occurredAt: displayOrEmpty(row.occurred_at),
    }));
}

/**
 * Map DB quote (+ relations) to frontend Quote.
 * Keeps demo_key as Quote.id / project demo_key as projectId for routes.
 */
export function mapQuoteRowToQuote(row: QuoteWithRelations): Quote {
  const projectDemoKey = row.projects?.demo_key ?? null;

  return {
    id: row.demo_key ?? row.id,
    projectId: projectDemoKey ?? row.project_id,
    version: row.version,
    status: row.status as Quote["status"],
    items: row.quote_items
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapItem),
    subtotal: row.subtotal,
    discount: row.discount,
    shippingFee: row.shipping_fee,
    extraFee: row.extra_fee,
    tax: row.tax,
    total: row.total,
    currency: "KRW",
    note: row.note,
    createdBy: row.created_by,
    approvedBy: row.approved_by,
    approvedAt: displayOrEmpty(row.approved_at),
    sentAt: displayOrEmpty(row.sent_at),
    expiresAt: displayDateOrEmpty(row.expires_at),
    createdAt: displayOrEmpty(row.created_at),
    updatedAt: displayOrEmpty(row.updated_at),
    customerConfirmed: row.customer_confirmed,
    changeLog: mapChangeLog(row.quote_revisions),
  };
}

function mergeSellerQuotes(fromDb: Quote[]): Quote[] {
  const keys = new Set(fromDb.map((q) => q.id));
  const extras = mockQuotes.filter((q) => !keys.has(q.id));
  return [...fromDb, ...extras].sort((a, b) => {
    if (a.projectId === b.projectId) {
      return b.version - a.version;
    }
    return a.projectId.localeCompare(b.projectId);
  });
}

/**
 * Quotes for a project workspace / quote builder.
 * Resolves project UUID or demo_key (prj-001); falls back to mockQuotes.
 */
export async function getQuotesByProjectId(
  projectIdentifier: string,
): Promise<QuotesResult> {
  try {
    const rows = await quoteRepository.listByProject(projectIdentifier);
    if (rows.length > 0) {
      return {
        quotes: rows.map(mapQuoteRowToQuote),
        source: "supabase",
      };
    }
  } catch {
    // Supabase unavailable / missing tables / RLS → mock
  }

  return {
    quotes: getMockQuotesByProjectId(projectIdentifier),
    source: "mock",
  };
}

export async function getLatestQuote(
  projectIdentifier: string,
): Promise<QuoteResult> {
  const { quotes, source } = await getQuotesByProjectId(projectIdentifier);
  if (quotes.length > 0) {
    return { quote: quotes[0], source };
  }

  return {
    quote: getMockLatestQuote(projectIdentifier),
    source: "mock",
  };
}

export async function getQuoteById(identifier: string): Promise<QuoteResult> {
  try {
    const row = await quoteRepository.getById(identifier);
    if (row) {
      return { quote: mapQuoteRowToQuote(row), source: "supabase" };
    }
  } catch {
    // fall through
  }

  return {
    quote: getMockQuoteById(identifier),
    source: "mock",
  };
}

/**
 * Seller quote list. Prefers Supabase; merges mock quotes for other demo
 * projects so /seller/quotes keeps the full demo list. Empty/fail → mock.
 * Signed-in SELLER filters by profile.id via projects.seller_id.
 */
export async function listForSeller(): Promise<QuotesResult> {
  try {
    const { getCurrentActorContext } = await import(
      "@/lib/providers/authProvider"
    );
    const actor = await getCurrentActorContext();
    const filter =
      actor?.role === "SELLER" ? { sellerId: actor.profileId } : undefined;

    const rows = await quoteRepository.listForSeller(filter);
    if (rows.length === 0) {
      return { quotes: mockQuotes, source: "mock" };
    }
    return {
      quotes: mergeSellerQuotes(rows.map(mapQuoteRowToQuote)),
      source: "supabase",
    };
  } catch {
    return { quotes: mockQuotes, source: "mock" };
  }
}

/** Timeline stays mock until a later sprint (not part of Phase 3 tables). */
export async function getQuoteTimeline(
  projectIdentifier: string,
): Promise<QuoteTimelineStep[]> {
  return getMockQuoteTimeline(projectIdentifier);
}

export async function createQuote(
  input: Parameters<typeof quoteRepository.create>[0],
) {
  return quoteRepository.create(input);
}

export async function updateQuote(
  identifier: string,
  patch: Parameters<typeof quoteRepository.update>[1],
) {
  return quoteRepository.update(identifier, patch);
}
