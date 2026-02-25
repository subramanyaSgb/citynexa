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

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const propertyTypes = [
  { label: "Residential", href: "/properties?propertyType=residential" },
  { label: "Commercial", href: "/properties?propertyType=commercial" },
  { label: "Plots", href: "/properties?propertyType=plot" },
  { label: "For Rent", href: "/properties?propertyType=rent" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Twitter", href: "#", icon: Twitter },
];

export function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/citynexa-logo.jpeg"
                alt="City Nexa"
                width={40}
                height={40}
                className="size-9 rounded-lg bg-white object-contain p-0.5"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                City Nexa
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-warm-400">
              Your trusted real estate partner in Bangalore. We help you find
              the perfect property that matches your lifestyle and investment
              goals.
            </p>

            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-warm-700 text-warm-400 transition-all hover:border-copper hover:bg-copper/10 hover:text-copper"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-warm-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-warm-500">
              Property Types
            </h3>
            <ul className="space-y-3">
              {propertyTypes.map((type) => (
                <li key={type.label}>
                  <Link
                    href={type.href}
                    className="text-sm text-warm-400 transition-colors hover:text-white"
                  >
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-warm-500">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-warm-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-warm-500" />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="flex items-center gap-3 text-sm text-warm-400 transition-colors hover:text-white"
                >
                  <Phone className="size-4 shrink-0 text-warm-500" />
                  <span>+91 XXXXXXXXXX</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@citynexa.com"
                  className="flex items-center gap-3 text-sm text-warm-400 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-warm-500" />
                  <span>info@citynexa.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-warm-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-warm-500">
            &copy; {new Date().getFullYear()} City Nexa Networks Pvt Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
