"use server";

import { prisma } from "@/lib/prisma";
import { inquirySchema, type InquiryFormData } from "@/lib/validations/inquiry";
import type { InquiryStatus, InquiryType } from "@/generated/prisma/client";

export async function submitInquiry(data: InquiryFormData) {
  try {
    const parsed = inquirySchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false as const,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const { name, email, phone, message, propertyId, inquiryType } =
      parsed.data;

    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message: message || null,
        propertyId: propertyId || null,
        inquiryType: inquiryType as InquiryType,
        status: "NEW",
      },
    });

    return { success: true as const };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return {
      success: false as const,
      error: "Failed to submit inquiry. Please try again.",
    };
  }
}

export interface InquiryFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getInquiries(filters: InquiryFilters = {}) {
  try {
    const { status, search, page = 1, limit = 10 } = filters;

    const where: Record<string, unknown> = {};

    if (status && ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "CLOSED"].includes(status)) {
      where.status = status as InquiryStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const [inquiries, totalCount] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          property: {
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return {
      inquiries,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return { inquiries: [], totalCount: 0, totalPages: 0 };
  }
}

export async function updateInquiryStatus(
  id: string,
  status: string,
  notes?: string,
) {
  try {
    const validStatuses = ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "CLOSED"];
    if (!validStatuses.includes(status)) {
      return { success: false as const, error: "Invalid status" };
    }

    await prisma.inquiry.update({
      where: { id },
      data: {
        status: status as InquiryStatus,
        ...(notes !== undefined && { adminNotes: notes }),
      },
    });

    return { success: true as const };
  } catch (error) {
    console.error("Failed to update inquiry status:", error);
    return {
      success: false as const,
      error: "Failed to update inquiry status.",
    };
  }
}
