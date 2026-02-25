"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Key,
  UserX,
  UserCheck,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAdminUser,
  updateAdminUser,
  resetAdminPassword,
  toggleAdminActive,
  type AdminUserItem,
} from "@/lib/actions/admin-users";

interface AdminUsersPanelProps {
  users: AdminUserItem[];
  currentUserId: string;
}

type DialogType = "create" | "edit" | "resetPassword" | "toggleActive" | null;

export function AdminUsersPanel({ users, currentUserId }: AdminUsersPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Dialog state
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");

  // Message banner
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- Dialog openers ---

  function openCreateDialog() {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("ADMIN");
    setMessage(null);
    setOpenDialog("create");
  }

  function openEditDialog(user: AdminUserItem) {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setMessage(null);
    setOpenDialog("edit");
  }

  function openResetPasswordDialog(user: AdminUserItem) {
    setSelectedUser(user);
    setFormPassword("");
    setMessage(null);
    setOpenDialog("resetPassword");
  }

  function openToggleActiveDialog(user: AdminUserItem) {
    setSelectedUser(user);
    setMessage(null);
    setOpenDialog("toggleActive");
  }

  function closeDialog() {
    setOpenDialog(null);
    setSelectedUser(null);
  }

  // --- Action handlers ---

  function handleCreate() {
    setMessage(null);
    startTransition(async () => {
      const result = await createAdminUser({
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
      });
      if (result.success) {
        setMessage({ type: "success", text: "Admin user created successfully." });
        closeDialog();
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  function handleEdit() {
    if (!selectedUser) return;
    setMessage(null);
    startTransition(async () => {
      const result = await updateAdminUser(selectedUser.id, {
        name: formName,
        email: formEmail,
        role: formRole,
      });
      if (result.success) {
        setMessage({ type: "success", text: "Admin user updated successfully." });
        closeDialog();
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  function handleResetPassword() {
    if (!selectedUser) return;
    setMessage(null);
    startTransition(async () => {
      const result = await resetAdminPassword(selectedUser.id, formPassword);
      if (result.success) {
        setMessage({ type: "success", text: "Password reset successfully." });
        closeDialog();
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  function handleToggleActive() {
    if (!selectedUser) return;
    setMessage(null);
    startTransition(async () => {
      const result = await toggleAdminActive(selectedUser.id);
      if (result.success) {
        const action = selectedUser.isActive ? "deactivated" : "activated";
        setMessage({ type: "success", text: `Admin user ${action} successfully.` });
        closeDialog();
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Message banner */}
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

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} admin {users.length === 1 ? "user" : "users"}
        </p>
        <Button onClick={openCreateDialog}>
          <Plus className="size-4" />
          Add Admin
        </Button>
      </div>

      {/* Users table */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Users className="size-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No admin users found
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "SUPER_ADMIN"
                          ? "bg-violet-100 text-violet-700 hover:bg-violet-100"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      }
                    >
                      {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openResetPasswordDialog(user)}
                        >
                          <Key className="size-4" />
                          Reset Password
                        </DropdownMenuItem>
                        {user.id !== currentUserId && (
                          <DropdownMenuItem
                            onClick={() => openToggleActiveDialog(user)}
                          >
                            {user.isActive ? (
                              <>
                                <UserX className="size-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="size-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={openDialog === "create"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
            <DialogDescription>
              Create a new admin user account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                placeholder="Full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="admin@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Min. 6 characters"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <Select value={formRole} onValueChange={(v) => setFormRole(v as "ADMIN" | "SUPER_ADMIN")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openDialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Update the details for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="Full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="admin@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formRole} onValueChange={(v) => setFormRole(v as "ADMIN" | "SUPER_ADMIN")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openDialog === "resetPassword"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reset-password">New Password</Label>
              <Input
                id="reset-password"
                type="password"
                placeholder="Min. 6 characters"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Key className="size-4" />
              )}
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Active Dialog */}
      <Dialog open={openDialog === "toggleActive"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isActive ? "Deactivate" : "Activate"} Admin User
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.isActive
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to log in.`
                : `Are you sure you want to activate ${selectedUser?.name}? They will be able to log in again.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.isActive ? "destructive" : "default"}
              onClick={handleToggleActive}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : selectedUser?.isActive ? (
                <UserX className="size-4" />
              ) : (
                <UserCheck className="size-4" />
              )}
              {isPending
                ? "Processing..."
                : selectedUser?.isActive
                  ? "Deactivate"
                  : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
