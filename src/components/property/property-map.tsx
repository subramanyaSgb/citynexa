"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property, PropertyImage } from "@/generated/prisma/client";

export type MapProperty = Property & {
  builder: { id: string; name: string };
  images: PropertyImage[];
};

export interface PropertyMapProps {
  properties: MapProperty[];
}

const PropertyMapInner = dynamic(
  () => import("./property-map-inner").then((mod) => mod.PropertyMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] w-full items-center justify-center rounded-2xl border border-warm-200 bg-warm-50">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <p className="text-sm text-warm-500">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export function PropertyMap({ properties }: PropertyMapProps) {
  // Filter out properties without lat/lng
  const mappableProperties = properties.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  if (mappableProperties.length === 0) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-warm-300 bg-warm-50/50">
        <p className="text-lg font-semibold text-warm-700">
          No properties with location data
        </p>
        <p className="mt-1 text-sm text-warm-500">
          Properties without coordinates cannot be displayed on the map.
        </p>
      </div>
    );
  }

  return <PropertyMapInner properties={mappableProperties} />;
}
