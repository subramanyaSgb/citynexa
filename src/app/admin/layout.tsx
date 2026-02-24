"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page renders without the admin shell
  if (pathname === "/admin/login") {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar: visible on desktop only */}
        <AdminSidebar className="hidden lg:flex" />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
