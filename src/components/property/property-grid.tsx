"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  SearchX,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Map,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyMap } from "@/components/property/property-map";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
} from "@/lib/constants";
import type { Property, PropertyImage } from "@/generated/prisma/client";

type PropertyWithRelations = Property & {
  builder: { id: string; name: string };
  images: PropertyImage[];
};

interface PropertyGridProps {
  properties: PropertyWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentSortBy: string;
  limit: number;
}

function formatPrice(price: number, unit: string): string {
  if (unit === "CRORE") {
    return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} Cr`;
  }
  return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} L`;
}

function getPrimaryImage(images: PropertyImage[]): string | null {
  const primary = images.find((img) => img.isPrimary);
  if (primary) return primary.imageUrl;
  if (images.length > 0) return images[0].imageUrl;
  return null;
}

function formatArea(area: number | null, unit: string | null): string {
  if (!area) return "";
  const unitLabel =
    unit === "SQFT"
      ? "sq.ft"
      : unit === "SQYD"
        ? "sq.yd"
        : unit === "SQMT"
          ? "sq.mt"
          : "sq.ft";
  return `${area.toLocaleString()} ${unitLabel}`;
}

function PropertyListCard({ property }: { property: PropertyWithRelations }) {
  const primaryImageUrl = getPrimaryImage(property.images);

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <article className="flex overflow-hidden rounded-2xl border border-warm-200 bg-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-warm-900/8">
        {/* Image */}
        <div className="relative w-64 shrink-0 overflow-hidden bg-warm-100">
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="256px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
              <Building2 className="size-12 text-warm-300" />
            </div>
          )}
          {/* Property type pill */}
          <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-warm-800 backdrop-blur-sm">
              {PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}
            </span>
            <span className="rounded-full bg-navy/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              For {LISTING_TYPE_LABELS[property.listingType] ?? property.listingType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center gap-2 p-5">
          {/* Title + Price */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="line-clamp-1 text-base font-semibold text-warm-900">
              {property.title}
            </h3>
            <span className="shrink-0 text-lg font-bold text-copper">
              &#8377;{formatPrice(property.price, property.priceUnit)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-warm-500">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">
              {property.locality
                ? `${property.locality}, ${property.city}`
                : property.city}
            </span>
          </div>

          {/* Specs row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-warm-600">
            {property.propertyType === "RESIDENTIAL" && (
              <>
                {property.bedrooms != null && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="size-3.5 text-warm-400" />
                    <span>{property.bedrooms} beds</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-1">
                    <Bath className="size-3.5 text-warm-400" />
                    <span>{property.bathrooms} baths</span>
                  </div>
                )}
              </>
            )}
            {property.carpetArea != null && (
              <div className="flex items-center gap-1">
                <Maximize className="size-3.5 text-warm-400" />
                <span>
                  {formatArea(property.carpetArea, property.carpetAreaUnit)}
                </span>
              </div>
            )}
            {property.propertyType === "COMMERCIAL" &&
              property.floorNumber != null && (
                <span className="text-xs">
                  Floor {property.floorNumber}
                  {property.totalFloors != null && `/${property.totalFloors}`}
                </span>
              )}
            <span className="text-xs font-medium text-warm-500">
              {property.builder.name}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function PropertyGrid({
  properties,
  totalCount,
  totalPages,
  currentPage,
  currentSortBy,
  limit,
}: PropertyGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.replace(`/properties?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page > 1) {
        params.set("page", page.toString());
      } else {
        params.delete("page");
      }
      startTransition(() => {
        router.replace(`/properties?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  // Generate page numbers for pagination
  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {totalCount > 0 ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {startItem}-{endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              properties
            </>
          ) : (
            "No properties found"
          )}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={currentSortBy || "newest"}
            onValueChange={(value) => updateParam("sortBy", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-warm-200 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-warm-50 text-navy"
                  : "text-warm-600 hover:text-navy"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-warm-50 text-navy"
                  : "text-warm-600 hover:text-navy"
              }`}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                viewMode === "map"
                  ? "bg-warm-50 text-navy"
                  : "text-warm-600 hover:text-navy"
              }`}
              aria-label="Map view"
            >
              <Map className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties */}
      {properties.length > 0 ? (
        viewMode === "map" ? (
          <PropertyMap properties={properties} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {properties.map((property) => (
              <PropertyListCard key={property.id} property={property} />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
          <SearchX className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">No properties found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search to find what you&apos;re
            looking for.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              startTransition(() => {
                router.replace("/properties");
              });
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="gap-1"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex size-9 items-center justify-center text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="size-9"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
