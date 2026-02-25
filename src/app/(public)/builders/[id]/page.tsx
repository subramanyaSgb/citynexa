import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Calendar,
  ExternalLink,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";

interface BuilderDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getBuilder(id: string) {
  const builder = await prisma.builder.findUnique({
    where: { id, isActive: true },
  });

  return builder;
}

async function getBuilderProperties(builderId: string) {
  const properties = await prisma.property.findMany({
    where: { builderId, isActive: true },
    include: {
      builder: { select: { id: true, name: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return properties;
}

export async function generateMetadata({
  params,
}: BuilderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const builder = await getBuilder(id);

  if (!builder) {
    return { title: "Builder Not Found | City Nexa Networks" };
  }

  const description =
    builder.description?.slice(0, 160) ||
    `Explore properties by ${builder.name} in Bangalore. ${builder.totalProjects} projects delivered. Trusted builder partner of City Nexa Networks.`;

  return {
    title: `${builder.name} — Builder Partner | City Nexa Networks`,
    description,
    openGraph: {
      title: `${builder.name} — Builder Partner`,
      description,
      ...(builder.logoUrl ? { images: [{ url: builder.logoUrl }] } : {}),
    },
  };
}

export default async function BuilderDetailPage({
  params,
}: BuilderDetailPageProps) {
  const { id } = await params;
  const builder = await getBuilder(id);

  if (!builder) {
    notFound();
  }

  const properties = await getBuilderProperties(builder.id);

  return (
    <section className="bg-warm-50/40">
      {/* Builder Profile Header */}
      <div className="border-b border-warm-200 bg-warm-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          {/* Back link */}
          <Link
            href="/builders"
            className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-warm-200 px-4 py-1.5 text-xs font-semibold text-warm-600 transition-colors hover:bg-white hover:text-copper hover:border-warm-300"
          >
            <ArrowLeft className="size-3.5" />
            All Builders
          </Link>

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            {/* Builder Logo */}
            {builder.logoUrl ? (
              <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-warm-200 bg-white p-3 shadow-sm md:size-28">
                <Image
                  src={builder.logoUrl}
                  alt={builder.name}
                  width={112}
                  height={112}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border border-warm-200 bg-white shadow-sm md:size-28">
                <Building2 className="size-12 text-warm-300" />
              </div>
            )}

            {/* Builder Info */}
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-copper">
                Builder Partner
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
                {builder.name}
              </h1>

              {builder.description && (
                <p className="mt-3 max-w-2xl text-warm-600 leading-relaxed">
                  {builder.description}
                </p>
              )}

              {/* Meta row: year, projects, website */}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                {builder.establishedYear && (
                  <div className="flex items-center gap-1.5 text-sm text-warm-500">
                    <Calendar className="size-4 text-warm-400" />
                    <span>Established {builder.establishedYear}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-warm-500">
                  <Layers className="size-4 text-warm-400" />
                  <span>
                    {builder.totalProjects}{" "}
                    {builder.totalProjects === 1 ? "project" : "projects"}{" "}
                    delivered
                  </span>
                </div>
                {builder.websiteUrl && (
                  <a
                    href={builder.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-warm-200 px-4 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-white hover:border-warm-300"
                  >
                    <ExternalLink className="size-3.5" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper">
            Properties
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-warm-900 md:text-3xl">
            Listings by {builder.name}
          </h2>
          <p className="mt-1 text-warm-500">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"} available
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-2xl border border-warm-200 bg-white py-20 text-center">
            <Building2 className="mx-auto size-12 text-warm-300" />
            <p className="mt-4 text-lg text-warm-500">
              No properties listed at the moment.
            </p>
            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-warm-200 px-6 py-2 text-sm font-semibold text-copper transition-colors hover:bg-copper hover:text-white hover:border-copper"
            >
              Browse All Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
