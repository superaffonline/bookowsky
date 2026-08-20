import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { featuredBookIds } from "@/lib/books";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: brand.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${brand.url}/books`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...featuredBookIds.map((id) => ({
      url: `${brand.url}/books/gutenberg-${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
