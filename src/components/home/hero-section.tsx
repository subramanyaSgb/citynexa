"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Home, Building2, LandPlot } from "lucide-react";
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
      {/* Subtle diagonal line decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-[600px] w-[1px] origin-top rotate-[25deg] bg-gradient-to-b from-copper/20 via-copper/5 to-transparent" />
        <div className="absolute -right-16 top-0 h-[400px] w-[1px] origin-top rotate-[25deg] bg-gradient-to-b from-warm-200/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[88vh] items-center gap-8 py-16 lg:grid-cols-12 lg:gap-6 lg:py-0">

          {/* Left — Content */}
          <div className="relative z-10 lg:col-span-6 xl:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-dark">
              Bangalore&apos;s Trusted Real Estate Partner
            </p>

            <h1 className="mt-4 text-[2.5rem] font-bold leading-[1.08] tracking-tight text-warm-900 sm:text-[3.25rem] lg:text-[3.75rem]">
              Find your
              <br />
              next <span className="font-display italic text-navy">home</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-warm-500">
              Zero commission for buyers. Expert guidance from our property
              consultants across Bangalore&apos;s finest developments.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-warm-400" />
                <Input
                  type="text"
                  placeholder="Search locality, project, or builder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-lg border-warm-200 bg-white pl-10 pr-4 text-sm placeholder:text-warm-400 focus-visible:ring-1 focus-visible:ring-copper/40 shadow-none"
                />
              </div>
              <Button
                type="submit"
                className="h-12 rounded-lg bg-navy px-5 text-sm font-medium text-warm-50 hover:bg-navy-light"
              >
                Search
              </Button>
            </form>

            {/* Quick filter chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-warm-400">Browse:</span>
              {[
                { label: "Residential", href: "/properties?propertyType=RESIDENTIAL", icon: Home },
                { label: "Commercial", href: "/properties?propertyType=COMMERCIAL", icon: Building2 },
                { label: "Plots", href: "/properties?propertyType=PLOT", icon: LandPlot },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-warm-200/80 bg-white/60 px-3 py-1.5 text-[12px] font-medium text-warm-600 transition-all hover:border-warm-300 hover:bg-white hover:text-warm-800"
                >
                  <item.icon className="size-3 text-warm-400 transition-colors group-hover:text-copper" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Trust line */}
            <div className="mt-10 flex items-center gap-6 border-t border-warm-200/60 pt-6">
              <div>
                <p className="text-2xl font-bold text-navy">500+</p>
                <p className="text-[11px] text-warm-500">Listings</p>
              </div>
              <div className="h-8 w-px bg-warm-200" />
              <div>
                <p className="text-2xl font-bold text-navy">14+</p>
                <p className="text-[11px] text-warm-500">Builders</p>
              </div>
              <div className="h-8 w-px bg-warm-200" />
              <div>
                <p className="text-2xl font-bold text-navy">0%</p>
                <p className="text-[11px] text-warm-500">Commission</p>
              </div>
            </div>
          </div>

          {/* Right — Editorial image composition */}
          <div className="relative hidden lg:col-span-6 lg:block xl:col-span-7">
            <div className="relative ml-auto max-w-[540px]">
              {/* Main image */}
              <div className="relative aspect-[3/4] w-[75%] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                  alt="Luxury property in Bangalore"
                  fill
                  className="object-cover"
                  priority
                  sizes="40vw"
                />
              </div>

              {/* Secondary offset image */}
              <div className="absolute -bottom-4 right-0 aspect-[4/3] w-[55%] overflow-hidden rounded-2xl border-4 border-warm-50 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                  alt="Modern interior"
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>

              {/* Floating card */}
              <div className="absolute -left-6 bottom-24 rounded-xl border border-warm-200 bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-copper/10">
                    <ArrowRight className="size-4 text-copper" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-warm-800">
                      Ready to Move In
                    </p>
                    <p className="text-[11px] text-warm-500">
                      120+ properties available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
