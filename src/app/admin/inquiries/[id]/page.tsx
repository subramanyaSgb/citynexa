import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, User, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InquiryStatusSection } from "./inquiry-detail-client";

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  GENERAL: "General Inquiry",
  PROPERTY_SPECIFIC: "Property Specific",
  CALLBACK: "Callback Request",
};

const INQUIRY_TYPE_CLASSES: Record<string, string> = {
  GENERAL: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  PROPERTY_SPECIFIC: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  CALLBACK: "bg-teal-100 text-teal-800 hover:bg-teal-100",
};

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params;

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          propertyType: true,
          listingType: true,
          city: true,
          locality: true,
        },
      },
    },
  });

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/inquiries">
            <ArrowLeft className="size-4" />
            Back to Inquiries
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Inquiry from {inquiry.name}
        </h2>
        <p className="text-muted-foreground">
          Received on {formatDateTime(inquiry.createdAt)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Contact Info + Property */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">
                      {inquiry.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {inquiry.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MessageSquare className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Inquiry Type
                    </p>
                    <Badge
                      variant="secondary"
                      className={
                        INQUIRY_TYPE_CLASSES[inquiry.inquiryType] ?? ""
                      }
                    >
                      {INQUIRY_TYPE_LABELS[inquiry.inquiryType] ??
                        inquiry.inquiryType}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Message */}
              {inquiry.message && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Message
                    </p>
                    <div className="rounded-md bg-muted/50 p-4 text-sm text-foreground">
                      {inquiry.message}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Linked Property */}
          {inquiry.property && (
            <Card>
              <CardHeader>
                <CardTitle>Linked Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {inquiry.property.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.property.propertyType} &middot;{" "}
                      {inquiry.property.listingType}
                      {inquiry.property.locality &&
                        ` &middot; ${inquiry.property.locality}`}
                      {inquiry.property.city &&
                        `, ${inquiry.property.city}`}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/admin/properties/${inquiry.property.id}/edit`}
                    >
                      View Property
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Status & Notes */}
        <div>
          <InquiryStatusSection
            inquiryId={inquiry.id}
            currentStatus={inquiry.status}
            adminNotes={inquiry.adminNotes}
          />
        </div>
      </div>
    </div>
  );
}
