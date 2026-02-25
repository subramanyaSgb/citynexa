"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ArrowLeftRight,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Building2,
} from "lucide-react";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  POSSESSION_STATUS_LABELS,
} from "@/lib/constants";
import { useShortlist } from "@/lib/shortlist-context";
import { useCompare } from "@/lib/compare-context";
import type {
  Property,
  PropertyImage,
  PropertyType,
  PossessionStatus,
} from "@/generated/prisma/client";

type PropertyWithRelations = Property & {
  builder: { id: string; name: string };
  images: PropertyImage[];
};

interface PropertyCardProps {
  property: PropertyWithRelations;
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

function getPossessionStyle(status: PossessionStatus): string {
  switch (status) {
    case "READY_TO_MOVE":
      return "bg-emerald-50 text-emerald-700";
    case "UNDER_CONSTRUCTION":
      return "bg-amber-50 text-amber-700";
    case "UPCOMING":
      return "bg-sky-50 text-sky-700";
    default:
      return "bg-warm-100 text-warm-600";
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { toggleShortlist, isShortlisted } = useShortlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const shortlisted = isShortlisted(property.id);
  const inCompare = isInCompare(property.id);
  const primaryImageUrl = getPrimaryImage(property.images);

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-warm-200 bg-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-warm-900/8">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-warm-100">
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
              <Building2 className="size-12 text-warm-300" />
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleShortlist(property.id);
              }}
              aria-label={shortlisted ? "Remove from shortlist" : "Save to shortlist"}
            >
              <Heart
                className={`size-4 transition-colors ${
                  shortlisted
                    ? "fill-red-500 text-red-500"
                    : "text-warm-500 hover:text-red-500"
                }`}
              />
            </button>
            <button
              type="button"
              className={`flex size-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-all hover:scale-110 ${
                inCompare
                  ? "bg-copper text-white hover:bg-copper/90"
                  : "bg-white/90 text-warm-500 hover:bg-white hover:text-copper"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (inCompare) {
                  removeFromCompare(property.id);
                } else {
                  addToCompare(property.id);
                }
              }}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            >
              <ArrowLeftRight className="size-4 transition-colors" />
            </button>
          </div>

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
        <div className="p-4">
          {/* Title + Price row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-[15px] font-semibold text-warm-900">
              {property.title}
            </h3>
            <span className="shrink-0 text-base font-bold text-copper">
              &#8377;{formatPrice(property.price, property.priceUnit)}
            </span>
          </div>

          {/* Location */}
          <div className="mt-1.5 flex items-center gap-1 text-sm text-warm-500">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">
              {property.locality
                ? `${property.locality}, ${property.city}`
                : property.city}
            </span>
          </div>

          {/* Specs */}
          <div className="mt-3 flex items-center gap-3 border-t border-warm-100 pt-3 text-sm text-warm-600">
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
          </div>

          {/* Builder + Possession */}
          <div className="mt-3 flex items-center justify-between border-t border-warm-100 pt-3">
            <span className="text-xs font-medium text-warm-500">
              {property.builder.name}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getPossessionStyle(property.possessionStatus)}`}
            >
              {POSSESSION_STATUS_LABELS[property.possessionStatus] ??
                property.possessionStatus}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
