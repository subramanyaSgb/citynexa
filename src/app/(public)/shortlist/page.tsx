"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { useShortlist } from "@/lib/shortlist-context";
import { getPropertiesByIds } from "@/lib/actions/public-properties";
import { PropertyCard } from "@/components/property/property-card";
import type { Property, PropertyImage } from "@/generated/prisma/client";

type PropertyWithRelations = Property & {
  builder: { id: string; name: string };
  images: PropertyImage[];
};

export default function ShortlistPage() {
  const { shortlistedIds, clearShortlist } = useShortlist();
  const [properties, setProperties] = useState<PropertyWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getPropertiesByIds(ids);
      setProperties(result as PropertyWithRelations[]);
    } catch (error) {
      console.error("Failed to fetch shortlisted properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(shortlistedIds);
  }, [shortlistedIds, fetchProperties]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl">
            Your Shortlist
          </h1>
          <p className="mt-2 text-warm-500">
            {shortlistedIds.length === 0
              ? "You haven't shortlisted any properties yet."
              : `${shortlistedIds.length} ${shortlistedIds.length === 1 ? "property" : "properties"} saved`}
          </p>
        </div>

        {shortlistedIds.length > 0 && (
          <button
            type="button"
            onClick={clearShortlist}
            className="inline-flex items-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm font-medium text-warm-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: shortlistedIds.length || 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl border border-warm-200 bg-white"
            >
              <div className="aspect-[16/10] bg-warm-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-warm-100" />
                <div className="h-3 w-1/2 rounded bg-warm-100" />
                <div className="h-3 w-2/3 rounded bg-warm-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && shortlistedIds.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-warm-100">
            <Heart className="size-10 text-warm-300" />
          </div>
          <h2 className="mt-6 font-display text-xl font-semibold text-warm-900">
            No properties shortlisted
          </h2>
          <p className="mt-2 max-w-md text-warm-500">
            Browse our collection and tap the heart icon on any property to save
            it to your shortlist for easy comparison later.
          </p>
          <Link
            href="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-copper px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-copper/90"
          >
            Browse Properties
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {/* Property grid */}
      {!loading && properties.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
