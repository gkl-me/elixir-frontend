"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { Member, WorkspaceRole, getRoleBadge } from "../shared";
import { RoleSelector } from "../RoleSelector";
import { updateMemberRoleAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const EditMemberRoleModal = ({
  member,
  onClose,
  onSuccess,
}: {
  member: Member;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [roleId, setRoleId] = useState(member.roleId);
  const [saving, setSaving] = useState(false);

  const { data, execute: fetchRoles } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_ROLES,
    method: "GET",
  });

  const allRoles: WorkspaceRole[] = data?.data?.roles ?? [];
  const selectableRoles = allRoles
    .filter((r) => r.key !== "owner")
    .map((r) => {
      const badge = getRoleBadge(r.key);
      return {
        id: r.id ?? r.key,
        label: r.name,
        desc: `${r.permissions.length} permissions`,
        color: badge.color,
      };
    });

  useEffect(() => {
    if (workspaceId) {
      fetchRoles({
        params: {
          workspaceId,
        },
      });
    }
  }, [workspaceId, fetchRoles]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateMemberRoleAction(
      workspaceId,
      member.memberId,
      roleId
    );
    setSaving(false);
    if (result.success) {
      toast.success("Role updated");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to update role");
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Edit Role"
      description={`Changing role for ${member.name}`}
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <div className="max-h-[50vh] overflow-y-auto">
          {selectableRoles.length === 0 ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[#8735C9]" />
            </div>
          ) : (
            <RoleSelector
              roles={selectableRoles}
              value={roleId}
              onChange={setRoleId}
            />
          )}
        </div>
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-1">
          <Button
            onClick={handleSave}
            disabled={saving || !roleId}
            className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Role
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
