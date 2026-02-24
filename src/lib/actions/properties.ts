"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { propertyServerSchema, type PropertyFormData } from "@/lib/validations/property";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function randomId(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getProperties({
  search,
  propertyType,
  listingType,
  builderId,
  page = 1,
  limit = 10,
}: {
  search?: string;
  propertyType?: string;
  listingType?: string;
  builderId?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const where: Record<string, unknown> = {};

    if (search) {
      where.title = { contains: search, mode: "insensitive" as const };
    }
    if (propertyType && ["RESIDENTIAL", "COMMERCIAL", "PLOT"].includes(propertyType)) {
      where.propertyType = propertyType;
    }
    if (listingType && ["SALE", "RENT"].includes(listingType)) {
      where.listingType = listingType;
    }
    if (builderId) {
      where.builderId = builderId;
    }

    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          builder: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return { properties, totalCount };
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return { properties: [], totalCount: 0 };
  }
}

export async function getProperty(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        builder: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
    return property;
  } catch (error) {
    console.error("Failed to fetch property:", error);
    return null;
  }
}

export async function createProperty(
  data: PropertyFormData,
  images?: { url: string; isPrimary: boolean }[]
): Promise<ActionResult> {
  try {
    const parsed = propertyServerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
    }

    const { possessionDate, amenities, ...rest } = parsed.data;

    const slug = slugify(parsed.data.title, { lower: true, strict: true }) + "-" + randomId(4);

    await prisma.property.create({
      data: {
        ...rest,
        slug,
        amenities: amenities ?? [],
        possessionDate: possessionDate ? new Date(possessionDate) : null,
        // Convert empty strings to null for optional fields
        description: rest.description || null,
        facingDirection: rest.facingDirection || null,
        furnishing: rest.furnishing || null,
        address: rest.address || null,
        locality: rest.locality || null,
        pincode: rest.pincode || null,
        reraNumber: rest.reraNumber || null,
        carpetAreaUnit: rest.carpetAreaUnit || null,
        // Create property images if provided
        images:
          images && images.length > 0
            ? {
                create: images.map((img, index) => ({
                  imageUrl: img.url,
                  isPrimary: img.isPrimary,
                  sortOrder: index,
                })),
              }
            : undefined,
      },
    });

    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { success: false, error: "Failed to create property. Please try again." };
  }
}

export async function updateProperty(
  id: string,
  data: PropertyFormData,
  images?: { url: string; isPrimary: boolean }[]
): Promise<ActionResult> {
  try {
    const parsed = propertyServerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
    }

    const { possessionDate, amenities, ...rest } = parsed.data;

    // Update property and replace images in a transaction
    await prisma.$transaction(async (tx) => {
      // Update the property fields
      await tx.property.update({
        where: { id },
        data: {
          ...rest,
          amenities: amenities ?? [],
          possessionDate: possessionDate ? new Date(possessionDate) : null,
          description: rest.description || null,
          facingDirection: rest.facingDirection || null,
          furnishing: rest.furnishing || null,
          address: rest.address || null,
          locality: rest.locality || null,
          pincode: rest.pincode || null,
          reraNumber: rest.reraNumber || null,
          carpetAreaUnit: rest.carpetAreaUnit || null,
        },
      });

      // If images were provided, delete existing and recreate
      if (images !== undefined) {
        await tx.propertyImage.deleteMany({
          where: { propertyId: id },
        });

        if (images.length > 0) {
          await tx.propertyImage.createMany({
            data: images.map((img, index) => ({
              propertyId: id,
              imageUrl: img.url,
              isPrimary: img.isPrimary,
              sortOrder: index,
            })),
          });
        }
      }
    });

    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to update property:", error);
    return { success: false, error: "Failed to update property. Please try again." };
  }
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  try {
    await prisma.property.delete({
      where: { id },
    });

    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: "Failed to delete property. Please try again." };
  }
}

export async function togglePropertyActive(id: string): Promise<ActionResult> {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    await prisma.property.update({
      where: { id },
      data: { isActive: !property.isActive },
    });

    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle property status:", error);
    return { success: false, error: "Failed to toggle property status. Please try again." };
  }
}

export async function togglePropertyFeatured(id: string): Promise<ActionResult> {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      select: { isFeatured: true },
    });

    if (!property) {
      return { success: false, error: "Property not found." };
    }

    await prisma.property.update({
      where: { id },
      data: { isFeatured: !property.isFeatured },
    });

    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle property featured status:", error);
    return { success: false, error: "Failed to toggle featured status. Please try again." };
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
    console.error("Failed to fetch builders:", error);
    return [];
  }
}
