"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/lib/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
] as const;

const STATUS_BADGE_CLASSES: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  CONTACTED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  FOLLOW_UP: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  CONVERTED: "bg-green-100 text-green-800 hover:bg-green-100",
  CLOSED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow Up",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

interface InquiryStatusSectionProps {
  inquiryId: string;
  currentStatus: string;
  adminNotes: string | null;
}

export function InquiryStatusSection({
  inquiryId,
  currentStatus,
  adminNotes,
}: InquiryStatusSectionProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(adminNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, status, notes);
      if (result.success) {
        setMessage({ type: "success", text: "Status and notes updated successfully." });
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: result.error ?? "Failed to update. Please try again.",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status & Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Current Status
          </label>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={STATUS_BADGE_CLASSES[status] ?? ""}
            >
              {STATUS_LABELS[status] ?? status}
            </Badge>
          </div>
        </div>

        {/* Status Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Change Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Admin Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Admin Notes
          </label>
          <Textarea
            placeholder="Add internal notes about this inquiry..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Feedback message */}
        {message && (
          <div
            className={`rounded-md border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
