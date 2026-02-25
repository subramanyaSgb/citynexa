import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";
      const isLoggedIn = !!auth?.user;

      if (isAdminRoute && !isLoginPage && !isLoggedIn) {
        return false; // Redirect to signIn page
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  providers: [], // Populated in auth.ts
} satisfies NextAuthConfig;
