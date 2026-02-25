import { prisma } from "@/lib/prisma";
import { TestimonialsCarousel } from "./testimonials-carousel";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper">
            Testimonials
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
            What our customers say
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-warm-500">
            Hear from people who found their dream property with City Nexa
          </p>
        </div>

        <div className="mt-12">
          <TestimonialsCarousel
            testimonials={testimonials.map((t) => ({
              id: t.id,
              name: t.name,
              text: t.text,
              rating: t.rating,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
