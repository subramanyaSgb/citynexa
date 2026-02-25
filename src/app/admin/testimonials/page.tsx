import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { getTestimonials } from "@/lib/actions/testimonials";
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
import { TestimonialSearch } from "./testimonial-search";
import { TestimonialActions } from "./testimonial-actions";

interface TestimonialsPageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const page = Number(params.page) || 1;
  const limit = 10;

  const { testimonials, totalCount } = await getTestimonials(search, page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Testimonials
          </h2>
          <p className="text-muted-foreground">
            Manage customer testimonials
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="size-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {/* Search */}
      <TestimonialSearch defaultValue={search} />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
          <CardDescription>
            {totalCount} testimonial{totalCount !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No testimonials found
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search terms."
                  : "Get started by adding your first testimonial."}
              </p>
              {!search && (
                <Button asChild className="mt-4">
                  <Link href="/admin/testimonials/new">
                    <Plus className="size-4" />
                    Add Testimonial
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">
                        {testimonial.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${
                                i < testimonial.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={testimonial.isActive ? "default" : "secondary"}
                          className={
                            testimonial.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {testimonial.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <TestimonialActions
                          testimonialId={testimonial.id}
                          testimonialName={testimonial.name}
                          isActive={testimonial.isActive}
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
                            pathname: "/admin/testimonials",
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
                            pathname: "/admin/testimonials",
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
