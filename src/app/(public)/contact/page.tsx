import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { InquiryForm } from "@/components/property/inquiry-form";

export const metadata: Metadata = {
  title: "Contact Us | City Nexa Networks",
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Office",
    value: "Bangalore, Karnataka",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+91 98808 75721",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Sat, 9 AM – 7 PM",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-warm-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-dark">
              Get in Touch
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl">
              Contact us
            </h1>
            <p className="mt-3 text-[15px] text-warm-500">
              Have a question or need assistance? Our team is ready to help you
              find the perfect property.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left: Info + Map */}
            <div className="space-y-8 lg:col-span-5">
              {/* Contact details */}
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy/5">
                      <item.icon className="size-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-warm-400">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-warm-900">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="overflow-hidden rounded-xl border border-warm-200">
                <iframe
                  title="City Nexa Networks Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15551.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-warm-200 bg-warm-50 p-5 md:p-6">
                <InquiryForm inquiryType="GENERAL" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
