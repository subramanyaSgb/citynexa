"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  PRICE_UNIT_LABELS,
  POSSESSION_STATUS_LABELS,
} from "@/lib/constants";
import type {
  Property,
  PropertyImage,
  PropertyType,
  ListingType,
  PossessionStatus,
} from "@/generated/prisma/client";

type PropertyWithRelations = Property & {
  builder: { id: string; name: string };
  images: PropertyImage[];
};

interface PropertyCardProps {
  property: PropertyWithRelations;
}

function getPropertyTypeBadgeColor(type: PropertyType): string {
  switch (type) {
    case "RESIDENTIAL":
      return "bg-blue-600 text-white hover:bg-blue-700";
    case "COMMERCIAL":
      return "bg-purple-600 text-white hover:bg-purple-700";
    case "PLOT":
      return "bg-green-600 text-white hover:bg-green-700";
    default:
      return "bg-gray-600 text-white";
  }
}

function getListingTypeBadgeColor(type: ListingType): string {
  switch (type) {
    case "SALE":
      return "bg-emerald-600 text-white hover:bg-emerald-700";
    case "RENT":
      return "bg-orange-500 text-white hover:bg-orange-600";
    default:
      return "bg-gray-600 text-white";
  }
}

function getPossessionBadgeStyle(status: PossessionStatus): string {
  switch (status) {
    case "READY_TO_MOVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "UNDER_CONSTRUCTION":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "UPCOMING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function formatPrice(price: number, unit: string): string {
  if (unit === "CRORE") {
    return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} Crore`;
  }
  return `${price % 1 === 0 ? price.toFixed(0) : price.toFixed(1)} Lakh`;
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

export function PropertyCard({ property }: PropertyCardProps) {
  const primaryImageUrl = getPrimaryImage(property.images);

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <Card className="overflow-hidden border border-border/60 py-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
              <Building2 className="size-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Heart Icon Overlay */}
          <button
            type="button"
            className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Shortlist functionality in Phase 2
            }}
            aria-label="Save to shortlist"
          >
            <Heart className="size-4 text-gray-600 hover:text-red-500" />
          </button>

          {/* Type Badges */}
          <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
            <Badge
              className={`text-[10px] px-2 py-0.5 ${getPropertyTypeBadgeColor(property.propertyType)}`}
            >
              {PROPERTY_TYPE_LABELS[property.propertyType] ??
                property.propertyType}
            </Badge>
            <Badge
              className={`text-[10px] px-2 py-0.5 ${getListingTypeBadgeColor(property.listingType)}`}
            >
              {LISTING_TYPE_LABELS[property.listingType] ??
                property.listingType}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="space-y-3 p-4">
          {/* Title */}
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">
              {property.locality
                ? `${property.locality}, ${property.city}`
                : property.city}
            </span>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-primary">
            &#8377;{formatPrice(property.price, property.priceUnit)}
          </p>

          {/* Specs Row */}
          <div className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
            {property.propertyType === "RESIDENTIAL" && (
              <>
                {property.bedrooms != null && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="size-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-1">
                    <Bath className="size-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
              </>
            )}
            {property.carpetArea != null && (
              <div className="flex items-center gap-1">
                <Maximize className="size-4" />
                <span>
                  {formatArea(property.carpetArea, property.carpetAreaUnit)}
                </span>
              </div>
            )}
            {property.propertyType === "COMMERCIAL" &&
              property.floorNumber != null && (
                <div className="flex items-center gap-1 text-xs">
                  <span>Floor {property.floorNumber}</span>
                  {property.totalFloors != null && (
                    <span>/ {property.totalFloors}</span>
                  )}
                </div>
              )}
          </div>

          {/* Builder + Possession */}
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">
              {property.builder.name}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 ${getPossessionBadgeStyle(property.possessionStatus)}`}
            >
              {POSSESSION_STATUS_LABELS[property.possessionStatus] ??
                property.possessionStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
