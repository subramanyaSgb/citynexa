"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { builderServerSchema, type BuilderFormData } from "@/lib/validations/builder";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function getBuilders(
  search?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const [builders, totalCount] = await Promise.all([
      prisma.builder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.builder.count({ where }),
    ]);

    return { builders, totalCount };
  } catch (error) {
    console.error("Failed to fetch builders:", error);
    return { builders: [], totalCount: 0 };
  }
}

export async function getBuilder(id: string) {
  try {
    const builder = await prisma.builder.findUnique({
      where: { id },
    });
    return builder;
  } catch (error) {
    console.error("Failed to fetch builder:", error);
    return null;
  }
}

export async function createBuilder(data: BuilderFormData): Promise<ActionResult> {
  try {
    const parsed = builderServerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
    }

    const { websiteUrl, ...rest } = parsed.data;

    await prisma.builder.create({
      data: {
        ...rest,
        websiteUrl: websiteUrl || null,
      },
    });

    revalidatePath("/admin/builders");
    return { success: true };
  } catch (error) {
    console.error("Failed to create builder:", error);
    return { success: false, error: "Failed to create builder. Please try again." };
  }
}

export async function updateBuilder(
  id: string,
  data: BuilderFormData
): Promise<ActionResult> {
  try {
    const parsed = builderServerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
    }

    const { websiteUrl, ...rest } = parsed.data;

    await prisma.builder.update({
      where: { id },
      data: {
        ...rest,
        websiteUrl: websiteUrl || null,
      },
    });

    revalidatePath("/admin/builders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update builder:", error);
    return { success: false, error: "Failed to update builder. Please try again." };
  }
}

export async function deleteBuilder(id: string): Promise<ActionResult> {
  try {
    // Check if builder has properties
    const propertyCount = await prisma.property.count({
      where: { builderId: id },
    });

    if (propertyCount > 0) {
      return {
        success: false,
        error: `Cannot delete builder with ${propertyCount} existing ${propertyCount === 1 ? "property" : "properties"}. Remove the properties first.`,
      };
    }

    await prisma.builder.delete({
      where: { id },
    });

    revalidatePath("/admin/builders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete builder:", error);
    return { success: false, error: "Failed to delete builder. Please try again." };
  }
}

export async function toggleBuilderActive(id: string): Promise<ActionResult> {
  try {
    const builder = await prisma.builder.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!builder) {
      return { success: false, error: "Builder not found." };
    }

    await prisma.builder.update({
      where: { id },
      data: { isActive: !builder.isActive },
    });

    revalidatePath("/admin/builders");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle builder status:", error);
    return { success: false, error: "Failed to toggle builder status. Please try again." };
  }
}
