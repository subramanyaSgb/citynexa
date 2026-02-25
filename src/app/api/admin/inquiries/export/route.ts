import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow Up",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  GENERAL: "General",
  PROPERTY_SPECIFIC: "Property",
  CALLBACK: "Callback",
};

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.inquiry.findMany({
    include: {
      property: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = ["Name", "Email", "Phone", "Property", "Type", "Status", "Message", "Date"];
  const csvRows = [headers.join(",")];

  for (const inquiry of inquiries) {
    const row = [
      escapeCSV(inquiry.name),
      escapeCSV(inquiry.email),
      escapeCSV(inquiry.phone),
      escapeCSV(inquiry.property?.title ?? "-"),
      escapeCSV(INQUIRY_TYPE_LABELS[inquiry.inquiryType] ?? inquiry.inquiryType),
      escapeCSV(STATUS_LABELS[inquiry.status] ?? inquiry.status),
      escapeCSV(inquiry.message ?? ""),
      escapeCSV(formatDate(inquiry.createdAt)),
    ];
    csvRows.push(row.join(","));
  }

  const csv = csvRows.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="inquiries.csv"',
    },
  });
}
