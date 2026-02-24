import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Don't protect auth API routes
  if (isAuthRoute) return;

  // Redirect unauthenticated users to the login page
  if (isAdminRoute && !isLoginPage && !req.auth) {
    return Response.redirect(new URL("/admin/login", req.url));
  }

  // Redirect authenticated users away from the login page
  if (isLoginPage && req.auth) {
    return Response.redirect(new URL("/admin/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
