import { z } from "zod";

export const builderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  totalProjects: z.number().int().min(0, "Must be 0 or greater"),
  establishedYear: z
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(2030, "Year must be 2030 or earlier")
    .optional(),
  isActive: z.boolean(),
});

export type BuilderFormData = z.infer<typeof builderSchema>;

// Schema for server-side validation that handles coercion from serialized data
export const builderServerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  totalProjects: z.coerce.number().int().min(0, "Must be 0 or greater").default(0),
  establishedYear: z.coerce
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(2030, "Year must be 2030 or earlier")
    .optional(),
  isActive: z.boolean().default(true),
});
