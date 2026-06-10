"use client";

import React from "react";
import { CustomModal } from "@/components/modal/CustomModal";
import { RoleForm } from "../RoleForm";
import { WorkspaceRole } from "../shared";
import { updateRoleAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toast } from "sonner";

export const EditCustomRoleModal = ({
  role,
  onClose,
  onSuccess,
}: {
  role: WorkspaceRole;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");

  const handleSave = async (name: string, permissions: string[]) => {
    console.log(role)
    if (!role.id) {
      return;
    }
    const result = await updateRoleAction(workspaceId, role.id, { name, permissions });
    if (result.success) {
      toast.success("Role updated!");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to update role");
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title={`Edit Role · ${role.name}`}
      description="Update role name and permissions."
      className="sm:max-w-xl"
    >
      <RoleForm
        initialName={role.name}
        initialPerms={role.permissions}
        onSave={handleSave}
        onClose={onClose}
        saveLabel="Save Changes"
      />
    </CustomModal>
  );
};
