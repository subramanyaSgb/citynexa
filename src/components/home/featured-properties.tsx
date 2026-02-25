import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";

export async function FeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: { isFeatured: true, isActive: true },
    include: { builder: true, images: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  if (properties.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header — left-aligned with accent bar */}
        <div className="flex items-end justify-between">
          <div>
            <div className="mb-3 h-[3px] w-10 bg-copper" />
            <h2 className="text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
              Latest in Bangalore
            </h2>
            <p className="mt-1.5 text-sm text-warm-500">
              Handpicked from our trusted builder partners
            </p>
          </div>
          <Link
            href="/properties"
            className="group hidden items-center gap-1.5 text-[13px] font-medium text-warm-600 transition-colors hover:text-navy sm:inline-flex"
          >
            View all
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Properties grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 transition-colors hover:text-navy"
          >
            View All Properties
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
