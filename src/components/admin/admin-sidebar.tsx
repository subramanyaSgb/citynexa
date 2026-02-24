"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Home,
  Building2,
  MessageSquare,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Home },
  { label: "Builders", href: "/admin/builders", icon: Building2 },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-white",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
          <Image
            src="/images/citynexa-logo.jpeg"
            alt="City Nexa"
            fill
            className="object-cover"
            priority
          />
        </div>
        <span className="text-lg font-semibold tracking-tight text-primary">
          City Nexa
        </span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer: User & Sign Out */}
      <div className="mt-auto border-t px-3 py-4">
        <Separator className="mb-4 hidden" />
        <div className="mb-3 flex items-center gap-3 px-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {status === "loading" ? (
              <Skeleton className="size-8 rounded-full" />
            ) : (
              (session?.user?.name?.[0] ?? "A").toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            {status === "loading" ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <p className="truncate text-sm font-medium text-foreground">
                {session?.user?.name ?? "Admin"}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="size-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
