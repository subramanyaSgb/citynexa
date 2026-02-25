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
    <section className="relative overflow-hidden bg-navy py-16 md:py-20 grain-overlay">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div>
            <div className="mb-3 h-[3px] w-10 bg-copper" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Looking for the
              <br />
              perfect property?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Let our experts help you find your dream home. Fill out the form
              and we&apos;ll get in touch shortly.
            </p>

            <ul className="mt-8 space-y-3">
              {BULLET_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-copper" />
                  <span className="text-sm text-white/70">{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[11px] uppercase tracking-wider text-white/30">
              Talk to our experts today — it&apos;s completely free
            </p>
          </div>

          {/* Right column — form */}
          <div className="rounded-xl border border-white/8 bg-white p-5 shadow-2xl md:p-6">
            <InquiryForm inquiryType="GENERAL" />
          </div>
        </div>
      </div>
    </section>
  );
}
