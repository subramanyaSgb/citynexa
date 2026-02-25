import { prisma } from "@/lib/prisma";
import { TestimonialsCarousel } from "./testimonials-carousel";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Hear from people who found their dream property with City Nexa
          </p>
        </div>

        {/* Carousel */}
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
