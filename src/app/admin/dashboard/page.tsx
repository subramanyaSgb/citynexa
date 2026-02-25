import Link from "next/link";
import {
  Building2,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Plus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/stats-card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  // Get today's midnight for "new leads today" count
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const [
    totalProperties,
    activeListings,
    totalInquiries,
    newLeadsToday,
    recentInquiries,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { isActive: true } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({
      where: { createdAt: { gte: todayMidnight } },
    }),
    prisma.inquiry.findMany({
      include: {
        property: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome to City Nexa Admin Panel
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/builders/new">
              <Plus className="size-4" />
              Add Builder
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/properties/new">
              <Plus className="size-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={totalProperties}
          icon={Building2}
          description="All property listings"
        />
        <StatsCard
          title="Active Listings"
          value={activeListings}
          icon={CheckCircle}
          description="Currently published"
        />
        <StatsCard
          title="Total Inquiries"
          value={totalInquiries}
          icon={MessageSquare}
          description="All time inquiries"
        />
        <StatsCard
          title="New Leads Today"
          value={newLeadsToday}
          icon={TrendingUp}
          description="Received today"
        />
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>
            Latest {recentInquiries.length} inquiries received
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No inquiries yet
              </p>
              <p className="text-sm text-muted-foreground">
                Inquiries from visitors will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInquiries.map((inquiry) => (
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
                    <TableCell className="max-w-[200px] truncate">
                      {inquiry.property ? (
                        <Link
                          href={`/admin/properties/${inquiry.property.id}/edit`}
                          className="hover:underline"
                        >
                          {inquiry.property.title}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">General</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={STATUS_BADGE_CLASSES[inquiry.status] ?? ""}
                      >
                        {STATUS_LABELS[inquiry.status] ?? inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {formatDate(inquiry.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {recentInquiries.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/inquiries">View All Inquiries</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
