import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://citynexa.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/builders`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic property pages
  const properties = await prisma.property.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic builder pages
  const builders = await prisma.builder.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
  });

  const builderPages: MetadataRoute.Sitemap = builders.map((b) => ({
    url: `${baseUrl}/builders/${b.id}`,
    lastModified: b.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages, ...builderPages];
}
