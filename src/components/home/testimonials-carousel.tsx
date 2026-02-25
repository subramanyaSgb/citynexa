"use client";

import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";

interface TestimonialData {
  id: string;
  name: string;
  text: string;
  rating: number;
}

interface TestimonialsCarouselProps {
  testimonials: TestimonialData[];
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 px-2 md:px-8"
            >
              <div className="mx-auto max-w-xl text-center">
                {/* Stars */}
                <div className="flex items-center justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < testimonial.rating
                          ? "fill-copper text-copper"
                          : "text-warm-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mt-5 font-display text-lg leading-relaxed text-warm-800 italic md:text-xl">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-navy/5 text-[13px] font-bold text-navy">
                    {testimonial.name.charAt(0)}
                  </div>
                  <p className="text-sm font-semibold text-warm-800">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 bg-copper"
                  : "w-1.5 bg-warm-300 hover:bg-warm-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
