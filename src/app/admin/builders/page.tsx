import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getBuilders } from "@/lib/actions/builders";
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
import { BuilderSearch } from "./builder-search";
import { BuilderActions } from "./builder-actions";

interface BuildersPageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function BuildersPage({ searchParams }: BuildersPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const page = Number(params.page) || 1;
  const limit = 10;

  const { builders, totalCount } = await getBuilders(search, page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Builders
          </h2>
          <p className="text-muted-foreground">
            Manage your builder partners
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/builders/new">
            <Plus className="size-4" />
            Add Builder
          </Link>
        </Button>
      </div>

      {/* Search */}
      <BuilderSearch defaultValue={search} />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Builders</CardTitle>
          <CardDescription>
            {totalCount} builder{totalCount !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {builders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No builders found
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search terms."
                  : "Get started by adding your first builder."}
              </p>
              {!search && (
                <Button asChild className="mt-4">
                  <Link href="/admin/builders/new">
                    <Plus className="size-4" />
                    Add Builder
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Projects</TableHead>
                    <TableHead className="text-center">Est. Year</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {builders.map((builder) => (
                    <TableRow key={builder.id}>
                      <TableCell>
                        <div className="relative size-10 overflow-hidden rounded-md border bg-muted">
                          {builder.logoUrl ? (
                            <Image
                              src={builder.logoUrl}
                              alt={builder.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
                              {builder.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {builder.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {builder.totalProjects}
                      </TableCell>
                      <TableCell className="text-center">
                        {builder.establishedYear ?? "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={builder.isActive ? "default" : "secondary"}
                          className={
                            builder.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {builder.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <BuilderActions
                          builderId={builder.id}
                          builderName={builder.name}
                          isActive={builder.isActive}
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
                            pathname: "/admin/builders",
                            query: {
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
                            pathname: "/admin/builders",
                            query: {
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
