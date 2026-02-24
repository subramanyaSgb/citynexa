"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import type { Property, Builder, PropertyImage } from "@/generated/prisma/client";
import { propertySchema, type PropertyFormData } from "@/lib/validations/property";
import {
  BANGALORE_LOCALITIES,
  AMENITIES,
  FACING_DIRECTIONS,
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  PRICE_UNIT_LABELS,
  FURNISHING_LABELS,
  POSSESSION_STATUS_LABELS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload, type UploadedImage } from "@/components/admin/image-upload";

interface PropertyFormProps {
  initialData?: Property & { builder: Builder; images?: PropertyImage[] };
  builders: { id: string; name: string }[];
  onSubmit: (
    data: PropertyFormData,
    images: UploadedImage[]
  ) => Promise<{ success: boolean; error?: string }>;
}

export function PropertyForm({ initialData, builders, onSubmit }: PropertyFormProps) {
  const router = useRouter();

  // Initialize images from existing property data
  const [images, setImages] = useState<UploadedImage[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((img) => ({
          url: img.imageUrl,
          isPrimary: img.isPrimary,
        }));
    }
    return [];
  });

  const form = useForm<PropertyFormData>({
    resolver: standardSchemaResolver(propertySchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      propertyType: initialData?.propertyType ?? "RESIDENTIAL",
      listingType: initialData?.listingType ?? "SALE",
      builderId: initialData?.builderId ?? "",
      price: initialData?.price ?? 0,
      priceUnit: initialData?.priceUnit ?? "LAKH",
      carpetArea: initialData?.carpetArea ?? null,
      carpetAreaUnit: initialData?.carpetAreaUnit ?? null,
      builtUpArea: initialData?.builtUpArea ?? null,
      bedrooms: initialData?.bedrooms ?? null,
      bathrooms: initialData?.bathrooms ?? null,
      floorNumber: initialData?.floorNumber ?? null,
      totalFloors: initialData?.totalFloors ?? null,
      facingDirection: initialData?.facingDirection ?? null,
      furnishing: initialData?.furnishing ?? null,
      possessionStatus: initialData?.possessionStatus ?? "READY_TO_MOVE",
      possessionDate: initialData?.possessionDate
        ? new Date(initialData.possessionDate).toISOString().split("T")[0]
        : null,
      amenities: (initialData?.amenities as string[] | undefined) ?? [],
      address: initialData?.address ?? null,
      city: initialData?.city ?? "Bangalore",
      locality: initialData?.locality ?? null,
      state: initialData?.state ?? "Karnataka",
      pincode: initialData?.pincode ?? null,
      latitude: initialData?.latitude ?? null,
      longitude: initialData?.longitude ?? null,
      reraNumber: initialData?.reraNumber ?? null,
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
    },
  });

  const { isSubmitting } = form.formState;
  const propertyType = form.watch("propertyType");

  async function handleSubmit(data: PropertyFormData) {
    const result = await onSubmit(data, images);
    if (result.success) {
      router.push("/admin/properties");
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

        {/* Section 1: Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about this property.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sobha Dream Acres 2BHK" {...field} />
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
                      placeholder="Detailed description of the property..."
                      rows={5}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Type & Listing Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Builder & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Builder & Pricing</CardTitle>
            <CardDescription>
              Select the builder and set the price.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Builder */}
            <FormField
              control={form.control}
              name="builderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Builder *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a builder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {builders.map((builder) => (
                        <SelectItem key={builder.id} value={builder.id}>
                          {builder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price & Price Unit */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="e.g. 45"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Unit *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PRICE_UNIT_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>
              Property dimensions, rooms, and other specifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Carpet Area + Unit */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="carpetArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carpet Area</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="e.g. 1200"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(Number.isNaN(val) ? null : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carpetAreaUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Unit</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "__none__" ? null : val)}
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        <SelectItem value="SQFT">Sq. Ft.</SelectItem>
                        <SelectItem value="SQYD">Sq. Yd.</SelectItem>
                        <SelectItem value="SQMT">Sq. Mt.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Built-up Area */}
            <FormField
              control={form.control}
              name="builtUpArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Built-up Area (sq. ft.)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="e.g. 1500"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(val) ? null : val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bedrooms & Bathrooms (only for RESIDENTIAL) */}
            {propertyType === "RESIDENTIAL" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="e.g. 2"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.onChange(Number.isNaN(val) ? null : val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="e.g. 2"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.onChange(Number.isNaN(val) ? null : val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Floor Number & Total Floors (for RESIDENTIAL/COMMERCIAL) */}
            {(propertyType === "RESIDENTIAL" || propertyType === "COMMERCIAL") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="floorNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="e.g. 3"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.onChange(Number.isNaN(val) ? null : val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalFloors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Floors</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="e.g. 20"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.onChange(Number.isNaN(val) ? null : val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Facing Direction & Furnishing */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="facingDirection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facing Direction</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "__none__" ? null : val)}
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {FACING_DIRECTIONS.map((dir) => (
                          <SelectItem key={dir} value={dir}>
                            {dir}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnishing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Furnishing</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "__none__" ? null : val)}
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {Object.entries(FURNISHING_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Possession */}
        <Card>
          <CardHeader>
            <CardTitle>Possession Details</CardTitle>
            <CardDescription>
              Current possession status and expected date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="possessionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possession Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(POSSESSION_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="possessionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possession Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              Select the amenities available with this property.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {AMENITIES.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? [];
                                  if (checked) {
                                    field.onChange([...current, amenity]);
                                  } else {
                                    field.onChange(
                                      current.filter((v: string) => v !== amenity)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {amenity}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section 6: Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Property location details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full address"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City & Locality */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Bangalore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locality</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "__none__" ? null : val)}
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select locality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {BANGALORE_LOCALITIES.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* State & Pincode */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Karnataka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 560066"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Latitude & Longitude */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 12.9716"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(Number.isNaN(val) ? null : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 77.5946"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(Number.isNaN(val) ? null : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Meta */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>
              RERA number, visibility, and featured status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* RERA Number */}
            <FormField
              control={form.control}
              name="reraNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RERA Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. PRM/KA/RERA/1251/446/PR/..."
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Images */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Property Images
              </label>
              <ImageUpload
                value={images}
                onChange={setImages}
                bucket="property-images"
                multiple
                maxFiles={10}
              />
              <p className="text-xs text-muted-foreground">
                Upload up to 10 images. Click the star icon to set the primary image.
              </p>
            </div>

            {/* Featured Switch */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured</FormLabel>
                    <FormDescription>
                      Show this property in the featured section on the homepage.
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

            {/* Active Switch */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Make this property visible on the website.
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
            {initialData ? "Update Property" : "Create Property"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/properties")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
