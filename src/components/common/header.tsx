"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/common/mobile-nav";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Builders", href: "/builders" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/95 shadow-[0_1px_0_0_rgba(232,226,216,0.8)] backdrop-blur-xl"
          : "bg-white"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/citynexa-logo.jpeg"
            alt="City Nexa"
            width={36}
            height={36}
            className="size-8 rounded-md object-contain"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-navy">
              City Nexa
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-warm-400">
              Networks
            </span>
          </div>
        </Link>

        {/* Desktop Navigation — underline active style */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200",
                isActive(link.href)
                  ? "text-navy"
                  : "text-warm-500 hover:text-warm-800"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-copper" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <a
            href="tel:+919880875721"
            className="hidden items-center gap-1.5 rounded-full border border-warm-200 px-3.5 py-1.5 text-[12px] font-medium text-warm-600 transition-colors hover:border-copper/40 hover:text-copper sm:inline-flex"
          >
            <Phone className="size-3" />
            +91 98808 75721
          </a>

          <Link href="/shortlist" className="hidden sm:block">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-warm-500 hover:bg-warm-100 hover:text-navy"
            >
              <Heart className="size-[16px]" />
              <span className="sr-only">Shortlist</span>
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-warm-600 hover:bg-warm-100 lg:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        navLinks={navLinks}
        currentPath={pathname}
      />
    </header>
  );
}
