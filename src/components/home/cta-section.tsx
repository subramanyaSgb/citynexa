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
    <section className="relative overflow-hidden bg-navy py-20 md:py-24">
      {/* Subtle pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-copper-light">
              Get In Touch
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
              Looking for the perfect property?
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Let our experts help you find your dream home. Fill out the form
              and we&apos;ll get in touch shortly.
            </p>

            <ul className="mt-8 space-y-4">
              {BULLET_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-copper" />
                  <span className="text-white/80">{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-white/40">
              Talk to our experts today — it&apos;s completely free!
            </p>
          </div>

          {/* Right column — form */}
          <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl md:p-8">
            <InquiryForm inquiryType="GENERAL" />
          </div>
        </div>
      </div>
    </section>
  );
}
