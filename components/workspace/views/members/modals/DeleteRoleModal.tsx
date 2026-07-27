"use client";

import React, { useState } from "react";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { WorkspaceRole } from "../shared";
import { deleteRoleAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toast } from "sonner";

export const DeleteRoleModal = ({
  role,
  onClose,
  onSuccess,
}: {
  role: WorkspaceRole;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!role.id) {
      return;
    }
    setLoading(true);
    const result = await deleteRoleAction(workspaceId, role.id);
    setLoading(false);
    if (result.success) {
      toast.success("Role deleted successfully");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to delete role");
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Delete Role"
      description={`Are you sure you want to delete "${role.name}"?`}
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#8735C9]/15">
            <Shield className="h-4 w-4 text-[#c084fc]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{role.name}</p>
            <p className="text-xs text-[#6b7db3]">
              {role.permissions.length} permissions
            </p>
          </div>
        </div>
        <p className="text-xs text-[#6b7db3]">
          Members assigned this role will fall back to the default Member role.
          This action cannot be undone.
        </p>
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-1">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 gap-2 bg-red-500 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete Role
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
