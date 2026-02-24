import { type DefaultSession } from "next-auth";

type AdminRole = "SUPER_ADMIN" | "ADMIN";

declare module "next-auth" {
  interface User {
    role?: AdminRole;
  }

  interface Session {
    user: {
      id: string;
      role: AdminRole;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AdminRole;
  }
}
