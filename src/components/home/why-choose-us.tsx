import {
  BadgePercent,
  Shield,
  Headphones,
  CircleCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Why Choose City Nexa?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            We make your property search simple, transparent, and hassle-free
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPOSITIONS.map((item) => (
            <Card
              key={item.title}
              className="border-border/60 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="flex flex-col items-center gap-4 p-6">
                {/* Icon */}
                <div className="flex size-14 items-center justify-center rounded-full bg-[#1B3A5C]">
                  <item.icon className="size-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
