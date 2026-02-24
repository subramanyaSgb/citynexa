"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, MoreHorizontal, Star } from "lucide-react";
import {
  deleteProperty,
  togglePropertyActive,
  togglePropertyFeatured,
} from "@/lib/actions/properties";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyActionsProps {
  propertyId: string;
  propertyTitle: string;
  isActive: boolean;
  isFeatured: boolean;
}

export function PropertyActions({
  propertyId,
  propertyTitle,
  isActive,
  isFeatured,
}: PropertyActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggleActive() {
    startTransition(async () => {
      await togglePropertyActive(propertyId);
    });
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      await togglePropertyFeatured(propertyId);
    });
  }

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteProperty(propertyId);
      if (!result.success) {
        setDeleteError(result.error);
      } else {
        setDeleteDialogOpen(false);
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Featured toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        onClick={handleToggleFeatured}
        aria-label={`Toggle ${propertyTitle} featured status`}
      >
        <Star
          className={`size-4 ${isFeatured ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      </Button>

      {/* Active toggle */}
      <Switch
        size="sm"
        checked={isActive}
        onCheckedChange={handleToggleActive}
        disabled={isPending}
        aria-label={`Toggle ${propertyTitle} active status`}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/properties/${propertyId}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setDeleteError(null);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{propertyTitle}</strong>? This
              action cannot be undone and will also remove all associated images.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {deleteError}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
