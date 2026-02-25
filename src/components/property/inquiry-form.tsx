"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { inquirySchema, type InquiryFormData } from "@/lib/validations/inquiry";
import { submitInquiry } from "@/lib/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface InquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  inquiryType?: "GENERAL" | "PROPERTY_SPECIFIC" | "CALLBACK";
}

export function InquiryForm({
  propertyId,
  propertyTitle,
  inquiryType = "GENERAL",
}: InquiryFormProps) {
  const form = useForm<InquiryFormData>({
    resolver: standardSchemaResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: propertyTitle
        ? `I'm interested in ${propertyTitle}`
        : "",
      propertyId: propertyId ?? undefined,
      inquiryType: inquiryType,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: InquiryFormData) {
    const result = await submitInquiry(data);

    if (result.success) {
      toast.success("Thank you! We'll contact you soon.");
      form.reset({
        name: "",
        email: "",
        phone: "",
        message: propertyTitle
          ? `I'm interested in ${propertyTitle}`
          : "",
        propertyId: propertyId ?? undefined,
        inquiryType: inquiryType,
      });
    } else {
      toast.error(result.error || "Something went wrong. Please try again.");
    }
  }

  const title = propertyId
    ? "Interested in this property?"
    : "Get in Touch";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what you're looking for..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#1B3A5C] hover:bg-[#152d47]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {isSubmitting ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
