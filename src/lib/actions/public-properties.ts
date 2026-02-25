"use server";

import { prisma } from "@/lib/prisma";
import type {
  PropertyType,
  ListingType,
  PossessionStatus,
  Furnishing,
} from "@/generated/prisma/client";

export interface PropertyFilters {
  search?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  possessionStatus?: string;
  furnishing?: string;
  locality?: string;
  builderId?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

const VALID_PROPERTY_TYPES = ["RESIDENTIAL", "COMMERCIAL", "PLOT"];
const VALID_LISTING_TYPES = ["SALE", "RENT"];
const VALID_POSSESSION_STATUSES = [
  "READY_TO_MOVE",
  "UNDER_CONSTRUCTION",
  "UPCOMING",
];
const VALID_FURNISHINGS = ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"];

/**
 * Convert any price to Lakh for comparison.
 * If priceUnit is CRORE, multiply by 100 to get Lakh equivalent.
 */
function toLakh(price: number, unit: string): number {
  return unit === "CRORE" ? price * 100 : price;
}

export async function getPublicProperties(filters: PropertyFilters) {
  try {
    const {
      search,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      possessionStatus,
      furnishing,
      locality,
      builderId,
      sortBy = "newest",
      page = 1,
      limit = 12,
    } = filters;

    // Build the where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    // Property type filter
    if (propertyType && VALID_PROPERTY_TYPES.includes(propertyType)) {
      where.propertyType = propertyType as PropertyType;
    }

    // Listing type filter
    if (listingType && VALID_LISTING_TYPES.includes(listingType)) {
      where.listingType = listingType as ListingType;
    }

    // Possession status filter
    if (
      possessionStatus &&
      VALID_POSSESSION_STATUSES.includes(possessionStatus)
    ) {
      where.possessionStatus = possessionStatus as PossessionStatus;
    }

    // Furnishing filter
    if (furnishing && VALID_FURNISHINGS.includes(furnishing)) {
      where.furnishing = furnishing as Furnishing;
    }

    // Locality filter (case-insensitive contains)
    if (locality) {
      where.locality = { contains: locality, mode: "insensitive" as const };
    }

    // Builder filter
    if (builderId) {
      where.builderId = builderId;
    }

    // Bedrooms filter
    if (bedrooms) {
      const bedroomNum = parseInt(bedrooms, 10);
      if (!isNaN(bedroomNum)) {
        if (bedroomNum >= 5) {
          where.bedrooms = { gte: 5 };
        } else {
          where.bedrooms = bedroomNum;
        }
      }
    }

    // Search filter: search by title OR locality OR builder name
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { locality: { contains: search, mode: "insensitive" as const } },
        {
          builder: {
            name: { contains: search, mode: "insensitive" as const },
          },
        },
      ];
    }

    // Sort order
    let orderBy: Record<string, string>;
    switch (sortBy) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [allProperties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          builder: {
            select: { id: true, name: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    // Post-process: apply price range filter in application layer
    // because price comparison needs unit conversion
    let properties = allProperties;

    if (minPrice !== undefined || maxPrice !== undefined) {
      // We need to re-query without pagination for price filtering,
      // or better, handle it differently. Since Prisma doesn't support
      // computed columns, we'll do a broader query and filter in-app.
      // For better performance with large datasets, we filter on the
      // fetched page and adjust. However, for correctness we need to
      // query all matching records first.

      // Actually, let's build a smarter approach:
      // Query all matching (non-price-filtered) records, filter by price,
      // then paginate in application code.
      const allForPriceFilter = await prisma.property.findMany({
        where,
        include: {
          builder: {
            select: { id: true, name: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy,
      });

      const priceFiltered = allForPriceFilter.filter((p) => {
        const priceLakh = toLakh(p.price, p.priceUnit);
        if (minPrice !== undefined && priceLakh < minPrice) return false;
        if (maxPrice !== undefined && priceLakh > maxPrice) return false;
        return true;
      });

      const filteredTotal = priceFiltered.length;
      const start = (page - 1) * limit;
      properties = priceFiltered.slice(start, start + limit);

      return {
        properties,
        totalCount: filteredTotal,
        totalPages: Math.ceil(filteredTotal / limit),
      };
    }

    return {
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Failed to fetch public properties:", error);
    return { properties: [], totalCount: 0, totalPages: 0 };
  }
}

export async function getActiveBuilders() {
  try {
    const builders = await prisma.builder.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return builders;
  } catch (error) {
    console.error("Failed to fetch active builders:", error);
    return [];
  }
}
