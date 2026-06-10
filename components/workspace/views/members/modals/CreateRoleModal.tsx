"use client";

import React from "react";
import { CustomModal } from "@/components/modal/CustomModal";
import { RoleForm } from "../RoleForm";
import { createRoleAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toast } from "sonner";

export const CreateRoleModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");

  const handleSave = async (name: string, permissions: string[]) => {
    const result = await createRoleAction(workspaceId, { name, permissions });
    if (result.success) {
      toast.success("Role created!");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to create role");
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Create Custom Role"
      description="Define a role with specific permissions."
      className="sm:max-w-xl"
    >
      <RoleForm
        onSave={handleSave}
        onClose={onClose}
        saveLabel="Create Role"
      />
    </CustomModal>
  );
};
