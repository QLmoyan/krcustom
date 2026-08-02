import type { MetadataRoute } from "next";
import { DEMO } from "@/data/demoFlow";
import { mockServices } from "@/data/mockServices";
import { mockStores } from "@/data/mockStores";
import { getSiteUrl } from "@/lib/site";

const CATEGORY_SLUGS = [
  "apparel",
  "goods",
  "acrylic",
  "signage",
  "print",
  "business",
  "event",
  "owned-item",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/search",
    "/login",
    `/service/${DEMO.serviceId}`,
    `/store/${DEMO.storeId}`,
    `/project/${DEMO.projectId}`,
    `/orders/${DEMO.orderId}`,
    `/design-proofs/${DEMO.designProofId}`,
  ].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categories: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${siteUrl}/category/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const services: MetadataRoute.Sitemap = mockServices.map((service) => ({
    url: `${siteUrl}/service/${service.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const stores: MetadataRoute.Sitemap = mockStores.map((store) => ({
    url: `${siteUrl}/store/${store.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categories, ...services, ...stores];
}
