"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Quote } from "lucide-react";

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
              className="w-full flex-shrink-0 px-2 md:px-12"
            >
              <div className="mx-auto max-w-2xl rounded-2xl border border-warm-200 bg-warm-50 p-8 text-center md:p-10">
                <Quote className="mx-auto size-8 text-copper/30" />

                <div className="mt-4 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < testimonial.rating
                          ? "fill-copper text-copper"
                          : "text-warm-200"
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="mt-5 font-display text-lg leading-relaxed text-warm-800 md:text-xl">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                <div className="mt-6">
                  <div className="mx-auto size-10 rounded-full bg-copper/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-copper">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold text-warm-900">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-copper"
                  : "w-2 bg-warm-300 hover:bg-warm-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
