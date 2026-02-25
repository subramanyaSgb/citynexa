"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BANGALORE_LOCALITIES,
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
  FURNISHING_LABELS,
  POSSESSION_STATUS_LABELS,
} from "@/lib/constants";

interface PropertyFiltersProps {
  builders: { id: string; name: string }[];
}

export function PropertyFilters({ builders }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Read current filter values from URL
  const currentPropertyType = searchParams.get("propertyType") ?? "";
  const currentListingType = searchParams.get("listingType") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentBedrooms = searchParams.get("bedrooms") ?? "";
  const currentPossessionStatus = searchParams.get("possessionStatus") ?? "";
  const currentFurnishing = searchParams.get("furnishing") ?? "";
  const currentLocality = searchParams.get("locality") ?? "";
  const currentBuilderId = searchParams.get("builderId") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      params.delete("page");
      startTransition(() => {
        router.replace(`/properties?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  const clearAllFilters = useCallback(() => {
    // Preserve only the search param if present
    const search = searchParams.get("search");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    startTransition(() => {
      router.replace(`/properties?${params.toString()}`);
    });
    setSheetOpen(false);
  }, [router, searchParams, startTransition]);

  const hasActiveFilters =
    currentPropertyType ||
    currentListingType ||
    currentMinPrice ||
    currentMaxPrice ||
    currentBedrooms ||
    currentPossessionStatus ||
    currentFurnishing ||
    currentLocality ||
    currentBuilderId;

  const filterContent = (
    <div className="space-y-6">
      {/* Clear All */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="w-full text-destructive hover:text-destructive"
        >
          <X className="mr-1 size-4" />
          Clear All Filters
        </Button>
      )}

      {/* Property Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Property Type</Label>
        <div className="space-y-2">
          {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`type-${value}`}
                checked={currentPropertyType === value}
                onCheckedChange={(checked) => {
                  updateParams("propertyType", checked ? value : "");
                }}
              />
              <label
                htmlFor={`type-${value}`}
                className="cursor-pointer text-sm"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Listing Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Listing Type</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="listing-all"
              checked={currentListingType === ""}
              onCheckedChange={() => updateParams("listingType", "")}
            />
            <label htmlFor="listing-all" className="cursor-pointer text-sm">
              All
            </label>
          </div>
          {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`listing-${value}`}
                checked={currentListingType === value}
                onCheckedChange={(checked) => {
                  updateParams("listingType", checked ? value : "");
                }}
              />
              <label
                htmlFor={`listing-${value}`}
                className="cursor-pointer text-sm"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Budget Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Budget (in Lakh)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="number"
              placeholder="Min"
              value={currentMinPrice}
              onChange={(e) => updateParams("minPrice", e.target.value)}
              className="h-9"
              min={0}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max"
              value={currentMaxPrice}
              onChange={(e) => updateParams("maxPrice", e.target.value)}
              className="h-9"
              min={0}
            />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Enter values in Lakh (e.g., 100 for 1 Crore)
        </p>
      </div>

      <Separator />

      {/* Bedrooms - only visible when Residential selected */}
      {(!currentPropertyType || currentPropertyType === "RESIDENTIAL") && (
        <>
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Bedrooms</Label>
            <div className="flex flex-wrap gap-2">
              {["1", "2", "3", "4", "5"].map((num) => (
                <Button
                  key={num}
                  variant={currentBedrooms === num ? "default" : "outline"}
                  size="sm"
                  className="h-8 min-w-[3rem]"
                  onClick={() =>
                    updateParams("bedrooms", currentBedrooms === num ? "" : num)
                  }
                >
                  {num === "5" ? "5+" : num} BHK
                </Button>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Possession Status */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Possession Status</Label>
        <div className="space-y-2">
          {Object.entries(POSSESSION_STATUS_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`possession-${value}`}
                checked={currentPossessionStatus === value}
                onCheckedChange={(checked) => {
                  updateParams("possessionStatus", checked ? value : "");
                }}
              />
              <label
                htmlFor={`possession-${value}`}
                className="cursor-pointer text-sm"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Furnishing */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Furnishing</Label>
        <div className="space-y-2">
          {Object.entries(FURNISHING_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`furnishing-${value}`}
                checked={currentFurnishing === value}
                onCheckedChange={(checked) => {
                  updateParams("furnishing", checked ? value : "");
                }}
              />
              <label
                htmlFor={`furnishing-${value}`}
                className="cursor-pointer text-sm"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Locality */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Locality</Label>
        <Select
          value={currentLocality}
          onValueChange={(value) =>
            updateParams("locality", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Localities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Localities</SelectItem>
            {BANGALORE_LOCALITIES.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Builder */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Builder</Label>
        <Select
          value={currentBuilderId}
          onValueChange={(value) =>
            updateParams("builderId", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Builders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Builders</SelectItem>
            {builders.map((builder) => (
              <SelectItem key={builder.id} value={builder.id}>
                {builder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="size-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] overflow-y-auto p-6">
            <SheetHeader className="p-0 pb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {filterContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border bg-card p-4">
            {filterContent}
          </div>
        </div>
      </aside>
    </>
  );
}
