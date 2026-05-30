"use client";

import React from "react";
import { CustomModal } from "@/components/modal/CustomModal";
import { RoleForm } from "../RoleForm";

export const CreateRoleModal = ({ onClose }: { onClose: () => void }) => (
  <CustomModal
    isOpen
    onClose={onClose}
    title="Create Custom Role"
    description="Define a role with specific permissions."
    className="sm:max-w-xl"
  >
    <RoleForm
      onSave={() => {
        onClose();
      }}
      onClose={onClose}
      saveLabel="Create Role"
    />
  </CustomModal>
);
