"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";
import { updateInquiryStatus } from "@/lib/actions/inquiries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
] as const;

interface InquiryActionsProps {
  inquiryId: string;
  currentStatus: string;
}

export function InquiryActions({
  inquiryId,
  currentStatus,
}: InquiryActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    startTransition(async () => {
      await updateInquiryStatus(inquiryId, newStatus);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={isPending}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/inquiries/${inquiryId}`}>
            <Eye className="size-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {STATUSES.map((status) => (
              <DropdownMenuItem
                key={status.value}
                disabled={status.value === currentStatus}
                onClick={() => handleStatusChange(status.value)}
              >
                {status.value === currentStatus && (
                  <span className="mr-1 text-xs">&#10003;</span>
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
