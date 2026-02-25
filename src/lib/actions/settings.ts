"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type SettingsMap = Record<string, string>;

const SETTINGS_KEYS = [
  "whatsapp_phone",
  "company_email",
  "company_phone",
  "company_address",
  "notification_email",
  "facebook_url",
  "instagram_url",
  "linkedin_url",
  "twitter_url",
  "meta_title",
  "meta_description",
] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export async function getSettings(): Promise<SettingsMap> {
  try {
    const rows = await prisma.siteSettings.findMany();
    const map: SettingsMap = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export type SettingsActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateSettings(
  data: SettingsMap
): Promise<SettingsActionResult> {
  try {
    const entries = Object.entries(data).filter(
      ([key]) => (SETTINGS_KEYS as readonly string[]).includes(key)
    );

    await Promise.all(
      entries.map(([key, value]) =>
        prisma.siteSettings.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return {
      success: false,
      error: "Failed to save settings. Please try again.",
    };
  }
}

export type ChangePasswordResult =
  | { success: true }
  | { success: false; error: string };

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in." };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: "New password must be at least 6 characters.",
      };
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const isCurrentValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    const newHash = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to change password:", error);
    return {
      success: false,
      error: "Failed to change password. Please try again.",
    };
  }
}
