import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Calendar, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getFeatureFlags } from "@/lib/feature-flags";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Our Builder Partners | City Nexa Networks",
  description:
    "Explore trusted and RERA-registered builder partners in Bangalore. View their projects and find premium properties from top developers.",
};

async function getActiveBuilders() {
  const builders = await prisma.builder.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          properties: {
            where: { isActive: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return builders;
}

export default async function BuildersPage() {
  const features = await getFeatureFlags();
  if (!features.builders) redirect("/");

  const builders = await getActiveBuilders();

  return (
    <section className="bg-warm-50/40">
      {/* Page Header */}
      <div className="border-b border-warm-200 bg-warm-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper">
            Trusted Partners
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-warm-900 md:text-5xl">
            Our Builder Partners
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-warm-500">
            We collaborate with Bangalore&apos;s most reputed developers to bring
            you quality homes and commercial spaces you can trust.
          </p>
        </div>
      </div>

      {/* Builder Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {builders.length === 0 ? (
          <div className="py-20 text-center">
            <Building2 className="mx-auto size-12 text-warm-300" />
            <p className="mt-4 text-lg text-warm-500">
              No builders available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {builders.map((builder) => (
              <Link
                key={builder.id}
                href={`/builders/${builder.id}`}
                className="group block"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-warm-200 bg-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-warm-900/8 group-hover:border-warm-300">
                  {/* Logo + Name Header */}
                  <div className="flex items-center gap-4 border-b border-warm-100 px-6 py-5">
                    {builder.logoUrl ? (
                      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-warm-200 bg-white p-1.5">
                        <Image
                          src={builder.logoUrl}
                          alt={builder.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-warm-200 bg-warm-50">
                        <Building2 className="size-7 text-warm-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-semibold text-warm-900 group-hover:text-copper transition-colors duration-300">
                        {builder.name}
                      </h2>
                      {builder.establishedYear && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-sm text-warm-500">
                          <Calendar className="size-3.5" />
                          <span>Est. {builder.establishedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 px-6 py-4">
                    {builder.description ? (
                      <p className="line-clamp-3 text-sm leading-relaxed text-warm-600">
                        {builder.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-warm-400">
                        Trusted builder partner of City Nexa Networks.
                      </p>
                    )}
                  </div>

                  {/* Footer Stats + CTA */}
                  <div className="flex items-center justify-between border-t border-warm-100 px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-navy">
                          {builder.totalProjects}
                        </p>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-warm-400">
                          Projects
                        </p>
                      </div>
                      <div className="h-8 w-px bg-warm-200" />
                      <div className="text-center">
                        <p className="text-lg font-bold text-navy">
                          {builder._count.properties}
                        </p>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-warm-400">
                          Listings
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-warm-200 px-4 py-1.5 text-xs font-semibold text-copper transition-all duration-300 group-hover:bg-copper group-hover:text-white group-hover:border-copper">
                      View Properties
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
