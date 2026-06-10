"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { CustomModal } from "@/components/modal/CustomModal";
import { CustomForm } from "@/components/form/CustomForm";
import { Button } from "@/components/ui/button";
import { WorkspaceRole, getRoleBadge } from "../shared";
import { RoleSelector } from "../RoleSelector";
import { sendInviteAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type InviteValues = z.infer<typeof inviteSchema>;

export const InviteModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [roleId, setRoleId] = useState("");
  const [sending, setSending] = useState(false);

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

  // Pre-select 'member' role
  useEffect(() => {
    if (!roleId && allRoles.length > 0) {
      const memberRole = allRoles.find((r) => r.key === "member");
      if (memberRole?.id) {
        setRoleId(memberRole.id);
      }
    }
  }, [allRoles, roleId]);

  const handleSubmit = async (values: InviteValues) => {
    if (!roleId) {
      toast.error("Please select a role");
      return;
    }
    setSending(true);
    const result = await sendInviteAction(workspaceId, {
      email: values.email,
      roleId,
    });
    setSending(false);
    if (result.success) {
      toast.success("Invitation sent!");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to send invite");
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Invite Member"
      description="Send an invitation to join this workspace."
      className="sm:max-w-md"
    >
      <div className="space-y-5">
        <CustomForm<InviteValues>
          schema={inviteSchema}
          defaultValues={{ email: "" }}
          onSubmit={handleSubmit}
          submitText={sending ? "Sending..." : "Send Invitation"}
          fields={[
            {
              name: "email",
              label: "Email Address",
              type: "email",
              placeholder: "colleague@company.com",
            },
          ]}
        />

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
            Assign Role
          </label>
          <div className="max-h-[30vh] overflow-y-auto">
            {selectableRoles.length === 0 ? (
              <div className="flex justify-center py-4">
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
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </CustomModal>
  );
};
