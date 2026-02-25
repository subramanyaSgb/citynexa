import { CheckCircle2 } from "lucide-react";
import { InquiryForm } from "@/components/property/inquiry-form";

const BULLET_POINTS = [
  "Browse 500+ premium properties",
  "Get expert guidance at zero cost",
  "Personalized property recommendations",
  "End-to-end support from search to handover",
] as const;

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-[#1B3A5C] via-[#1B3A5C] to-[#152d47] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left column: text content */}
          <div className="text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              Looking for the Perfect Property?
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Let our experts help you find your dream home. Fill out the form
              and we will get in touch with you shortly.
            </p>

            <ul className="mt-8 space-y-4">
              {BULLET_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#C5A355]" />
                  <span className="text-white/90">{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-white/50">
              Talk to our experts today - it&apos;s completely free!
            </p>
          </div>

          {/* Right column: inquiry form */}
          <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
            <InquiryForm inquiryType="GENERAL" />
          </div>
        </div>
      </div>
    </section>
  );
}
