import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  inquiryType: z.enum(["GENERAL", "PROPERTY_SPECIFIC", "CALLBACK"]),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
