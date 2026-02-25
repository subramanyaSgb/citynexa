import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  text: z.string().min(10, "Review text must be at least 10 characters"),
  rating: z.number().int().min(1).max(5),
  isActive: z.boolean(),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

// Schema for server-side validation that handles coercion from serialized data
export const testimonialServerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  text: z.string().min(10, "Review text must be at least 10 characters"),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").default(5),
  isActive: z.boolean().default(true),
});
