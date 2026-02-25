"use client";

import { useState, useTransition } from "react";
import {
  Power,
  ToggleLeft,
  Save,
  Loader2,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  updateSiteControlSettings,
  type SettingsMap,
} from "@/lib/actions/settings";

interface SiteControlPanelProps {
  initialSettings: SettingsMap;
}

const FEATURE_TOGGLES = [
  { key: "feature_properties", label: "Property Listings", description: "Public property search and detail pages" },
  { key: "feature_builders", label: "Builder Pages", description: "Builder profiles and their project listings" },
  { key: "feature_shortlist", label: "Shortlist", description: "Visitor shortlist / favorites functionality" },
  { key: "feature_inquiries", label: "Inquiry Forms", description: "Contact forms and property inquiry submissions" },
  { key: "feature_testimonials", label: "Testimonials", description: "Customer testimonials section on homepage" },
  { key: "feature_whatsapp", label: "WhatsApp Button", description: "Floating WhatsApp chat button" },
  { key: "feature_map", label: "Map View", description: "Map-based property search and location views" },
] as const;

export function SiteControlPanel({ initialSettings }: SiteControlPanelProps) {
  const [settings, setSettings] = useState<SettingsMap>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isLive = settings.site_live !== "false";

  function handleToggle(key: string, value: boolean) {
    setSettings((prev) => ({ ...prev, [key]: value ? "true" : "false" }));
  }

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateSiteControlSettings(settings);
      if (result.success) {
        setMessage({ type: "success", text: "Site control settings saved." });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Kill Switch */}
      <Card className={!isLive ? "border-red-300 bg-red-50/50" : "border-green-300 bg-green-50/50"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-lg ${isLive ? "bg-green-100" : "bg-red-100"}`}>
                <Power className={`size-5 ${isLive ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <CardTitle>Website Status</CardTitle>
                <CardDescription>
                  {isLive
                    ? "Public website is live and accessible"
                    : "Public website is offline \u2014 visitors see maintenance page"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${isLive ? "text-green-700" : "text-red-700"}`}>
                {isLive ? "LIVE" : "OFFLINE"}
              </span>
              <Switch
                checked={isLive}
                onCheckedChange={(checked) => handleToggle("site_live", checked)}
              />
            </div>
          </div>
        </CardHeader>
        {!isLive && (
          <CardContent>
            <div className="flex items-start gap-2 rounded-lg bg-red-100/80 p-3 text-sm text-red-800">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>The public website is currently offline. All visitors will see the maintenance page. The admin panel remains accessible.</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Custom Shutdown Message */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
              <AlertTriangle className="size-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>Maintenance Message</CardTitle>
              <CardDescription>
                Custom message shown to visitors when the site is offline
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="This website is currently undergoing maintenance. Please check back later."
            rows={4}
            value={settings.shutdown_message ?? ""}
            onChange={(e) => handleChange("shutdown_message", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100">
              <ToggleLeft className="size-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>
                Enable or disable individual features on the public website
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {FEATURE_TOGGLES.map(({ key, label, description }) => {
              const isEnabled = settings[key] !== "false";
              return (
                <div
                  key={key}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleToggle(key, checked)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="size-4" />
          <span>Changes take effect immediately after saving</span>
        </div>
        <Button onClick={handleSave} disabled={isPending} size="lg">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isPending ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
