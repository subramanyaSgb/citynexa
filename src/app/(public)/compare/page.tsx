"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  X,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  CalendarDays,
} from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { getPropertiesForCompare } from "@/lib/actions/public-properties";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  FURNISHING_LABELS,
  POSSESSION_STATUS_LABELS,
} from "@/lib/constants";
import type {
  Property,
  PropertyImage,
} from "@/generated/prisma/client";

type CompareProperty = Property & {
  builder: { id: string; name: string; logoUrl: string | null };
  images: PropertyImage[];
};

function formatPrice(price: number, unit: string): string {
  if (unit === "CRORE") {
    return `\u20B9${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} Cr`;
  }
  return `\u20B9${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} L`;
}

function formatArea(area: number | null, unit: string | null): string {
  if (!area) return "\u2014";
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

function getPrimaryImage(images: PropertyImage[]): string | null {
  const primary = images.find((img) => img.isPrimary);
  if (primary) return primary.imageUrl;
  if (images.length > 0) return images[0].imageUrl;
  return null;
}

interface CompareRowProps {
  label: string;
  icon?: React.ReactNode;
  values: (string | React.ReactNode)[];
  highlight?: boolean;
}

function CompareRow({ label, icon, values, highlight }: CompareRowProps) {
  return (
    <tr className={highlight ? "bg-warm-50/50" : ""}>
      <td className="border-r border-warm-100 px-4 py-3.5 text-sm font-medium text-warm-600 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>
      </td>
      {values.map((value, i) => (
        <td
          key={i}
          className="border-r border-warm-100 px-4 py-3.5 text-sm text-warm-800 last:border-r-0"
        >
          {value || "\u2014"}
        </td>
      ))}
      {/* Fill empty columns up to 3 */}
      {Array.from({ length: 3 - values.length }).map((_, i) => (
        <td
          key={`empty-${i}`}
          className="border-r border-warm-100 px-4 py-3.5 text-sm text-warm-300 last:border-r-0"
        >
          \u2014
        </td>
      ))}
    </tr>
  );
}

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const [properties, setProperties] = useState<CompareProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getPropertiesForCompare(ids);
      setProperties(result as CompareProperty[]);
    } catch (error) {
      console.error("Failed to fetch properties for compare:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(compareIds);
  }, [compareIds, fetchProperties]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl">
            Compare Properties
          </h1>
          <p className="mt-2 text-warm-500">
            {compareIds.length === 0
              ? "No properties selected for comparison."
              : `Comparing ${compareIds.length} ${compareIds.length === 1 ? "property" : "properties"} side by side`}
          </p>
        </div>

        {compareIds.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="inline-flex items-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm font-medium text-warm-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <X className="size-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && compareIds.length > 0 && (
        <div className="mt-12">
          <div className="animate-pulse overflow-hidden rounded-2xl border border-warm-200 bg-white">
            <div className="grid grid-cols-4">
              <div className="border-r border-warm-100 p-4">
                <div className="h-4 w-20 rounded bg-warm-100" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-r border-warm-100 p-4 last:border-r-0">
                  <div className="aspect-[16/10] rounded-lg bg-warm-100" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-warm-100" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-warm-100" />
                </div>
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 border-t border-warm-100">
                <div className="border-r border-warm-100 p-4">
                  <div className="h-3 w-16 rounded bg-warm-100" />
                </div>
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="border-r border-warm-100 p-4 last:border-r-0">
                    <div className="h-3 w-20 rounded bg-warm-100" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && compareIds.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-warm-100">
            <ArrowLeftRight className="size-10 text-warm-300" />
          </div>
          <h2 className="mt-6 font-display text-xl font-semibold text-warm-900">
            No properties to compare
          </h2>
          <p className="mt-2 max-w-md text-warm-500">
            Browse our collection and tap the compare icon on any property card
            to add it here. You can compare up to 3 properties side by side.
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

      {/* Comparison table */}
      {!loading && properties.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-warm-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-100">
                  {/* Label column header */}
                  <th className="w-48 min-w-[180px] border-r border-warm-100 bg-warm-50 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                    Property Details
                  </th>
                  {/* Property columns */}
                  {properties.map((property) => {
                    const imgUrl = getPrimaryImage(property.images);
                    return (
                      <th
                        key={property.id}
                        className="min-w-[240px] border-r border-warm-100 px-4 py-4 text-left last:border-r-0"
                      >
                        <div className="space-y-3">
                          {/* Property image */}
                          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-warm-100">
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={property.title}
                                fill
                                className="object-cover"
                                sizes="280px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
                                <Building2 className="size-10 text-warm-300" />
                              </div>
                            )}
                          </div>

                          {/* Title + Remove */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/properties/${property.slug}`}
                                className="line-clamp-2 text-sm font-semibold text-warm-900 hover:text-copper transition-colors"
                              >
                                {property.title}
                              </Link>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-warm-500">
                                <MapPin className="size-3 shrink-0" />
                                <span className="line-clamp-1">
                                  {property.locality
                                    ? `${property.locality}, ${property.city}`
                                    : property.city}
                                </span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCompare(property.id)}
                              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-warm-100 text-warm-400 transition-colors hover:bg-red-100 hover:text-red-500"
                              aria-label="Remove from compare"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                  {/* Fill empty columns */}
                  {Array.from({ length: 3 - properties.length }).map((_, i) => (
                    <th
                      key={`empty-header-${i}`}
                      className="min-w-[240px] border-r border-warm-100 px-4 py-4 last:border-r-0"
                    >
                      <Link
                        href="/properties"
                        className="flex aspect-[16/10] flex-col items-center justify-center rounded-lg border-2 border-dashed border-warm-200 bg-warm-50/50 text-warm-400 transition-colors hover:border-copper/40 hover:text-copper"
                      >
                        <ArrowLeftRight className="size-6" />
                        <span className="mt-2 text-xs font-medium">Add Property</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {/* Price */}
                <CompareRow
                  label="Price"
                  highlight
                  values={properties.map((p) => (
                    <span key={p.id} className="text-base font-bold text-copper">
                      {formatPrice(p.price, p.priceUnit)}
                    </span>
                  ))}
                />

                {/* Type */}
                <CompareRow
                  label="Type"
                  values={properties.map(
                    (p) =>
                      `${PROPERTY_TYPE_LABELS[p.propertyType] ?? p.propertyType} \u2022 ${LISTING_TYPE_LABELS[p.listingType] ?? p.listingType}`,
                  )}
                />

                {/* Area */}
                <CompareRow
                  label="Area"
                  icon={<Maximize className="size-3.5 text-warm-400" />}
                  highlight
                  values={properties.map((p) =>
                    formatArea(p.carpetArea, p.carpetAreaUnit),
                  )}
                />

                {/* Bedrooms */}
                <CompareRow
                  label="Bedrooms"
                  icon={<BedDouble className="size-3.5 text-warm-400" />}
                  values={properties.map((p) =>
                    p.bedrooms != null ? `${p.bedrooms} BHK` : "\u2014",
                  )}
                />

                {/* Bathrooms */}
                <CompareRow
                  label="Bathrooms"
                  icon={<Bath className="size-3.5 text-warm-400" />}
                  highlight
                  values={properties.map((p) =>
                    p.bathrooms != null ? `${p.bathrooms}` : "\u2014",
                  )}
                />

                {/* Furnishing */}
                <CompareRow
                  label="Furnishing"
                  values={properties.map((p) =>
                    p.furnishing
                      ? FURNISHING_LABELS[p.furnishing] ?? p.furnishing
                      : "\u2014",
                  )}
                />

                {/* Possession */}
                <CompareRow
                  label="Possession"
                  icon={<CalendarDays className="size-3.5 text-warm-400" />}
                  highlight
                  values={properties.map((p) => (
                    <span
                      key={p.id}
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        p.possessionStatus === "READY_TO_MOVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : p.possessionStatus === "UNDER_CONSTRUCTION"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {POSSESSION_STATUS_LABELS[p.possessionStatus] ??
                        p.possessionStatus}
                    </span>
                  ))}
                />

                {/* Builder */}
                <CompareRow
                  label="Builder"
                  icon={<Building2 className="size-3.5 text-warm-400" />}
                  values={properties.map((p) => (
                    <Link
                      key={p.id}
                      href={`/builders/${p.builder.id}`}
                      className="font-medium text-navy hover:text-copper transition-colors"
                    >
                      {p.builder.name}
                    </Link>
                  ))}
                />

                {/* Location */}
                <CompareRow
                  label="Location"
                  icon={<MapPin className="size-3.5 text-warm-400" />}
                  highlight
                  values={properties.map((p) => {
                    const parts = [
                      p.locality,
                      p.city,
                      p.state,
                      p.pincode,
                    ].filter(Boolean);
                    return parts.join(", ");
                  })}
                />

                {/* Floor */}
                <CompareRow
                  label="Floor"
                  values={properties.map((p) => {
                    if (p.floorNumber == null) return "\u2014";
                    return p.totalFloors != null
                      ? `${p.floorNumber} of ${p.totalFloors}`
                      : `${p.floorNumber}`;
                  })}
                />

                {/* Facing */}
                <CompareRow
                  label="Facing"
                  highlight
                  values={properties.map((p) => p.facingDirection ?? "\u2014")}
                />

                {/* RERA Number */}
                <CompareRow
                  label="RERA No."
                  values={properties.map((p) => p.reraNumber ?? "\u2014")}
                />

                {/* Amenities */}
                <tr className="bg-warm-50/50">
                  <td className="border-r border-warm-100 px-4 py-3.5 text-sm font-medium text-warm-600 align-top whitespace-nowrap">
                    Amenities
                  </td>
                  {properties.map((p) => {
                    const amenities = Array.isArray(p.amenities)
                      ? (p.amenities as string[])
                      : [];
                    return (
                      <td
                        key={p.id}
                        className="border-r border-warm-100 px-4 py-3.5 text-sm text-warm-800 last:border-r-0 align-top"
                      >
                        {amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {amenities.map((a) => (
                              <span
                                key={a}
                                className="inline-block rounded-full bg-copper/8 px-2 py-0.5 text-[11px] font-medium text-copper"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "\u2014"
                        )}
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - properties.length }).map((_, i) => (
                    <td
                      key={`empty-amenity-${i}`}
                      className="border-r border-warm-100 px-4 py-3.5 text-sm text-warm-300 last:border-r-0"
                    >
                      {"\u2014"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Back to browse */}
      {!loading && properties.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-medium text-warm-500 transition-colors hover:text-copper"
          >
            Browse more properties to compare
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
