"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROPERTY_TYPE_LABELS,
  LISTING_TYPE_LABELS,
} from "@/lib/constants";

interface PropertySearchProps {
  defaultSearch: string;
  defaultPropertyType: string;
  defaultListingType: string;
  defaultBuilderId: string;
  builders: { id: string; name: string }[];
}

export function PropertySearch({
  defaultSearch,
  defaultPropertyType,
  defaultListingType,
  defaultBuilderId,
  builders,
}: PropertySearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    // Reset page when filters change
    params.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearch(term: string) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      updateParams({ search: term.trim() });
    }, 300);
  }

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${isPending ? "opacity-70" : ""}`}>
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          defaultValue={defaultSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Property Type filter */}
      <Select
        value={defaultPropertyType || "__all__"}
        onValueChange={(val) => updateParams({ propertyType: val === "__all__" ? "" : val })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Types</SelectItem>
          {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Listing Type filter */}
      <Select
        value={defaultListingType || "__all__"}
        onValueChange={(val) => updateParams({ listingType: val === "__all__" ? "" : val })}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="All Listings" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Listings</SelectItem>
          {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Builder filter */}
      <Select
        value={defaultBuilderId || "__all__"}
        onValueChange={(val) => updateParams({ builderId: val === "__all__" ? "" : val })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Builders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Builders</SelectItem>
          {builders.map((builder) => (
            <SelectItem key={builder.id} value={builder.id}>
              {builder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
