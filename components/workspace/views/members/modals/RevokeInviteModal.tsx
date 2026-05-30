"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { type Invite } from "../../../../../data/demoData";

export const RevokeInviteModal = ({
  invite,
  onClose,
}: {
  invite: Invite;
  onClose: () => void;
}) => (
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
          onClick={() => {
            onClose();
          }}
          className="flex-1 gap-2 bg-red-500 font-semibold text-white hover:bg-red-600"
        >
          <X className="h-4 w-4" />
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
