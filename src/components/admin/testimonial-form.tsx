"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Star } from "lucide-react";
import type { Testimonial } from "@/generated/prisma/client";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validations/testimonial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface TestimonialFormProps {
  initialData?: Testimonial;
  onSubmit: (data: TestimonialFormData) => Promise<{ success: boolean; error?: string }>;
}

export function TestimonialForm({ initialData, onSubmit }: TestimonialFormProps) {
  const router = useRouter();

  const form = useForm<TestimonialFormData>({
    resolver: standardSchemaResolver(testimonialSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      text: initialData?.text ?? "",
      rating: initialData?.rating ?? 5,
      isActive: initialData?.isActive ?? true,
    },
  });

  const { isSubmitting } = form.formState;

  async function handleSubmit(data: TestimonialFormData) {
    const result = await onSubmit(data);
    if (result.success) {
      router.push("/admin/testimonials");
    } else {
      form.setError("root", {
        message: result.error ?? "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Root-level error */}
        {form.formState.errors.root && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Testimonial Details</CardTitle>
            <CardDescription>
              Enter the information for this testimonial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Rahul Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Text */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did the customer say about their experience..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className="rounded p-0.5 transition-colors hover:bg-muted"
                        >
                          <Star
                            className={`size-6 ${
                              star <= field.value
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {field.value} of 5
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Switch */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Make this testimonial visible on the website.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {initialData ? "Update Testimonial" : "Create Testimonial"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/testimonials")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
