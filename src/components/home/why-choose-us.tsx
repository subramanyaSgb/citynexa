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
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper">
            Why City Nexa
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
            The smarter way to find property
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-warm-500">
            Simple, transparent, and hassle-free property search
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPOSITIONS.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-warm-200 bg-warm-50 p-6 transition-all duration-300 hover:border-copper/30 hover:bg-white hover:shadow-lg hover:shadow-warm-900/5"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-copper/10 text-copper transition-colors group-hover:bg-copper group-hover:text-white">
                <item.icon className="size-6" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-warm-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-warm-500">
                {item.description}
              </p>

              <span className="absolute top-5 right-5 text-4xl font-bold text-warm-100 transition-colors group-hover:text-copper/10">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
