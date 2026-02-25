"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/properties?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/properties");
    }
  }

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1B3A5C] via-[#1B3A5C]/95 to-[#152d47]">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A5C]/50 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        {/* Main heading */}
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Find Your Dream Property
          <span className="block mt-2 text-[#C5A355]">in Bangalore</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
          Zero commission for buyers. Expert guidance, trusted builders.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-xl items-center gap-0 overflow-hidden rounded-full bg-white shadow-xl shadow-black/10"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by locality or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 border-0 pl-12 pr-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-full rounded-r-none shadow-none"
            />
          </div>
          <Button
            type="submit"
            className="h-14 rounded-l-none rounded-r-full bg-[#C5A355] px-6 text-base font-semibold text-white hover:bg-[#b8963e] md:px-8"
          >
            Search
          </Button>
        </form>

        {/* Quick filter chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-white/60">Quick filters:</span>
          <Link
            href="/properties?propertyType=RESIDENTIAL"
            className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
          >
            Residential
          </Link>
          <Link
            href="/properties?propertyType=COMMERCIAL"
            className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
          >
            Commercial
          </Link>
          <Link
            href="/properties?propertyType=PLOT"
            className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
          >
            Plots
          </Link>
        </div>
      </div>
    </section>
  );
}
