"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Building2, Home, LandPlot } from "lucide-react";
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
    <section className="relative overflow-hidden bg-warm-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[85vh] items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-0">

          {/* Left — Content */}
          <div className="relative z-10 max-w-xl py-8 lg:py-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-copper/30 bg-copper/10 px-4 py-1.5 text-sm font-medium text-copper-dark">
              <MapPin className="size-3.5" />
              Bangalore&apos;s Trusted Real Estate Partner
            </div>

            <h1 className="mt-6 font-display text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-warm-900 md:text-[3.5rem] lg:text-[4rem]">
              Real estate for
              <br />
              <span className="text-navy">living</span> &{" "}
              <span className="text-copper">investments</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-warm-600 md:text-xl">
              Zero commission for buyers. Expert guidance from our experienced
              team of property consultants across Bangalore.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex items-center overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-lg shadow-warm-900/5"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-warm-400" />
                <Input
                  type="text"
                  placeholder="Search by locality or project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 border-0 bg-transparent pl-12 pr-4 text-[15px] placeholder:text-warm-400 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                />
              </div>
              <Button
                type="submit"
                className="m-1.5 h-11 rounded-xl bg-navy px-6 text-sm font-semibold text-warm-50 hover:bg-navy-light"
              >
                Search
              </Button>
            </form>

            {/* Quick filter chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href="/properties?propertyType=RESIDENTIAL"
                className="group inline-flex items-center gap-1.5 rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 transition-all hover:border-navy/30 hover:bg-navy/5 hover:text-navy"
              >
                <Home className="size-3.5 text-warm-400 transition-colors group-hover:text-navy" />
                Residential
              </Link>
              <Link
                href="/properties?propertyType=COMMERCIAL"
                className="group inline-flex items-center gap-1.5 rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 transition-all hover:border-navy/30 hover:bg-navy/5 hover:text-navy"
              >
                <Building2 className="size-3.5 text-warm-400 transition-colors group-hover:text-navy" />
                Commercial
              </Link>
              <Link
                href="/properties?propertyType=PLOT"
                className="group inline-flex items-center gap-1.5 rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 transition-all hover:border-navy/30 hover:bg-navy/5 hover:text-navy"
              >
                <LandPlot className="size-3.5 text-warm-400 transition-colors group-hover:text-navy" />
                Plots
              </Link>
            </div>
          </div>

          {/* Right — Hero image with floating cards */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt="Luxury property in Bangalore"
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-900/40 via-transparent to-transparent" />
            </div>

            {/* Floating property preview card */}
            <div className="absolute -bottom-6 -left-8 w-72 rounded-2xl border border-warm-200 bg-white p-5 shadow-xl shadow-warm-900/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-warm-500">Featured Property</p>
                  <p className="mt-1 font-display text-lg font-semibold text-warm-900">
                    Golden Springfield
                  </p>
                </div>
                <span className="rounded-full bg-copper/10 px-2.5 py-1 text-xs font-semibold text-copper-dark">
                  New
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 border-t border-warm-100 pt-3 text-sm text-warm-600">
                <span className="font-semibold text-warm-900">3 BHK</span>
                <span>1,650 sqft</span>
                <span className="font-semibold text-copper">&#8377;85 L</span>
              </div>
            </div>

            {/* Floating stats badge */}
            <div className="absolute -right-4 top-8 rounded-2xl border border-warm-200 bg-white px-5 py-3 shadow-lg shadow-warm-900/10">
              <p className="text-2xl font-bold text-navy">500+</p>
              <p className="text-xs text-warm-500">Premium Listings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-warm-100/50 to-transparent" />
    </section>
  );
}
