"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { cn } from "@/lib/utils";
import { Member, grad, initials } from "../shared";
import { removeMemberAction } from "@/app/actions/workspace.action";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toast } from "sonner";

export const RemoveMemberModal = ({
  member,
  onClose,
  onSuccess,
}: {
  member: Member;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    const result = await removeMemberAction(workspaceId, member.memberId);
    setLoading(false);
    if (result.success) {
      toast.success("Member removed successfully");
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to remove member");
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Remove Member"
      description={`Are you sure you want to remove ${member.name}?`}
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-3">
          <div
            className={cn(
              "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
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
          This will revoke their workspace access. This action cannot be undone.
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
              <Trash2 className="h-4 w-4" />
            )}
            Remove Member
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
