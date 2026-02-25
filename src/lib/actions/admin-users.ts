"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { AdminRole } from "@/generated/prisma/client";

// Types
export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
};

type ActionResult = { success: true } | { success: false; error: string };

// Validation schemas
const createAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
});

const updateAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
});

// Helper: check SUPER_ADMIN
async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "SUPER_ADMIN") {
    return null;
  }
  return session;
}

// Get all admin users
export async function getAdminUsers(): Promise<AdminUserItem[]> {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return users;
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    return [];
  }
}

// Create admin user
export async function createAdminUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. SUPER_ADMIN access required." };
    }

    const parsed = createAdminSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    // Check if email already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return { success: false, error: "An admin with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    await prisma.adminUser.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role as AdminRole,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to create admin user:", error);
    return { success: false, error: "Failed to create admin user." };
  }
}

// Update admin user (name, email, role)
export async function updateAdminUser(
  id: string,
  data: { name: string; email: string; role: string }
): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. SUPER_ADMIN access required." };
    }

    const parsed = updateAdminSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    // Check email uniqueness (exclude current user)
    const existing = await prisma.adminUser.findFirst({
      where: { email: parsed.data.email, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Another admin with this email already exists." };
    }

    await prisma.adminUser.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role as AdminRole,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update admin user:", error);
    return { success: false, error: "Failed to update admin user." };
  }
}

// Reset admin password
export async function resetAdminPassword(
  id: string,
  newPassword: string
): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. SUPER_ADMIN access required." };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: { id },
      data: { passwordHash },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return { success: false, error: "Failed to reset password." };
  }
}

// Toggle admin active status
export async function toggleAdminActive(id: string): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. SUPER_ADMIN access required." };
    }

    // Self-protection: can't deactivate yourself
    if (session.user.id === id) {
      return { success: false, error: "You cannot deactivate your own account." };
    }

    const user = await prisma.adminUser.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Admin user not found." };
    }

    await prisma.adminUser.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle admin status:", error);
    return { success: false, error: "Failed to update admin status." };
  }
}
