"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import type { Builder } from "@/generated/prisma/client";
import { builderSchema, type BuilderFormData } from "@/lib/validations/builder";
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
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";

interface BuilderFormProps {
  initialData?: Builder;
  onSubmit: (data: BuilderFormData) => Promise<{ success: boolean; error?: string }>;
}

export function BuilderForm({ initialData, onSubmit }: BuilderFormProps) {
  const router = useRouter();

  const form = useForm<BuilderFormData>({
    resolver: standardSchemaResolver(builderSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      websiteUrl: initialData?.websiteUrl ?? "",
      logoUrl: initialData?.logoUrl ?? null,
      totalProjects: initialData?.totalProjects ?? 0,
      establishedYear: initialData?.establishedYear ?? undefined,
      isActive: initialData?.isActive ?? true,
    },
  });

  const { isSubmitting } = form.formState;

  async function handleSubmit(data: BuilderFormData) {
    const result = await onSubmit(data);
    if (result.success) {
      router.push("/admin/builders");
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
            <CardTitle>Builder Details</CardTitle>
            <CardDescription>
              Enter the basic information about this builder.
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
                    <Input placeholder="e.g. Sobha Limited" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the builder..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website URL */}
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.example.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo Upload */}
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => {
                const logoImages: UploadedImage[] = field.value
                  ? [{ url: field.value, isPrimary: true }]
                  : [];

                return (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={logoImages}
                        onChange={(images: UploadedImage[]) => {
                          field.onChange(images.length > 0 ? images[0].url : null);
                        }}
                        bucket="builder-logos"
                        multiple={false}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload the builder&apos;s logo. JPEG, PNG, or WebP, max 5MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Total Projects & Established Year */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="totalProjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Projects</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="establishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1900}
                        max={2030}
                        placeholder="e.g. 1995"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(Number.isNaN(val) ? undefined : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Active Switch */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Make this builder visible on the website.
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
            {initialData ? "Update Builder" : "Create Builder"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/builders")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
