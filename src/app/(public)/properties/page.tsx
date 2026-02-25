import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { getFeatureFlags } from "@/lib/feature-flags";
import {
  getPublicProperties,
  getActiveBuilders,
} from "@/lib/actions/public-properties";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import { PropertyListingSearch } from "@/components/property/property-listing-search";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Bangalore | City Nexa Networks",
  description:
    "Browse residential, commercial properties and plots for sale and rent in Bangalore. Find your dream home with City Nexa Networks.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getStringParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

function getNumberParam(
  value: string | string[] | undefined
): number | undefined {
  const str = getStringParam(value);
  if (!str) return undefined;
  const num = parseFloat(str);
  return isNaN(num) ? undefined : num;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const features = await getFeatureFlags();
  if (!features.properties) redirect("/");

  const params = await searchParams;

  const filters = {
    search: getStringParam(params.search),
    propertyType: getStringParam(params.propertyType),
    listingType: getStringParam(params.listingType),
    minPrice: getNumberParam(params.minPrice),
    maxPrice: getNumberParam(params.maxPrice),
    bedrooms: getStringParam(params.bedrooms),
    possessionStatus: getStringParam(params.possessionStatus),
    furnishing: getStringParam(params.furnishing),
    locality: getStringParam(params.locality),
    builderId: getStringParam(params.builderId),
    sortBy: getStringParam(params.sortBy) ?? "newest",
    page: getNumberParam(params.page) ?? 1,
    limit: 12,
  };

  const [{ properties, totalCount, totalPages }, builders] = await Promise.all([
    getPublicProperties(filters),
    getActiveBuilders(),
  ]);

  return (
    <section className="bg-background">
      {/* Page Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Properties in Bangalore
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover your perfect property from our curated listings
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl">
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <PropertyListingSearch />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Mobile filter button + Desktop sidebar */}
          <Suspense fallback={<Skeleton className="h-10 w-28 lg:h-96 lg:w-72" />}>
            <PropertyFilters builders={builders} />
          </Suspense>

          {/* Property Grid */}
          <Suspense
            fallback={
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-9 w-44" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-[400px] rounded-xl" />
                  ))}
                </div>
              </div>
            }
          >
            <PropertyGrid
              properties={properties}
              totalCount={totalCount}
              totalPages={totalPages}
              currentPage={filters.page}
              currentSortBy={filters.sortBy}
              limit={filters.limit}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
