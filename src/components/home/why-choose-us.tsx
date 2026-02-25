import {
  BadgePercent,
  Shield,
  Headphones,
  CircleCheck,
} from "lucide-react";

const VALUE_PROPOSITIONS = [
  {
    icon: BadgePercent,
    title: "Zero Commission",
    description:
      "No hidden charges or broker fees. Our service is 100% free for property buyers.",
  },
  {
    icon: Shield,
    title: "Trusted Partners",
    description:
      "We work with 14+ verified and RERA-registered builders across Bangalore.",
  },
  {
    icon: Headphones,
    title: "Expert Guidance",
    description:
      "Our experienced team helps you find the perfect property matching your needs and budget.",
  },
  {
    icon: CircleCheck,
    title: "End-to-End Support",
    description:
      "From property search to documentation, we assist you at every step of the journey.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="relative bg-warm-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetric layout: left heading + right grid */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left heading */}
          <div className="lg:col-span-4 lg:py-4">
            <div className="mb-3 h-[3px] w-10 bg-copper" />
            <h2 className="text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
              Why work
              <br />
              with us?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-warm-500">
              Simple, transparent, and hassle-free property search — the way it
              should be.
            </p>
          </div>

          {/* Right — 2x2 value grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {VALUE_PROPOSITIONS.map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-warm-200/80 bg-white p-5 transition-all duration-300 hover:border-copper/20 hover:shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors duration-300 group-hover:bg-copper/10 group-hover:text-copper">
                  <item.icon className="size-5" />
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
      </div>
    </section>
  );
}
