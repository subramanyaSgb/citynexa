"use client";

import { createTestimonial } from "@/lib/actions/testimonials";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import type { TestimonialFormData } from "@/lib/validations/testimonial";

export default function NewTestimonialPage() {
  async function handleSubmit(data: TestimonialFormData) {
    return await createTestimonial(data);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Add New Testimonial
        </h2>
        <p className="text-muted-foreground">
          Create a new customer testimonial for your website.
        </p>
      </div>

      <TestimonialForm onSubmit={handleSubmit} />
    </div>
  );
}
