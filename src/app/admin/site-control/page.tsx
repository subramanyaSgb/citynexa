import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteControlSettings } from "@/lib/actions/settings";
import { SiteControlPanel } from "./site-control-panel";

export default async function SiteControlPage() {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const settings = await getSiteControlSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Site Control
        </h2>
        <p className="text-muted-foreground">
          Master controls for the public website. Only visible to Super Admins.
        </p>
      </div>

      <SiteControlPanel initialSettings={settings} />
    </div>
  );
}
