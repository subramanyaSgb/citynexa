"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Menu } from "lucide-react";
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-white"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/citynexa-logo.jpeg"
            alt="City Nexa"
            width={40}
            height={40}
            className="size-9 rounded-lg object-contain"
            priority
          />
          <span className="text-xl font-bold tracking-tight text-navy">
            City Nexa
          </span>
        </Link>

        {/* Desktop Navigation — pill style */}
        <nav className="hidden items-center lg:flex">
          <div className="flex items-center rounded-full border border-warm-200 bg-warm-50 p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive(link.href)
                    ? "bg-navy text-white shadow-sm"
                    : "text-warm-700 hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link href="/shortlist" className="hidden sm:block">
            <Button
              variant="ghost"
              size="icon"
              className="relative size-10 rounded-full text-warm-600 hover:bg-warm-100 hover:text-navy"
            >
              <Heart className="size-[18px]" />
              <span className="sr-only">Shortlist</span>
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full text-warm-600 hover:bg-warm-100 lg:hidden"
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
