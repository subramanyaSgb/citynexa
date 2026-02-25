"use client";

import { useState, useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateSettings, type SettingsMap } from "@/lib/actions/settings";

interface SettingsFormProps {
  initialSettings: SettingsMap;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<SettingsMap>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateSettings(settings);
      if (result.success) {
        setMessage({ type: "success", text: "Settings saved successfully." });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Public contact details shown on the website
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="whatsapp_phone">WhatsApp Number</Label>
            <Input
              id="whatsapp_phone"
              placeholder="919880875721"
              value={settings.whatsapp_phone ?? ""}
              onChange={(e) => handleChange("whatsapp_phone", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Country code + number, no spaces (e.g. 919880875721)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_phone">Phone Number</Label>
            <Input
              id="company_phone"
              placeholder="+91 98808 75721"
              value={settings.company_phone ?? ""}
              onChange={(e) => handleChange("company_phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_email">Email Address</Label>
            <Input
              id="company_email"
              type="email"
              placeholder="info@citynexa.com"
              value={settings.company_email ?? ""}
              onChange={(e) => handleChange("company_email", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="company_address">Address</Label>
            <Textarea
              id="company_address"
              placeholder="Bangalore, Karnataka, India"
              rows={2}
              value={settings.company_address ?? ""}
              onChange={(e) => handleChange("company_address", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Social media profile links shown in the footer
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="facebook_url">Facebook</Label>
            <Input
              id="facebook_url"
              placeholder="https://facebook.com/citynexa"
              value={settings.facebook_url ?? ""}
              onChange={(e) => handleChange("facebook_url", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram</Label>
            <Input
              id="instagram_url"
              placeholder="https://instagram.com/citynexa"
              value={settings.instagram_url ?? ""}
              onChange={(e) => handleChange("instagram_url", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              placeholder="https://linkedin.com/company/citynexa"
              value={settings.linkedin_url ?? ""}
              onChange={(e) => handleChange("linkedin_url", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter_url">Twitter / X</Label>
            <Input
              id="twitter_url"
              placeholder="https://x.com/citynexa"
              value={settings.twitter_url ?? ""}
              onChange={(e) => handleChange("twitter_url", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>
            Default metadata for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Default Meta Title</Label>
            <Input
              id="meta_title"
              placeholder="City Nexa Networks — Premium Real Estate in Bangalore"
              value={settings.meta_title ?? ""}
              onChange={(e) => handleChange("meta_title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_description">Default Meta Description</Label>
            <Textarea
              id="meta_description"
              placeholder="Your trusted real estate partner in Bangalore..."
              rows={3}
              value={settings.meta_description ?? ""}
              onChange={(e) =>
                handleChange("meta_description", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
