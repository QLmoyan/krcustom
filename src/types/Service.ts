export type ServiceMethod = "directPurchase" | "quote" | "customerOwnedItem";

export interface ServiceOptionChoice {
  id: string;
  label: string;
}

export interface ServiceOptionGroup {
  id: string;
  name: string;
  choices: ServiceOptionChoice[];
}

export interface ServiceQuantityTier {
  minQuantity: number;
  maxQuantity: number | null;
  unitPrice: number;
  note: string;
}

export interface ServiceDetailBlock {
  id: string;
  title: string;
  body: string;
}

export interface ServicePortfolioItem {
  id: string;
  title: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

export interface ServiceFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceReviewHighlight {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface ServiceReviewSummary {
  averageRating: number;
  totalCount: number;
  summaryText: string;
  scoreBreakdown: {
    stars: number;
    count: number;
  }[];
  highlights: ServiceReviewHighlight[];
}

export interface Service {
  id: string;
  title: string;
  storeId: string;
  storeName: string;
  coverImage: string;
  minimumPrice: number;
  rating: number;
  reviewCount: number;
  productionDays: string;
  tags: string[];
  supportsDirectPurchase: boolean;
  supportsQuote: boolean;
  supportsCustomerOwnedItem: boolean;
  description?: string;
  galleryImages?: string[];
  category?: string;
  categorySlug?: string;
  minimumOrderQuantity?: number;
  availableOptions?: ServiceOptionGroup[];
  supportedMethods?: ServiceMethod[];
  quantityTiers?: ServiceQuantityTier[];
  detailBlocks?: ServiceDetailBlock[];
  portfolioItems?: ServicePortfolioItem[];
  faqItems?: ServiceFaqItem[];
  reviewSummary?: ServiceReviewSummary;
}
