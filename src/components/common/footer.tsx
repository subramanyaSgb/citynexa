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
import { Separator } from "@/components/ui/separator";

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
    <footer className="bg-primary text-primary-foreground">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/citynexa-logo.jpeg"
                alt="City Nexa"
                width={40}
                height={40}
                className="size-9 rounded-md bg-white object-contain p-0.5"
              />
              <span className="text-lg font-bold tracking-tight">
                City Nexa
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              Your trusted real estate partner in Bangalore. We help you find
              the perfect property that matches your lifestyle and investment
              goals.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Property Types
            </h3>
            <ul className="space-y-3">
              {propertyTypes.map((type) => (
                <li key={type.label}>
                  <Link
                    href={type.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Phone className="size-4 shrink-0" />
                  <span>+91 XXXXXXXXXX</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@citynexa.com"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  <Mail className="size-4 shrink-0" />
                  <span>info@citynexa.com</span>
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <Separator className="bg-primary-foreground/20" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} City Nexa Networks Pvt Ltd. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
