"use client";

import React from "react";
import { Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { CustomRole } from "../shared";

export const DeleteRoleModal = ({
  role,
  onClose,
}: {
  role: CustomRole;
  onClose: () => void;
}) => (
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
          onClick={() => {
            onClose();
          }}
          className="flex-1 gap-2 bg-red-500 font-semibold text-white hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
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
