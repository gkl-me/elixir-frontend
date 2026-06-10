"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { cn } from "@/lib/utils";
import { initials, grad } from "./shared";
import { TeamMember } from "./TeamManagePage";
import { removeTeamMemberAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";

interface RemoveTeamMemberModalProps {
  teamId: string;
  teamName: string;
  member: TeamMember;
  onSuccess: () => void;
  onClose: () => void;
}

export const RemoveTeamMemberModal = ({
  teamId,
  teamName,
  member,
  onSuccess,
  onClose,
}: RemoveTeamMemberModalProps) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      const res = await removeTeamMemberAction({
        workspaceId,
        teamId,
        memberId: member.id,
      });
      if (res.success) {
        toastHandler({ success: true, message: "Member removed from team" });
        onSuccess();
        onClose();
      } else {
        toastHandler({
          success: false,
          error: res.error || "Failed to remove member",
        });
      }
    } catch (error) {
      toastHandler({ success: false, error: AxiosErrorHandler(error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Remove from Team"
      description={`Remove ${member.name} from ${teamName}?`}
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
              grad(member.name)
            )}
          >
            {initials(member.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{member.name}</p>
            <p className="text-xs text-[#6b7db3]">{member.email}</p>
          </div>
        </div>
        <p className="text-xs text-[#6b7db3]">
          They will lose access to all team resources but remain a workspace
          member.
        </p>
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-1">
          <Button
            onClick={handleRemove}
            disabled={loading}
            className="flex-1 gap-2 bg-red-500 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Remove from Team
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
