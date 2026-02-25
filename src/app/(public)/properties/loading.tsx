import { Skeleton } from "@/components/ui/skeleton";

function SkeletonPropertyCard() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-none" />
      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Location */}
        <Skeleton className="h-4 w-1/2" />
        {/* Price */}
        <Skeleton className="h-6 w-28" />
        {/* Specs row */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesLoading() {
  return (
    <section className="bg-background">
      {/* Page Header skeleton */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-5 w-80" />
          {/* Search bar */}
          <Skeleton className="mt-6 h-10 w-full max-w-xl" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter Sidebar skeleton */}
          <div className="hidden w-72 shrink-0 space-y-4 lg:block">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Mobile filter button skeleton */}
          <Skeleton className="h-10 w-28 lg:hidden" />

          {/* Property Grid skeleton */}
          <div className="flex-1 space-y-6">
            {/* Sort / count bar */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-9 w-44" />
            </div>

            {/* Grid of skeleton cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonPropertyCard key={i} />
              ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex justify-center gap-2 pt-4">
              <Skeleton className="size-9 rounded-md" />
              <Skeleton className="size-9 rounded-md" />
              <Skeleton className="size-9 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
