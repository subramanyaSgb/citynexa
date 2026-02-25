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
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "UNDER_CONSTRUCTION":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "UPCOMING":
      return "bg-sky-50 text-sky-700 border-sky-100";
    default:
      return "bg-warm-100 text-warm-600 border-warm-200";
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
      <article className="overflow-hidden rounded-xl border border-warm-200/80 bg-white transition-all duration-300 group-hover:border-warm-300 group-hover:shadow-md group-hover:shadow-warm-900/5">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-warm-100">
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
              <Building2 className="size-10 text-warm-300" />
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-2.5 right-2.5 z-10 flex gap-1.5">
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-md bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleShortlist(property.id);
              }}
              aria-label={shortlisted ? "Remove from shortlist" : "Save to shortlist"}
            >
              <Heart
                className={`size-3.5 transition-colors ${
                  shortlisted
                    ? "fill-red-500 text-red-500"
                    : "text-warm-500"
                }`}
              />
            </button>
            <button
              type="button"
              className={`flex size-7 items-center justify-center rounded-md shadow-sm backdrop-blur-sm transition-all ${
                inCompare
                  ? "bg-copper text-white"
                  : "bg-white/90 text-warm-500 hover:bg-white"
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
              <ArrowLeftRight className="size-3.5" />
            </button>
          </div>

          {/* Property type + listing tag */}
          <div className="absolute bottom-2.5 left-2.5 z-10 flex gap-1">
            <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-warm-800 backdrop-blur-sm">
              {PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}
            </span>
            <span className="rounded-md bg-navy/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              {LISTING_TYPE_LABELS[property.listingType] ?? property.listingType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Price */}
          <p className="text-[13px] font-bold text-navy">
            &#8377;{formatPrice(property.price, property.priceUnit)}
          </p>

          {/* Title */}
          <h3 className="mt-0.5 line-clamp-1 text-[14px] font-semibold text-warm-900">
            {property.title}
          </h3>

          {/* Location */}
          <div className="mt-1 flex items-center gap-1 text-[12px] text-warm-500">
            <MapPin className="size-3 shrink-0" />
            <span className="line-clamp-1">
              {property.locality
                ? `${property.locality}, ${property.city}`
                : property.city}
            </span>
          </div>

          {/* Specs row */}
          <div className="mt-2.5 flex items-center gap-3 text-[12px] text-warm-600">
            {property.propertyType === "RESIDENTIAL" && (
              <>
                {property.bedrooms != null && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="size-3 text-warm-400" />
                    <span>{property.bedrooms} bed</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-1">
                    <Bath className="size-3 text-warm-400" />
                    <span>{property.bathrooms} bath</span>
                  </div>
                )}
              </>
            )}
            {property.carpetArea != null && (
              <div className="flex items-center gap-1">
                <Maximize className="size-3 text-warm-400" />
                <span>
                  {formatArea(property.carpetArea, property.carpetAreaUnit)}
                </span>
              </div>
            )}
            {property.propertyType === "COMMERCIAL" &&
              property.floorNumber != null && (
                <span className="text-[11px]">
                  Floor {property.floorNumber}
                  {property.totalFloors != null && `/${property.totalFloors}`}
                </span>
              )}
          </div>

          {/* Builder + Possession */}
          <div className="mt-2.5 flex items-center justify-between border-t border-warm-100 pt-2.5">
            <span className="text-[11px] font-medium text-warm-500">
              {property.builder.name}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${getPossessionStyle(property.possessionStatus)}`}
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
