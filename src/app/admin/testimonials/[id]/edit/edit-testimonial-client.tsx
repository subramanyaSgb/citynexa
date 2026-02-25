"use client";

import type { Testimonial } from "@/generated/prisma/client";
import { updateTestimonial } from "@/lib/actions/testimonials";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import type { TestimonialFormData } from "@/lib/validations/testimonial";

interface EditTestimonialClientProps {
  testimonial: Testimonial;
}

export function EditTestimonialClient({ testimonial }: EditTestimonialClientProps) {
  async function handleSubmit(data: TestimonialFormData) {
    return await updateTestimonial(testimonial.id, data);
  }

  return <TestimonialForm initialData={testimonial} onSubmit={handleSubmit} />;
}
