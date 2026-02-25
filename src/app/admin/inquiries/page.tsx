import Link from "next/link";
import { getInquiries } from "@/lib/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InquiryActions } from "./inquiry-actions";
import { ExportCSVButton } from "./export-csv-button";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
] as const;

const STATUS_BADGE_CLASSES: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  CONTACTED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  FOLLOW_UP: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  CONVERTED: "bg-green-100 text-green-800 hover:bg-green-100",
  CLOSED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

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

const INQUIRY_TYPE_CLASSES: Record<string, string> = {
  GENERAL: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  PROPERTY_SPECIFIC: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  CALLBACK: "bg-teal-100 text-teal-800 hover:bg-teal-100",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

interface InquiriesPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function InquiriesPage({
  searchParams,
}: InquiriesPageProps) {
  const params = await searchParams;
  const status = params.status ?? "";
  const search = params.search ?? "";
  const page = Number(params.page) || 1;
  const limit = 10;

  const { inquiries, totalCount, totalPages } = await getInquiries({
    status: status || undefined,
    search: search || undefined,
    page,
    limit,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Inquiries
          </h2>
          <p className="text-muted-foreground">
            {totalCount} inquir{totalCount !== 1 ? "ies" : "y"} total
          </p>
        </div>
        <ExportCSVButton />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.value;
          const query: Record<string, string> = {};
          if (tab.value) query.status = tab.value;
          if (search) query.search = search;

          return (
            <Link
              key={tab.value}
              href={{
                pathname: "/admin/inquiries",
                query: Object.keys(query).length > 0 ? query : undefined,
              }}
              className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {status ? STATUS_LABELS[status] ?? "All" : "All"} Inquiries
          </CardTitle>
          <CardDescription>
            {totalCount} inquir{totalCount !== 1 ? "ies" : "y"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No inquiries found
              </p>
              <p className="text-sm text-muted-foreground">
                {status || search
                  ? "Try adjusting your filters."
                  : "Inquiries from visitors will appear here."}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/inquiries/${inquiry.id}`}
                          className="hover:underline"
                        >
                          {inquiry.name}
                        </Link>
                      </TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {inquiry.phone}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {inquiry.property ? (
                          <Link
                            href={`/admin/properties/${inquiry.property.id}/edit`}
                            className="hover:underline"
                          >
                            {inquiry.property.title}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={
                            INQUIRY_TYPE_CLASSES[inquiry.inquiryType] ?? ""
                          }
                        >
                          {INQUIRY_TYPE_LABELS[inquiry.inquiryType] ??
                            inquiry.inquiryType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={
                            STATUS_BADGE_CLASSES[inquiry.status] ?? ""
                          }
                        >
                          {STATUS_LABELS[inquiry.status] ?? inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <InquiryActions
                          inquiryId={inquiry.id}
                          currentStatus={inquiry.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={{
                            pathname: "/admin/inquiries",
                            query: {
                              ...(status ? { status } : {}),
                              ...(search ? { search } : {}),
                              page: String(page - 1),
                            },
                          }}
                        >
                          Previous
                        </Link>
                      </Button>
                    )}
                    {page < totalPages && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={{
                            pathname: "/admin/inquiries",
                            query: {
                              ...(status ? { status } : {}),
                              ...(search ? { search } : {}),
                              page: String(page + 1),
                            },
                          }}
                        >
                          Next
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
