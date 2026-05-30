"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { Member, allRoles } from "../shared";
import { RoleSelector } from "../RoleSelector";

export const EditMemberRoleModal = ({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) => {
  const roles = allRoles();
  const [role, setRole] = useState(
    member.role === "owner" ? "admin" : member.role
  );

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Edit Role"
      description={`Changing role for ${member.user.name}`}
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <div className="max-h-[50vh] overflow-y-auto">
          <RoleSelector roles={roles} value={role} onChange={setRole} />
        </div>
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-1">
          <Button
            onClick={() => {
              onClose();
            }}
            className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90"
          >
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
