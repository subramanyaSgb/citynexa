import { getSettings } from "@/lib/actions/settings";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage site-wide configuration and contact details
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
