import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InquiryForm } from "@/components/property/inquiry-form";

export const metadata: Metadata = {
  title: "Contact Us | City Nexa Networks",
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Office Address",
    value: "Bangalore, Karnataka, India",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 XXXXXXXXXX",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@citynexa.com",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Sat: 9:00 AM - 7:00 PM",
  },
];

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground">
          Have a question or need assistance? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: Inquiry Form */}
        <Card>
          <CardContent className="p-6">
            <InquiryForm inquiryType="GENERAL" />
          </CardContent>
        </Card>

        {/* Right: Contact Info + Map */}
        <div className="space-y-6">
          {/* Contact Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item) => (
              <Card key={item.label}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1B3A5C]/10">
                    <item.icon className="size-5 text-[#1B3A5C]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Google Maps Embed */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <iframe
                title="City Nexa Networks Office Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15551.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
