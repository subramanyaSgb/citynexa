"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { testimonialServerSchema, type TestimonialFormData } from "@/lib/validations/testimonial";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function getTestimonials(
  search?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const [testimonials, totalCount] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return { testimonials, totalCount };
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return { testimonials: [], totalCount: 0 };
  }
}

export async function getTestimonial(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });
    return testimonial;
  } catch (error) {
    console.error("Failed to fetch testimonial:", error);
    return null;
  }
}

export async function createTestimonial(data: TestimonialFormData): Promise<ActionResult> {
  try {
    const parsed = testimonialServerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
    }

    await prisma.testimonial.create({
      data: parsed.data,
    });

    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return { success: false, error: "Failed to create testimonial. Please try again." };
  }
}

export async function updateTestimonial(
  id: string,
  data: TestimonialFormData
): Promise<ActionResult> {
  try {
    const parsed = testimonialServerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
    }

    await prisma.testimonial.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return { success: false, error: "Failed to update testimonial. Please try again." };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });

    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return { success: false, error: "Failed to delete testimonial. Please try again." };
  }
}

export async function toggleTestimonialActive(id: string): Promise<ActionResult> {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!testimonial) {
      return { success: false, error: "Testimonial not found." };
    }

    await prisma.testimonial.update({
      where: { id },
      data: { isActive: !testimonial.isActive },
    });

    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle testimonial status:", error);
    return { success: false, error: "Failed to toggle testimonial status. Please try again." };
  }
}
