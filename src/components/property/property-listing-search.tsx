"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PropertyListingSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const currentSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(currentSearch);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    startTransition(() => {
      router.replace(`/properties?${params.toString()}`);
    });
  }, [router, searchParams, searchValue, startTransition]);

  const clearSearch = useCallback(() => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    startTransition(() => {
      router.replace(`/properties?${params.toString()}`);
    });
  }, [router, searchParams, startTransition]);

  return (
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by property name, locality, or builder..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="pl-9 pr-9"
        />
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
