import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  Lightbulb,
  CalendarCheck,
  Shield,
  Eye,
  Compass,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | City Nexa Networks",
  description:
    "Learn about City Nexa Networks — Bangalore's trusted real estate channel partner. Zero commission for buyers, expert guidance, and end-to-end support from 14+ verified builder partners.",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Tell Us Your Requirements",
    description:
      "Share your budget, location preference, and property type. Our team listens carefully to understand exactly what you need.",
  },
  {
    step: "02",
    icon: Lightbulb,
    title: "Get Expert Recommendations",
    description:
      "Our team curates personalized property matches from our network of 14+ trusted builders across Bangalore.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Visit & Finalize",
    description:
      "Schedule site visits at your convenience and we handle all documentation, negotiations, and paperwork for you.",
  },
] as const;

const VALUES = [
  {
    icon: Shield,
    title: "Trust",
    description:
      "We partner only with RERA-registered builders and maintain complete integrity in every interaction.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "No hidden charges, no surprises. Every detail about pricing, legality, and timelines is shared upfront.",
  },
  {
    icon: Compass,
    title: "Expert Guidance",
    description:
      "Our experienced consultants bring deep market knowledge to help you make confident decisions.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Your needs drive everything we do. We go the extra mile to ensure a smooth and satisfying experience.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-warm-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-dark">
              About City Nexa
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl lg:text-5xl">
              Bangalore&apos;s trusted real estate partner
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-warm-500">
              Connecting home buyers with the city&apos;s finest builders and
              properties — with zero commission and end-to-end support.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story — asymmetric layout */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="mb-3 h-[3px] w-10 bg-copper" />
              <h2 className="text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
                Our story
              </h2>
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed text-warm-600 lg:col-span-8">
              <p>
                City Nexa Networks is a premier real estate channel partner in
                Bangalore, dedicated to connecting buyers with top builders
                across the city. We believe finding your dream property should
                be an exciting journey, not a stressful one.
              </p>
              <p>
                Our service is{" "}
                <span className="font-semibold text-navy">
                  completely free for buyers
                </span>{" "}
                &mdash; zero commission, zero hidden fees. From the first
                conversation to final handover, our experienced team provides
                expert guidance and end-to-end support, ensuring every step of
                your property buying experience is transparent and hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-warm-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 h-[3px] w-10 bg-copper" />
          <h2 className="text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 max-w-md text-sm text-warm-500">
            A streamlined process designed to save you time and effort
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="group rounded-xl border border-warm-200/80 bg-white p-5 transition-all duration-300 hover:border-copper/20 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-copper/10 group-hover:text-copper">
                    <item.icon className="size-5" />
                  </div>
                  <span className="text-[11px] font-bold text-warm-300">
                    Step {item.step}
                  </span>
                </div>

                <h3 className="mt-4 text-[15px] font-semibold text-warm-900">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-[13px] leading-relaxed text-warm-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values — combined */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="mb-3 h-[3px] w-10 bg-copper" />
              <h2 className="text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
                What we
                <br />
                stand for
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-warm-500">
                We are on a mission to simplify real estate for every buyer in
                Bangalore. By partnering with verified builders and providing
                unbiased guidance, we empower you to make the right decision.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-xl border border-warm-200/80 bg-warm-50 p-5 transition-all duration-300 hover:border-copper/20 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-copper/10 group-hover:text-copper">
                    <value.icon className="size-5" />
                  </div>

                  <h4 className="mt-4 text-[15px] font-semibold text-warm-900">
                    {value.title}
                  </h4>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-warm-500">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-navy py-12 md:py-14 grain-overlay relative">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "500+", label: "Properties" },
              { value: "1000+", label: "Happy Customers" },
              { value: "14+", label: "Builder Partners" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[12px] text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-warm-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
              Ready to find your
              <br />
              dream property?
            </h2>
            <p className="mt-3 text-sm text-warm-500">
              Get in touch with our team today. Expert guidance, zero commission.
            </p>
            <Button
              asChild
              className="mt-6 rounded-lg bg-navy px-6 text-sm font-medium text-warm-50 hover:bg-navy-light"
            >
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
