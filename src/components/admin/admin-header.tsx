"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useState } from "react";

/** Map pathname segments to human-readable page titles. */
function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  // Take the last meaningful segment after /admin/
  const page = segments[segments.length - 1];

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    properties: "Properties",
    builders: "Builders",
    inquiries: "Inquiries",
    testimonials: "Testimonials",
    settings: "Settings",
    users: "Users",
    "site-control": "Site Control",
  };

  return titles[page] ?? "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = getPageTitle(pathname);
  const initials = (session?.user?.name?.[0] ?? "A").toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 lg:px-6">
      {/* Mobile hamburger menu */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AdminSidebar className="border-r-0" />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      {/* Right side: user dropdown */}
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 px-2"
            >
              <Avatar size="sm">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline-block">
                {session?.user?.name ?? "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">
                  {session?.user?.name ?? "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button className="w-full cursor-pointer">
                <User className="mr-2 size-4" />
                Profile
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="mr-2 size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
