import { prisma } from "@/lib/prisma";
import { TestimonialsCarousel } from "./testimonials-carousel";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-warm-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 mx-auto h-[3px] w-10 bg-copper" />
        <h2 className="text-center text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
          What our customers say
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-warm-500">
          Hear from people who found their dream property with us
        </p>

        <div className="mt-10">
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
