import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { BuilderPartners } from "@/components/home/builder-partners";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { StatsCounter } from "@/components/home/stats-counter";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "City Nexa Networks — Your Trusted Real Estate Partner in Bangalore",
  description:
    "Find your dream property in Bangalore with City Nexa Networks. Zero commission for buyers, expert guidance, and trusted builder partners. Browse 500+ premium residential, commercial properties and plots.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <BuilderPartners />
      <WhyChooseUs />
      <StatsCounter />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
