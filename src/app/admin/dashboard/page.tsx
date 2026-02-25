import Link from "next/link";
import {
  Building2,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Plus,
  Users,
  BarChart3,
  CalendarPlus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
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

const STATUS_BAR_COLORS: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  FOLLOW_UP: "bg-orange-500",
  CONVERTED: "bg-green-500",
  CLOSED: "bg-gray-400",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow Up",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  // 7 days ago for trend chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // First of this month for "properties added this month"
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const [
    totalProperties,
    activeListings,
    totalInquiries,
    newLeadsToday,
    recentInquiries,
    // New analytics queries
    totalBuilders,
    convertedInquiries,
    propertiesThisMonth,
    inquiryStatusBreakdown,
    inquiryTrendRaw,
    popularProperties,
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
    // Total builders
    prisma.builder.count(),
    // Converted inquiries (for conversion rate)
    prisma.inquiry.count({ where: { status: "CONVERTED" } }),
    // Properties added this month
    prisma.property.count({
      where: { createdAt: { gte: firstOfMonth } },
    }),
    // Inquiry status breakdown
    prisma.inquiry.groupBy({
      by: ["status"],
      _count: { status: true },
      orderBy: { _count: { status: "desc" } },
    }),
    // Inquiry trend: raw query for last 7 days grouped by date
    prisma.$queryRaw<
      Array<{ day: Date; count: bigint }>
    >(Prisma.sql`
      SELECT DATE(created_at) as day, COUNT(*)::bigint as count
      FROM inquiries
      WHERE created_at >= ${sevenDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY day ASC
    `),
    // Popular properties: top 5 by inquiry count
    prisma.property.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        _count: { select: { inquiries: true } },
      },
      orderBy: { inquiries: { _count: "desc" } },
      take: 5,
    }),
  ]);

  // --- Compute derived analytics data ---

  // Conversion rate
  const conversionRate =
    totalInquiries > 0
      ? ((convertedInquiries / totalInquiries) * 100).toFixed(1)
      : "0.0";

  // Build inquiry trend for all 7 days (fill in zeros for days with no inquiries)
  const trendMap = new Map<string, number>();
  for (const row of inquiryTrendRaw) {
    const dateKey = new Date(row.day).toISOString().split("T")[0];
    trendMap.set(dateKey, Number(row.count));
  }

  const inquiryTrend: Array<{ label: string; date: string; count: number }> =
    [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dateKey = d.toISOString().split("T")[0];
    inquiryTrend.push({
      label: DAY_LABELS[d.getDay()],
      date: dateKey,
      count: trendMap.get(dateKey) ?? 0,
    });
  }
  const maxTrendCount = Math.max(...inquiryTrend.map((d) => d.count), 1);

  // Status breakdown with total for percentage calculation
  const statusTotal = inquiryStatusBreakdown.reduce(
    (sum, s) => sum + s._count.status,
    0
  );
  const maxStatusCount = Math.max(
    ...inquiryStatusBreakdown.map((s) => s._count.status),
    1
  );

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

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total Builders"
          value={totalBuilders}
          icon={Users}
          description="Registered builders"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={BarChart3}
          description="Inquiries converted"
        />
        <StatsCard
          title="Added This Month"
          value={propertiesThisMonth}
          icon={CalendarPlus}
          description="Properties added this month"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inquiry Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Trend (Last 7 Days)</CardTitle>
            <CardDescription>Daily inquiry volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2" style={{ height: "200px" }}>
              {inquiryTrend.map((day) => {
                const heightPercent =
                  maxTrendCount > 0
                    ? (day.count / maxTrendCount) * 100
                    : 0;
                return (
                  <div
                    key={day.date}
                    className="flex flex-1 flex-col items-center justify-end gap-1"
                    style={{ height: "100%" }}
                  >
                    <span className="text-xs font-semibold text-foreground">
                      {day.count}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-primary transition-all"
                      style={{
                        height: `${Math.max(heightPercent, 4)}%`,
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Status Breakdown</CardTitle>
            <CardDescription>
              Distribution across {statusTotal} total inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inquiryStatusBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No inquiry data yet.
                </p>
              ) : (
                inquiryStatusBreakdown.map((item) => {
                  const widthPercent =
                    (item._count.status / maxStatusCount) * 100;
                  const percentage =
                    statusTotal > 0
                      ? ((item._count.status / statusTotal) * 100).toFixed(1)
                      : "0";
                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {STATUS_LABELS[item.status] ?? item.status}
                        </span>
                        <span className="text-muted-foreground">
                          {item._count.status} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${STATUS_BAR_COLORS[item.status] ?? "bg-gray-400"}`}
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Properties</CardTitle>
          <CardDescription>
            Top 5 properties by inquiry count
          </CardDescription>
        </CardHeader>
        <CardContent>
          {popularProperties.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No property inquiries yet.
            </p>
          ) : (
            <div className="divide-y">
              {popularProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="truncate font-medium text-foreground hover:underline"
                    >
                      {property.title}
                    </Link>
                  </div>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {property._count.inquiries}{" "}
                    {property._count.inquiries === 1 ? "inquiry" : "inquiries"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
