import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";

export async function FeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: { isFeatured: true, isActive: true },
    include: { builder: true, images: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  if (properties.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Featured Properties
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Handpicked properties for you
          </p>
        </div>

        {/* Properties grid / scroll */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white"
          >
            <Link href="/properties">
              View All Properties
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
