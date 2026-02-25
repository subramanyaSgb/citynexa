import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import { getSettings } from "@/lib/actions/settings";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Builders", href: "/builders" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const propertyTypes = [
  { label: "Residential", href: "/properties?propertyType=RESIDENTIAL" },
  { label: "Commercial", href: "/properties?propertyType=COMMERCIAL" },
  { label: "Plots", href: "/properties?propertyType=PLOT" },
];

const socialIcons = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
} as const;

export async function Footer() {
  const settings = await getSettings();

  const socialLinks = [
    { label: "Facebook", href: settings.facebook_url, icon: socialIcons.facebook },
    { label: "LinkedIn", href: settings.linkedin_url, icon: socialIcons.linkedin },
    { label: "Instagram", href: settings.instagram_url, icon: socialIcons.instagram },
    { label: "Twitter", href: settings.twitter_url, icon: socialIcons.twitter },
  ].filter((s) => s.href);

  return (
    <footer className="bg-warm-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left — brand + description + social */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/citynexa-logo.jpeg"
                alt="City Nexa"
                width={36}
                height={36}
                className="size-8 rounded-md bg-white object-contain p-0.5"
              />
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold tracking-tight text-white">
                  City Nexa
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-warm-500">
                  Networks
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-warm-500">
              Your trusted real estate partner in Bangalore. Connecting buyers
              with premium properties — at zero commission.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-5 flex items-center gap-1.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-8 items-center justify-center rounded-md text-warm-500 transition-colors hover:bg-warm-800 hover:text-warm-300"
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right — 3 link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-warm-500">
                Navigation
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-warm-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-warm-500">
                Properties
              </h3>
              <ul className="space-y-2.5">
                {propertyTypes.map((type) => (
                  <li key={type.label}>
                    <Link
                      href={type.href}
                      className="text-[13px] text-warm-400 transition-colors hover:text-white"
                    >
                      {type.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-warm-500">
                Contact
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-[13px] text-warm-400">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-warm-600" />
                  <span>{settings.company_address || "Bangalore, Karnataka"}</span>
                </li>
                <li>
                  <a
                    href={`tel:${settings.company_phone || "+919880875721"}`}
                    className="flex items-center gap-2 text-[13px] text-warm-400 transition-colors hover:text-white"
                  >
                    <Phone className="size-3.5 shrink-0 text-warm-600" />
                    <span>{settings.company_phone || "+91 98808 75721"}</span>
                  </a>
                </li>
                {settings.company_email && (
                  <li>
                    <a
                      href={`mailto:${settings.company_email}`}
                      className="flex items-center gap-2 text-[13px] text-warm-400 transition-colors hover:text-white"
                    >
                      <Mail className="size-3.5 shrink-0 text-warm-600" />
                      <span>{settings.company_email}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-warm-800">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-center text-[12px] text-warm-600">
            &copy; {new Date().getFullYear()} City Nexa Networks Pvt Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
