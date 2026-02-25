"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative">
      {/* Cards container */}
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
              <Card className="mx-auto max-w-2xl border-border/60">
                <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                  {/* Quote icon */}
                  <Quote className="size-10 text-[#C5A355]/30" />

                  {/* Star rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-5 ${
                          i < testimonial.rating
                            ? "fill-[#C5A355] text-[#C5A355]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-base italic leading-relaxed text-muted-foreground md:text-lg">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>

                  {/* Customer name */}
                  <div className="mt-2">
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-[#1B3A5C]"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
