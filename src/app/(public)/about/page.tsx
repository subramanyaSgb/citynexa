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
  Building2,
  Users,
  Handshake,
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

const STATS = [
  { value: "500+", label: "Properties Listed", icon: Building2 },
  { value: "1000+", label: "Happy Customers", icon: Users },
  { value: "14", label: "Builder Partners", icon: Handshake },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-warm-50">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warm-100/60 via-transparent to-copper/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper">
            About Us
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-warm-900 md:text-5xl lg:text-6xl">
            About City Nexa Networks
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-warm-600 md:text-xl">
            Bangalore&apos;s trusted real estate partner, connecting home buyers
            with the city&apos;s finest builders and properties since day one.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-copper">
              Our Story
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
              Built on trust, driven by expertise
            </h2>
            <div className="mt-6 space-y-4 text-warm-600 leading-relaxed md:text-lg">
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

      {/* ── How It Works ── */}
      <section className="border-y border-warm-200 bg-warm-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-copper">
              How It Works
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
              Three simple steps to your dream home
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-warm-500">
              A streamlined process designed to save you time and effort
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-warm-200 bg-white p-6 transition-all duration-300 hover:border-copper/30 hover:shadow-lg hover:shadow-warm-900/5"
              >
                <span className="absolute top-5 right-5 text-4xl font-bold text-warm-100 transition-colors group-hover:text-copper/10">
                  {item.step}
                </span>

                <div className="flex size-12 items-center justify-center rounded-xl bg-copper/10 text-copper transition-colors group-hover:bg-copper group-hover:text-white">
                  <item.icon className="size-6" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-warm-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-warm-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Values ── */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mission */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-copper">
              Our Mission
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
              Making property buying transparent and hassle-free
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-warm-600 md:text-lg leading-relaxed">
              We are on a mission to simplify real estate for every buyer in
              Bangalore. By partnering with verified builders and providing
              unbiased guidance, we empower you to make the right decision with
              complete confidence.
            </p>
          </div>

          {/* Values */}
          <div className="mt-16">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-copper">
                Our Values
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-warm-900 md:text-3xl">
                What we stand for
              </h3>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-warm-200 bg-warm-50 p-6 text-center transition-all duration-300 hover:border-copper/30 hover:bg-white hover:shadow-lg hover:shadow-warm-900/5"
                >
                  <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-copper/10 text-copper transition-colors group-hover:bg-copper group-hover:text-white">
                    <value.icon className="size-6" />
                  </div>

                  <h4 className="mt-5 text-lg font-semibold text-warm-900">
                    {value.title}
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-warm-500">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbers Section ── */}
      <section className="border-y border-warm-200 bg-warm-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-copper">
              Our Impact
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
              Numbers that speak for themselves
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-navy/10 text-navy">
                  <stat.icon className="size-7" />
                </div>
                <div className="font-display text-4xl font-semibold text-warm-900 md:text-5xl">
                  {stat.value.replace("+", "")}
                  {stat.value.includes("+") && (
                    <span className="text-copper">+</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-warm-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-navy py-20 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper-light">
            Get Started
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
            Ready to find your dream property?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Get in touch with our team today. Expert guidance, zero commission
            &mdash; your perfect property is just a conversation away.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-8 rounded-xl bg-copper px-8 text-base font-semibold text-white hover:bg-copper-dark"
          >
            <Link href="/contact">
              Contact Us
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
