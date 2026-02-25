"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Building2,
  HardHat,
  Info,
  Phone,
  Heart,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/properties": Building2,
  "/builders": HardHat,
  "/about": Info,
  "/contact": Phone,
};

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: { label: string; href: string }[];
  currentPath: string;
}

export function MobileNav({
  open,
  onOpenChange,
  navLinks,
  currentPath,
}: MobileNavProps) {
  function isActive(href: string) {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Link
            href="/"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/citynexa-logo.jpeg"
              alt="City Nexa"
              width={40}
              height={40}
              className="size-9 rounded-md object-contain"
            />
            <span className="text-lg font-bold tracking-tight text-[#1B3A5C]">
              City Nexa
            </span>
          </Link>
        </SheetHeader>

        <Separator />

        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => {
            const Icon = navIcons[link.href] || Home;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-primary"
                )}
              >
                <Icon className="size-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        <div className="p-4">
          <Link
            href="/shortlist"
            onClick={() => onOpenChange(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
              currentPath === "/shortlist"
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-accent/10 hover:text-primary"
            )}
          >
            <Heart className="size-5" />
            Shortlist
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
