"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard } from "@/components/property/property-card";
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

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
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
