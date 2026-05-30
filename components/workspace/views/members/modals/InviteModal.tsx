"use client";

import React, { useState } from "react";
import { z } from "zod";
import { CustomModal } from "@/components/modal/CustomModal";
import { CustomForm } from "@/components/form/CustomForm";
import { Button } from "@/components/ui/button";
import { allRoles } from "../shared";
import { RoleSelector } from "../RoleSelector";

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type InviteValues = z.infer<typeof inviteSchema>;

export const InviteModal = ({ onClose }: { onClose: () => void }) => {
  const [role, setRole] = useState("member");
  const roles = allRoles();

  const handleSubmit = () => {
    onClose();
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
        {/* Email — CustomForm with zod validation */}
        <CustomForm<InviteValues>
          schema={inviteSchema}
          defaultValues={{ email: "" }}
          onSubmit={handleSubmit}
          submitText="Send Invitation"
          fields={[
            {
              name: "email",
              label: "Email Address",
              type: "email",
              placeholder: "colleague@company.com",
            },
          ]}
        />

        {/* Role selector — outside the form since it's custom UI */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
            Assign Role
          </label>
          <div className="max-h-[30vh] overflow-y-auto">
            <RoleSelector roles={roles} value={role} onChange={setRole} />
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
