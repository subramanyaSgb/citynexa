import Link from "next/link";
import { Plus } from "lucide-react";
import { getProperties, getActiveBuilders } from "@/lib/actions/properties";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  PRICE_UNIT_LABELS,
} from "@/lib/constants";
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
import { PropertySearch } from "./property-search";
import { PropertyActions } from "./property-actions";

interface PropertiesPageProps {
  searchParams: Promise<{
    search?: string;
    propertyType?: string;
    listingType?: string;
    builderId?: string;
    page?: string;
  }>;
}

function formatPrice(price: number, priceUnit: string): string {
  const unit = PRICE_UNIT_LABELS[priceUnit] ?? priceUnit;
  return `\u20B9${price} ${unit}`;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const propertyType = params.propertyType ?? "";
  const listingType = params.listingType ?? "";
  const builderId = params.builderId ?? "";
  const page = Number(params.page) || 1;
  const limit = 10;

  const [{ properties, totalCount }, builders] = await Promise.all([
    getProperties({ search, propertyType, listingType, builderId, page, limit }),
    getActiveBuilders(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Properties
          </h2>
          <p className="text-muted-foreground">
            Manage your property listings
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="size-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <PropertySearch
        defaultSearch={search}
        defaultPropertyType={propertyType}
        defaultListingType={listingType}
        defaultBuilderId={builderId}
        builders={builders}
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
          <CardDescription>
            {totalCount} propert{totalCount !== 1 ? "ies" : "y"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No properties found
              </p>
              <p className="text-sm text-muted-foreground">
                {search || propertyType || listingType || builderId
                  ? "Try adjusting your search or filters."
                  : "Get started by adding your first property."}
              </p>
              {!search && !propertyType && !listingType && !builderId && (
                <Button asChild className="mt-4">
                  <Link href="/admin/properties/new">
                    <Plus className="size-4" />
                    Add Property
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Listing</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Builder</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {property.title}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={property.listingType === "SALE" ? "default" : "secondary"}
                        >
                          {LISTING_TYPE_LABELS[property.listingType] ?? property.listingType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatPrice(property.price, property.priceUnit)}
                      </TableCell>
                      <TableCell>
                        {property.builder.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <PropertyActions
                          propertyId={property.id}
                          propertyTitle={property.title}
                          isActive={property.isActive}
                          isFeatured={property.isFeatured}
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
                            pathname: "/admin/properties",
                            query: {
                              ...(search ? { search } : {}),
                              ...(propertyType ? { propertyType } : {}),
                              ...(listingType ? { listingType } : {}),
                              ...(builderId ? { builderId } : {}),
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
                            pathname: "/admin/properties",
                            query: {
                              ...(search ? { search } : {}),
                              ...(propertyType ? { propertyType } : {}),
                              ...(listingType ? { listingType } : {}),
                              ...(builderId ? { builderId } : {}),
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
