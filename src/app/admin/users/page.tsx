import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminUsers } from "@/lib/actions/admin-users";
import { AdminUsersPanel } from "./admin-users-panel";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Users
        </h2>
        <p className="text-muted-foreground">
          Manage admin users. Only visible to Super Admins.
        </p>
      </div>

      <AdminUsersPanel users={users} currentUserId={session.user.id} />
    </div>
  );
}
