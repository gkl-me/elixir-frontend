"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { WorkspaceInvite } from "../shared";
import { revokeInviteAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toast } from "sonner";

export const RevokeInviteModal = ({
  invite,
  onClose,
  onSuccess,
}: {
  invite: WorkspaceInvite;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [loading, setLoading] = useState(false);

  const handleRevoke = async () => {
    if (!invite.id) {
      return;
    }
    setLoading(true);
    const result = await revokeInviteAction(workspaceId, invite.id);
    setLoading(false);
    if (result.success) {
      toast.success("Invite revoked");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to revoke invite");
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Revoke Invite"
      description={`Revoke the invitation sent to ${invite.email}?`}
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <p className="text-xs text-[#6b7db3]">
          The recipient will no longer be able to use this invite link.
        </p>
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-1">
          <Button
            onClick={handleRevoke}
            disabled={loading}
            className="flex-1 gap-2 bg-red-500 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Revoke Invite
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
